#!/usr/bin/env node
/**
 * Database Migration Runner for curA/ClotSolid
 * 
 * Shows migration status and tracks applied migrations.
 * 
 * Usage:
 *   node scripts/db-migrate.js                    # Show pending migrations
 *   node scripts/db-migrate.js --status           # Show migration status
 *   node scripts/db-migrate.js --apply <file>     # Mark a migration as applied
 * 
 * Note: Actual SQL migrations must be applied via Supabase SQL Editor.
 * This script tracks which migrations have been applied.
 * 
 * Environment Variables:
 *   SUPABASE_URL or VITE_SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key for admin access
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Check if schema_migrations table exists
async function checkMigrationTable() {
  const { error } = await supabase
    .from('schema_migrations')
    .select('version')
    .limit(1);

  if (error && error.code === '42P01') {
    return false;
  }
  return true;
}

// Get list of migration files
async function getMigrationFiles() {
  const files = await readdir(MIGRATIONS_DIR);
  return files
    .filter(f => f.endsWith('.sql'))
    .sort()
    .map(f => ({
      version: basename(f, '.sql').split('_')[0],
      filename: f,
      path: join(MIGRATIONS_DIR, f),
    }));
}

// Get applied migrations
async function getAppliedMigrations() {
  const hasTable = await checkMigrationTable();
  if (!hasTable) return [];

  const { data, error } = await supabase
    .from('schema_migrations')
    .select('version')
    .order('version');

  if (error) return [];
  return data.map(m => m.version);
}

// Calculate checksum for migration file
async function calculateChecksum(filePath) {
  const content = await readFile(filePath, 'utf-8');
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// Mark a migration as applied
async function markApplied(migration) {
  const hasTable = await checkMigrationTable();
  if (!hasTable) {
    console.log('⚠️  schema_migrations table does not exist.');
    console.log('   Please run this SQL in Supabase SQL Editor first:');
    console.log(`
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  id SERIAL PRIMARY KEY,
  version TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  checksum TEXT NOT NULL
);
    `);
    return false;
  }

  const checksum = await calculateChecksum(migration.path);
  
  const { error } = await supabase
    .from('schema_migrations')
    .insert({
      version: migration.version,
      filename: migration.filename,
      checksum,
    });

  if (error) {
    if (error.code === '23505') {
      console.log(`   ℹ️  ${migration.filename} already marked as applied`);
      return true;
    }
    console.error(`❌ Error marking ${migration.filename}:`, error.message);
    return false;
  }

  console.log(`✅ Marked ${migration.filename} as applied`);
  return true;
}

// Show migration status
async function showStatus() {
  console.log('📊 Migration Status\n');

  const hasTable = await checkMigrationTable();
  if (!hasTable) {
    console.log('⚠️  schema_migrations table does not exist.');
    console.log('   All migrations will show as pending.\n');
    console.log('   To create the table, run this SQL in Supabase SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  id SERIAL PRIMARY KEY,
  version TEXT UNIQUE NOT NULL,
  filename TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  checksum TEXT NOT NULL
);
    `);
    console.log('');
  }

  const migrationFiles = await getMigrationFiles();
  const applied = await getAppliedMigrations();

  console.log('Migration Files:');
  for (const m of migrationFiles) {
    const status = applied.includes(m.version) ? '✅' : '⏳';
    console.log(`   ${status} ${m.filename}`);
  }

  console.log(`\nTotal: ${migrationFiles.length} | Applied: ${applied.length} | Pending: ${migrationFiles.length - applied.length}`);
  
  if (applied.length === 0) {
    console.log('\n💡 To apply migrations:');
    console.log('   1. Run each .sql file in supabase/migrations/ via Supabase SQL Editor');
    console.log('   2. Then mark as applied: npm run db:migrate:apply <filename>');
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--status') || args.length === 0) {
    await showStatus();
  } else if (args.includes('--apply')) {
    const fileArg = args[args.indexOf('--apply') + 1];
    if (!fileArg) {
      console.error('❌ Please specify migration file: --apply <filename>');
      process.exit(1);
    }

    const migrationFiles = await getMigrationFiles();
    const migration = migrationFiles.find(m => m.filename === fileArg || m.version === fileArg);
    
    if (!migration) {
      console.error(`❌ Migration not found: ${fileArg}`);
      process.exit(1);
    }

    await markApplied(migration);
  } else {
    console.log('Usage:');
    console.log('  node scripts/db-migrate.js --status         # Show migration status');
    console.log('  node scripts/db-migrate.js --apply <file>   # Mark migration as applied');
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
