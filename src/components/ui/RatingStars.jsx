import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../utils/cn';

export function RatingStars({ rating, reviewCount, size = 'sm', className }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className={`${starSize} fill-yellow text-yellow`} />;
          }
          if (i === fullStars && hasHalf) {
            return <StarHalf key={i} className={`${starSize} fill-yellow text-yellow`} />;
          }
          return <Star key={i} className={`${starSize} text-gray-200`} />;
        })}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink-muted">({reviewCount})</span>
      )}
    </div>
  );
}
