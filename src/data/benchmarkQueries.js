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
];

export default BENCHMARK_QUERIES;
