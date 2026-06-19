import { cn } from '../../utils/cn';

export function CategoryTag({ category, className }) {
  const isClinical = category === 'Conventional' || category === 'TCM';

  return (
    <span className={cn(
      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
      isClinical ? 'bg-coral/10 text-coral-dark' : 'bg-teal/10 text-teal-dark',
      className
    )}>
      {category}
    </span>
  );
}
