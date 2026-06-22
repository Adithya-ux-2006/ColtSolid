import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

function readEnv() {
  const pairs = fs
    .readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    });

  return Object.fromEntries(pairs);
}

function extractSection(sql, startMarker, endMarker) {
  const start = sql.indexOf(startMarker);
  if (start === -1) throw new Error(`Missing section start: ${startMarker}`);

  const from = start + startMarker.length;
  const end = endMarker ? sql.indexOf(endMarker, from) : sql.length;
  if (end === -1) throw new Error(`Missing section end: ${endMarker}`);

  return sql.slice(from, end).trim();
}

function parseSqlValue(token) {
  const trimmed = token.trim();
  if (trimmed === 'null' || trimmed === 'NULL') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }

  return trimmed;
}

function parseTuples(section) {
  const tuples = [];
  let currentTuple = null;
  let currentValue = '';
  let inString = false;

  for (let i = 0; i < section.length; i += 1) {
    const char = section[i];
    const next = section[i + 1];

    if (char === "'") {
      currentValue += char;
      if (inString && next === "'") {
        currentValue += next;
        i += 1;
      } else {
        inString = !inString;
      }
      continue;
    }

    if (!inString && char === '(') {
      currentTuple = [];
      currentValue = '';
      continue;
    }

    if (!inString && char === ',') {
      if (currentTuple) {
        currentTuple.push(parseSqlValue(currentValue));
        currentValue = '';
      }
      continue;
    }

    if (!inString && char === ')') {
      if (!currentTuple) continue;
      currentTuple.push(parseSqlValue(currentValue));
      tuples.push(currentTuple);
      currentTuple = null;
      currentValue = '';
      continue;
    }

    if (currentTuple) {
      currentValue += char;
    }
  }

  return tuples;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function upsertInChunks(client, table, rows, onConflict, chunkSize = 100) {
  for (const part of chunk(rows, chunkSize)) {
    const { error } = await client.from(table).upsert(part, { onConflict });
    if (error) throw new Error(`${table} upsert failed: ${error.message}`);
  }
}

async function insertInChunks(client, table, rows, chunkSize = 100) {
  for (const part of chunk(rows, chunkSize)) {
    const { error } = await client.from(table).insert(part);
    if (error) throw new Error(`${table} insert failed: ${error.message}`);
  }
}

async function seedCatalog(serviceClient, seedSql) {
  const symptomTuples = parseTuples(
    extractSection(seedSql, 'INSERT INTO public.symptoms (id, label, emoji, color_theme) VALUES', 'ON CONFLICT (id) DO UPDATE SET')
  );
  const remedyTuples = parseTuples(
    extractSection(
      seedSql,
      'INSERT INTO public.remedies (\n  id, name, category, rating, review_count, short_description, long_description,\n  how_to_use, warnings, time_to_effect, difficulty, cost, is_featured\n) VALUES',
      'ON CONFLICT (id) DO UPDATE SET'
    )
  );
  const remedySymptomsTuples = parseTuples(
    extractSection(seedSql, 'INSERT INTO public.remedy_symptoms (remedy_id, symptom_id) VALUES', ';\n\nINSERT INTO public.research_papers')
  );
  const researchTuples = parseTuples(
    extractSection(seedSql, 'INSERT INTO public.research_papers (remedy_id, title, journal, url, key_findings) VALUES', ';\n\nCOMMIT')
  );

  const symptoms = symptomTuples.map(([id, label, emoji, color_theme]) => ({ id, label, emoji, color_theme }));
  const remedies = remedyTuples.map(([
    id,
    name,
    category,
    rating,
    review_count,
    short_description,
    long_description,
    how_to_use,
    warnings,
    time_to_effect,
    difficulty,
    cost,
    is_featured,
  ]) => ({
    id,
    name,
    category,
    rating,
    review_count,
    short_description,
    long_description,
    how_to_use,
    warnings,
    time_to_effect,
    difficulty,
    cost,
    is_featured,
  }));
  const remedySymptoms = remedySymptomsTuples.map(([remedy_id, symptom_id]) => ({ remedy_id, symptom_id }));
  const researchPapers = researchTuples.map(([remedy_id, title, journal, url, key_findings]) => ({
    remedy_id,
    title,
    journal,
    url,
    key_findings,
  }));

  await upsertInChunks(serviceClient, 'symptoms', symptoms, 'id');
  await upsertInChunks(serviceClient, 'remedies', remedies, 'id');

  const remedyIds = remedies.map((remedy) => remedy.id);
  const { error: deleteResearchError } = await serviceClient.from('research_papers').delete().in('remedy_id', remedyIds);
  if (deleteResearchError) throw new Error(`research_papers delete failed: ${deleteResearchError.message}`);

  const { error: deleteJunctionError } = await serviceClient.from('remedy_symptoms').delete().in('remedy_id', remedyIds);
  if (deleteJunctionError) throw new Error(`remedy_symptoms delete failed: ${deleteJunctionError.message}`);

  await insertInChunks(serviceClient, 'remedy_symptoms', remedySymptoms);
  await insertInChunks(serviceClient, 'research_papers', researchPapers);
}

async function getCount(client, table) {
  const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
  if (error) throw new Error(`${table} count failed: ${error.message}`);
  return count;
}

async function verifyTables(client) {
  const names = ['users', 'symptoms', 'remedies', 'remedy_symptoms', 'research_papers', 'favorites', 'appointments'];
  const results = [];

  for (const table of names) {
    const { error } = await client.from(table).select('*').limit(1);
    results.push({ table, ok: !error, error: error?.message || null });
  }

  return results;
}

async function testAuthAndPersistence(url, anonKey) {
  const makeClient = () => createClient(url, anonKey);
  const email = `cura${Date.now()}@gmail.com`;
  const password = 'curA!234';
  const client = makeClient();

  const signUp = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: 'Live Flow Test',
        university: 'State University',
        year: 'Senior',
      },
    },
  });

  if (signUp.error) throw new Error(`signup failed: ${signUp.error.message}`);
  if (!signUp.data.session || !signUp.data.user) throw new Error('signup did not return a live session');

  const userId = signUp.data.user.id;
  const profile = await client.from('users').select('*').eq('id', userId).maybeSingle();
  if (profile.error) throw new Error(`users row lookup failed: ${profile.error.message}`);
  if (!profile.data) throw new Error('users trigger did not create a row');

  await client.auth.signOut();
  const login = await client.auth.signInWithPassword({ email, password });
  if (login.error) throw new Error(`login failed: ${login.error.message}`);

  const restored = await client.auth.getSession();
  if (!restored.data.session) throw new Error('session restore failed after login');

  const remedy = await client.from('remedies').select('id').limit(1).maybeSingle();
  if (remedy.error) throw new Error(`remedy lookup failed: ${remedy.error.message}`);
  if (!remedy.data?.id) throw new Error('no remedy available for favorite test');

  const favoriteInsert = await client
    .from('favorites')
    .insert({ user_id: userId, remedy_id: remedy.data.id })
    .select()
    .single();
  if (favoriteInsert.error) throw new Error(`favorite insert failed: ${favoriteInsert.error.message}`);

  const favoriteRead = await client.from('favorites').select('*').eq('user_id', userId).eq('remedy_id', remedy.data.id).maybeSingle();
  if (favoriteRead.error || !favoriteRead.data) throw new Error(`favorite read failed: ${favoriteRead.error?.message || 'missing row'}`);

  const favoriteDelete = await client.from('favorites').delete().match({ user_id: userId, remedy_id: remedy.data.id }).select().single();
  if (favoriteDelete.error) throw new Error(`favorite delete failed: ${favoriteDelete.error.message}`);

  const appointmentInsert = await client
    .from('appointments')
    .insert({
      user_id: userId,
      title: 'Campus Clinic Visit',
      doctor: 'Dr Rivera',
      location: 'Student Health',
      apt_date: '2026-06-20',
      apt_time: '10:30',
      notes: 'Bring records',
      type: 'General',
      status: 'Upcoming',
    })
    .select()
    .single();
  if (appointmentInsert.error) throw new Error(`appointment insert failed: ${appointmentInsert.error.message}`);

  const appointmentUpdate = await client
    .from('appointments')
    .update({ status: 'Completed', notes: 'Updated note' })
    .eq('id', appointmentInsert.data.id)
    .select()
    .single();
  if (appointmentUpdate.error) throw new Error(`appointment update failed: ${appointmentUpdate.error.message}`);

  const appointmentDelete = await client.from('appointments').delete().eq('id', appointmentInsert.data.id).select().single();
  if (appointmentDelete.error) throw new Error(`appointment delete failed: ${appointmentDelete.error.message}`);

  const otherClient = makeClient();
  const otherSignUp = await otherClient.auth.signUp({
    email: `other${Date.now()}@gmail.com`,
    password,
    options: { data: { name: 'Other User', university: 'Other U', year: 'Junior' } },
  });
  if (otherSignUp.error) throw new Error(`secondary signup failed: ${otherSignUp.error.message}`);

  const privateAppointment = await client
    .from('appointments')
    .insert({
      user_id: userId,
      title: 'Private Test',
      doctor: 'Dr Private',
      location: 'Student Health',
      apt_date: '2026-06-21',
      apt_time: '11:00',
      type: 'General',
      status: 'Upcoming',
    })
    .select()
    .single();
  if (privateAppointment.error) throw new Error(`private appointment insert failed: ${privateAppointment.error.message}`);

  const otherRead = await otherClient.from('appointments').select('*').eq('id', privateAppointment.data.id).maybeSingle();
  const anonRead = await makeClient().from('appointments').select('*').eq('id', privateAppointment.data.id).maybeSingle();
  await client.from('appointments').delete().eq('id', privateAppointment.data.id);

  return {
    auth: {
      email,
      userId,
      profileRow: profile.data,
      sessionRestored: !!restored.data.session,
    },
    favorites: {
      saved: !!favoriteInsert.data,
      removed: !!favoriteDelete.data,
    },
    appointments: {
      created: !!appointmentInsert.data,
      updated: appointmentUpdate.data?.status === 'Completed',
      deleted: !!appointmentDelete.data,
      otherUserVisible: !!otherRead.data,
      anonymousVisible: !!anonRead.data,
    },
  };
}

