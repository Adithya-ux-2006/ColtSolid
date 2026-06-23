const BENCHMARK_QUERIES = [
  // Direct symptom label matches (baseline)
  { query: "headache", expectedSymptoms: ["Headache"], expectedPrimaryCount: 1 },
  { query: "nausea", expectedSymptoms: ["Nausea"], expectedPrimaryCount: 1 },
  { query: "congestion", expectedSymptoms: ["Congestion"], expectedPrimaryCount: 1 },

  // Natural language descriptions
  { query: "my stomach hurts", expectedSymptoms: ["Stomach Ache"], expectedPrimaryCount: 1 },
  { query: "my nose is completely blocked", expectedSymptoms: ["Congestion"], expectedPrimaryCount: 1 },
  { query: "i have a really bad headache", expectedSymptoms: ["Headache"], expectedPrimaryCount: 1 },

  // Negation / symptom-absent (should NOT match the negated symptom)
  { query: "I cannot sleep", expectedSymptoms: ["Insomnia"], expectedPrimaryCount: 1,
    note: "Should detect insomnia via phrase map, with negation flag" },
  { query: "my period has not been coming", expectedPrimaryCount: 0,
    note: "Should NOT match period-related symptoms; negation should reduce scores" },
  { query: "no appetite at all", expectedSymptoms: ["Nausea", "Indigestion"], expectedPrimaryCount: 0,
    note: "Should detect appetite loss concept but with negation flag" },

  // Symptom combinations (multi-symptom queries)
  { query: "headache and nausea", expectedSymptoms: ["Headache", "Nausea"], expectedPrimaryCount: 2 },
  { query: "blocked nose and sore throat", expectedSymptoms: ["Congestion", "Sore Throat"], expectedPrimaryCount: 2 },

  // Ambiguous / colloquial phrasing
  { query: "i'm throwing up everything", expectedSymptoms: ["Nausea"], expectedPrimaryCount: 1 },
  { query: "my brain is foggy", expectedSymptoms: ["Brain Fog"], expectedPrimaryCount: 1 },
  { query: "i feel dizzy when i stand up", expectedSymptoms: ["Dehydration"], expectedPrimaryCount: 0,
    note: "Should detect lightheadedness concept, may map to Dehydration/Low Energy" },
  { query: "i keep waking up at night", expectedSymptoms: ["Insomnia"], expectedPrimaryCount: 1 },

  // Concepts that should produce a result through phrase expansion
  { query: "my throat is scratchy", expectedSymptoms: ["Sore Throat"], expectedPrimaryCount: 1 },
  { query: "my eyes are burning", expectedSymptoms: ["Eye Pain"], expectedPrimaryCount: 0,
    note: "Phrase maps to Eye Strain, Eye Pain — at least one should appear" },
  { query: "my muscles ache all over", expectedSymptoms: ["Muscle Pain", "Joint Pain"], expectedPrimaryCount: 0,
    note: "Phrase maps to muscle soreness → Muscle Pain, Joint Pain" },
];

export default BENCHMARK_QUERIES;
