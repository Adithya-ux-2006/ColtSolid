import { ExternalLink, BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

export function EvidenceCard({ source, onTrackClick, className }) {
  return (
    <a
      href={source.url || '#'}
      target="_blank"
      rel="noreferrer"
      onClick={onTrackClick}
      className={cn(
        'block rounded-2xl border border-ink/5 p-4 hover:border-primary/20 hover:bg-surface/30 transition-all',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              {source.journal || source.label || 'Clinical Research'}
            </span>
            {source.journal && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary/70 bg-primary/5 rounded-full px-1.5 py-0.5">
                <BookOpen className="w-2.5 h-2.5" />
                Peer-reviewed
              </span>
            )}
          </div>
          {source.keyFinding && (
            <p className="text-sm text-ink leading-relaxed">&ldquo;{source.keyFinding}&rdquo;</p>
          )}
          {source.label && !source.keyFinding && (
            <p className="text-sm text-ink">{source.label}</p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-ink-subtle shrink-0 mt-1 md:mt-1 self-end md:self-auto" />
      </div>
    </a>
  );
}
