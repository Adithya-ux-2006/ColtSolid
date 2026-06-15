import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

const STORAGE_KEY = 'clotsolid_search_count';

function getStoredSearchCount() {
  if (typeof window === 'undefined') return 0;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number.parseInt(raw || '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function useTrialGate() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchCount, setSearchCount] = useState(getStoredSearchCount);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, String(searchCount));
  }, [searchCount]);

  const incrementSearch = () => {
    if (isAuthenticated) {
      return { blocked: false, searchCount };
    }

    const nextCount = searchCount + 1;
    setSearchCount(nextCount);

    return {
      blocked: nextCount > 3,
      searchCount: nextCount,
    };
  };

  const resetGate = () => {
    setSearchCount(0);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    searchCount,
    showGate: !isAuthenticated && searchCount > 3,
    incrementSearch,
    resetGate,
  };
}
