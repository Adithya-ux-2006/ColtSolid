import { BookOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

function getEvidenceLevel(score) {
  if (score == null || score === 0) return null;
  if (score >= 7) return { text: 'High evidence', color: 'bg-warning/10 text-warning border border-warning/30' };
  if (score >= 4) return { text: 'Moderate evidence', color: 'bg-warning/10 text-warning border border-warning/30' };
  return { text: 'Limited evidence', color: 'bg-ink-muted/10 text-ink-muted border border-border' };
}

export function EvidenceLabel({ score, size = 'md', className }) {
  const level = getEvidenceLevel(score);
  if (!level) return null;

  if (size === 'sm') {
    return (
      <span
        className={cn('inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap', level.color, className)}
        aria-label={`Evidence level: ${level.text}`}
      >
        <BookOpen className="w-3 h-3 shrink-0" />
        {level.text}
      </span>
    );
  }

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap justify-center', level.color, className)}
      aria-label={`Evidence level: ${level.text}`}
    >
      <BookOpen className="w-3.5 h-3.5 shrink-0" />
      {level.text}
    </span>
  );
}
