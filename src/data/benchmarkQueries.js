const BENCHMARK_QUERIES = [
  { query: "headache", expectedTopLabel: "Headache" },
  { query: "nausea", expectedTopLabel: "Nausea" },
  { query: "congestion", expectedTopLabel: "Congestion" },
  { query: "insomnia", expectedTopLabel: "Insomnia" },

  { query: "my stomach hurts", expectedTopLabel: "Stomach Ache" },
  { query: "my nose is completely blocked", expectedTopLabel: "Congestion" },
  { query: "i have a really bad headache", expectedTopLabel: "Headache" },
  { query: "my brain is foggy", expectedTopLabel: "Brain Fog" },

  { query: "I cannot sleep", expectedTopLabel: "Insomnia", expectNegation: true },
  { query: "my period has not been coming", expectNegation: true },
  { query: "no appetite at all", expectNegation: true, expectedLabels: ["Fatigue", "Indigestion", "Nausea"] },
  { query: "trouble sleeping", expectedTopLabel: "Insomnia" },

  { query: "headache and nausea", expectedLabels: ["Headache", "Nausea"] },
  { query: "blocked nose and sore throat", expectedLabels: ["Congestion", "Sore Throat"] },

  { query: "i'm throwing up everything", expectedTopLabel: "Nausea" },
  { query: "my throat is scratchy", expectedTopLabel: "Sore Throat" },
  { query: "my eyes are burning", expectedLabels: ["Eye Pain", "Eye Strain"] },
  { query: "i keep waking up at night", expectedTopLabel: "Insomnia" },
  { query: "i feel dizzy when i stand up", expectedLabels: ["Low Energy", "Fatigue", "Dehydration"] },
  { query: "my muscles ache all over", expectedLabels: ["Muscle Pain", "Joint Pain"] },
  { query: "stuffy nose", expectedTopLabel: "Congestion" },
  { query: "cant sleep", expectedTopLabel: "Insomnia" },

  { query: "tight chest", expectedLabels: ["Anxious", "Stress"] },
  { query: "burning chest", expectedLabels: ["Heartburn", "Indigestion"] },
  { query: "my knee is swollen", expectedLabels: ["Joint Pain", "Knee Pain"] },
  { query: "headache behind eyes", expectedLabels: ["Headache", "Migraine", "Eye Strain"] },
  { query: "stomach pain after eating", expectedLabels: ["Indigestion", "Heartburn", "Bloating"] },
  { query: "my legs feel heavy", expectedLabels: ["Leg Pain", "Fatigue", "Low Energy"] },
  { query: "sharp headache", expectedLabels: ["Headache", "Migraine"] },

  // Cough
  { query: "dry cough", expectedTopLabel: "Cough" },
  { query: "wet cough", expectedTopLabel: "Cough" },
  { query: "persistent cough", expectedTopLabel: "Cough" },
  { query: "hacking cough", expectedTopLabel: "Cough" },
  { query: "coughing a lot", expectedTopLabel: "Cough" },
  { query: "cant stop coughing", expectedTopLabel: "Cough" },
  { query: "cough that wont go away", expectedTopLabel: "Cough" },

  // Broader coverage
  { query: "congested chest", expectedLabels: ["Congestion", "Cough"] },
  { query: "cant poop", expectedTopLabel: "Constipation" },
  { query: "constipated", expectedTopLabel: "Constipation" },
  { query: "loose stools", expectedTopLabel: "Diarrhea" },
  { query: "migraine", expectedTopLabel: "Migraine" },
  { query: "throbbing headache", expectedLabels: ["Migraine", "Headache"] },
  { query: "knee hurts", expectedTopLabel: "Knee Pain" },
  { query: "shoulder hurts", expectedTopLabel: "Shoulder Pain" },
  { query: "back hurts", expectedTopLabel: "Back Pain" },
  { query: "neck hurts", expectedTopLabel: "Neck Pain" },
  { query: "throat hurts", expectedTopLabel: "Sore Throat" },
  { query: "sick", expectedTopLabel: "Cold" },
  { query: "feeling sick", expectedTopLabel: "Cold" },
  { query: "under the weather", expectedTopLabel: "Cold" },
  { query: "pimple", expectedTopLabel: "Acne" },
  { query: "dehydrated", expectedTopLabel: "Dehydration" },
  { query: "thirsty", expectedTopLabel: "Dehydration" },
  { query: "gas pain", expectedTopLabel: "Gas" },
  { query: "earache", expectedTopLabel: "Ear Pain" },
  { query: "sinus pain", expectedTopLabel: "Sinus Pressure" },
];

export default BENCHMARK_QUERIES;
