const TEMPORAL_MODIFIERS = [
  { phrase: "after eating", boosts: { indigestion: 0.4, heartburn: 0.3, bloating: 0.3, nausea: 0.2, gas: 0.2, stomach_ache: 0.2 } },
  { phrase: "while eating", boosts: { indigestion: 0.3, nausea: 0.2, sore_throat: 0.2 } },
  { phrase: "after studying", boosts: { eye_strain: 0.4, headache: 0.3, brain_fog: 0.2, fatigue: 0.2 } },
  { phrase: "after screen", boosts: { eye_strain: 0.5, headache: 0.3, brain_fog: 0.2, fatigue: 0.1 } },
  { phrase: "at night", boosts: { insomnia: 0.4, anxiety: 0.2, stress: 0.1, cough: 0.1 } },
  { phrase: "in the morning", boosts: { congestion: 0.2, headache: 0.1, sinus_pressure: 0.2, joint_pain: 0.1 } },
  { phrase: "when waking up", boosts: { fatigue: 0.2, headache: 0.1, low_energy: 0.2, insomnia: 0.1 } },
  { phrase: "after exercise", boosts: { muscle_pain: 0.4, joint_pain: 0.3, fatigue: 0.2, leg_pain: 0.2, dehydration: 0.3 } },
  { phrase: "after workout", boosts: { muscle_pain: 0.5, joint_pain: 0.3, fatigue: 0.2 } },
  { phrase: "during period", boosts: { period_cramps: 0.5, pms: 0.4, bloating: 0.3, fatigue: 0.2, headache: 0.1 } },
  { phrase: "before period", boosts: { pms: 0.5, bloating: 0.3, headache: 0.2, fatigue: 0.2 } },
  { phrase: "after eating dairy", boosts: { bloating: 0.3, gas: 0.3, indigestion: 0.3, stomach_ache: 0.2 } },
  { phrase: "when stressed", boosts: { stress: 0.5, anxiety: 0.4, headache: 0.2, insomnia: 0.2 } },
  { phrase: "at work", boosts: { stress: 0.4, anxiety: 0.3, eye_strain: 0.3, headache: 0.2, fatigue: 0.2 } },
  { phrase: "after eating spicy", boosts: { heartburn: 0.5, indigestion: 0.3, stomach_ache: 0.2 } },
  { phrase: "during sleep", boosts: { sleep_apnea: 0.4, night_sweats: 0.3, teeth_grinding: 0.3, restless_leg: 0.2 } },
  { phrase: "when sleeping", boosts: { sleep_apnea: 0.3, night_sweats: 0.3, teeth_grinding: 0.3 } },
  { phrase: "after sex", boosts: { uti: 0.3, yeast_infection: 0.2, vaginal_dryness: 0.2 } },
  { phrase: "after intercourse", boosts: { uti: 0.3, yeast_infection: 0.2, vaginal_dryness: 0.2 } },
  { phrase: "during exercise", boosts: { asthma: 0.4, palpitations: 0.2, dehydration: 0.2 } },
  { phrase: "when running", boosts: { asthma: 0.3, ankle_pain: 0.2, foot_pain: 0.2, knee_pain: 0.2 } },
  { phrase: "during allergy season", boosts: { allergies: 0.5, congestion: 0.3, hives: 0.2 } },
  { phrase: "in spring", boosts: { allergies: 0.4, congestion: 0.2, sneezing: 0.2 } },
  { phrase: "in the cold", boosts: { asthma: 0.2, poor_circulation: 0.3, chills: 0.3 } },
  { phrase: "after standing", boosts: { poor_circulation: 0.3, edema: 0.3, leg_pain: 0.2, back_pain: 0.2 } },
  { phrase: "after sitting", boosts: { back_pain: 0.3, sciatica: 0.3, hemorrhoids: 0.2 } },
  // New temporal patterns
  { phrase: "before bed", boosts: { insomnia: 0.5, anxiety: 0.3, stress: 0.2 } },
  { phrase: "at bedtime", boosts: { insomnia: 0.5, anxiety: 0.2 } },
  { phrase: "during exams", boosts: { stress: 0.5, anxiety: 0.4, insomnia: 0.3, headache: 0.2, eye_strain: 0.2 } },
  { phrase: "during exam", boosts: { stress: 0.5, anxiety: 0.4, insomnia: 0.3, headache: 0.2, eye_strain: 0.2 } },
  { phrase: "on my period", boosts: { period_cramps: 0.5, pms: 0.4, bloating: 0.3, fatigue: 0.2 } },
  { phrase: "on my cycle", boosts: { period_cramps: 0.4, pms: 0.4, bloating: 0.3 } },
  { phrase: "right after eating", boosts: { indigestion: 0.4, heartburn: 0.3, nausea: 0.2, bloating: 0.2 } },
  { phrase: "every morning", boosts: { fatigue: 0.2, headache: 0.2, low_energy: 0.2 } },
  { phrase: "all day", boosts: { fatigue: 0.3, headache: 0.2, stress: 0.2 } },
  { phrase: "past few days", boosts: { fatigue: 0.2, cold: 0.2 } },
  { phrase: "since yesterday", boosts: { cold: 0.3, headache: 0.2 } },
  { phrase: "for weeks", boosts: { fatigue: 0.3, stress: 0.2, burnout: 0.2 } },
  { phrase: "after drinking", boosts: { headache: 0.3, nausea: 0.3, stomach_ache: 0.2, dehydration: 0.2 } },
  { phrase: "after coffee", boosts: { anxiety: 0.3, heartburn: 0.3, stomach_ache: 0.2, palpitations: 0.2 } },
  { phrase: "after lunch", boosts: { bloating: 0.3, indigestion: 0.3, fatigue: 0.2 } },
  { phrase: "after dinner", boosts: { bloating: 0.3, indigestion: 0.3, heartburn: 0.2 } },
  { phrase: "in heat", boosts: { dehydration: 0.4, heat_exhaustion: 0.3, fatigue: 0.2 } },
  { phrase: "in sun", boosts: { dehydration: 0.3, sunburn: 0.4, headache: 0.2 } },
  { phrase: "while driving", boosts: { eye_strain: 0.3, back_pain: 0.2, neck_pain: 0.2 } },
  { phrase: "at desk", boosts: { eye_strain: 0.3, back_pain: 0.3, neck_pain: 0.3, headache: 0.2 } },
  { phrase: "after waking", boosts: { fatigue: 0.2, headache: 0.1, low_energy: 0.2 } },
  { phrase: "middle of night", boosts: { insomnia: 0.5, anxiety: 0.3 } },
  { phrase: "in the afternoon", boosts: { fatigue: 0.2, eye_strain: 0.2, headache: 0.1 } },
  { phrase: "every night", boosts: { insomnia: 0.4, anxiety: 0.2, stress: 0.2 } },
  { phrase: "right now", boosts: {}, },
  { phrase: "at the moment", boosts: {}, },
];

