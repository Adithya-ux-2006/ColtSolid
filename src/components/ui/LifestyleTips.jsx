import { Droplets, Moon, Sparkles, Flame, Snowflake, Footprints, Wind, Monitor, Coffee, Apple, ArrowUp, Cloud, Sun, Brain } from 'lucide-react';
import { cn } from '../../utils/cn';
import { LIFESTYLE_TIPS, FALLBACK_TIPS } from '../../constants/lifestyleTips';

const ICON_MAP = {
  Droplets, Moon, Sparkles, Flame, Snowflake, Footprints, Wind, Monitor, Coffee, Apple, ArrowUp, Cloud, Sun, Brain,
};

function TipIcon({ name, className }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={cn('w-5 h-5 text-primary', className)} />;
}

export function LifestyleTips({ symptomId, className }) {
  const tips = LIFESTYLE_TIPS[symptomId] || FALLBACK_TIPS;

  return (
    <div className={cn('rounded-3xl bg-mint/50 border border-primary/8 p-8', className)}>
      <h2 className="text-section-heading font-bold text-ink mb-6">Lifestyle & Support</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {tips.map((tip, i) => (
          <div
            key={`${symptomId}-${i}`}
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-card/80 flex items-center justify-center">
              <TipIcon name={tip.icon} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink leading-snug">{tip.label}</p>
              <p className="text-xs text-ink-muted mt-0.5">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
