import { Link, useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { RemedyImage } from './RemedyImage';
import { CategoryBadge } from './CategoryBadge';
import { EvidenceLabel } from './EvidenceLabel';
import { SafetyLabel } from './SafetyLabel';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';

export function AltRemedyRow({ remedy, isSafe, evidenceScore, safetyScore, showDivider = true, className }) {
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
    <div className={cn(showDivider && 'border-b border-border', className)}>
      <Link
        to={`/remedy/${remedy.id}`}
        className="flex items-center gap-4 py-4 hover:bg-mint/30 rounded-xl transition-colors -mx-2 px-2"
      >
        <RemedyImage category={remedy.category} size="sm" alt={remedy.name} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CategoryBadge category={remedy.category} className="scale-90 origin-left" />
          </div>
          <h4 className="font-semibold text-ink text-sm leading-snug truncate">{remedy.name}</h4>
          <p className="text-xs text-ink-muted truncate mt-0.5">{remedy.shortDescription}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs text-ink-muted">
          {remedy.timeToEffect && (
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {remedy.timeToEffect}
            </span>
          )}
          <SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} compact />
          <EvidenceLabel score={evidenceScore} size="sm" />
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
          <ChevronRight className="w-4 h-4 text-ink-subtle" />
        </div>
      </Link>
    </div>
  );
}
