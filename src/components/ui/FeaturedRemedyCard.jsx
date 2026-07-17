import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CategoryBadge } from './CategoryBadge';
import { RemedyImage } from './RemedyImage';
import { EvidenceLabel } from './EvidenceLabel';
import { SafetyLabel } from './SafetyLabel';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export function FeaturedRemedyCard({ remedy, isSafe, evidenceScore, safetyScore, className }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/remedy/${remedy.id}`}
        className={cn(
          'block bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden',
          className
        )}
      >
        <div className="md:flex">
          <div className="md:w-2/5 p-4 md:p-5">
            <RemedyImage
              category={remedy.category}
              size="lg"
              alt={remedy.name}
              className="md:h-full md:aspect-auto"
            />
          </div>

          <div className="flex-1 p-5 md:p-6 md:pl-0 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <CategoryBadge category={remedy.category} firstOccurrence />
              <button
                onClick={handleFavorite}
                className={cn(
                  'p-1.5 rounded-full transition-colors',
                  favorited ? 'text-primary' : 'text-ink-muted hover:text-primary'
                )}
                aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={cn('w-5 h-5', favorited && 'fill-primary')} />
              </button>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-ink mb-2">{remedy.name}</h3>
            <p className="text-ink-muted text-sm mb-4 leading-relaxed line-clamp-2">{remedy.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted mb-5">
              {remedy.timeToEffect && (
                <span className="flex items-center gap-1.5 bg-mint px-3 py-1.5 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {remedy.timeToEffect}
                </span>
              )}
              <EvidenceLabel score={evidenceScore} />
              <SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} compact />
            </div>

            <div className="mt-auto">
              <span className="inline-flex items-center justify-center w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-glow hover:bg-primary-dark transition-colors">
                View Remedy
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
