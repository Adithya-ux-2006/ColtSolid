import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CategoryBadge } from './CategoryBadge';
import { EmailQuickSaveCard } from './EmailQuickSaveCard';
import { RatingStars } from './RatingStars';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export function RemedyCard({ remedy, className }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const userAllergies = useAuthStore((state) => state.user?.known_allergies ?? []);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const favorite = isFavorite(remedy.id);
  const hasAllergyWarning = remedy.allergen_tags?.some((tag) => userAllergies.includes(tag));
  const [showQuickSave, setShowQuickSave] = useState(false);
  const quickSaveRef = useRef(null);

  useEffect(() => {
    if (!showQuickSave) return undefined;

    const handlePointerDown = (event) => {
      if (!quickSaveRef.current?.contains(event.target)) {
        setShowQuickSave(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [showQuickSave]);

  const handleHeartClick = (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setShowQuickSave((current) => !current);
      return;
    }

    toggleFavorite(remedy);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow relative group flex flex-col h-full",
        className
      )}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="space-y-2">
            <CategoryBadge category={remedy.category} />
            {hasAllergyWarning ? (
              <div className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-2.5 py-1 text-xs font-semibold text-amber-dark">
                <span aria-hidden="true">⚠️</span>
                <span>Check allergies</span>
              </div>
            ) : null}
          </div>
          <div ref={quickSaveRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleHeartClick}
              className="text-ink-muted hover:text-forest transition-colors p-1 -mr-1 -mt-1"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={cn('w-5 h-5', favorite && 'fill-forest text-forest')} />
            </motion.button>

            {showQuickSave ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-10 z-20 w-[280px] rounded-2xl border border-gray-100 border-l-4 border-l-forest bg-white p-4 shadow-card"
              >
                <EmailQuickSaveCard
                  remedyId={remedy.id}
                  title="🤍 Save this remedy"
                  description=""
                />
              </motion.div>
            ) : null}
          </div>
      </div>

      <h3 className="font-bold text-lg text-ink mb-2 line-clamp-1">{remedy.name}</h3>
      
      <p className="text-sm text-ink-muted line-clamp-2 mb-4 flex-grow">
        {remedy.shortDescription}
      </p>

      <RatingStars rating={remedy.rating} reviewCount={remedy.reviewCount} className="mb-4" />

      <div className="flex items-center gap-2 mb-4 text-xs font-medium text-ink-muted">
        <span className="bg-snow-dark px-2 py-1 rounded-md">{remedy.cost}</span>
        <span>•</span>
        <span>{remedy.timeToEffect}</span>
      </div>

      <Link
        to={`/remedy/${remedy.id}`}
        className="w-full mt-auto text-center py-2.5 rounded-xl text-sm font-semibold text-forest bg-forest/5 hover:bg-forest/10 transition-colors"
      >
        View Details &rarr;
      </Link>
    </motion.div>
  );
}
