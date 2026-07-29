import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CategoryBadge } from './CategoryBadge';
import { RatingStars } from './RatingStars';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';

const CATEGORY_PHOTOS = {
  Natural: [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1550572017-edd951b55104?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1611251135345-38d6c05b2f35?w=200&h=200&fit=crop&crop=center',
  ],
  Lifestyle: [
    'https://images.unsplash.com/photo-1545389336-cf090694435e?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=200&h=200&fit=crop&crop=center',
  ],
  Conventional: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1550572017-7e1f9d9c1a5a?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1577003831886-f1b0195c7f0c?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop&crop=center',
  ],
  TCM: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1550572017-7e1f9d9c1a5a?w=200&h=200&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop&crop=center',
  ],
};

function getPhotoUrl(remedy) {
  const category = remedy.category || 'Natural';
  const photos = CATEGORY_PHOTOS[category] || CATEGORY_PHOTOS.Natural;
  const index = remedy.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % photos.length;
  return photos[index];
}

export function SavedRemedyCard({ remedy, className }) {
  const navigate = useNavigate();
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const favorited = isFavorite(remedy.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/register'); return; }
    toggleFavorite(remedy);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Link
        to={`/remedy/${remedy.id}`}
        className={cn(
          'group block bg-card rounded-[20px] border border-border/60 shadow-soft',
          'hover:shadow-card-hover hover:border-border transition-all duration-200',
          className
        )}
      >
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden rounded-t-[20px] bg-surface">
            <img
              src={getPhotoUrl(remedy)}
              alt={remedy.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <button
            onClick={handleFavorite}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200',
              'bg-white/50 dark:bg-black/30',
              'hover:scale-110 active:scale-95',
              favorited ? 'text-red-500' : 'text-ink-muted hover:text-red-400'
            )}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className="w-4 h-4"
              fill={favorited ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ink text-[20px] leading-snug line-clamp-1">
              {remedy.name}
            </h3>
          </div>

          <div>
            <CategoryBadge category={remedy.category} />
          </div>

          <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
            {remedy.shortDescription}
          </p>

          <div className="flex items-center justify-between pt-1">
            {remedy.timeToEffect && (
              <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Clock className="w-3.5 h-3.5" />
                {remedy.timeToEffect}
              </span>
            )}

            <RatingStars
              rating={remedy.rating}
              reviewCount={remedy.reviewCount}
              size="sm"
              category={remedy.category}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
