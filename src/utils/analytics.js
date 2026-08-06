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

export async function trackSearchEvent({ source, queryText = '', symptomIds = [] }) {
  const userId = await getAnalyticsUserId();
  const { data, error } = await supabase.rpc('insert_search_event', {
    p_session_id: getAnalyticsSessionId(),
    p_source: source,
    p_query_text: queryText,
    p_symptom_ids: symptomIds,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function trackRemedyEvent({ remedyId, eventType, metadata = {} }) {
  const userId = await getAnalyticsUserId();
  const { data, error } = await supabase.rpc('insert_remedy_event', {
    p_session_id: getAnalyticsSessionId(),
    p_remedy_id: remedyId,
    p_event_type: eventType,
    p_metadata: metadata,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}

export async function createRemedyFeedback({ remedyId, vote }) {
  const userId = await getAnalyticsUserId();
  const { data, error } = await supabase.rpc('insert_remedy_feedback', {
    p_session_id: getAnalyticsSessionId(),
    p_remedy_id: remedyId,
    p_vote: vote,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
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
