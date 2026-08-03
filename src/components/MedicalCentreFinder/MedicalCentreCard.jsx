import { MapPin, Phone, Globe, Clock, Navigation } from 'lucide-react';
import { cn } from '../../utils/cn';

const TYPE_COLORS = {
  Hospital: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  Clinic: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Medical Practice': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Diagnostics Centre': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Laboratory: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

function getDistanceLabel(distance) {
  if (distance < 1) return `${Math.round(distance * 1000)} m`;
  return `${distance.toFixed(1)} km`;
}

export function MedicalCentreCard({ centre, isSelected, onSelect }) {
  const typeColor = TYPE_COLORS[centre.type] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

  return (
    <article
      className={cn(
        'rounded-2xl border p-4 transition-all cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5 shadow-card ring-2 ring-primary/20'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-soft'
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`${centre.name}, ${centre.type}, ${getDistanceLabel(centre.distance)} away`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-semibold text-ink truncate">{centre.name}</h3>
            <span className={cn(
              'shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
              typeColor.bg, typeColor.text, typeColor.border
            )}>
              {centre.type}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-ink-muted mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{getDistanceLabel(centre.distance)} away</span>
          </div>

          {centre.address && (
            <p className="text-xs text-ink-muted mb-2 line-clamp-2">{centre.address}</p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            {centre.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {centre.phone}
              </span>
            )}
            {centre.openingHours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {centre.openingHours}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-ink/5">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${centre.lat},${centre.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors"
          aria-label={`Get directions to ${centre.name}`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Get Directions
        </a>
        <a
          href={`https://www.openstreetmap.org/?mlat=${centre.lat}&mlon=${centre.lon}#map=16/${centre.lat}/${centre.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-ink text-xs font-semibold hover:bg-surface transition-colors"
          aria-label={`View ${centre.name} on OpenStreetMap`}
        >
          <Globe className="w-3.5 h-3.5" />
          View on Map
        </a>
      </div>
    </article>
  );
}
