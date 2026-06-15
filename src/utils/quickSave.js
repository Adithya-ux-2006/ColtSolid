const QUICK_SAVES_KEY = 'clotsolid_quick_saves';

export function getQuickSaves() {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(QUICK_SAVES_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveQuickRemedy(email, remedyId) {
  const current = getQuickSaves();
  const remedyIds = Array.from(new Set([...(current?.remedyIds || []), remedyId]));

  const nextValue = {
    email,
    remedyIds,
    savedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(QUICK_SAVES_KEY, JSON.stringify(nextValue));
  }

  return nextValue;
}

export function clearQuickSaves() {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(QUICK_SAVES_KEY);
}
