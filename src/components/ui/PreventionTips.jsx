import { CheckCircle, AlertCircle } from 'lucide-react';
import { PREVENTION_TIPS } from '../../data/bloodClotContent';

export function PreventionTips() {
  return (
    <section className="rounded-3xl bg-card border border-border overflow-hidden shadow-soft" role="region" aria-label="Blood clot prevention">
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Preventing Blood Clots</h2>
            <p className="text-sm text-ink-muted mt-1">
              General prevention tips. They are not treatment for a suspected blood clot.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PREVENTION_TIPS.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-surface p-4 border border-ink/5"
            >
              <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-ink-muted leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-warning/5 border border-warning/20">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-ink-muted leading-relaxed">
            These are general prevention tips. They are not treatment for a suspected blood clot.
          </p>
        </div>
      </div>
    </section>
  );
}
