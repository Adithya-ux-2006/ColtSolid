import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Search, SlidersHorizontal, ArrowUpDown, Clock,
  Leaf, TrendingUp
} from 'lucide-react';
import { cn } from '../utils/cn';
import { PageWrapper } from '../components/layout';
import { SavedRemedyCard } from '../components/ui/SavedRemedyCard';
import { useFavoritesStore } from '../store/favoritesStore';

const CATEGORIES = ['All', 'Natural', 'Lifestyle', 'Conventional', 'TCM'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'rating', label: 'Highest Rated' },
];

function parseReliefMinutes(timeStr) {
  if (!timeStr) return null;
  const s = timeStr.toLowerCase();
  if (s.includes('immediate')) return 0;
  if (s.includes('week') || s.includes('day')) return null;
  const nums = s.match(/\d+/g);
  if (!nums) return null;
  const values = nums.map(Number);
  const avg = (values[0] + (values[values.length - 1] || values[0])) / 2;
  if (s.includes('hour')) return avg * 60;
  return avg;
}

function computeAvgReliefTime(favorites) {
  const minutes = favorites
    .map((r) => parseReliefMinutes(r.timeToEffect))
    .filter((m) => m !== null);
  if (minutes.length === 0) return null;
  const avg = minutes.reduce((a, b) => a + b, 0) / minutes.length;
  if (avg < 1) return 'Immediate';
  if (avg < 60) return `${Math.round(avg)} min`;
  const h = Math.round(avg / 60);
  return `${h} hr${h > 1 ? 's' : ''}`;
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="w-[220px] h-[220px] md:w-[260px] md:h-[260px] shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#34D399" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="120" r="110" fill="url(#heroGlow)" />

      {/* Mortar */}
      <path
        d="M100 148c0-12 40-12 40 0l-6 18c-2 6-10 10-14 10h0c-4 0-12-4-14-10l-6-18z"
        fill="#374151"
        opacity="0.9"
      />
      {/* Pestle */}
      <rect x="117" y="112" width="6" height="36" rx="3" fill="#6B7280" transform="rotate(15 120 130)" />
      <ellipse cx="120" cy="112" rx="8" ry="5" fill="#9CA3AF" transform="rotate(15 120 112)" />

      {/* Bottle body */}
      <rect x="138" y="100" width="28" height="52" rx="6" fill="#34D399" fillOpacity="0.25" stroke="#34D399" strokeWidth="1.5" />
      {/* Bottle neck */}
      <rect x="145" y="90" width="14" height="14" rx="3" fill="#34D399" fillOpacity="0.15" stroke="#34D399" strokeWidth="1.2" />
      {/* Bottle cap */}
      <rect x="143" y="86" width="18" height="6" rx="2" fill="#34D399" fillOpacity="0.4" />
      {/* Bottle label */}
      <rect x="142" y="118" width="20" height="14" rx="2" fill="white" fillOpacity="0.5" />
      {/* Leaf on bottle */}
      <path
        d="M145 108c1-4 4-7 8-8"
        stroke="#34D399"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M147 108c1-3 3-5 6-6"
        stroke="#34D399"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Large leaf top-left */}
      <path
        d="M88 74c-6 14-2 28 2 32 4-4 8-18 2-32z"
        fill="#34D399"
        fillOpacity="0.35"
      />
      <path
        d="M88 74c2 6 3 12 2 18"
        stroke="#34D399"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Small leaf top */}
      <path
        d="M108 70c-2 8 2 16 4 18 2-2 6-10 4-18z"
        fill="#34D399"
        fillOpacity="0.25"
      />

      {/* Small leaves bottom */}
      <path
        d="M94 168c-4 8 0 16 2 18 2-2 4-10 2-18z"
        fill="#34D399"
        fillOpacity="0.2"
      />

      {/* Cross/plus decoration */}
      <circle cx="152" cy="132" r="2" fill="#34D399" fillOpacity="0.5" />
      <circle cx="152" cy="138" r="1.5" fill="#34D399" fillOpacity="0.4" />
      <circle cx="155" cy="135" r="1.5" fill="#34D399" fillOpacity="0.4" />

      {/* Droplets */}
      <ellipse cx="98" cy="108" rx="2" ry="3" fill="#34D399" fillOpacity="0.3" />
      <ellipse cx="104" cy="104" rx="1.5" ry="2.5" fill="#34D399" fillOpacity="0.25" />
    </svg>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-[20px] border border-border/60 shadow-soft p-4 md:p-5 flex items-center gap-3 md:gap-4"
    >
      <div className={cn(
        'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0',
        color === 'emerald' && 'bg-emerald-500/10 text-emerald-500',
        color === 'violet' && 'bg-violet-500/10 text-violet-500',
        color === 'orange' && 'bg-orange-500/10 text-orange-500',
        color === 'blue' && 'bg-blue-500/10 text-blue-500',
      )}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xl md:text-2xl font-bold text-ink leading-none mb-1">{value}</p>
        <p className="text-xs md:text-sm text-ink-muted truncate">{label}</p>
      </div>
    </motion.div>
  );
}

