import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { RemedyImage } from './RemedyImage';
import { EvidenceLabel } from './EvidenceLabel';
import { SafetyLabel } from './SafetyLabel';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';

export function AltRemedyRow({ remedy, isSafe, evidenceScore, safetyScore, className }) {
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
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Link
        to={`/remedy/${remedy.id}`}
        className={cn(
          'flex items-center gap-3 bg-white rounded-2xl p-3 shadow-soft hover:shadow-card transition-all',
          className
        )}
      >
        <RemedyImage category={remedy.category} size="sm" alt={remedy.name} />

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-ink text-sm leading-snug truncate">{remedy.name}</h4>
          <p className="text-xs text-ink-muted truncate mt-0.5">{remedy.shortDescription}</p>
          <div className="flex items-center gap-2 mt-1.5">
            {remedy.timeToEffect && (
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <Clock className="w-3 h-3" />
                {remedy.timeToEffect}
              </span>
            )}
            <EvidenceLabel score={evidenceScore} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} compact />
          <button
            onClick={handleFavorite}
            className={cn(
              'p-1.5 rounded-full transition-colors',
              favorited ? 'text-primary' : 'text-ink-muted hover:text-primary'
            )}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('w-4 h-4', favorited && 'fill-primary')} />
          </button>
          <ChevronRight className="w-4 h-4 text-ink-muted" />
        </div>
      </Link>
    </motion.div>
  );
}
