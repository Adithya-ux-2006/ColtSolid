import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

const STUDY_TYPE_STYLES = {
  'Meta-analysis': 'bg-evidence/10 text-evidence',
  'Randomized Trial': 'bg-evidence/10 text-evidence',
  'Systematic Review': 'bg-evidence/10 text-evidence',
  'Clinical Study': 'bg-evidence/10 text-evidence',
};

export function EvidenceCard({ source, onTrackClick, delay = 0, className }) {
  const reduced = useReducedMotion();
  const studyType = source.type || source.journal?.match(/meta-analysis|randomized|systematic/i)?.[0];
  const normalizedType = studyType
    ? studyType.charAt(0).toUpperCase() + studyType.slice(1).toLowerCase()
    : null;
  const typeKey = Object.keys(STUDY_TYPE_STYLES).find(
    k => k.toLowerCase() === normalizedType?.toLowerCase()
  );

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={className}
    >
      <a
        href={source.url || '#'}
        target="_blank"
        rel="noreferrer"
        onClick={onTrackClick}
        className={cn(
          'group block rounded-[20px] border border-border p-5 md:p-6',
          'bg-card',
          'transition-all duration-200',
          'active:shadow-card active:scale-[0.995]',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-evidence tracking-wider">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                {source.journal || source.label || 'Clinical Research'}
              </span>
              {source.journal && (
              <span className="inline-flex items-center text-[10px] font-medium text-evidence bg-evidence/10 rounded-full px-1.5 py-0.5">
                  Peer-reviewed
                </span>
              )}
              {source.year && (
                <span className="text-[11px] text-ink-subtle font-medium">{source.year}</span>
              )}
            </div>
            {source.keyFinding && (
              <p className="text-sm text-ink leading-relaxed line-clamp-2">&ldquo;{source.keyFinding}&rdquo;</p>
            )}
            {source.label && !source.keyFinding && (
              <p className="text-sm text-ink line-clamp-2">{source.label}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0 mt-0.5">
            <ExternalLink className="w-4 h-4 text-ink-subtle transition-colors duration-200 group-hover:text-evidence" />
            {typeKey && (
              <span className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap',
                STUDY_TYPE_STYLES[typeKey]
              )}>
                {typeKey}
              </span>
            )}
          </div>
        </div>
      </a>
    </motion.div>
  );
}
