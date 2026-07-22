import { Link, useNavigate } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { FavoriteHeart } from './FavoriteHeart';
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
        className="hidden md:grid grid-cols-[80px_2fr_160px_160px_170px_40px] items-center gap-4 h-[112px] px-4 hover:bg-mint/30 rounded-xl transition-colors"
      >
        <div className="flex items-center justify-center">
          <RemedyImage category={remedy.category} size="sm" alt={remedy.name} />
        </div>

        <div className="min-w-0 pr-4">
          <CategoryBadge category={remedy.category} className="scale-90 origin-left mb-1" />
          <h4 className="font-semibold text-ink text-sm leading-snug truncate">{remedy.name}</h4>
          <p className="text-xs text-ink-muted truncate mt-0.5">{remedy.shortDescription}</p>
        </div>

        <div className="flex items-center justify-center">
          {remedy.timeToEffect ? (
            <span className="flex items-center gap-1.5 text-xs text-ink-muted whitespace-nowrap">
              <Clock className="w-3 h-3 shrink-0" />
              {remedy.timeToEffect}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-center">
          <SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} compact />
        </div>

        <div className="flex items-center justify-center">
          <EvidenceLabel score={evidenceScore} size="sm" />
        </div>

        <div className="flex items-center justify-center gap-1">
          <button
            onClick={handleFavorite}
            className={cn(
              'p-1.5 rounded-full transition-colors',
              favorited ? 'text-primary' : 'text-ink-muted hover:text-primary'
            )}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FavoriteHeart favorited={favorited} className="w-4 h-4" />
          </button>
          <ChevronRight className="w-4 h-4 text-ink-subtle" />
        </div>
      </Link>

      <Link
        to={`/remedy/${remedy.id}`}
        className="md:hidden flex items-center gap-3 py-4 px-2 hover:bg-mint/30 rounded-xl transition-colors"
      >
        <RemedyImage category={remedy.category} size="sm" alt={remedy.name} />

        <div className="flex-1 min-w-0">
          <CategoryBadge category={remedy.category} className="scale-90 origin-left mb-1" />
          <h4 className="font-semibold text-ink text-sm leading-snug truncate">{remedy.name}</h4>
          <p className="text-xs text-ink-muted truncate mt-0.5">{remedy.shortDescription}</p>
          <div className="flex items-center gap-2 mt-1.5">
            {remedy.timeToEffect && (
              <span className="flex items-center gap-1 text-xs text-ink-muted">
                <Clock className="w-3 h-3" />
                {remedy.timeToEffect}
              </span>
            )}
            <SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} compact />
            <EvidenceLabel score={evidenceScore} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleFavorite}
            className={cn(
              'p-1.5 rounded-full transition-colors',
              favorited ? 'text-primary' : 'text-ink-muted hover:text-primary'
            )}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FavoriteHeart favorited={favorited} className="w-4 h-4" />
          </button>
          <ChevronRight className="w-4 h-4 text-ink-subtle" />
        </div>
      </Link>
    </div>
  );
}
