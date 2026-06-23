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
