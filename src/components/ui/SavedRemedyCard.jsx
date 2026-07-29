import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Heart, Leaf, Pill, CircleDot } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CategoryBadge } from './CategoryBadge';
import { RatingStars } from './RatingStars';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';

const CATEGORY_STYLES = {
  Natural: { bg: 'bg-emerald-500/10', circleBg: 'bg-emerald-500/15', color: 'text-emerald-500', Icon: Leaf },
  Lifestyle: { bg: 'bg-violet-500/10', circleBg: 'bg-violet-500/15', color: 'text-violet-500', Icon: Heart },
  Conventional: { bg: 'bg-orange-500/10', circleBg: 'bg-orange-500/15', color: 'text-orange-500', Icon: Pill },
  TCM: { bg: 'bg-amber-500/10', circleBg: 'bg-amber-500/15', color: 'text-amber-500', Icon: CircleDot },
};

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

  const catStyle = CATEGORY_STYLES[remedy.category] || CATEGORY_STYLES.Natural;
  const { Icon, bg, circleBg, color } = catStyle;

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
          <div className={cn('w-full aspect-square rounded-t-[20px] flex items-center justify-center', bg)}>
            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', circleBg)}>
              <Icon className={cn('w-10 h-10', color)} />
            </div>
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
