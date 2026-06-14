import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../utils/cn';

export function RatingStars({ rating, reviewCount, className }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex text-yellow">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-current" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-current" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4" />
        ))}
      </div>
      <span className="text-sm font-medium text-ink">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-ink-muted">({reviewCount})</span>
      )}
    </div>
  );
}
