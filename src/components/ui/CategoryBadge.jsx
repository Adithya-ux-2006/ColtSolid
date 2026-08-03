import { cn } from '../../utils/cn';

export function CategoryBadge({ category, className }) {
  if (!category) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-medium text-ink-muted',
        className
      )}
    >
        {category}
    </span>
  );
}
