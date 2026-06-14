import { cn } from '../../utils/cn';

export function CategoryBadge({ category, className }) {
  const styles = {
    Natural: 'bg-teal/10 text-teal-dark',
    TCM: 'bg-yellow/20 text-yellow-dark',
    Conventional: 'bg-coral/10 text-coral-dark',
    Lifestyle: 'bg-ink/10 text-ink'
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
