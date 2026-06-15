import { supabase } from '../lib/supabase';

const ANALYTICS_SESSION_KEY = 'clotsolid_analytics_session';

function getAnalyticsSessionId() {
  if (typeof window === 'undefined') return 'server-session';

  const existing = window.localStorage.getItem(ANALYTICS_SESSION_KEY);
  if (existing) return existing;

  const nextValue = window.crypto?.randomUUID?.() || `session-${Date.now()}`;
  window.localStorage.setItem(ANALYTICS_SESSION_KEY, nextValue);
  return nextValue;
}

function getAnalyticsUserId() {
  return supabase.auth.getUser().then(({ data }) => data.user?.id || null).catch(() => null);
}

async function insertRow(table, payload) {
  const userId = await getAnalyticsUserId();
  const { error } = await supabase.from(table).insert({
    ...payload,
    user_id: userId,
    session_id: getAnalyticsSessionId(),
  });

  if (error) throw error;
}

export async function trackSearchEvent({ source, queryText = '', symptomIds = [] }) {
  await insertRow('search_events', {
    source,
    query_text: queryText,
    symptom_ids: symptomIds,
  });
}

export async function trackRemedyEvent({ remedyId, eventType, metadata = {} }) {
  await insertRow('remedy_events', {
    remedy_id: remedyId,
    event_type: eventType,
    metadata,
  });
}

export async function createRemedyFeedback({ remedyId, vote }) {
  const userId = await getAnalyticsUserId();
  const { data, error } = await supabase
    .from('remedy_feedback')
    .insert({
      remedy_id: remedyId,
      vote,
      user_id: userId,
      session_id: getAnalyticsSessionId(),
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateRemedyFeedback(feedbackId, feedbackText) {
  const { error } = await supabase
    .from('remedy_feedback')
    .update({ feedback_text: feedbackText })
    .eq('id', feedbackId);

  if (error) throw error;
}

export async function fetchAnalyticsSummary() {
  const [{ data: searches, error: searchError }, { data: remedyEvents, error: remedyError }, { data: feedback, error: feedbackError }] = await Promise.all([
    supabase.from('search_events').select('symptom_ids, source, query_text, created_at'),
    supabase.from('remedy_events').select('remedy_id, event_type, metadata, created_at'),
    supabase.from('remedy_feedback').select('remedy_id, vote, feedback_text, created_at'),
  ]);

  if (searchError) throw searchError;
  if (remedyError) throw remedyError;
  if (feedbackError) throw feedbackError;

  return {
    searches: searches || [],
    remedyEvents: remedyEvents || [],
    feedback: feedback || [],
  };
}
