import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../utils/cn';

const CATEGORY_STAR_COLORS = {
  Natural: 'fill-emerald-500 text-emerald-500',
  Lifestyle: 'fill-violet-500 text-violet-500',
  'Over-the-Counter': 'fill-orange-500 text-orange-500',
};

export function RatingStars({ rating, size = 'sm', category, className }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const starColor = category ? (CATEGORY_STAR_COLORS[category] || 'fill-accent text-accent') : 'fill-accent text-accent';

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`${starSize} ${starColor}`} />;
          }
          if (i === fullStars && hasHalf) {
            return <StarHalf key={i} className={`${starSize} ${starColor}`} />;
          }
          return <Star key={i} className={`${starSize} text-surface-dark`} />;
        })}
      </div>
    </div>
  );
}
