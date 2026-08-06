#!/usr/bin/env node
/**
 * Database Schema Diff Tool for curA/ClotSolid
 * 
 * Compares current database schema against supabase/schema.sql
 * and identifies drift between environments.
 * 
 * Usage:
 *   node scripts/db-diff.js                    # Compare DB vs schema.sql
 *   node scripts/db-diff.js --output drift.sql # Generate migration to sync
 */

import { createClient } from '@supabase/supabase-js';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SCHEMA_PATH = join(__dirname, '..', 'supabase', 'schema.sql');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Execute raw SQL query
async function query(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (error) throw error;
  return data;
}

// Get current database schema
async function getDatabaseSchema() {
  const schema = {
    tables: {},
    indexes: {},
    policies: {},
    functions: {},
    triggers: {},
  };

  // Get all tables and columns
  const tables = await query(`
    SELECT 
      t.table_name,
      c.column_name,
      c.data_type,
      c.is_nullable,
      c.column_default,
      c.character_maximum_length,
      c.numeric_precision
    FROM information_schema.tables t
    JOIN information_schema.columns c 
      ON t.table_name = c.table_name 
      AND t.table_schema = c.table_schema
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name, c.ordinal_position
  `);

  for (const row of tables) {
    if (!schema.tables[row.table_name]) {
      schema.tables[row.table_name] = {
        columns: [],
        constraints: [],
      };
    }
    schema.tables[row.table_name].columns.push({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES',
      default: row.column_default,
      maxLength: row.character_maximum_length,
      precision: row.numeric_precision,
    });
  }

  // Get constraints
  const constraints = await query(`
    SELECT 
      tc.table_name,
      tc.constraint_name,
      tc.constraint_type,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints tc
    LEFT JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.table_schema = 'public'
    ORDER BY tc.table_name, tc.constraint_name
  `);

  for (const row of constraints) {
    if (schema.tables[row.table_name]) {
      schema.tables[row.table_name].constraints.push({
        name: row.constraint_name,
        type: row.constraint_type,
        column: row.column_name,
        foreignTable: row.foreign_table_name,
        foreignColumn: row.foreign_column_name,
      });
    }
  }

  // Get indexes
  const indexes = await query(`
    SELECT 
      tablename,
      indexname,
      indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname
  `);

  for (const row of indexes) {
    schema.indexes[`${row.tablename}.${row.indexname}`] = row.indexdef;
  }

  // Get RLS policies
  const policies = await query(`
    SELECT 
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual,
      with_check
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  `);

  for (const row of policies) {
    if (!schema.policies[row.tablename]) {
      schema.policies[row.tablename] = [];
    }
    schema.policies[row.tablename].push({
      name: row.policyname,
      permissive: row.permissive,
      roles: row.roles,
      command: row.cmd,
      using: row.qual,
      check: row.with_check,
    });
  }

  // Get functions
  const functions = await query(`
    SELECT 
      routine_name,
      routine_type,
      data_type
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    ORDER BY routine_name
  `);

  for (const row of functions) {
    schema.functions[row.routine_name] = {
      type: row.routine_type,
      returnType: row.data_type,
    };
  }

  // Get triggers
  const triggers = await query(`
    SELECT 
      event_object_table,
      trigger_name,
      event_manipulation,
      action_statement
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name
  `);

  for (const row of triggers) {
    if (!schema.triggers[row.event_object_table]) {
      schema.triggers[row.event_object_table] = [];
    }
    schema.triggers[row.event_object_table].push({
      name: row.trigger_name,
      event: row.event_manipulation,
      action: row.action_statement,
    });
  }

  return schema;
}

// Parse schema.sql file
async function parseSchemaFile() {
  const content = await readFile(SCHEMA_PATH, 'utf-8');
  
  // Simple parser - extract table definitions
  const tables = {};
  const tableRegex = /CREATE TABLE IF NOT EXISTS public\.(\w+)\s*\(([\s\S]*?)\);/g;
  let match;

  while ((match = tableRegex.exec(content)) !== null) {
    const tableName = match[1];
    const columnsStr = match[2];
    
    const columns = [];
    const lines = columnsStr.split('\n').map(l => l.trim()).filter(l => l);
    
    for (const line of lines) {
      if (line.startsWith('--') || line === '') continue;
      
      const colMatch = line.match(/^(\w+)\s+(.+?)(?:\s+(NOT NULL|NULL))?(?:\s+DEFAULT\s+(.+?))?(?:,|$)/);
      if (colMatch) {
        columns.push({
          name: colMatch[1],
          type: colMatch[2].replace(/NOT NULL|NULL/, '').trim(),
          nullable: !line.includes('NOT NULL'),
          default: colMatch[4] || null,
        });
      }
    }
    
    tables[tableName] = { columns };
  }

  return tables;
}

