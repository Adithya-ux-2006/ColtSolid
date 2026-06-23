const STOP_WORDS = new Set([
  'the', 'my', 'a', 'an', 'is', 'after', 'when', 'while', 'from', 'with',
  'in', 'on', 'at', 'for', 'of', 'to', 'and', 'or', 'but', 'not', 'its',
  'i', 'me', 'my', 'myself', 'we', 'our', 'yours', 'you', 'your', 'it',
  'have', 'has', 'had', 'do', 'does', 'did', 'can', 'cant', 'cannot',
  'will', 'would', 'could', 'should', 'may', 'might', 'all', 'every',
  'been', 'being', 'am', 'are', 'was', 'were', 'be',
  'get', 'got', 'feel', 'feels', 'feeling', 'felt', 'having', 'using',
  'dont', 'doesnt', 'wont', 'wouldnt', 'couldnt', 'shouldnt',
  'through', 'too', 'much', 'time', 'very', 'really', 'so', 'just',
  'ache', 'aches', 'aching', 'sore', 'soreness', 'hurt', 'hurts',
  'pain', 'pains', 'painful', 'today',
]);

const CONTRACTION_MAP = {
  "can't": 'cannot', "don't": 'dont', "won't": 'wont',
  "doesn't": 'doesnt', "isn't": 'isnt', "aren't": 'arent',
  "wasn't": 'wasnt', "weren't": 'werent', "it's": 'its',
  "i'm": 'im', "i've": 'ive', "i'll": 'ill',
};

function normalize(str) {
  let s = str.toLowerCase().trim().replace(/\s+/g, ' ');
  for (const [pattern, replacement] of Object.entries(CONTRACTION_MAP)) {
    s = s.replace(new RegExp(pattern.replace("'", "\\'"), 'g'), replacement);
  }
  return s;
}

function tokenize(str) {
  const tokens = str.split(/\s+/).filter(w => w.length >= 2);
  return tokens.filter(t => !STOP_WORDS.has(t));
}

function buildNgramProfile(str, minN, maxN) {
  const ngrams = new Set();
  for (let n = minN; n <= maxN; n++) {
    for (let i = 0; i <= str.length - n; i++) {
      ngrams.add(str.substring(i, i + n));
    }
  }
  return ngrams;
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function bestTokenNgramMatch(queryToken, labelTokens) {
  let best = 0;
  const qng = buildNgramProfile(queryToken, 2, 3);
  for (const lt of labelTokens) {
    const lng = buildNgramProfile(lt, 2, 3);
    const sim = jaccardSimilarity(qng, lng);
    if (sim > best) best = sim;
  }
  return best;
}

function computeTokenOverlap(queryTokens, labelTokens) {
  if (queryTokens.length === 0) return 0;
  let matchSum = 0;
  let matchedCount = 0;
  for (const qt of queryTokens) {
    const best = bestTokenNgramMatch(qt, labelTokens);
    matchSum += best;
    if (best > 0.25) matchedCount++;
  }
  const avgMatch = matchSum / queryTokens.length;
  const bonus = 1 + 0.25 * Math.min(matchedCount, Math.min(labelTokens.length, 3));
  return Math.min(avgMatch * bonus, 1);
}

function computeOverallNgramSimilarity(normalizedQuery, normalizedLabel) {
  const qng = buildNgramProfile(normalizedQuery, 2, 3);
  const lng = buildNgramProfile(normalizedLabel, 2, 3);
  return jaccardSimilarity(qng, lng);
}

export function buildSymptomIndex(symptoms) {
  if (!symptoms?.length) return [];
  return symptoms.map(s => {
    const normalizedLabel = normalize(s.label);
    return {
      id: s.id,
      label: s.label,
      emoji: s.emoji,
      color: s.color,
      normalizedLabel,
      labelTokens: tokenize(normalizedLabel),
    };
  });
}

function scoreSymptom(queryTokens, normalizedQuery, symptomIndex) {
  const tokenOverlap = computeTokenOverlap(queryTokens, symptomIndex.labelTokens);
  const ngramSim = computeOverallNgramSimilarity(normalizedQuery, symptomIndex.normalizedLabel);
  const combined = tokenOverlap * 0.65 + ngramSim * 0.35;
  return combined;
}

export function inferConcerns(query, symptoms) {
  if (!query || !symptoms?.length) {
    return { primaryConcerns: [], secondaryConcerns: [], confidence: 0, queryContext: null };
  }

  const normalized = normalize(query);
  const queryTokens = tokenize(normalized);

  if (queryTokens.length === 0) {
    return { primaryConcerns: [], secondaryConcerns: [], confidence: 0, queryContext: { raw: query, normalized, tokens: [] } };
  }

  const index = buildSymptomIndex(symptoms);

  const scored = index.map(si => ({
    symptomId: si.id,
    label: si.label,
    emoji: si.emoji,
    color: si.color,
    score: scoreSymptom(queryTokens, normalized, si),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topScore = scored.length > 0 ? scored[0].score : 0;
  const threshold = 0.08;

  const primaryConcerns = scored.filter(s => s.score >= topScore * 0.75);
  const secondaryConcerns = scored.filter(s => s.score >= topScore * 0.35 && s.score < topScore * 0.75);

  const validPrimaryConcerns = primaryConcerns.filter(s => s.score >= threshold);
  const validSecondaryConcerns = secondaryConcerns.filter(s => s.score >= threshold);

  const confidence = Math.round(Math.min(topScore * 100, 100));

  return {
    primaryConcerns: validPrimaryConcerns.map(s => ({ id: s.symptomId, label: s.label, emoji: s.emoji, color: s.color, score: s.score })),
    secondaryConcerns: validSecondaryConcerns.map(s => ({ id: s.symptomId, label: s.label, emoji: s.emoji, color: s.color, score: s.score })),
    confidence,
    queryContext: { raw: query, normalized, tokens: queryTokens },
  };
}
