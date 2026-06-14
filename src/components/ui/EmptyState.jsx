import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      {Icon && (
        <div className="w-16 h-16 bg-snow-dark rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-forest" />
        </div>
      )}
      <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
      <p className="text-ink-muted max-w-sm mb-6">{description}</p>
      
      {ctaLabel && ctaHref && (
        <Link 
          to={ctaHref}
          className="px-6 py-2.5 bg-forest text-white rounded-full font-medium hover:bg-forest-dark transition-colors shadow-forest"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