// Compare schemas and generate diff
function compareSchemas(dbSchema, fileSchema) {
  const diff = {
    missingInFile: [],
    missingInDb: [],
    columnDifferences: [],
  };

  // Check for tables in DB but not in file
  for (const tableName of Object.keys(dbSchema.tables)) {
    if (!fileSchema[tableName]) {
      diff.missingInFile.push(tableName);
    }
  }

  // Check for tables in file but not in DB
  for (const tableName of Object.keys(fileSchema)) {
    if (!dbSchema.tables[tableName]) {
      diff.missingInDb.push(tableName);
    }
  }

  // Compare columns for common tables
  for (const tableName of Object.keys(dbSchema.tables)) {
    if (fileSchema[tableName]) {
      const dbCols = dbSchema.tables[tableName].columns.map(c => c.name);
      const fileCols = fileSchema[tableName].columns.map(c => c.name);

      const missingInFile = dbCols.filter(c => !fileCols.includes(c));
      const missingInDb = fileCols.filter(c => !dbCols.includes(c));

      if (missingInFile.length > 0 || missingInDb.length > 0) {
        diff.columnDifferences.push({
          table: tableName,
          missingInFile,
          missingInDb,
        });
      }
    }
  }

  return diff;
}

// Generate migration SQL from diff
function generateMigration(diff) {
  const lines = [];
  lines.push('-- Auto-generated migration to sync schema.sql with database');
  lines.push('-- Generated at: ' + new Date().toISOString());
  lines.push('');
  lines.push('BEGIN;');
  lines.push('');

  // Add missing tables
  for (const table of diff.missingInFile) {
    lines.push(`-- TODO: Add table ${table}`);
    lines.push(`-- CREATE TABLE public.${table} (...);`);
    lines.push('');
  }

  // Add missing columns
  for (const colDiff of diff.columnDifferences) {
    for (const col of colDiff.missingInFile) {
      lines.push(`-- TODO: Add column ${colDiff.table}.${col}`);
      lines.push(`-- ALTER TABLE public.${colDiff.table} ADD COLUMN ${col} TEXT;`);
      lines.push('');
    }
  }

  lines.push('COMMIT;');

  return lines.join('\n');
}

// Main diff runner
async function runDiff() {
  console.log('🔍 Database Schema Diff Tool\n');
  console.log(`📍 Database: ${SUPABASE_URL}`);
  console.log(`📄 Schema file: ${SCHEMA_PATH}\n`);

  try {
    console.log('📊 Fetching database schema...');
    const dbSchema = await getDatabaseSchema();

    console.log('📄 Parsing schema.sql...');
    const fileSchema = await parseSchemaFile();

    console.log('🔄 Comparing schemas...\n');
    const diff = compareSchemas(dbSchema, fileSchema);

    // Report results
    if (diff.missingInFile.length === 0 && 
        diff.missingInDb.length === 0 && 
        diff.columnDifferences.length === 0) {
      console.log('✅ Schemas are in sync!');
      return;
    }

    if (diff.missingInFile.length > 0) {
      console.log('📋 Tables in database but not in schema.sql:');
      diff.missingInFile.forEach(t => console.log(`   - ${t}`));
      console.log('');
    }

    if (diff.missingInDb.length > 0) {
      console.log('📋 Tables in schema.sql but not in database:');
      diff.missingInDb.forEach(t => console.log(`   - ${t}`));
      console.log('');
    }

    if (diff.columnDifferences.length > 0) {
      console.log('📋 Column differences:');
      for (const colDiff of diff.columnDifferences) {
        console.log(`   ${colDiff.table}:`);
        colDiff.missingInFile.forEach(c => console.log(`     + ${c} (in DB, not in file)`));
        colDiff.missingInDb.forEach(c => console.log(`     - ${c} (in file, not in DB)`));
      }
      console.log('');
    }

    // Generate migration if requested
    if (process.argv.includes('--output')) {
      const outputFile = process.argv[process.argv.indexOf('--output') + 1];
      const migration = generateMigration(diff);
      await writeFile(outputFile, migration);
      console.log(`📝 Migration written to: ${outputFile}`);
    } else {
      console.log('💡 Run with --output <file> to generate a migration file');
    }

  } catch (err) {
    console.error('\n❌ Diff failed:', err.message);
    process.exit(1);
  }
}

runDiff();
