import { Clock3, MapPinned, Navigation, Star } from 'lucide-react';

export function NearbyShopCard({ place }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-ink">{place.name}</p>
          <p className="mt-1 text-sm text-ink-muted">{place.address}</p>
        </div>
        <span className="rounded-full bg-sage/15 px-2.5 py-1 text-xs font-semibold text-forest">
          {place.distanceKm} km
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-ink-muted">
        {place.categories.map((category) => (
          <span key={category} className="rounded-full bg-snow px-2.5 py-1">
            {category}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-ink-muted sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-dark" />
          <span>{place.rating ? `${place.rating.toFixed(1)} / 5` : 'No rating'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinned className="h-4 w-4 text-forest" />
          <span>{place.distanceKm} km away</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-sage-dark" />
          <span>
            {place.isOpen === null ? 'Hours unavailable' : place.isOpen ? 'Open now' : 'Closed'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-ink-muted" />
          <span>{place.reviewCount} reviews</span>
        </div>
      </div>

      <a
        href={place.directionsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
      >
        <Navigation className="h-4 w-4" />
        Directions
      </a>
    </div>
  );
}
