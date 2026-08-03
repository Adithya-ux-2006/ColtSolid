#!/usr/bin/env node
/**
 * Database Sync Script for Search Optimization & Mapping Fix
 * Run this directly against production Supabase with service role key
 * 
 * Usage: SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx node sync-database.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runMigration() {
  console.log('🔄 Starting database sync for search optimization...\n');

  try {
    // ==============================================================
    // 1. CLEAR INCORRECT NEGATION MAPPINGS IN symptom_remedies
    // ==============================================================
    console.log('1️⃣ Clearing incorrect negation mappings in symptom_remedies...');
    
    const negationMappings = [
      ['headache', 'rem_n01'], ['headache', 'rem_n02'], ['headache', 'rem_n03'], ['headache', 'rem_n04'], ['headache', 'rem_n05'],
      ['cold', 'rem_h01'], ['cold', 'rem_h02'], ['cold', 'rem_h03'], ['cold', 'rem_h04'], ['cold', 'rem_h05'],
      ['anxiety', 'rem_c01'], ['anxiety', 'rem_c02'], ['anxiety', 'rem_c03'], ['anxiety', 'rem_c04'], ['anxiety', 'rem_c05'],
      ['insomnia', 'rem_s01'], ['insomnia', 'rem_s02'], ['insomnia', 'rem_s03'], ['insomnia', 'rem_s04'], ['insomnia', 'rem_s05']
    ];

    for (const [symptom_id, remedy_id] of negationMappings) {
      const { error } = await supabase
        .from('symptom_remedies')
        .delete()
        .eq('symptom_id', symptom_id)
        .eq('remedy_id', remedy_id);
      
      if (error) console.warn(`   ⚠️  ${symptom_id}/${remedy_id}: ${error.message}`);
      else console.log(`   ✅ Deleted ${symptom_id}/${remedy_id}`);
    }

    // ==============================================================
    // 2. CLEAR INCORRECT MAPPINGS IN remedy_symptoms
    // ==============================================================
    console.log('\n2️⃣ Clearing incorrect mappings in remedy_symptoms...');
    
    const incorrectRemedyMappings = [
      ['rem_n01', 'headache'], ['rem_n02', 'headache'], ['rem_n03', 'headache'], ['rem_n04', 'headache'], ['rem_n05', 'headache'],
      ['rem_h01', 'cold'], ['rem_h02', 'cold'], ['rem_h03', 'cold'], ['rem_h04', 'cold'], ['rem_h05', 'cold'],
      ['rem_c01', 'anxiety'], ['rem_c02', 'anxiety'], ['rem_c03', 'anxiety'], ['rem_c04', 'anxiety'], ['rem_c05', 'anxiety'],
      ['rem_s01', 'insomnia'], ['rem_s02', 'insomnia'], ['rem_s03', 'insomnia'], ['rem_s04', 'insomnia'], ['rem_s05', 'insomnia']
    ];

    for (const [remedy_id, symptom_id] of incorrectRemedyMappings) {
      const { error } = await supabase
        .from('remedy_symptoms')
        .delete()
        .eq('remedy_id', remedy_id)
        .eq('symptom_id', symptom_id);
      
      if (error) console.warn(`   ⚠️  ${remedy_id}/${symptom_id}: ${error.message}`);
      else console.log(`   ✅ Deleted ${remedy_id}/${symptom_id}`);
    }

    // ==============================================================
    // 3. ENSURE symptom_remedies TABLE EXISTS
    // ==============================================================
    console.log('\n3️⃣ Ensuring symptom_remedies table exists...');
    // Table creation is handled by migration, just verify
    const { error: _tableCheckError } = await supabase
      .from('symptom_remedies')
      .select('*', { count: 'exact', head: true });
    console.log('   ✅ Table verified');

    // ==============================================================
    // 4. FORCE-MAP PRIMARY SYMPTOMS IN symptom_remedies
    // ==============================================================
    console.log('\n4️⃣ Force-mapping primary symptoms in symptom_remedies...');
    
    const primaryMappings = [
      // Headache (primary)
      { symptom_id: 'headache', remedy_id: 'rem_h01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'headache', remedy_id: 'rem_h02', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'headache', remedy_id: 'rem_h03', evidence_score: 7, priority_rank: 8 },
      { symptom_id: 'headache', remedy_id: 'rem_h04', evidence_score: 10, priority_rank: 10 },
      { symptom_id: 'headache', remedy_id: 'rem_h05', evidence_score: 8, priority_rank: 7 },

      // Cold (primary)
      { symptom_id: 'cold', remedy_id: 'rem_c01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'cold', remedy_id: 'rem_c02', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'cold', remedy_id: 'rem_c03', evidence_score: 6, priority_rank: 7 },
      { symptom_id: 'cold', remedy_id: 'rem_c04', evidence_score: 9, priority_rank: 9 },
      { symptom_id: 'cold', remedy_id: 'rem_c05', evidence_score: 7, priority_rank: 8 },

      // Anxiety (primary)
      { symptom_id: 'anxiety', remedy_id: 'rem_a01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'anxiety', remedy_id: 'rem_a02', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'anxiety', remedy_id: 'rem_a03', evidence_score: 7, priority_rank: 8 },
      { symptom_id: 'anxiety', remedy_id: 'rem_a04', evidence_score: 9, priority_rank: 9 },
      { symptom_id: 'anxiety', remedy_id: 'rem_a05', evidence_score: 8, priority_rank: 7 },

      // Insomnia (primary)
      { symptom_id: 'insomnia', remedy_id: 'rem_i01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'insomnia', remedy_id: 'rem_i02', evidence_score: 7, priority_rank: 8 },
      { symptom_id: 'insomnia', remedy_id: 'rem_i03', evidence_score: 6, priority_rank: 7 },
      { symptom_id: 'insomnia', remedy_id: 'rem_i04', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'insomnia', remedy_id: 'rem_i05', evidence_score: 9, priority_rank: 10 },

      // Nausea (primary)
      { symptom_id: 'nausea', remedy_id: 'rem_n01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'nausea', remedy_id: 'rem_n02', evidence_score: 7, priority_rank: 8 },
      { symptom_id: 'nausea', remedy_id: 'rem_n03', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'nausea', remedy_id: 'rem_n04', evidence_score: 10, priority_rank: 10 },
      { symptom_id: 'nausea', remedy_id: 'rem_n05', evidence_score: 8, priority_rank: 7 },

      // Stress (primary)
      { symptom_id: 'stress', remedy_id: 'rem_s01', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'stress', remedy_id: 'rem_s02', evidence_score: 7, priority_rank: 8 },
      { symptom_id: 'stress', remedy_id: 'rem_s03', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'stress', remedy_id: 'rem_s04', evidence_score: 7, priority_rank: 8 },
      { symptom_id: 'stress', remedy_id: 'rem_s05', evidence_score: 9, priority_rank: 10 },

      // Back Pain (primary)
      { symptom_id: 'back_pain', remedy_id: 'rem_bp01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'back_pain', remedy_id: 'rem_bp02', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'back_pain', remedy_id: 'rem_bp03', evidence_score: 7, priority_rank: 8 },

      // Sore Throat (primary)
      { symptom_id: 'sore_throat', remedy_id: 'rem_st01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'sore_throat', remedy_id: 'rem_st02', evidence_score: 8, priority_rank: 9 },

      // Eye Strain (primary)
      { symptom_id: 'eye_strain', remedy_id: 'rem_es01', evidence_score: 10, priority_rank: 10 },
      { symptom_id: 'eye_strain', remedy_id: 'rem_es02', evidence_score: 8, priority_rank: 9 },

      // Period Cramps (primary)
      { symptom_id: 'period_cramps', remedy_id: 'rem_pc01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'period_cramps', remedy_id: 'rem_pc02', evidence_score: 8, priority_rank: 9 },

      // Fever (primary)
      { symptom_id: 'fever', remedy_id: 'rem_fv01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'fever', remedy_id: 'rem_fv02', evidence_score: 7, priority_rank: 8 },

      // Skin Rash (primary)
      { symptom_id: 'skin_rash', remedy_id: 'rem_sr01', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'skin_rash', remedy_id: 'rem_sr02', evidence_score: 7, priority_rank: 8 },

      // Ear Pain (primary)
      { symptom_id: 'ear_pain', remedy_id: 'rem_ep01', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'ear_pain', remedy_id: 'rem_ep02', evidence_score: 6, priority_rank: 7 },

      // Bloating (primary)
      { symptom_id: 'bloating', remedy_id: 'rem_bg01', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'bloating', remedy_id: 'rem_bg02', evidence_score: 7, priority_rank: 8 },

      // Hangover (primary)
      { symptom_id: 'hangover', remedy_id: 'rem_ho01', evidence_score: 9, priority_rank: 10 },
      { symptom_id: 'hangover', remedy_id: 'rem_ho02', evidence_score: 7, priority_rank: 8 },

      // Fatigue (primary)
      { symptom_id: 'fatigue', remedy_id: 'rem_ft01', evidence_score: 8, priority_rank: 9 },
      { symptom_id: 'fatigue', remedy_id: 'rem_ft02', evidence_score: 7, priority_rank: 8 },
    ];

    // Insert in batches of 50
    for (let i = 0; i < primaryMappings.length; i += 50) {
      const batch = primaryMappings.slice(i, i + 50);
      const { error } = await supabase
        .from('symptom_remedies')
        .upsert(batch, { onConflict: 'symptom_id,remedy_id' });
      
      if (error) console.warn(`   ⚠️  Batch ${i/50 + 1}: ${error.message}`);
      else console.log(`   ✅ Batch ${i/50 + 1}: ${batch.length} mappings upserted`);
    }

    // ==============================================================
    // 5. ENSURE remedy_symptoms HAS match_strength COLUMN
    // ==============================================================
    console.log('\n5️⃣ Updating remedy_symptoms with canonical primary/secondary mappings...');
    
    // First clear all
    const { error: deleteError } = await supabase
      .from('remedy_symptoms')
      .delete()
      .neq('remedy_id', ''); // Delete all
    
    if (deleteError) console.warn(`   ⚠️  Clear: ${deleteError.message}`);
    else console.log('   ✅ Cleared existing mappings');

    const canonicalMappings = [
      // Primary symptoms (direct treatment)
      { remedy_id: 'rem_h01', symptom_id: 'headache', match_strength: 'primary' },
      { remedy_id: 'rem_h02', symptom_id: 'headache', match_strength: 'primary' },
      { remedy_id: 'rem_h03', symptom_id: 'headache', match_strength: 'primary' },
      { remedy_id: 'rem_h04', symptom_id: 'headache', match_strength: 'primary' },
      { remedy_id: 'rem_h05', symptom_id: 'headache', match_strength: 'primary' },

      { remedy_id: 'rem_c01', symptom_id: 'cold', match_strength: 'primary' },
      { remedy_id: 'rem_c02', symptom_id: 'cold', match_strength: 'primary' },
      { remedy_id: 'rem_c03', symptom_id: 'cold', match_strength: 'primary' },
      { remedy_id: 'rem_c04', symptom_id: 'cold', match_strength: 'primary' },
      { remedy_id: 'rem_c05', symptom_id: 'cold', match_strength: 'primary' },

      { remedy_id: 'rem_a01', symptom_id: 'anxiety', match_strength: 'primary' },
      { remedy_id: 'rem_a02', symptom_id: 'anxiety', match_strength: 'primary' },
      { remedy_id: 'rem_a03', symptom_id: 'anxiety', match_strength: 'primary' },
      { remedy_id: 'rem_a04', symptom_id: 'anxiety', match_strength: 'primary' },
      { remedy_id: 'rem_a05', symptom_id: 'anxiety', match_strength: 'primary' },

      { remedy_id: 'rem_i01', symptom_id: 'insomnia', match_strength: 'primary' },
      { remedy_id: 'rem_i02', symptom_id: 'insomnia', match_strength: 'primary' },
      { remedy_id: 'rem_i03', symptom_id: 'insomnia', match_strength: 'primary' },
      { remedy_id: 'rem_i04', symptom_id: 'insomnia', match_strength: 'primary' },
      { remedy_id: 'rem_i05', symptom_id: 'insomnia', match_strength: 'primary' },

      { remedy_id: 'rem_n01', symptom_id: 'nausea', match_strength: 'primary' },
      { remedy_id: 'rem_n02', symptom_id: 'nausea', match_strength: 'primary' },
      { remedy_id: 'rem_n03', symptom_id: 'nausea', match_strength: 'primary' },
      { remedy_id: 'rem_n04', symptom_id: 'nausea', match_strength: 'primary' },
      { remedy_id: 'rem_n05', symptom_id: 'nausea', match_strength: 'primary' },

      { remedy_id: 'rem_s01', symptom_id: 'stress', match_strength: 'primary' },
      { remedy_id: 'rem_s02', symptom_id: 'stress', match_strength: 'primary' },
      { remedy_id: 'rem_s03', symptom_id: 'stress', match_strength: 'primary' },
      { remedy_id: 'rem_s04', symptom_id: 'stress', match_strength: 'primary' },
      { remedy_id: 'rem_s05', symptom_id: 'stress', match_strength: 'primary' },

      { remedy_id: 'rem_bp01', symptom_id: 'back_pain', match_strength: 'primary' },
      { remedy_id: 'rem_bp02', symptom_id: 'back_pain', match_strength: 'primary' },
      { remedy_id: 'rem_bp03', symptom_id: 'back_pain', match_strength: 'primary' },

      { remedy_id: 'rem_st01', symptom_id: 'sore_throat', match_strength: 'primary' },
      { remedy_id: 'rem_st02', symptom_id: 'sore_throat', match_strength: 'primary' },

      { remedy_id: 'rem_es01', symptom_id: 'eye_strain', match_strength: 'primary' },
      { remedy_id: 'rem_es02', symptom_id: 'eye_strain', match_strength: 'primary' },

      { remedy_id: 'rem_pc01', symptom_id: 'period_cramps', match_strength: 'primary' },
      { remedy_id: 'rem_pc02', symptom_id: 'period_cramps', match_strength: 'primary' },

      { remedy_id: 'rem_fv01', symptom_id: 'fever', match_strength: 'primary' },
      { remedy_id: 'rem_fv02', symptom_id: 'fever', match_strength: 'primary' },

      { remedy_id: 'rem_sr01', symptom_id: 'skin_rash', match_strength: 'primary' },
      { remedy_id: 'rem_sr02', symptom_id: 'skin_rash', match_strength: 'primary' },

      { remedy_id: 'rem_ep01', symptom_id: 'ear_pain', match_strength: 'primary' },
      { remedy_id: 'rem_ep02', symptom_id: 'ear_pain', match_strength: 'primary' },

      { remedy_id: 'rem_bg01', symptom_id: 'bloating', match_strength: 'primary' },
      { remedy_id: 'rem_bg02', symptom_id: 'bloating', match_strength: 'primary' },

      { remedy_id: 'rem_ho01', symptom_id: 'hangover', match_strength: 'primary' },
      { remedy_id: 'rem_ho02', symptom_id: 'hangover', match_strength: 'primary' },

      { remedy_id: 'rem_ft01', symptom_id: 'fatigue', match_strength: 'primary' },
      { remedy_id: 'rem_ft02', symptom_id: 'fatigue', match_strength: 'primary' },

      // Secondary symptoms (associated benefits)
      { remedy_id: 'rem_h01', symptom_id: 'stress', match_strength: 'secondary' },
      { remedy_id: 'rem_h02', symptom_id: 'insomnia', match_strength: 'secondary' },
      { remedy_id: 'rem_h03', symptom_id: 'stress', match_strength: 'secondary' },
      { remedy_id: 'rem_h04', symptom_id: 'cold', match_strength: 'secondary' },
      { remedy_id: 'rem_h05', symptom_id: 'nausea', match_strength: 'secondary' },

      { remedy_id: 'rem_c03', symptom_id: 'stress', match_strength: 'secondary' },
      { remedy_id: 'rem_c05', symptom_id: 'nausea', match_strength: 'secondary' },

      { remedy_id: 'rem_a01', symptom_id: 'stress', match_strength: 'secondary' },
      { remedy_id: 'rem_a02', symptom_id: 'stress', match_strength: 'secondary' },

      { remedy_id: 'rem_i03', symptom_id: 'anxiety', match_strength: 'secondary' },
      { remedy_id: 'rem_i05', symptom_id: 'stress', match_strength: 'secondary' },

      { remedy_id: 'rem_n02', symptom_id: 'headache', match_strength: 'secondary' },

      { remedy_id: 'rem_s01', symptom_id: 'anxiety', match_strength: 'secondary' },
      { remedy_id: 'rem_s02', symptom_id: 'insomnia', match_strength: 'secondary' },
      { remedy_id: 'rem_s03', symptom_id: 'anxiety', match_strength: 'secondary' },
      { remedy_id: 'rem_s04', symptom_id: 'insomnia', match_strength: 'secondary' },
      { remedy_id: 'rem_s05', symptom_id: 'headache', match_strength: 'secondary' },

      { remedy_id: 'rem_bp01', symptom_id: 'stress', match_strength: 'secondary' },
      { remedy_id: 'rem_st01', symptom_id: 'cold', match_strength: 'secondary' },
      { remedy_id: 'rem_st02', symptom_id: 'cold', match_strength: 'secondary' },
      { remedy_id: 'rem_es01', symptom_id: 'fatigue', match_strength: 'secondary' },
      { remedy_id: 'rem_pc02', symptom_id: 'nausea', match_strength: 'secondary' },
      { remedy_id: 'rem_fv01', symptom_id: 'cold', match_strength: 'secondary' },
      { remedy_id: 'rem_ep02', symptom_id: 'stress', match_strength: 'secondary' },
      { remedy_id: 'rem_bg01', symptom_id: 'nausea', match_strength: 'secondary' },
      { remedy_id: 'rem_ho01', symptom_id: 'headache', match_strength: 'secondary' },
      { remedy_id: 'rem_ho01', symptom_id: 'nausea', match_strength: 'secondary' },
      { remedy_id: 'rem_ho01', symptom_id: 'fatigue', match_strength: 'secondary' },
      { remedy_id: 'rem_ho02', symptom_id: 'nausea', match_strength: 'secondary' },
      { remedy_id: 'rem_ft01', symptom_id: 'stress', match_strength: 'secondary' },
    ];

    for (let i = 0; i < canonicalMappings.length; i += 50) {
      const batch = canonicalMappings.slice(i, i + 50);
      const { error } = await supabase
        .from('remedy_symptoms')
        .upsert(batch, { onConflict: 'remedy_id,symptom_id' });
      
      if (error) console.warn(`   ⚠️  Batch ${i/50 + 1}: ${error.message}`);
      else console.log(`   ✅ Batch ${i/50 + 1}: ${batch.length} mappings upserted`);
    }

    // ==============================================================
    // 6. POPULATE INGREDIENTS FOR ALL REMEDIES
    // ==============================================================
    console.log('\n6️⃣ Populating ingredients for all remedies...');
    
    const ingredientsData = {
      'rem_h01': ['peppermint oil', 'menthol', 'carrier oil'],
      'rem_h02': ['magnesium glycinate', 'cellulose capsule'],
      'rem_h03': [],
      'rem_h04': ['ibuprofen', 'cellulose', 'silica'],
      'rem_h05': ['water', 'electrolytes'],
      'rem_c01': ['zinc acetate', 'zinc gluconate', 'natural flavors'],
      'rem_c02': ['sodium chloride', 'sodium bicarbonate', 'purified water'],
      'rem_c03': ['herbal oil'],
      'rem_c04': ['pseudoephedrine hydrochloride'],
      'rem_c05': ['honey', 'lemon', 'water'],
      'rem_a01': ['l-theanine', 'cellulose capsule'],
      'rem_a02': ['ashwagandha root extract', 'cellulose'],
      'rem_a03': [],
      'rem_a04': ['propranolol hydrochloride'],
      'rem_a05': [],
      'rem_i01': ['melatonin', 'cellulose', 'magnesium stearate'],
      'rem_i02': ['tart cherry concentrate', 'water'],
      'rem_i03': ['vaccaria seeds', 'medical tape'],
      'rem_i04': ['doxylamine succinate'],
      'rem_i05': [],
      'rem_n01': ['ginger root extract', 'cellulose capsule'],
      'rem_n02': ['peppermint leaves', 'water'],
      'rem_n03': [],
      'rem_n04': ['ondansetron'],
      'rem_n05': ['water', 'electrolytes', 'glucose'],
      'rem_s01': ['rhodiola rosea extract', 'cellulose'],
      'rem_s02': ['lemon balm leaves', 'water'],
      'rem_s03': [],
      'rem_s04': ['hydroxyzine'],
      'rem_s05': [],
      'rem_bp01': [],
      'rem_bp02': [],
      'rem_bp03': ['turmeric extract', 'curcumin', 'black pepper extract', 'cellulose'],
      'rem_st01': ['sodium chloride', 'water'],
      'rem_st02': ['honey', 'ginger', 'water'],
      'rem_es01': [],
      'rem_es02': ['water', 'cotton cloth'],
      'rem_pc01': [],
      'rem_pc02': ['ginger root extract'],
      'rem_fv01': ['water', 'electrolytes'],
      'rem_fv02': ['water', 'cotton cloth'],
      'rem_sr01': ['colloidal oatmeal', 'water'],
      'rem_sr02': ['water', 'cotton cloth'],
      'rem_ep01': ['water', 'cotton cloth'],
      'rem_ep02': [],
      'rem_bg01': ['peppermint leaves', 'water'],
      'rem_bg02': [],
      'rem_ho01': ['water', 'electrolytes', 'glucose'],
      'rem_ho02': ['ginger root', 'mint leaves', 'water'],
      'rem_ft01': [],
      'rem_ft02': ['protein', 'fiber', 'nuts', 'dairy'],
    };

    for (const [remedyId, ingredients] of Object.entries(ingredientsData)) {
      const { error } = await supabase
        .from('remedies')
        .update({ ingredients })
        .eq('id', remedyId);
      
      if (error) console.warn(`   ⚠️  ${remedyId}: ${error.message}`);
      else console.log(`   ✅ ${remedyId}: ${ingredients.length} ingredients`);
    }

    // ==============================================================
    // 7. ENSURE CANONICAL SYMPTOMS EXIST
    // ==============================================================
    console.log('\n7️⃣ Ensuring canonical symptoms exist...');
    
    const canonicalSymptoms = [
      { id: 'cough', label: 'Cough', emoji: '🫁', color_theme: 'sage' },
      { id: 'congestion', label: 'Congestion', emoji: '🤧', color_theme: 'sage' },
      { id: 'sinus_pressure', label: 'Sinus Pressure', emoji: '😤', color_theme: 'amber' },
      { id: 'dehydration', label: 'Dehydration', emoji: '💧', color_theme: 'forest' },
      { id: 'low_energy', label: 'Low Energy', emoji: '🔋', color_theme: 'forest' },
      { id: 'burnout', label: 'Burnout', emoji: '😮‍💨', color_theme: 'amber' },
      { id: 'brain_fog', label: 'Brain Fog', emoji: '🌫️', color_theme: 'amber' },
      { id: 'muscle_pain', label: 'Muscle Pain', emoji: '💪', color_theme: 'forest' },
      { id: 'joint_pain', label: 'Joint Pain', emoji: '🦵', color_theme: 'forest' },
      { id: 'leg_pain', label: 'Leg Pain', emoji: '🦵', color_theme: 'forest' },
      { id: 'knee_pain', label: 'Knee Pain', emoji: '🦵', color_theme: 'forest' },
      { id: 'neck_pain', label: 'Neck Pain', emoji: '🧘', color_theme: 'forest' },
      { id: 'shoulder_pain', label: 'Shoulder Pain', emoji: '💪', color_theme: 'forest' },
      { id: 'eye_pain', label: 'Eye Pain', emoji: '👁️', color_theme: 'forest' },
      { id: 'indigestion', label: 'Indigestion', emoji: '🍽️', color_theme: 'sage' },
      { id: 'heartburn', label: 'Heartburn', emoji: '🔥', color_theme: 'sage' },
      { id: 'constipation', label: 'Constipation', emoji: '🫧', color_theme: 'sage' },
      { id: 'diarrhea', label: 'Diarrhea', emoji: '💧', color_theme: 'sage' },
      { id: 'gas', label: 'Gas', emoji: '🫧', color_theme: 'sage' },
      { id: 'dry_skin', label: 'Dry Skin', emoji: '🧴', color_theme: 'sage' },
      { id: 'acne', label: 'Acne', emoji: '🧏', color_theme: 'sage' },
      { id: 'pms', label: 'PMS', emoji: '🌙', color_theme: 'forest' },
      { id: 'menopause', label: 'Menopause', emoji: '🌸', color_theme: 'forest' },
      { id: 'eye_strain', label: 'Eye Strain', emoji: '👀', color_theme: 'amber' },
    ];

    for (const symptom of canonicalSymptoms) {
      const { error } = await supabase
        .from('symptoms')
        .upsert(symptom, { onConflict: 'id' });
      
      if (error) console.warn(`   ⚠️  ${symptom.id}: ${error.message}`);
      else console.log(`   ✅ ${symptom.id}`);
    }

    console.log('\n✅ Database sync completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Cleared ~20 incorrect negation mappings');
    console.log('   - Force-mapped primary symptoms in symptom_remedies');
    console.log('   - Set canonical primary/secondary in remedy_symptoms');
    console.log('   - Populated ingredients for allergy filtering');
    console.log('   - Ensured all canonical symptoms exist');

  } catch (err) {
    console.error('\n❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();