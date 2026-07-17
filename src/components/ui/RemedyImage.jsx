import { Leaf, Heart, Pill, CircleDot } from 'lucide-react';
import { cn } from '../../utils/cn';

const CATEGORY_ICONS = {
  Natural: { Icon: Leaf, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  Lifestyle: { Icon: Heart, bg: 'bg-violet-50', color: 'text-violet-600' },
  Conventional: { Icon: Pill, bg: 'bg-blue-50', color: 'text-blue-600' },
  TCM: { Icon: CircleDot, bg: 'bg-amber-50', color: 'text-amber-600' },
};

const SIZE_CLASSES = {
  sm: 'w-10 h-10 rounded-xl',
  md: 'w-16 h-16 rounded-2xl',
  lg: 'w-full aspect-square rounded-3xl',
};

const ICON_SIZE_CLASSES = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-12 h-12',
};

export function RemedyImage({ category, size = 'md', src, alt, className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className={cn(SIZE_CLASSES[size], 'object-cover shadow-soft', className)}
      />
    );
  }

  const config = CATEGORY_ICONS[category] || CATEGORY_ICONS.Natural;
  const { Icon, bg, color } = config;

  return (
    <div
      className={cn(
        SIZE_CLASSES[size],
        bg,
        'flex items-center justify-center shadow-soft shrink-0',
        className
      )}
      aria-hidden="true"
    >
      <Icon className={cn(ICON_SIZE_CLASSES[size], color)} />
    </div>
  );
}
