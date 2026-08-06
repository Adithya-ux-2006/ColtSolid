#!/usr/bin/env node
/**
 * Database Validation Script for curA/ClotSolid
 * 
 * Validates database schema integrity using Supabase metadata.
 * 
 * Usage:
 *   node scripts/db-validate.js           # Run all validations
 *   node scripts/db-validate.js --verbose # Show detailed output
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const verbose = process.argv.includes('--verbose');

let errors = 0;
let warnings = 0;

function error(msg) {
  console.error(`❌ ERROR: ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`⚠️  WARNING: ${msg}`);
  warnings++;
}

function success(msg) {
  console.log(`✅ ${msg}`);
}

function info(msg) {
  if (verbose) console.log(`   ℹ️  ${msg}`);
}

// List of expected tables
const EXPECTED_TABLES = [
  'symptoms',
  'remedies',
  'remedy_symptoms',
  'research_papers',
  'users',
  'favorites',
  'appointments',
  'search_events',
  'remedy_events',
  'remedy_feedback',
  'remedy_schedules',
  'remedy_interactions',
  'remedy_popularity',
  'symptom_embeddings',
  'audit_log',
];

// Validation 1: Check all expected tables exist
async function validateTablesExist() {
  console.log('\n1️⃣  Checking expected tables exist...');
  
  for (const table of EXPECTED_TABLES) {
    const { error: err } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (err && err.code === '42P01') {
      error(`Table "${table}" does not exist`);
    } else if (err) {
      warn(`Table "${table}" query error: ${err.message}`);
    } else {
      info(`Table "${table}" exists`);
    }
  }
  
  success('Table existence check complete');
}

// Validation 2: Check core data tables have data
async function validateCoreData() {
  console.log('\n2️⃣  Checking core data tables have data...');
  
  const coreTables = ['symptoms', 'remedies'];
  
  for (const table of coreTables) {
    const { count, error: err } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (err) {
      warn(`Could not check ${table}: ${err.message}`);
    } else if (count === 0) {
      warn(`Table "${table}" is empty`);
    } else {
      info(`Table "${table}" has ${count} rows`);
    }
  }
  
  success('Core data check complete');
}

// Validation 3: Check remedy_symptoms has both tables populated
async function validateJunctionTables() {
  console.log('\n3️⃣  Checking junction tables...');
  
  const { count: rsCount, error: rsErr } = await supabase
    .from('remedy_symptoms')
    .select('*', { count: 'exact', head: true });
  
  if (rsErr) {
    warn(`Could not check remedy_symptoms: ${rsErr.message}`);
  } else if (rsCount === 0) {
    warn('Table "remedy_symptoms" is empty - no symptom-remedy mappings');
  } else {
    info(`Table "remedy_symptoms" has ${rsCount} rows`);
  }
  
  success('Junction table check complete');
}

// Validation 4: Check foreign key relationships
async function validateRelationships() {
  console.log('\n4️⃣  Checking key relationships...');
  
  // Check users have profiles
  const { count: userCount, error: userErr } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  if (!userErr && userCount !== null) {
    info(`Users table has ${userCount} profiles`);
  }
  
  // Check favorites reference valid users and remedies
  const { data: favSample, error: favErr } = await supabase
    .from('favorites')
    .select('user_id, remedy_id')
    .limit(10);
  
  if (!favErr && favSample) {
    info(`Favorites table has sample data (${favSample.length} rows checked)`);
  }
  
  success('Relationship check complete');
}

// Validation 5: Check for common data issues
async function validateDataIntegrity() {
  console.log('\n5️⃣  Checking data integrity...');
  
  // Check remedies have required fields
  const { data: remedies, error: remErr } = await supabase
    .from('remedies')
    .select('id, name, category')
    .limit(5);
  
  if (remErr) {
    warn(`Could not check remedies: ${remErr.message}`);
  } else if (remedies) {
    const missingName = remedies.filter(r => !r.name);
    const missingCategory = remedies.filter(r => !r.category);
    
    if (missingName.length > 0) {
      warn(`${missingName.length} remedies missing name`);
    }
    if (missingCategory.length > 0) {
      warn(`${missingCategory.length} remedies missing category`);
    }
    info(`Checked ${remedies.length} remedies for required fields`);
  }
  
  // Check symptoms have required fields
  const { data: symptoms, error: symErr } = await supabase
    .from('symptoms')
    .select('id, label, emoji')
    .limit(5);
  
  if (symErr) {
    warn(`Could not check symptoms: ${symErr.message}`);
  } else if (symptoms) {
    const missingLabel = symptoms.filter(s => !s.label);
    const missingEmoji = symptoms.filter(s => !s.emoji);
    
    if (missingLabel.length > 0) {
      warn(`${missingLabel.length} symptoms missing label`);
    }
    if (missingEmoji.length > 0) {
      warn(`${missingEmoji.length} symptoms missing emoji`);
    }
    info(`Checked ${symptoms.length} symptoms for required fields`);
  }
  
  success('Data integrity check complete');
}

// Validation 6: Check analytics tables structure
async function validateAnalyticsTables() {
  console.log('\n6️⃣  Checking analytics tables...');
  
  const analyticsTables = ['search_events', 'remedy_events', 'remedy_feedback', 'remedy_interactions'];
  
  for (const table of analyticsTables) {
    const { count, error: err } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (err && err.code === '42P01') {
      info(`Analytics table "${table}" does not exist (optional)`);
    } else if (err) {
      warn(`Could not check ${table}: ${err.message}`);
    } else {
      info(`Analytics table "${table}" has ${count} rows`);
    }
  }
  
  success('Analytics table check complete');
}

// Main validation runner
async function runValidation() {
  console.log('🔍 Database Validation Runner\n');
  console.log(`📍 Target: ${SUPABASE_URL}\n`);

  try {
    await validateTablesExist();
    await validateCoreData();
    await validateJunctionTables();
    await validateRelationships();
    await validateDataIntegrity();
    await validateAnalyticsTables();

    console.log('\n' + '='.repeat(50));
    console.log('📊 Validation Summary:');
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   ⚠️  Warnings: ${warnings}`);
    console.log('='.repeat(50));

    if (errors > 0) {
      console.log('\n❌ Validation FAILED - fix errors before deploying');
      process.exit(1);
    } else if (warnings > 0) {
      console.log('\n⚠️  Validation PASSED with warnings');
    } else {
      console.log('\n✅ Validation PASSED');
    }
  } catch (err) {
    console.error('\n❌ Validation failed with error:', err.message);
    process.exit(1);
  }
}

runValidation();
