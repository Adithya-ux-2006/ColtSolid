import { cn } from '../../utils/cn';

export function CategoryTag({ category, className }) {
  return (
    <span className={cn(
      'inline-flex px-3 py-1 rounded-full text-xs font-medium bg-surface text-primary',
      className
    )}>
      {category}
    </span>
  );
}
