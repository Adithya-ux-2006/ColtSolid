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
    const isPrimary = remedy._isPrimaryConcern !== false;

    if (isPrimary && remedy._tier === 0) {
      // Primary concern + DIRECT tier → best matches
      bestMatches.push(remedy);
    } else if (isPrimary || remedy._tier === 0) {
      // Primary ASSOCIATED/SUPPORTIVE, or secondary DIRECT → additional options
      additionalOptions.push(remedy);
    } else {
      // Secondary ASSOCIATED/SUPPORTIVE → supportive
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
