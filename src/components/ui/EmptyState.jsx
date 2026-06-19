import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-teal" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-ink mb-2">{title}</h3>
      <p className="text-ink-muted max-w-sm mb-6">{description}</p>

      {ctaLabel && ctaHref && (
        <Link
          to={ctaHref}
          className="px-6 py-3 bg-coral text-white rounded-2xl font-medium hover:bg-coral-dark transition-colors shadow-coral"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
