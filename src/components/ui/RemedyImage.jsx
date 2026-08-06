import { cn } from '../../utils/cn';
import { CATEGORY_ICONS } from '../../constants/categoryIcons';

const SIZE_CLASSES = {
  sm: 'w-10 h-10 rounded-xl',
  card: 'w-12 h-12 rounded-xl',
  md: 'w-16 h-16 rounded-2xl',
  lg: 'w-full aspect-square rounded-3xl',
  hero: 'w-[140px] h-[140px] rounded-full object-cover',
};

const ICON_SIZE_CLASSES = {
  sm: 'w-5 h-5',
  card: 'w-7 h-7',
  md: 'w-7 h-7',
  lg: 'w-12 h-12',
  hero: 'w-16 h-16',
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
