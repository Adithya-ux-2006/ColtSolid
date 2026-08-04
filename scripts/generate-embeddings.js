// scripts/generate-embeddings.js
// Offline script: generates Gemini embeddings for all symptoms and stores them
// in the Supabase symptom_embeddings table.
//
// Usage: node scripts/generate-embeddings.js
// Requires: GOOGLE_AI_STUDIO_API_KEY env var, SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
//
// Run this when:
// - Symptom catalog changes (new symptoms added/removed)
// - You want to refresh embeddings with a newer model
// - Initial setup after deploying migration 024

import { GoogleGenAI } from '@google/genai';

const EMBEDDING_MODEL = 'text-embedding-004';
const BATCH_SIZE = 10; // Gemini embedContent supports batching

function getEnvOrExit(name) {
  const val = process.env[name];
  if (!val) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return val;
}

async function fetchSymptoms(supabaseUrl, supabaseKey) {
  const response = await fetch(`${supabaseUrl}/rest/v1/symptoms?select=id,label&order=label`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch symptoms: ${response.status} ${text}`);
  }

  return response.json();
}

async function upsertEmbeddings(supabaseUrl, supabaseKey, rows) {
  const response = await fetch(`${supabaseUrl}/rest/v1/symptom_embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upsert embeddings: ${response.status} ${text}`);
  }
}

async function main() {
  const supabaseUrl = getEnvOrExit('SUPABASE_URL');
  const supabaseKey = getEnvOrExit('SUPABASE_SERVICE_ROLE_KEY');
  const apiKey = getEnvOrExit('GOOGLE_AI_STUDIO_API_KEY');

  console.log('Fetching symptoms from Supabase...');
  const symptoms = await fetchSymptoms(supabaseUrl, supabaseKey);
  console.log(`Found ${symptoms.length} symptoms`);

  if (symptoms.length === 0) {
    console.log('No symptoms found. Nothing to do.');
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  const rows = [];

  // Process in batches
  for (let i = 0; i < symptoms.length; i += BATCH_SIZE) {
    const batch = symptoms.slice(i, i + BATCH_SIZE);
    const texts = batch.map(s => `${s.label}: health symptom`);

    console.log(`Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(symptoms.length / BATCH_SIZE)} (${batch.length} symptoms)...`);

    const response = await ai.models.batchEmbedContents({
      model: EMBEDDING_MODEL,
      requests: texts.map(text => ({
        contents: [{ role: 'user', parts: [{ text }] }],
        taskType: 'RETRIEVAL_DOCUMENT',
      })),
    });

    const embeddings = response.embeddings;
    for (let j = 0; j < batch.length; j++) {
      rows.push({
        symptom_id: batch[j].id,
        label: batch[j].label,
        embedding: `[${embeddings[j].values.join(',')}]`,
      });
    }

    // Rate limit: brief pause between batches
    if (i + BATCH_SIZE < symptoms.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`Upserting ${rows.length} embeddings to Supabase...`);
  await upsertEmbeddings(supabaseUrl, supabaseKey, rows);

  console.log(`Done! ${rows.length} symptom embeddings generated and stored.`);
}

main().catch(err => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
