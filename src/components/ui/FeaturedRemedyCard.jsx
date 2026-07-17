import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Heart, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CategoryBadge } from './CategoryBadge';
import { RemedyImage } from './RemedyImage';
import { EvidenceLabel } from './EvidenceLabel';
import { SafetyLabel } from './SafetyLabel';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useAuthStore } from '../../store/authStore';

function generateReasons(remedy, evidenceScore, safetyScore) {
  const reasons = [];

  if (remedy.timeToEffect?.match(/immediate|minute/i)) {
    reasons.push('Fast acting');
  }
  if (evidenceScore >= 7) {
    reasons.push('High quality evidence');
  } else if (evidenceScore >= 4) {
    reasons.push('Supported by clinical research');
  }
  if (safetyScore >= 85) {
    reasons.push('Very low risk');
  } else if (safetyScore >= 60) {
    reasons.push('Generally well tolerated');
  }
  if (remedy.difficulty === 'Easy') {
    reasons.push('Easy to use');
  }
  if (remedy._relevanceReason) {
    const reason = remedy._relevanceReason;
    if (!reasons.includes(reason)) {
      reasons.push(reason);
    }
  }

  return reasons.slice(0, 5);
}

export function FeaturedRemedyCard({ remedy, isSafe, evidenceScore, safetyScore, className }) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <div
        className={cn(
          'bg-white rounded-[28px] shadow-soft-lg overflow-hidden',
          className
        )}
      >
        <div className="flex flex-col md:flex-row min-h-[360px] md:h-[400px]">
          <div className="md:w-[25%] flex items-center justify-center p-6 bg-mint/40">
            <div className="w-[180px] h-[180px] rounded-full bg-white/80 flex items-center justify-center">
              <RemedyImage
                category={remedy.category}
                size="hero"
                alt={remedy.name}
              />
            </div>
          </div>

          <div className="md:w-[45%] p-6 md:px-8 md:py-6 flex flex-col">
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

            <h3 className="text-[36px] leading-tight font-bold text-ink mb-2">{remedy.name}</h3>
            <p className="text-ink-muted text-sm leading-relaxed line-clamp-2 mb-4">{remedy.shortDescription}</p>

            <div className="flex items-center gap-4 text-sm text-ink-muted mb-auto">
              {remedy.timeToEffect && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-ink">{remedy.timeToEffect}</span>
                </span>
              )}
              <span className="w-px h-4 bg-border" />
              <SafetyLabel safetyScore={safetyScore} hasConflicts={!isSafe} compact />
              <span className="w-px h-4 bg-border" />
              <EvidenceLabel score={evidenceScore} size="sm" />
            </div>

            <Link
              to={`/remedy/${remedy.id}`}
              className="mt-5 flex items-center justify-center w-full h-14 rounded-2xl bg-primary text-white text-base font-semibold shadow-glow hover:bg-primary-dark transition-all hover:-translate-y-0.5"
            >
              View Remedy
            </Link>
          </div>

          <div className="md:w-[30%] bg-mint/60 p-6 flex flex-col">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-4">
              Why We Recommend This
            </p>
            {reasons.length > 0 ? (
              <ul className="space-y-3">
                {reasons.map((reason, i) => (
                  <motion.li
                    key={reason}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-start gap-2.5 text-sm text-ink"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">Tailored to your symptoms.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
