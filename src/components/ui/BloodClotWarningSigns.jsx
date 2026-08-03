import { ShieldAlert, AlertTriangle, Phone } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CLOT_SYMPTOMS } from '../../data/bloodClotContent';

function WarningSignCard({ title, plainName, warningSigns, seekAdviceIf, color }) {
  return (
    <div className={cn(
      'rounded-2xl border p-5',
      color === 'danger' && 'border-danger/20 bg-danger/5',
      color === 'warning' && 'border-warning/20 bg-warning/5',
    )}>
      <div className="flex items-center gap-2 mb-3">
        {color === 'danger' ? (
          <AlertTriangle className="w-5 h-5 text-danger" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-warning" />
        )}
        <div>
          <h3 className="font-semibold text-ink">{title}</h3>
          <p className="text-xs text-ink-muted">{plainName}</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">Warning signs to watch for:</p>
        <ul className="space-y-1">
          {warningSigns.map((sign, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
              <span className={cn(
                'mt-1.5 text-[8px]',
                color === 'danger' ? 'text-danger' : 'text-warning'
              )} aria-hidden="true">&#9679;</span>
              {sign}
            </li>
          ))}
        </ul>
      </div>

      {seekAdviceIf && (
        <div className="pt-3 border-t border-ink/10">
          <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">Seek medical advice if:</p>
          <ul className="space-y-1">
            {seekAdviceIf.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="text-primary mt-1.5 text-[8px]" aria-hidden="true">&#9679;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function BloodClotWarningSigns() {
  return (
    <section className="rounded-3xl bg-card border border-border overflow-hidden shadow-soft" role="region" aria-label="Blood clot warning signs">
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-danger" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Blood Clot Warning Signs</h2>
            <p className="text-sm text-ink-muted mt-1">
              Learn the common warning signs of blood clots so you know when to seek help.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <WarningSignCard
            title={CLOT_SYMPTOMS.dvt.name}
            plainName={CLOT_SYMPTOMS.dvt.plainName}
            warningSigns={CLOT_SYMPTOMS.dvt.warningSigns}
            seekAdviceIf={CLOT_SYMPTOMS.dvt.seekAdviceIf}
            color="warning"
          />
          <WarningSignCard
            title={CLOT_SYMPTOMS.pe.name}
            plainName={CLOT_SYMPTOMS.pe.plainName}
            warningSigns={CLOT_SYMPTOMS.pe.warningSigns}
            seekAdviceIf={CLOT_SYMPTOMS.pe.seekAdviceIf}
            color="danger"
          />
        </div>

        <div className="mt-4 rounded-2xl border border-danger/20 bg-danger/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="w-5 h-5 text-danger" />
            <h3 className="font-semibold text-danger">Emergency signs — Call 112 immediately</h3>
          </div>
          <ul className="space-y-1">
            {CLOT_SYMPTOMS.emergency.signs.map((sign, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="text-danger mt-1.5 text-[8px]" aria-hidden="true">&#9679;</span>
                {sign}
              </li>
            ))}
          </ul>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call 112
          </a>
        </div>
      </div>
    </section>
  );
}
