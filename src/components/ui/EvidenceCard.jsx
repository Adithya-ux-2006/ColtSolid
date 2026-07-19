import { ExternalLink, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

const STUDY_TYPE_COLORS = {
  'Meta-analysis': 'bg-primary/10 text-primary',
  'Randomized Trial': 'bg-blue-500/10 text-blue-500',
  'Systematic Review': 'bg-violet-500/10 text-violet-500',
  'Clinical Study': 'bg-amber-500/10 text-amber-500',
};

export function EvidenceCard({ source, onTrackClick, className }) {
  const studyType = source.type || source.journal?.match(/meta-analysis|randomized|systematic/i)?.[0];
  const normalizedType = studyType
    ? studyType.charAt(0).toUpperCase() + studyType.slice(1).toLowerCase()
    : null;
  const typeKey = Object.keys(STUDY_TYPE_COLORS).find(
    k => k.toLowerCase() === normalizedType?.toLowerCase()
  );

  return (
    <a
      href={source.url || '#'}
      target="_blank"
      rel="noreferrer"
      onClick={onTrackClick}
      className={cn(
        'group block rounded-2xl border border-border p-4 hover:border-primary/20 hover:bg-surface-raised/50 transition-all duration-150',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              {source.journal || source.label || 'Clinical Research'}
            </span>
            {source.journal && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary/70 bg-primary/5 rounded-full px-1.5 py-0.5">
                Peer-reviewed
              </span>
            )}
            {source.year && (
              <span className="text-[10px] text-ink-subtle font-medium">{source.year}</span>
            )}
          </div>
          {source.keyFinding && (
            <p className="text-sm text-ink leading-relaxed line-clamp-2">&ldquo;{source.keyFinding}&rdquo;</p>
          )}
          {source.label && !source.keyFinding && (
            <p className="text-sm text-ink line-clamp-2">{source.label}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {typeKey && (
            <span className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap',
              STUDY_TYPE_COLORS[typeKey]
            )}>
              {typeKey}
            </span>
          )}
          <ExternalLink className="w-4 h-4 text-ink-subtle group-hover:text-primary transition-colors" />
        </div>
      </div>
    </a>
  );
}
