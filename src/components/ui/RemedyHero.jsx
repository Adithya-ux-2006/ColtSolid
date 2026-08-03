import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '../../utils/cn';
import { RemedyImage } from './RemedyImage';
import { EvidenceLabel } from './EvidenceLabel';

function StarRating({ rating }) {
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
    </div>
  );
}

export function RemedyHero({ remedy, evidenceScore, className }) {
  return (
    <section className={cn('flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative shrink-0"
      >
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-surface border border-border flex items-center justify-center">
          <RemedyImage category={remedy.category} size="hero" alt={remedy.name} />
        </div>
      </motion.div>

      <div className="flex-1 min-w-0 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="text-sm text-ink-muted mb-3"
        >
          {remedy.category}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="page-title mb-5"
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
            <StarRating rating={remedy.rating} />
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
