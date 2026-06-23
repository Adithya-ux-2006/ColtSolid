const FEEDBACK_EVENTS = {
  SEARCH_ENGINE_RESULT: 'search_engine_result',
  SEARCH_UI_RESULT: 'search_ui_result',
  REMEDY_CLICK: 'remedy_click',
  CATEGORY_CLICK: 'category_click',
  SEARCH_FEEDBACK: 'search_feedback',
  MATCH_RATING: 'match_rating',
};

let feedbackQueue = [];
let flushTimer = null;

function enqueue(event) {
  feedbackQueue.push({
    ...event,
    timestamp: event.timestamp || Date.now(),
    sessionId: event.sessionId || getSessionId(),
  });
  scheduleFlush();
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(async () => {
    flushTimer = null;
    await flush();
  }, 5000);
}

async function flush() {
  if (feedbackQueue.length === 0) return;

  const batch = feedbackQueue.splice(0, Math.min(feedbackQueue.length, 50));
  const stored = loadStored();

  stored.push(...batch);
  if (stored.length > 1000) {
    stored.splice(0, stored.length - 1000);
  }

  try {
    localStorage.setItem('cura_feedback_log', JSON.stringify(stored));
  } catch {
    // silently fail
  }
}

function loadStored() {
  try {
    const raw = localStorage.getItem('cura_feedback_log');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getSessionId() {
  let sid = sessionStorage.getItem('cura_session_id');
  if (!sid) {
    sid = 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem('cura_session_id', sid);
  }
  return sid;
}

export function logSearchResult(engineResult) {
  enqueue({
    type: FEEDBACK_EVENTS.SEARCH_ENGINE_RESULT,
    query: engineResult.queryContext?.raw || '',
    normalizedQuery: engineResult.queryContext?.normalized || '',
    primaryConcerns: (engineResult.primaryConcerns || []).map(c => ({ id: c.id, label: c.label, score: c.score })),
    secondaryConcerns: (engineResult.secondaryConcerns || []).map(c => ({ id: c.id, label: c.label, score: c.score })),
    confidence: engineResult.confidence,
    severity: engineResult.severity,
    userIntent: engineResult.userIntent,
    hasNegation: engineResult.hasNegation,
    matchedPhrases: engineResult.matchedPhrases,
  });
}

export function logSearchUIShown(engineResult) {
  enqueue({
    type: FEEDBACK_EVENTS.SEARCH_UI_RESULT,
    query: engineResult.queryContext?.raw || '',
    primaryConcerns: (engineResult.primaryConcerns || []).map(c => c.id),
    hasNegation: engineResult.hasNegation,
  });
}

export function logRemedyClick(remedyId, symptomId, searchQuery) {
  enqueue({
    type: FEEDBACK_EVENTS.REMEDY_CLICK,
    remedyId,
    symptomId,
    searchQuery,
  });
}

export function logCategoryClick(category, query) {
  enqueue({
    type: FEEDBACK_EVENTS.CATEGORY_CLICK,
    category,
    query,
  });
}

export function logMatchRating(query, topSymptomId, rating) {
  enqueue({
    type: FEEDBACK_EVENTS.MATCH_RATING,
    query,
    symptomId: topSymptomId,
    rating,
  });
}

export function getFeedbackStats() {
  const stored = loadStored();
  const stats = {
    totalEvents: stored.length,
    searchEvents: 0,
    remedyClicks: 0,
    ratings: 0,
    uniqueQueries: new Set(),
  };

  for (const e of stored) {
    if (e.type === FEEDBACK_EVENTS.SEARCH_ENGINE_RESULT || e.type === FEEDBACK_EVENTS.SEARCH_UI_RESULT) {
      stats.searchEvents++;
      if (e.query) stats.uniqueQueries.add(e.query);
    }
    if (e.type === FEEDBACK_EVENTS.REMEDY_CLICK) stats.remedyClicks++;
    if (e.type === FEEDBACK_EVENTS.MATCH_RATING) stats.ratings++;
  }

  stats.uniqueQueries = stats.uniqueQueries.size;
  return stats;
}

export function exportFeedbackLog() {
  return loadStored();
}

export function clearFeedbackLog() {
  feedbackQueue = [];
  try {
    localStorage.removeItem('cura_feedback_log');
  } catch {
    // silently fail
  }
}

export default {
  logSearchResult,
  logSearchUIShown,
  logRemedyClick,
  logCategoryClick,
  logMatchRating,
  getFeedbackStats,
  exportFeedbackLog,
  clearFeedbackLog,
};
