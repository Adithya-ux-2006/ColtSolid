const BENCHMARK_QUERIES = [
  // --- Direct symptom label matches (baseline) ---
  { query: "headache", expectedTopLabel: "Headache" },
  { query: "nausea", expectedTopLabel: "Nausea" },
  { query: "congestion", expectedTopLabel: "Congestion" },
  { query: "insomnia", expectedTopLabel: "Insomnia" },

  // --- Natural language descriptions ---
  { query: "my stomach hurts", expectedTopLabel: "Stomach Ache" },
  { query: "my nose is completely blocked", expectedTopLabel: "Congestion" },
  { query: "i have a really bad headache", expectedTopLabel: "Headache" },
  { query: "my brain is foggy", expectedTopLabel: "Brain Fog" },

  // --- Negation detection ---
  { query: "I cannot sleep", expectedTopLabel: "Insomnia", expectNegation: true },
  { query: "my period has not been coming", expectNegation: true,
    note: "Negated; 'period' token strongly matches Period Cramps, but negation flag is set" },
  { query: "no appetite at all", expectNegation: true, expectedLabels: ["Fatigue", "Indigestion", "Nausea"],
    note: "Negated; concept hints produce weak secondary (appetite loss → fatigue/indigestion/nausea)" },
  { query: "trouble sleeping", expectedTopLabel: "Insomnia",
    note: "Phrase maps to insomnia concept, negation flag inherent" },

  // --- Symptom combinations ---
  { query: "headache and nausea", expectedLabels: ["Headache", "Nausea"] },
  { query: "blocked nose and sore throat", expectedLabels: ["Congestion", "Sore Throat"] },

  // --- Colloquial / concept-based phrasing ---
  { query: "i'm throwing up everything", expectedTopLabel: "Nausea" },
  { query: "my throat is scratchy", expectedTopLabel: "Sore Throat" },
  { query: "my eyes are burning", expectedLabels: ["Eye Pain", "Eye Strain"],
    note: "At least one of these should appear" },
  { query: "i keep waking up at night", expectedTopLabel: "Insomnia" },
  { query: "i feel dizzy when i stand up", expectedLabels: ["Low Energy", "Fatigue", "Dehydration"],
    note: "At least one of these should appear via concept match" },
  { query: "my muscles ache all over", expectedLabels: ["Muscle Pain", "Joint Pain"],
    note: "At least one should appear via phrase match" },
  { query: "stuffy nose", expectedTopLabel: "Congestion" },
  { query: "cant sleep", expectedTopLabel: "Insomnia" },

  // --- Composition-based queries (no phrase map, pure anatomy+sensation) ---
  { query: "tight chest", expectedLabels: ["Anxiety", "Stress"],
    note: "Composition: 'tight'→anxiety/stress + 'chest'→anxiety = context-weighted for anxiety" },
  { query: "burning chest", expectedLabels: ["Heartburn", "Indigestion"],
    note: "Composition: 'burning'→heartburn + 'chest'→heartburn = affinity bonus" },
  { query: "my knee is swollen", expectedLabels: ["Joint Pain", "Knee Pain"],
    note: "Composition: 'knee'→knee/joint pain + 'swollen'→joint pain = context-weighted" },
  { query: "headache behind eyes", expectedLabels: ["Headache", "Migraine", "Eye Strain"],
    note: "Composition: 'headache'→headache + 'behind eyes'→migraine,eye strain booster" },
  { query: "stomach pain after eating", expectedLabels: ["Indigestion", "Heartburn", "Bloating"],
    note: "Composition: 'stomach'→indigestion + 'pain'→stomach + 'after eating'→indigestion booster" },
  { query: "my legs feel heavy", expectedLabels: ["Leg Pain", "Fatigue", "Low Energy"],
    note: "Composition: 'leg'→leg_pain + 'heavy'→fatigue, leg pain dominates from anatomy match" },
  { query: "sharp headache", expectedLabels: ["Headache", "Migraine"],
    note: "Composition: 'sharp'→migraine + 'headache' direct match" },
];

export default BENCHMARK_QUERIES;
