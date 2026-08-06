#!/usr/bin/env node
/**
 * Schema Generator for curA/ClotSolid
 * 
 * Generates supabase/schema.sql from current database state.
 * 
 * Usage:
 *   node scripts/generate-schema.js           # Generate schema.sql
 *   node scripts/generate-schema.js --dry-run # Preview without writing
 */

import { createClient } from '@supabase/supabase-js';
import { writeFile } from 'fs/promises';
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

// Generate CREATE TABLE statement
function generateCreateTable(table, columns, constraints) {
  const lines = [];
  lines.push(`CREATE TABLE IF NOT EXISTS public.${table} (`);

  const columnDefs = columns.map(col => {
    let def = `    ${col.column_name} ${col.data_type}`;
    
    if (col.character_maximum_length) {
      def += `(${col.character_maximum_length})`;
    }
    
    if (col.is_nullable === 'NO') {
      def += ' NOT NULL';
    }
    
    if (col.column_default) {
      def += ` DEFAULT ${col.column_default}`;
    }
    
    return def;
  });

  // Add constraints
  const tableConstraints = constraints.filter(c => c.table_name === table);
  const pkColumns = tableConstraints
    .filter(c => c.constraint_type === 'PRIMARY KEY')
    .map(c => c.column_name);
  
  if (pkColumns.length > 0) {
    columnDefs.push(`    PRIMARY KEY (${pkColumns.join(', ')})`);
  }

  const uniqueConstraints = tableConstraints
    .filter(c => c.constraint_type === 'UNIQUE')
    .reduce((acc, c) => {
      if (!acc[c.constraint_name]) acc[c.constraint_name] = [];
      acc[c.constraint_name].push(c.column_name);
      return acc;
    }, {});

  for (const [name, cols] of Object.entries(uniqueConstraints)) {
    columnDefs.push(`    CONSTRAINT ${name} UNIQUE (${cols.join(', ')})`);
  }

  lines.push(columnDefs.join(',\n'));
  lines.push(');');

  return lines.join('\n');
}

// Generate RLS policies
function generateRLSPolicies(policies) {
  const lines = [];
  
  // Group by table
  const byTable = {};
  for (const p of policies) {
    if (!byTable[p.tablename]) byTable[p.tablename] = [];
    byTable[p.tablename].push(p);
  }

  // Enable RLS for each table
  const tables = Object.keys(byTable).sort();
  for (const table of tables) {
    lines.push(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
  }

  lines.push('');

  // Generate policies
  for (const table of tables) {
    lines.push(`-- Policies for ${table}`);
    for (const p of byTable[table]) {
      lines.push(`DROP POLICY IF EXISTS "${p.policyname}" ON public.${table};`);
      
      let policyDef = `CREATE POLICY "${p.policyname}" ON public.${table}`;
      
      if (p.permissive === 'PERMISSIVE') {
        policyDef += ' AS PERMISSIVE';
      } else {
        policyDef += ' AS RESTRICTIVE';
      }
      
      policyDef += ` FOR ${p.cmd}`;
      
      if (p.roles && p.roles !== '{public}') {
        policyDef += ` TO ${p.roles}`;
      }
      
      if (p.qual) {
        policyDef += `\n    USING (${p.qual})`;
      }
      
      if (p.with_check) {
        policyDef += `\n    WITH CHECK (${p.with_check})`;
      }
      
      policyDef += ';';
      lines.push(policyDef);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// Generate functions
function generateFunctions(functions, triggers) {
  const lines = [];
  
  lines.push('-- Functions');
  lines.push('');
  
  for (const [name, func] of Object.entries(functions)) {
    // Skip built-in functions
    if (name.startsWith('pg_') || name.startsWith('sql_')) continue;
    
    lines.push(`-- Function: ${name}`);
    lines.push(`-- Type: ${func.type}`);
    lines.push(`-- Returns: ${func.returnType}`);
    lines.push('');
  }

  lines.push('-- Triggers');
  lines.push('');
  
  for (const [table, tableTriggers] of Object.entries(triggers)) {
    for (const t of tableTriggers) {
      lines.push(`-- Trigger: ${t.name} on ${table}`);
      lines.push(`-- Event: ${t.event}`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

// Main schema generator
async function generateSchema() {
  console.log('📝 Schema Generator\n');
  console.log(`📍 Database: ${SUPABASE_URL}`);
  console.log(`📄 Output: ${SCHEMA_PATH}\n`);

  try {
    // Get all schema information
    console.log('📊 Fetching tables and columns...');
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

    console.log('📊 Fetching constraints...');
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

    console.log('📊 Fetching RLS policies...');
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

    console.log('📊 Fetching functions...');
    const functions = await query(`
      SELECT 
        routine_name,
        routine_type,
        data_type
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      ORDER BY routine_name
    `);

    console.log('📊 Fetching triggers...');
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

    // Generate schema
    console.log('\n🔄 Generating schema...');
    
    const schemaLines = [];
    schemaLines.push('-- Supabase Schema for curA');
    schemaLines.push('-- Generated at: ' + new Date().toISOString());
    schemaLines.push('-- DO NOT EDIT - This file is auto-generated');
    schemaLines.push('');
    schemaLines.push('-- 1. Create Tables');
    schemaLines.push('');

    // Group tables
    const tableMap = {};
    for (const row of tables) {
      if (!tableMap[row.table_name]) {
        tableMap[row.table_name] = [];
      }
      tableMap[row.table_name].push(row);
    }

    // Generate CREATE TABLE statements
    for (const [tableName, columns] of Object.entries(tableMap)) {
      schemaLines.push(generateCreateTable(tableName, columns, constraints));
      schemaLines.push('');
    }

    // Generate RLS policies
    schemaLines.push('-- 2. Row Level Security (RLS) Policies');
    schemaLines.push('');
    schemaLines.push(generateRLSPolicies(policies));

    // Generate functions and triggers
    schemaLines.push('-- 3. Functions and Triggers');
    schemaLines.push('');
    schemaLines.push(generateFunctions(functions, triggers));

    const schemaContent = schemaLines.join('\n');

    if (process.argv.includes('--dry-run')) {
      console.log('\n📋 Generated schema (dry run):\n');
      console.log(schemaContent);
    } else {
      await writeFile(SCHEMA_PATH, schemaContent);
      console.log(`\n✅ Schema written to: ${SCHEMA_PATH}`);
    }

  } catch (err) {
    console.error('\n❌ Generation failed:', err.message);
    process.exit(1);
  }
}

generateSchema();
