import { ExternalLink, BookOpen, MapPin, Navigation, Clock, Store } from 'lucide-react';
import { cn } from '../../utils/cn';

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function FeaturedPharmacy({ shop, className }) {
  if (!shop) return null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lon}`;
  const isOpen = shop.isOpen !== false;

  return (
    <div className={cn(
      'rounded-3xl p-5 border-2 border-success/20 bg-card shadow-soft',
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-success/10 text-success">
          <MapPin className="w-3 h-3" />
          Closest to You
        </span>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <Store className="w-5 h-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink truncate">{shop.name}</p>
          <p className="text-sm text-ink-muted truncate">{shop.address}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <Navigation className="w-3 h-3" />
              {formatDistance(shop.distance)}
            </span>
            <span className={cn(
              'text-xs font-medium',
              isOpen ? 'text-success' : 'text-danger'
            )}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full h-12 rounded-2xl bg-primary text-white text-sm font-semibold shadow-glow hover:bg-primary-dark transition-all hover:-translate-y-0.5"
      >
        Get Directions
      </a>
    </div>
  );
}

export function PharmacyCard({ shop, className }) {
  if (!shop) return null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lon}`;
  const isOpen = shop.isOpen !== false;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 p-3 rounded-2xl bg-bg hover:bg-surface/50 transition-colors',
        className
      )}
    >
      <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0">
        <Store className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{shop.name}</p>
        <p className="text-xs text-ink-muted truncate">{shop.address}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-ink-muted">
            <Navigation className="w-3 h-3" />
            {formatDistance(shop.distance)}
          </span>
          <span className={cn(
            'text-xs font-medium',
            isOpen ? 'text-success' : 'text-danger'
          )}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-ink-subtle shrink-0" />
    </a>
  );
}