const POSITIONAL_MODIFIERS = [
  { phrase: "upper stomach", boosts: { indigestion: 0.3, heartburn: 0.3, stomach_ache: 0.2 } },
  { phrase: "lower stomach", boosts: { period_cramps: 0.3, bloating: 0.3, gas: 0.2, stomach_ache: 0.2 } },
  { phrase: "upper back", boosts: { neck_pain: 0.3, shoulder_pain: 0.3, back_pain: 0.2, headache: 0.1 } },
  { phrase: "lower back", boosts: { back_pain: 0.5, leg_pain: 0.1 } },
  { phrase: "left side", boosts: {} },
  { phrase: "right side", boosts: {} },
  { phrase: "behind eyes", boosts: { headache: 0.3, migraine: 0.3, eye_strain: 0.3, sinus_pressure: 0.2 } },
  { phrase: "around temples", boosts: { headache: 0.4, migraine: 0.4, eye_strain: 0.2 } },
  { phrase: "back of head", boosts: { headache: 0.3, neck_pain: 0.3, stress: 0.2 } },
  { phrase: "front of head", boosts: { headache: 0.3, sinus_pressure: 0.3, eye_strain: 0.2 } },
  { phrase: "bottom of foot", boosts: { leg_pain: 0.2 } },
  { phrase: "top of head", boosts: { headache: 0.2, migraine: 0.1 } },
  { phrase: "roof of mouth", boosts: { canker_sore: 0.3, cold_sore: 0.2 } },
  { phrase: "on gums", boosts: { gum_pain: 0.4, canker_sore: 0.2, toothache: 0.2 } },
  { phrase: "inside cheek", boosts: { canker_sore: 0.3, toothache: 0.1 } },
  { phrase: "under tongue", boosts: { canker_sore: 0.2 } },
  { phrase: "heel of foot", boosts: { foot_pain: 0.4 } },
  { phrase: "arch of foot", boosts: { foot_pain: 0.4 } },
  { phrase: "ball of foot", boosts: { foot_pain: 0.3 } },
  { phrase: "base of skull", boosts: { headache: 0.2, neck_pain: 0.3 } },
  { phrase: "between toes", boosts: { fungal_infection: 0.4 } },
  { phrase: "under nail", boosts: { fungal_infection: 0.4 } },
  { phrase: "in ear", boosts: { tinnitus: 0.3, ear_pain: 0.2 } },
  { phrase: "around anus", boosts: { hemorrhoids: 0.4 } },
  { phrase: "on scalp", boosts: { psoriasis: 0.3, hair_loss: 0.2 } },
  { phrase: "in groin", boosts: { uti: 0.2, yeast_infection: 0.2, insect_bite: 0.2 } },
  // New positional patterns
  { phrase: "in my chest", boosts: { anxiety: 0.3, heartburn: 0.3, congestion: 0.3, asthma: 0.3, palpitations: 0.3 } },
  { phrase: "on my face", boosts: { skin_rash: 0.3, acne: 0.4, sinus_pressure: 0.2 } },
  { phrase: "in my throat", boosts: { sore_throat: 0.5, cold: 0.3, gerd: 0.3 } },
  { phrase: "on my skin", boosts: { skin_rash: 0.5, dry_skin: 0.4, eczema: 0.3, hives: 0.3 } },
  { phrase: "in my joints", boosts: { joint_pain: 0.6, arthritis: 0.4 } },
  { phrase: "in my muscles", boosts: { muscle_pain: 0.6, fatigue: 0.2 } },
  { phrase: "behind my ear", boosts: { ear_pain: 0.4, headache: 0.2 } },
  { phrase: "on my back", boosts: { back_pain: 0.4, skin_rash: 0.2 } },
  { phrase: "in my legs", boosts: { leg_pain: 0.4, restless_leg: 0.3, muscle_pain: 0.3 } },
  { phrase: "in my eyes", boosts: { eye_strain: 0.5, eye_pain: 0.4, allergies: 0.3 } },
  { phrase: "around my eyes", boosts: { eye_strain: 0.4, eye_pain: 0.3, headache: 0.3, migraine: 0.2 } },
  { phrase: "in my sinuses", boosts: { sinus_pressure: 0.6, congestion: 0.4 } },
  { phrase: "on my scalp", boosts: { headache: 0.3, psoriasis: 0.3, hair_loss: 0.2 } },
  { phrase: "in my jaw", boosts: { tmj_pain: 0.5, toothache: 0.4, headache: 0.3 } },
  { phrase: "in my neck", boosts: { neck_pain: 0.5, headache: 0.3, stress: 0.2 } },
  { phrase: "in my shoulders", boosts: { shoulder_pain: 0.5, neck_pain: 0.3, stress: 0.3 } },
  { phrase: "in my hands", boosts: { joint_pain: 0.3, neuropathy: 0.4, wrist_pain: 0.3 } },
  { phrase: "in my knees", boosts: { knee_pain: 0.5, joint_pain: 0.4 } },
  { phrase: "in my ears", boosts: { ear_pain: 0.4, tinnitus: 0.4 } },
  { phrase: "in my hips", boosts: { hip_pain: 0.5, back_pain: 0.3 } },
  { phrase: "in my arms", boosts: { muscle_pain: 0.3, joint_pain: 0.3, shoulder_pain: 0.2 } },
  { phrase: "in my wrists", boosts: { wrist_pain: 0.5, joint_pain: 0.3 } },
  { phrase: "in my elbows", boosts: { elbow_pain: 0.5, joint_pain: 0.3 } },
  { phrase: "on my lips", boosts: { cold_sore: 0.4, dry_mouth: 0.2 } },
  { phrase: "in my stomach", boosts: { stomach_ache: 0.5, indigestion: 0.4, nausea: 0.3, bloating: 0.3 } },
  { phrase: "in my belly", boosts: { stomach_ache: 0.4, bloating: 0.4, gas: 0.3, period_cramps: 0.2 } },
  { phrase: "in my lower abdomen", boosts: { period_cramps: 0.4, bloating: 0.3, constipation: 0.2 } },
  { phrase: "in my upper abdomen", boosts: { indigestion: 0.4, heartburn: 0.3, stomach_ache: 0.2 } },
  { phrase: "in my lower back", boosts: { back_pain: 0.6, sciatica: 0.3 } },
  { phrase: "in my upper back", boosts: { back_pain: 0.4, shoulder_pain: 0.3, neck_pain: 0.2 } },
];

export function getTemporalModifiers() {
  return TEMPORAL_MODIFIERS;
}

export function getPositionalModifiers() {
  return POSITIONAL_MODIFIERS;
}

export function findContextModifiers(normalizedQuery) {
  const boosts = {};
  const tags = [];

  for (const modifier of TEMPORAL_MODIFIERS) {
    if (normalizedQuery.includes(modifier.phrase)) {
      tags.push(modifier.phrase);
      for (const [symptomId, boost] of Object.entries(modifier.boosts)) {
        boosts[symptomId] = (boosts[symptomId] || 0) + boost;
      }
    }
  }

  for (const modifier of POSITIONAL_MODIFIERS) {
    if (normalizedQuery.includes(modifier.phrase)) {
      tags.push(modifier.phrase);
      for (const [symptomId, boost] of Object.entries(modifier.boosts)) {
        boosts[symptomId] = (boosts[symptomId] || 0) + boost;
      }
    }
  }

  return { boosts, tags };
}
