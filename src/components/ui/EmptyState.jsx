import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-5">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-ink mb-2">{title}</h3>
      <p className="text-ink-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {ctaLabel && ctaHref && (
        <Link
          to={ctaHref}
          className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors shadow-glow"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