async function verifyPublicCatalog(anonClient) {
  const symptoms = await anonClient.from('symptoms').select('*').order('label');
  const featured = await anonClient.from('remedies').select('id, is_featured').eq('is_featured', true);
  const remedy = await anonClient
    .from('remedies')
    .select('id, name, remedy_symptoms(symptom_id), research_papers(title, journal, url, key_findings)')
    .eq('id', 'rem_h01')
    .maybeSingle();

  if (symptoms.error) throw new Error(`public symptoms query failed: ${symptoms.error.message}`);
  if (featured.error) throw new Error(`featured remedies query failed: ${featured.error.message}`);
  if (remedy.error) throw new Error(`remedy detail query failed: ${remedy.error.message}`);

  const symptomCounts = {};
  const remedies = await anonClient.from('remedies').select('id, remedy_symptoms(symptom_id)');
  if (remedies.error) throw new Error(`results remedies query failed: ${remedies.error.message}`);

  for (const row of remedies.data) {
    for (const link of row.remedy_symptoms || []) {
      symptomCounts[link.symptom_id] = (symptomCounts[link.symptom_id] || 0) + 1;
    }
  }

  return {
    symptomCount: symptoms.data.length,
    featuredCount: featured.data.length,
    remedyDetailResearchCount: remedy.data?.research_papers?.length || 0,
    symptomResultCounts: symptomCounts,
  };
}

async function main() {
  const env = readEnv();
  const url = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    throw new Error('Missing Supabase URL, anon key, or service role key in .env');
  }

  const anonClient = createClient(url, anonKey);
  const serviceClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8');

  const tables = await verifyTables(serviceClient);
  await seedCatalog(serviceClient, seedSql);

  const counts = {
    symptoms: await getCount(serviceClient, 'symptoms'),
    remedies: await getCount(serviceClient, 'remedies'),
    remedy_symptoms: await getCount(serviceClient, 'remedy_symptoms'),
    research_papers: await getCount(serviceClient, 'research_papers'),
  };

  const publicCatalog = await verifyPublicCatalog(anonClient);
  const liveFlows = await testAuthAndPersistence(url, anonKey);

  console.log(JSON.stringify({ tables, counts, publicCatalog, liveFlows }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
