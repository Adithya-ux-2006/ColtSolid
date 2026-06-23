export const SECTION = {
  BEST_MATCH: 'bestMatch',
  BEST_MATCHES: 'bestMatches',
  ADDITIONAL_OPTIONS: 'additionalOptions',
  SUPPORTIVE: 'supportive',
};

export function groupResults(remedies) {
  if (!remedies?.length) {
    return { bestMatch: null, bestMatches: [], additionalOptions: [], supportive: [] };
  }

  const bestMatch = remedies.length > 0 ? remedies[0] : null;

  const remaining = remedies.slice(1);

  const bestMatches = [];
  const additionalOptions = [];
  const supportive = [];

  for (const remedy of remaining) {
    if (remedy._tier === 0) {
      bestMatches.push(remedy);
    } else if (remedy._tier === 1) {
      additionalOptions.push(remedy);
    } else {
      supportive.push(remedy);
    }
  }

  return {
    bestMatch,
    bestMatches,
    additionalOptions,
    supportive,
  };
}
