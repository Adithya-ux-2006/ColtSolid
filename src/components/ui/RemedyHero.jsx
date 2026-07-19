import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Star, StarHalf } from 'lucide-react';
import { cn } from '../../utils/cn';
import { RemedyImage } from './RemedyImage';
import { CategoryBadge } from './CategoryBadge';
import { EvidenceLabel } from './EvidenceLabel';

function StarRating({ rating, reviewCount }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < full) return <Star key={i} className="w-4 h-4 fill-warning text-warning" />;
          if (i === full && hasHalf) return <StarHalf key={i} className="w-4 h-4 fill-warning text-warning" />;
          return <Star key={i} className="w-4 h-4 text-ink-subtle" />;
        })}
      </div>
      {reviewCount != null && (
        <span className="text-sm text-ink-muted">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}

export function RemedyHero({ remedy, isSafe, evidenceScore, className }) {
  return (
    <section className={cn('flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative shrink-0"
      >
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-primary-tint flex items-center justify-center shadow-glow ring-[3px] ring-primary/10">
          <RemedyImage category={remedy.category} size="hero" alt={remedy.name} />
        </div>
      </motion.div>

      <div className="flex-1 min-w-0 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4"
        >
          <CategoryBadge category={remedy.category} firstOccurrence />
          {isSafe ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safe
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning/10 text-warning">
              <AlertTriangle className="w-3.5 h-3.5" />
              Check
            </span>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="page-title mb-4"
        >
          {remedy.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18 }}
          className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-5"
        >
          {evidenceScore > 0 && <EvidenceLabel score={evidenceScore} />}
          {remedy.rating > 0 && (
            <StarRating rating={remedy.rating} reviewCount={remedy.reviewCount} />
          )}
        </motion.div>

        {remedy.shortDescription && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.22 }}
            className="text-ink-muted text-base leading-relaxed max-w-lg"
          >
            {remedy.shortDescription}
          </motion.p>
        )}
      </div>
    </section>
  );
}
