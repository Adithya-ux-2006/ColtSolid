import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CategoryBadge } from './CategoryBadge';
import { RatingStars } from './RatingStars';
import { AllergyBadge } from './AllergyBadge';

export function RemedyCard({ remedy, className, featured, isSafe = true }) {
  if (featured) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Link
          to={`/remedy/${remedy.id}`}
          className={cn(
            'block bg-gradient-card rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-shadow',
            className
          )}
        >
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={remedy.category} />
            <span className="text-xs font-medium text-primary-light bg-white/60 px-2.5 py-0.5 rounded-full">
              Featured
            </span>
          </div>
          <h3 className="text-xl font-semibold text-ink mb-2">{remedy.name}</h3>
          <p className="text-ink-muted text-sm mb-4 line-clamp-2">{remedy.shortDescription}</p>
          <div className="flex items-center gap-4 text-sm text-ink-muted">
            {remedy.timeToEffect && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {remedy.timeToEffect}
              </span>
            )}
            {remedy.difficulty && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {remedy.difficulty}
              </span>
            )}
          </div>
          <AllergyBadge isSafe={isSafe} className="mt-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <Link
        to={`/remedy/${remedy.id}`}
        className={cn(
          'block bg-white rounded-3xl p-5 shadow-soft hover:shadow-card transition-all',
          className
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-surface flex items-center justify-center shrink-0 text-primary font-semibold text-sm">
              {remedy.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-ink truncate">{remedy.name}</h3>
              <CategoryBadge category={remedy.category} />
            </div>
          </div>
          <AllergyBadge isSafe={isSafe} compact />
        </div>

        <p className="text-sm text-ink-muted mb-3 line-clamp-2">{remedy.shortDescription}</p>

        <div className="flex items-center gap-3 text-xs text-ink-muted mb-3">
          {remedy.timeToEffect && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {remedy.timeToEffect}
            </span>
          )}
          {remedy.cost && (
            <span className="bg-surface px-2 py-0.5 rounded-md">{remedy.cost}</span>
          )}
          {remedy._evidenceScore ? (
            <span className="text-primary font-medium" title="Evidence level">
              E{remedy._evidenceScore}/10
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <RatingStars rating={remedy.rating} reviewCount={remedy.reviewCount} />
          <span className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
            View Details &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
