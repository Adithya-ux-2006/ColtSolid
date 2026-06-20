import { cn } from '../../utils/cn';

const STYLES = {
  Natural: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  TCM: 'bg-amber-50 text-amber-700 border-amber-200',
  Conventional: 'bg-blue-50 text-blue-700 border-blue-200',
  Lifestyle: 'bg-violet-50 text-violet-700 border-violet-200',
};

export function CategoryBadge({ category, className }) {
  if (!category) return null;

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      STYLES[category] || 'bg-surface text-primary border-primary/20',
      className
    )}>
      {category}
    </span>
  );
}
