import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Store } from 'lucide-react';
import { getApiUrl } from '../../utils/api';
import { cn } from '../../utils/cn';
import { FeaturedPharmacy, PharmacyCard } from './PharmacyComponents';

export function NearbyShops({ className }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationDenied, setLocationDenied] = useState(() => !navigator.geolocation);
  const [radius, setRadius] = useState(3000);
  const [showAll, setShowAll] = useState(false);
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

  const featured = shops[0] || null;
  const nearby = showAll ? shops.slice(1) : shops.slice(1, 4);

  return (
    <section className={cn('', className)}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title mb-0">Where To Buy</h2>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-ink-muted" />
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
        <div className="text-center py-10 section-card">
          <MapPin className="w-8 h-8 text-ink-muted mx-auto mb-3" />
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
            <div key={i} className="animate-pulse section-card">
              <div className="h-4 bg-surface rounded w-3/4 mb-2" />
              <div className="h-3 bg-surface rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-10 section-card">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && !locationDenied && shops.length === 0 && (
        <div className="text-center py-10 section-card">
          <Store className="w-8 h-8 text-ink-muted mx-auto mb-3" />
          <p className="text-sm text-ink-muted">No pharmacies found nearby</p>
        </div>
      )}

      {!loading && shops.length > 0 && (
        <div className="space-y-4">
          {featured && <FeaturedPharmacy shop={featured} />}

          {nearby.length > 0 && (
            <div className="section-card p-4">
              <p className="section-label mb-3">Nearby Pharmacies</p>
              <div className="space-y-0.5">
                {nearby.map((shop, idx) => (
                  <PharmacyCard key={idx} shop={shop} />
                ))}
              </div>
              {!showAll && shops.length > 4 && (
                <button
                  onClick={() => setShowAll(true)}
                  className="w-full text-center text-sm font-medium text-primary mt-3 hover:underline"
                >
                  View More Pharmacies
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
