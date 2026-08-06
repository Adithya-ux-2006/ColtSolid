export function getSafetyText(score, hasConflicts) {
  if (hasConflicts) return 'Check first';
  if (score >= 85) return 'Very Safe';
  if (score >= 60) return 'Safe';
  if (score >= 30) return 'Generally Safe';
  return 'Check first';
}
