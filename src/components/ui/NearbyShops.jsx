import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Navigation, Clock, Store, ExternalLink } from 'lucide-react';
import { getApiUrl } from '../../utils/api';
import { cn } from '../../utils/cn';

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function parseOpeningHours(hours) {
  if (!hours) return null;
  try {
    const now = new Date();
    const dayIndex = now.getDay();
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = days[dayIndex];
    const match = hours.match(new RegExp(`${today}\\s+(.+?)(?:;|$)`));
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function NearbyShops({ remedyName, className }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationDenied, setLocationDenied] = useState(() => !navigator.geolocation);
  const [radius, setRadius] = useState(3000);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchShops = useCallback(async (lat, lon) => {
    if (!mountedRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('/api/nearby-shops'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, radius, limit: 10 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch shops');
      if (mountedRef.current) setShops(data.shops || []);
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [radius]);

  const requestLocation = useCallback(() => {
    setLocationDenied(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchShops(pos.coords.latitude, pos.coords.longitude),
      () => setLocationDenied(true),
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchShops]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchShops(pos.coords.latitude, pos.coords.longitude),
      () => setLocationDenied(true),
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchShops]);

  return (
    <section className={cn('section-card', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Where to Buy</h2>
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-transparent text-xs text-ink-muted border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value={1000}>1km</option>
            <option value={3000}>3km</option>
            <option value={5000}>5km</option>
            <option value={10000}>10km</option>
          </select>
        </div>
      </div>

      {locationDenied && (
        <div className="text-center py-6">
          <MapPin className="w-8 h-8 text-ink-muted mx-auto mb-2" />
          <p className="text-sm text-ink-muted mb-3">Enable location to find nearby pharmacies</p>
          <button
            onClick={requestLocation}
            className="text-sm text-primary font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-surface rounded w-3/4 mb-2" />
              <div className="h-3 bg-surface rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-red-600 text-center py-4">{error}</p>
      )}

      {!loading && !error && !locationDenied && shops.length === 0 && (
        <p className="text-sm text-ink-muted text-center py-4">No pharmacies found nearby</p>
      )}

      {!loading && shops.length > 0 && (
        <div className="space-y-3">
          {shops.map((shop, idx) => {
            const hours = parseOpeningHours(shop.openingHours);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lon}`;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-bg hover:bg-surface/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center shrink-0 mt-0.5">
                  <Store className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{shop.name}</p>
                  <p className="text-xs text-ink-muted truncate">{shop.address}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-ink-muted">
                      <Navigation className="w-3 h-3" />
                      {formatDistance(shop.distance)}
                    </span>
                    {hours && (
                      <span className="flex items-center gap-1 text-xs text-ink-muted">
                        <Clock className="w-3 h-3" />
                        {hours}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 mt-1 p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-surface transition-colors"
                  aria-label={`Open ${shop.name} in Google Maps`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      )}

      {!loading && shops.length > 0 && (
        <p className="text-xs text-ink-muted text-center mt-4">
          {remedyName ? `Pharmacies near you for ${remedyName}` : 'Pharmacies near you'}
        </p>
      )}
    </section>
  );
}
