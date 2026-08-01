import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { FavoriteHeart } from './FavoriteHeart';
import { ScheduleQuickAdd } from './ScheduleQuickAdd';
import { cn } from '../../utils/cn';
import { CategoryBadge } from './CategoryBadge';
import { RemedyImage } from './RemedyImage';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';

function getSafetyText(score, hasConflicts) {
  if (hasConflicts) return 'Not Safe';
  if (score >= 85) return 'Very Safe';
  if (score >= 60) return 'Safe';
  if (score >= 30) return 'Caution';
  return 'Not Safe';
}

function getEvidenceText(score) {
  if (score >= 7) return 'High';
  if (score >= 4) return 'Moderate';
  if (score > 0) return 'Limited';
  return '—';
}

function generateReasons(remedy, evidenceScore, safetyScore) {
  const reasons = [];
  if (evidenceScore >= 7) reasons.push('High quality evidence');
  else if (evidenceScore >= 4) reasons.push('Supported by research');
  if (safetyScore >= 85) reasons.push('Very low risk');
  else if (safetyScore >= 60) reasons.push('Well tolerated');
  if (remedy.timeToEffect?.match(/immediate|minute/i)) reasons.push('Fast acting');
  return reasons.slice(0, 3);
}

export function HighlightedRemedyCard({ remedy, isSafe, evidenceScore, safetyScore, delay = 0 }) {
  const navigate = useNavigate();
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const favorited = isFavorite(remedy.id);
  const reasons = generateReasons(remedy, evidenceScore, safetyScore);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/register'); return; }
    toggleFavorite(remedy);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="flex flex-col h-full"
    >
      <div className="flex flex-col h-full bg-card rounded-3xl border border-border shadow-soft hover:shadow-card transition-shadow overflow-hidden">
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-3">
            <CategoryBadge category={remedy.category} firstOccurrence />
            <div className="flex items-center gap-1 shrink-0 -mt-0.5 -mr-0.5">
              <ScheduleQuickAdd remedy={remedy} />
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
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-tint flex items-center justify-center shrink-0">
              <RemedyImage category={remedy.category} size="card" alt={remedy.name} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-ink text-base leading-snug line-clamp-1">{remedy.name}</h3>
              <p className="text-xs text-ink-muted line-clamp-1 mt-0.5">{remedy.shortDescription}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-0.5">
                <Clock className="w-3 h-3 text-primary" />
                <span className="text-xs font-semibold text-ink">{remedy.timeToEffect || 'Varies'}</span>
              </div>
              <span className="text-[10px] text-ink-muted">Relief</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-xs font-semibold text-ink">{getSafetyText(safetyScore, !isSafe)}</span>
              </div>
              <span className="text-[10px] text-ink-muted whitespace-nowrap">Safe for you</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-xs font-semibold text-ink">{getEvidenceText(evidenceScore)}</span>
              </div>
              <span className="text-[10px] text-ink-muted">Evidence</span>
            </div>
          </div>

          {reasons.length > 0 && (
            <div className="bg-surface/60 rounded-xl px-3 py-2.5 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">
                Why We Recommend This
              </p>
              <ul className="space-y-1">
                {reasons.map((reason) => (
                  <li key={reason} className="flex items-start gap-2 text-xs text-ink">
                    <Check className="w-3 h-3 text-primary shrink-0 mt-[2px]" />
                    <span className="leading-snug">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto">
            <Link
              to={`/remedy/${remedy.id}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-dark transition-all hover:-translate-y-0.5"
            >
              View Remedy
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
