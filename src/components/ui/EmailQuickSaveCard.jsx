import { useState } from 'react';
import { Link } from 'react-router-dom';
import { saveQuickRemedy } from '../../utils/quickSave';
import { trackRemedyEvent } from '../../utils/analytics';

export function EmailQuickSaveCard({
  remedyId,
  title,
  description,
  helperText = "We'll keep your saved remedies ready when you come back.",
  successText = 'Saved! Check your email to create your full account.',
  showDivider = true,
  showAuthLinks = true,
  showSecondaryDismiss = false,
  secondaryDismissLabel = 'Maybe later',
  onDismiss,
}) {
  const [email, setEmail] = useState('');
  const [savedEmail, setSavedEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!email.trim()) return;

    const value = saveQuickRemedy(email.trim(), remedyId);
    trackRemedyEvent({
      remedyId,
      eventType: 'saved',
      metadata: { method: 'email_quick_save' },
    }).catch(() => {});
    setSavedEmail(value.email);
    setIsSaved(true);
  };

  if (isSaved) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-forest">✓ {successText}</p>
        </div>

        <Link
          to={`/register?email=${encodeURIComponent(savedEmail)}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Complete Your Account
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-base font-semibold text-ink">{title}</p>
        {description ? <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p> : null}
      </div>

      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email.com"
          className="min-w-0 flex-1 px-3 py-2.5 text-sm text-ink focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSave}
          className="bg-forest px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Save →
        </button>
      </div>

      {helperText ? <p className="text-xs leading-relaxed text-ink-muted">{helperText}</p> : null}

      {showDivider ? <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-ink-subtle">or</p> : null}

      {showAuthLinks ? (
        <div className="flex gap-2">
          <Link
            to="/register"
            className="flex-1 rounded-xl border border-forest bg-forest px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            Create Full Account
          </Link>
          <Link
            to="/login"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-snow"
          >
            Log In
          </Link>
        </div>
      ) : null}

      {showSecondaryDismiss && onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          {secondaryDismissLabel}
        </button>
      ) : null}

      <p className="text-xs text-ink-subtle">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
