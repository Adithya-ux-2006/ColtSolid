import { AlertTriangle, Phone, MapPin, ShieldCheck, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { RISK_RESULTS, MEDICAL_DISCLAIMER } from '../../data/bloodClotContent';

function RiskResultCard({ level }) {
  const result = RISK_RESULTS[level];
  if (!result) return null;

  const isEmergency = level === 'emergency';
  const isHigh = level === 'high';

  return (
    <div
      className={cn(
        'rounded-2xl border p-6',
        isEmergency && 'border-danger/30 bg-danger/10',
        isHigh && 'border-danger/20 bg-danger/5',
        level === 'moderate' && 'border-warning/20 bg-warning/5',
        level === 'low' && 'border-success/20 bg-success/5'
      )}
      role="region"
      aria-label={`Risk assessment: ${result.heading}`}
    >
      <div className="flex items-start gap-3 mb-4">
        {isEmergency || isHigh ? (
          <AlertTriangle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
        ) : level === 'moderate' ? (
          <Info className="w-6 h-6 text-warning shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-6 h-6 text-success shrink-0 mt-0.5" />
        )}
        <div>
          <h3 className={cn(
            'text-lg font-bold',
            isEmergency && 'text-danger',
            isHigh && 'text-danger',
            level === 'moderate' && 'text-warning',
            level === 'low' && 'text-success'
          )}>
            {result.heading}
          </h3>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">{result.text}</p>
        </div>
      </div>

      {result.nextSteps && (
        <div className="mt-4 pt-4 border-t border-ink/10">
          <p className="text-sm font-semibold text-ink mb-3">What you can do now:</p>
          <ul className="space-y-2">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="text-primary mt-1 text-xs" aria-hidden="true">&#9679;</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isEmergency && (
        <div className="mt-4 pt-4 border-t border-danger/20">
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl bg-danger text-white font-bold text-lg hover:bg-danger/90 transition-colors shadow-lg"
            aria-label="Call emergency services"
          >
            <Phone className="w-5 h-5" />
            Call 112
          </a>
        </div>
      )}

      {isHigh && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-danger/10">
          <a
            href="tel:112"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-danger text-white text-sm font-semibold hover:bg-danger/90 transition-colors"
            aria-label="Call emergency services"
          >
            <Phone className="w-4 h-4" />
            Call Emergency Services
          </a>
          <a
            href="https://www.google.com/maps/search/hospitals+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-ink text-sm font-semibold hover:bg-surface transition-colors"
            aria-label="Find nearest emergency centre"
          >
            <MapPin className="w-4 h-4" />
            Find Nearest Emergency Centre
          </a>
        </div>
      )}

      {level === 'moderate' && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-warning/10">
          <a
            href="#medical-centres"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Find Medical Centres
          </a>
          <a
            href="#symptom-warning-signs"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-ink text-sm font-semibold hover:bg-surface transition-colors"
          >
            Learn About Warning Signs
          </a>
        </div>
      )}
    </div>
  );
}

function MedicalDisclaimerBanner() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-surface p-4 text-xs text-ink-muted leading-relaxed">
      <p className="font-semibold text-ink mb-1">Important Medical Disclaimer</p>
      <p>{MEDICAL_DISCLAIMER.main}</p>
      <p className="mt-2 font-semibold text-danger">{MEDICAL_DISCLAIMER.emergency}</p>
    </div>
  );
}

export { RiskResultCard, MedicalDisclaimerBanner };
