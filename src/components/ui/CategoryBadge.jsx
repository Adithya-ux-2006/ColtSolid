import { cn } from '../../utils/cn';

export function CategoryBadge({ category, className }) {
  const styles = {
    Natural: 'bg-sage/20 text-forest',
    TCM: 'bg-amber/10 text-amber-dark',
    Conventional: 'bg-forest/10 text-forest',
    Lifestyle: 'bg-ink/10 text-ink-muted'
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-medium',
      styles[category] || styles.Lifestyle,
      className
    )}>
      {category}
    </span>
  );
}
