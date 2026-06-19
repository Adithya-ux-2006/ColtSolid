import { Heart } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { RemedyCard, EmptyState } from '../components/ui';
import { useFavoritesStore } from '../store/favoritesStore';

export function Favorites() {
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <PageWrapper className="min-h-screen bg-cream pb-24 md:pb-8 pt-6">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-ink mb-2">Your Remedies</h1>
        <p className="text-sm text-ink-muted mb-8">
          {favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}
        </p>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(remedy => (
              <RemedyCard key={remedy.id} remedy={remedy} />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Heart}
            title="No saved remedies yet"
            description="Start searching to find relief. Remedies you favorite will appear here."
            ctaLabel="Search Symptoms"
            ctaHref="/search"
            className="mt-12 bg-white rounded-3xl border border-gray-100 shadow-sm"
          />
        )}
      </div>
    </PageWrapper>
  );
}
