import { getPhraseMap, getSynonymMap, getConceptSymptoms } from '../data/conceptPhrases';

const NEGATION_WORDS = new Set([
  'not', 'no', 'never', 'neither', 'nor', 'nowhere',
  'cannot', 'cant', 'couldnt', 'wouldnt', 'shouldnt',
  'wont', 'dont', 'doesnt', 'didnt', 'isnt', 'arent',
  'wasnt', 'werent', 'havent', 'hasnt', 'hadnt',
  'without', 'unable', 'missing', 'absent', 'stopped',
  'lack', 'lacking',
]);

const CONTRACTION_MAP = {
  "can't": 'cannot', "don't": 'dont', "won't": 'wont',
  "doesn't": 'doesnt', "isn't": 'isnt', "aren't": 'arent',
  "wasn't": 'wasnt', "weren't": 'werent', "it's": 'its',
  "i'm": 'im', "i've": 'ive', "i'll": 'ill',
  "couldn't": 'couldnt', "wouldn't": 'wouldnt', "shouldn't": 'shouldnt',
  "haven't": 'havent', "hasn't": 'hasnt', "hadn't": 'hadnt',
  "you're": 'youre', "you've": 'youve', "they're": 'theyre',
  "we're": 'were', "we've": 'weve', "there's": 'theres',
  "that's": 'thats', "what's": 'whats', "who's": 'whos',
  "didn't": 'didnt', "doesnt": 'doesnt',
};

const STOP_WORDS = new Set([
  'the', 'my', 'a', 'an', 'is', 'after', 'when', 'while', 'from', 'with',
  'in', 'on', 'at', 'for', 'of', 'to', 'and', 'or', 'but',
  'i', 'me', 'myself', 'we', 'our', 'yours', 'you', 'your', 'it',
  'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'all', 'every',
  'been', 'being', 'am', 'are', 'was', 'were', 'be',
  'get', 'got', 'feel', 'feels', 'feeling', 'felt', 'having', 'using',
  'through', 'too', 'much', 'time', 'very', 'really', 'so', 'just',
  'today',
]);

function normalizeContractions(str) {
  let s = str.toLowerCase().trim().replace(/\s+/g, ' ');
  for (const [pattern, replacement] of Object.entries(CONTRACTION_MAP)) {
    s = s.replace(new RegExp(pattern.replace("'", "\\'"), 'g'), replacement);
  }
  return s;
}

function tokenize(str) {
  return str.split(/\s+/).filter(w => w.length >= 2);
}

function removeStopWords(tokens) {
  return tokens.filter(t => !STOP_WORDS.has(t));
}

function extractNegation(tokens) {
  const negatedTokens = [];
  const cleanTokens = [];
  let negateNext = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (NEGATION_WORDS.has(token)) {
      negateNext = true;
      negatedTokens.push(token);
      continue;
    }
    if (negateNext) {
      negatedTokens.push(token);
      negateNext = false;
      continue;
    }
    cleanTokens.push(token);
  }

  return { cleanTokens, negatedTokens, hasNegation: negatedTokens.length > 0 };
}

function isSubsequence(phraseWords, queryWords) {
  let pi = 0;
  for (const qw of queryWords) {
    if (pi < phraseWords.length && qw === phraseWords[pi]) {
      pi++;
    }
  }
  return pi === phraseWords.length;
}

function findMatchingPhrases(normalized, phraseMap) {
  const matches = [];
  const queryWords = normalized.split(/\s+/);
  const entries = Object.entries(phraseMap).sort((a, b) => b[0].length - a[0].length);

  const usedWords = new Set();

  for (const [phrase, data] of entries) {
    if (normalized.includes(phrase)) {
      matches.push({ phrase, ...data });
      const pWords = phrase.split(/\s+/);
      for (const w of pWords) usedWords.add(w);
    }
  }

  for (const [phrase, data] of entries) {
    if (matches.some(m => m.phrase === phrase)) continue;
    const pWords2 = phrase.split(/\s+/);
    const pLen2 = pWords2.length;
    if (pLen2 < 2) continue;
    const novelWords = pWords2.some(w => !usedWords.has(w));
    if (!novelWords) continue;
    if (isSubsequence(pWords2, queryWords)) {
      matches.push({ phrase, ...data });
      for (const w of pWords2) usedWords.add(w);
    }
  }

  return matches;
}

function expandWithSynonyms(tokens, synonymMap) {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    const synonym = synonymMap[token];
    if (synonym && synonym !== token) {
      expanded.add(synonym);
    }
  }

  for (const [word, canonical] of Object.entries(synonymMap)) {
    if (expanded.has(canonical) && !expanded.has(word)) {
      expanded.add(word);
    }
  }

  return [...expanded];
}

function gatherConceptSymptoms(phrases, conceptSymptoms) {
  const hintedIds = new Set();
  const negatedIds = new Set();

  for (const match of phrases) {
    const matchedSymptoms = match.hintSymptoms || [];
    for (const id of matchedSymptoms) {
      hintedIds.add(id);
    }

    if (match.negated === true) {
      for (const id of matchedSymptoms) {
        negatedIds.add(id);
      }
    }

    for (const concept of (match.concepts || [])) {
      const conceptSymptomIds = conceptSymptoms[concept] || [];
      for (const id of conceptSymptomIds) {
        hintedIds.add(id);
      }
    }
  }

  return { hintedIds: [...hintedIds], negatedIds: [...negatedIds] };
}

function generateExpandedTokens(phrases) {
  const extraTokens = new Set();

  for (const match of phrases) {
    for (const concept of (match.concepts || [])) {
      const conceptWords = concept.split(/\s+/);
      for (const word of conceptWords) {
        if (word.length >= 3) extraTokens.add(word);
      }
    }
  }

  return [...extraTokens];
}

export function preprocessQuery(query) {
  if (!query || query.trim().length < 2) {
    return {
      normalized: query || '',
      queryTokens: [],
      expandedTokens: [],
      conceptHints: [],
      negatedIds: [],
      hasNegation: false,
      negatedTerms: [],
      matchedPhrases: [],
      hasEmergencyPhrase: false,
    };
  }

  const phraseMap = getPhraseMap();
  const synonymMap = getSynonymMap();
  const conceptSymptoms = getConceptSymptoms();

  const normalized = normalizeContractions(query);
  const rawTokens = tokenize(normalized);

  const { cleanTokens, negatedTokens, hasNegation } = extractNegation(rawTokens);
  const queryTokens = removeStopWords(cleanTokens);

  const matchedPhrases = findMatchingPhrases(normalized, phraseMap);

  const synonymExpanded = expandWithSynonyms(queryTokens, synonymMap);
  const phraseExpanded = generateExpandedTokens(matchedPhrases);

  const allExpandedTokens = [...new Set([...synonymExpanded, ...phraseExpanded])];

  const { hintedIds, negatedIds } = gatherConceptSymptoms(matchedPhrases, conceptSymptoms);

  const hasEmergencyPhrase = matchedPhrases.some(m => m.emergency === true);

  return {
    normalized,
    queryTokens,
    expandedTokens: allExpandedTokens,
    conceptHints: hintedIds,
    negatedIds,
    hasNegation,
    negatedTerms: [...new Set(negatedTokens)],
    matchedPhrases: matchedPhrases.map(m => ({ phrase: m.phrase, concepts: m.concepts })),
    hasEmergencyPhrase,
  };
}
