import { cn } from '../../utils/cn';

const STYLES = {
  Natural: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  TCM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Conventional: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Lifestyle: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export function CategoryBadge({ category, firstOccurrence, className }) {
  if (!category) return null;

  const displayText = category === 'TCM' && !firstOccurrence
    ? 'TCM'
    : category === 'TCM'
      ? 'Traditional Chinese Medicine (TCM)'
      : category;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
        STYLES[category] || 'bg-primary/10 text-primary border-primary/20',
        className
      )}
      title={category === 'TCM' ? 'Traditional Chinese Medicine' : undefined}
    >
      {displayText}
    </span>
  );
}