export function Favorites() {
  const favorites = useFavoritesStore((state) => state.favorites);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const naturalCount = favorites.filter((r) => r.category === 'Natural').length;
  const naturalPercent = favorites.length > 0
    ? Math.round((naturalCount / favorites.length) * 100)
    : 0;

  const highEvidenceCount = favorites.filter((r) => {
    if (r._evidenceScore != null) return r._evidenceScore >= 7;
    return r.rating >= 4.5;
  }).length;

  const avgReliefTime = useMemo(() => computeAvgReliefTime(favorites), [favorites]);

  const filtered = useMemo(() => {
    let result = [...favorites];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.shortDescription || '').toLowerCase().includes(q) ||
          (r.category || '').toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter((r) => r.category === activeCategory);
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b._savedAt || 0) - new Date(a._savedAt || 0));
        break;
    }

    return result;
  }, [favorites, searchQuery, activeCategory, sortBy]);

  return (
    <PageWrapper className="min-h-screen pb-28 md:pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/4 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-5 md:px-8 pt-8 md:pt-12 pb-6 md:pb-10">
          <div className="flex items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{favorites.length} Saved Item{favorites.length !== 1 && 's'}</span>
              </div>

              <h1 className="text-[44px] md:text-[52px] font-bold text-ink tracking-tight leading-[1.05] mb-3">
                Saved Remedies
              </h1>

              <p className="text-base md:text-lg text-ink-muted leading-relaxed max-w-lg">
                Keep your favourite evidence-backed treatments all in one place.
              </p>
            </div>

            <div className="hidden md:block">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Insights */}
      {favorites.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-5 md:px-8 mb-8 md:mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard
              icon={Heart}
              value={favorites.length}
              label="Total Saved"
              color="emerald"
            />
            <StatCard
              icon={Leaf}
              value={`${naturalCount} (${naturalPercent}%)`}
              label="Natural"
              color="emerald"
            />
            <StatCard
              icon={TrendingUp}
              value={highEvidenceCount}
              label="Evidence-backed"
              color="violet"
            />
            <StatCard
              icon={Clock}
              value={avgReliefTime || '—'}
              label="Avg. Relief Time"
              color="orange"
            />
          </div>
        </section>
      )}

      {/* Main content */}
      {favorites.length > 0 ? (
        <>
          {/* Search + Filter + Sort */}
          <section className="max-w-[1280px] mx-auto px-5 md:px-8 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your saved remedies..."
                  className="w-full h-11 md:h-12 pl-11 pr-4 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl text-sm text-ink placeholder-ink-muted/60 transition-all duration-200 focus:outline-none focus:border-primary/30 focus:bg-card focus:shadow-soft"
                />
              </div>

              <button
                type="button"
                className="flex items-center gap-2 h-11 md:h-12 px-4 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl text-sm font-medium text-ink-muted hover:text-ink hover:border-border transition-all duration-200"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-2 h-11 md:h-12 px-4 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl text-sm font-medium text-ink-muted hover:text-ink hover:border-border transition-all duration-200"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">Sort</span>
                </button>

                {showSortMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 z-20 bg-card border border-border/60 rounded-2xl shadow-card-lg py-1.5 min-w-[160px]">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setSortBy(opt.value); setShowSortMenu(false); }}
                          className={cn(
                            'w-full text-left px-4 py-2 text-sm transition-colors duration-150',
                            sortBy === opt.value
                              ? 'text-primary font-medium bg-primary/5'
                              : 'text-ink-muted hover:text-ink hover:bg-surface'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Category Filter Chips */}
          <section className="max-w-[1280px] mx-auto px-5 md:px-8 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-surface text-ink-muted border border-border/60 hover:border-border hover:text-ink'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Saved Remedy Grid */}
          {filtered.length > 0 ? (
            <section className="max-w-[1280px] mx-auto px-5 md:px-8 mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((remedy) => (
                  <SavedRemedyCard key={remedy.id} remedy={remedy} />
                ))}
              </div>
            </section>
          ) : (
            <section className="max-w-[1280px] mx-auto px-5 md:px-8 mb-10">
              <div className="flex flex-col items-center justify-center text-center py-16 bg-card rounded-[20px] border border-border/60 shadow-soft">
                <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-5">
                  <Search className="w-7 h-7 text-ink-muted" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-2">No matches found</h3>
                <p className="text-ink-muted max-w-sm mb-6 leading-relaxed">
                  Try adjusting your search or filter to find what you&apos;re looking for.
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors shadow-glow"
                >
                  Clear filters
                </button>
              </div>
            </section>
          )}

          {/* Browse More CTA */}
          <section className="max-w-[1280px] mx-auto px-5 md:px-8 mb-8">
            <div className="relative bg-gradient-to-br from-card to-card/80 rounded-[20px] border border-border/60 shadow-soft p-6 md:p-8 flex items-center gap-6 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Heart className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-ink mb-1">
                  Looking for more remedies?
                </h2>
                <p className="text-sm md:text-base text-ink-muted">
                  Browse our full catalog of evidence-backed treatments tailored to your symptoms.
                </p>
              </div>

              <Link
                to="/search"
                className="shrink-0 inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors shadow-glow"
              >
                Browse Remedies
                <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>
          </section>
        </>
      ) : (
        /* Empty State */
        <section className="max-w-[1280px] mx-auto px-5 md:px-8 pb-16">
          <div className="flex flex-col items-center justify-center text-center py-16 md:py-20 bg-card rounded-[20px] border border-border/60 shadow-soft">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3">
              No Saved Remedies Yet
            </h2>
            <p className="text-ink-muted max-w-md mb-8 leading-relaxed">
              Save remedies by tapping the heart icon while browsing.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors shadow-glow"
            >
              Browse Remedies
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
