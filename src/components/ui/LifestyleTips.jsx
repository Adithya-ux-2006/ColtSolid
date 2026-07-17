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
    <div className={cn('rounded-3xl bg-mint border border-primary/10 p-6', className)}>
      <h2 className="text-section-heading font-bold text-ink mb-4">Lifestyle & Recovery</h2>
      <div className="grid grid-cols-2 gap-3">
        {tips.map((tip, i) => (
          <div
            key={`${symptomId}-${i}`}
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-soft"
          >
            <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center shrink-0">
              <TipIcon name={tip.icon} />
            </div>
            <p className="text-sm font-medium text-ink leading-snug">{tip.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
