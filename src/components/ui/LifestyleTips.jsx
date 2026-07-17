import { Droplets, Moon, Sparkles, Flame, Snowflake, Footprints, Wind, Monitor, Coffee, Apple, ArrowUp, Cloud, Sun, Brain } from 'lucide-react';
import { cn } from '../../utils/cn';
import { LIFESTYLE_TIPS, FALLBACK_TIPS } from '../../constants/lifestyleTips';

const ICON_MAP = {
  Droplets, Moon, Sparkles, Flame, Snowflake, Footprints, Wind, Monitor, Coffee, Apple, ArrowUp, Cloud, Sun, Brain,
};

function TipIcon({ name, className }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={cn('w-4 h-4 text-primary', className)} />;
}

export function LifestyleTips({ symptomId, className }) {
  const tips = LIFESTYLE_TIPS[symptomId] || FALLBACK_TIPS;

  return (
    <div className={className}>
      <p className="section-label">Lifestyle & Recovery Tips</p>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 no-scrollbar md:grid md:grid-cols-2 md:overflow-visible md:snap-none md:mx-0 md:px-0">
        {tips.map((tip, i) => (
          <div
            key={`${symptomId}-${i}`}
            className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-soft shrink-0 snap-start w-56 md:w-auto"
          >
            <div className="w-8 h-8 rounded-xl bg-mint flex items-center justify-center shrink-0">
              <TipIcon name={tip.icon} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink leading-snug">{tip.label}</p>
              <p className="text-xs text-ink-muted truncate">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
