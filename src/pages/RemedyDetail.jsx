import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, AlertTriangle, ExternalLink, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageWrapper } from '../components/layout';
import { CategoryBadge, RatingStars, EmailQuickSaveCard } from '../components/ui';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCatalogStore } from '../store/catalogStore';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';

export function RemedyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const notifyNearbyLaunch = useAuthStore((state) => state.enableNearbyLaunchNotification);
  const notifyNearbyEnabled = useAuthStore((state) => state.user?.notify_nearby_launch ?? false);
  const remedies = useCatalogStore((state) => state.remedies);
  const isCatalogLoading = useCatalogStore((state) => state.isLoading);
  const hasLoaded = useCatalogStore((state) => state.hasLoaded);
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [showToast, setShowToast] = useState(false);
  const [showQuickSave, setShowQuickSave] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [isSavingNearby, setIsSavingNearby] = useState(false);
  const [nearbyMessage, setNearbyMessage] = useState('');
  const heartAreaRef = useRef(null);

  const remedy = remedies.find(r => r.id === id);
  const favorite = useFavoritesStore((state) => (remedy ? state.isFavorite(remedy.id) : false));
  const truncatedRemedyName = remedy?.name?.length > 30 ? `${remedy.name.slice(0, 27)}...` : remedy?.name || '';

  useEffect(() => {
    if (!showQuickSave) return undefined;

    const handlePointerDown = (event) => {
      if (!heartAreaRef.current?.contains(event.target)) {
        setShowQuickSave(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showQuickSave]);

  useEffect(() => {
    if (isAuthenticated || !remedy?.id) return undefined;

    const sessionKey = `clotsolid_exit_intent_${remedy.id}`;
    if (window.sessionStorage.getItem(sessionKey) === 'shown') {
      return undefined;
    }

    let hasTriggered = false;
    let maxScrollY = window.scrollY;
    let scrolledDeepEnough = false;

    const cleanup = () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };

    const triggerExitIntent = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      window.sessionStorage.setItem(sessionKey, 'shown');
      setShowExitIntent(true);
      cleanup();
    };

    const handleMouseLeave = (event) => {
      if (event.clientY <= 0) {
        triggerExitIntent();
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > maxScrollY) {
        maxScrollY = currentScrollY;
      }
      if (maxScrollY > 400) {
        scrolledDeepEnough = true;
      }
      if (scrolledDeepEnough && maxScrollY - currentScrollY > 200) {
        triggerExitIntent();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return cleanup;
  }, [isAuthenticated, remedy?.id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setShowQuickSave((current) => !current);
      return;
    }

    toggleFavorite(remedy);
  };

  const handleNearbyNotify = async () => {
    setIsSavingNearby(true);
    setNearbyMessage('');

    const result = await notifyNearbyLaunch();

    setIsSavingNearby(false);
    setNearbyMessage(result.success ? 'We will let you know when nearby stores go live in your area.' : 'Unable to save this preference right now.');
  };

  const tabs = ['Overview', 'How to Use', 'Research', 'Warnings'];

  if (!hasLoaded && isCatalogLoading) {
    return <PageWrapper className="min-h-screen bg-snow p-8 text-center">Loading remedy...</PageWrapper>;
  }

  if (!remedy) return <div className="p-8 text-center">Remedy not found</div>;

  return (
    <PageWrapper className="min-h-screen bg-snow pb-24">
      {/* Toast */}
      <div className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-2 rounded-full font-medium text-sm z-50 transition-all shadow-lg flex items-center gap-2",
        showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <CheckCircle2 className="w-4 h-4 text-sage" /> Copied link!
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-100 pt-6 pb-8 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full bg-white shadow-sm hover:bg-gray-50 text-ink transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 text-ink transition-colors">
              <Share className="w-5 h-5" />
            </button>
          </div>

          <CategoryBadge category={remedy.category} className="mb-4 inline-block" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-4">{remedy.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <RatingStars rating={remedy.rating} reviewCount={remedy.reviewCount} />
            <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
            <span className="bg-white border border-gray-200 px-2 py-1 rounded-md text-xs font-bold text-ink shadow-sm tracking-widest">{remedy.cost}</span>
            <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
            <span className="text-sm font-medium text-ink-muted flex items-center gap-1">
              {remedy.timeToEffect}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 md:top-16 z-30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors relative",
                  activeTab === tab ? "border-forest text-forest" : "border-transparent text-ink-muted hover:text-ink"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {activeTab === 'Overview' && (
          <div className="space-y-6 animate-fade-in">
            <p className="text-lg text-ink leading-relaxed">{remedy.longDescription}</p>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 flex justify-between items-center">
              <span className="font-medium text-ink">Difficulty</span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-bold text-ink">{remedy.difficulty}</span>
            </div>
          </div>
        )}

        {activeTab === 'How to Use' && (
          <div className="space-y-4 animate-fade-in">
            {remedy.howToUse.split('\n').map((step, idx) => (
              <div key={idx} className="flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
                <div className="w-8 h-8 shrink-0 bg-sage/10 text-sage-dark rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-ink mt-1">{step.replace(/^\d+\.\s*/, '')}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Research' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-ink-muted mb-4 font-medium">Clinical Evidence</p>
            {remedy.researchPapers?.length ? (
              remedy.researchPapers.map((paper, idx) => (
                <a 
                  key={idx} 
                  href={paper.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group block bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-forest/30 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-forest/20 group-hover:bg-forest transition-colors" />
                  <div className="pl-3">
                    <p className="text-xs font-bold text-forest uppercase tracking-wider mb-1">{paper.journal}</p>
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-ink font-medium group-hover:text-forest transition-colors leading-relaxed">
                        "{paper.keyFinding}"
                      </p>
                      <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-forest shrink-0 mt-1" />
                    </div>
                  </div>
                </a>
              ))
            ) : remedy.researchLinks?.length ? (
              remedy.researchLinks.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-forest/30 hover:shadow-md transition-all"
                >
                  <span className="font-medium text-ink group-hover:text-forest transition-colors">{link.label}</span>
                  <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-forest" />
                </a>
              ))
            ) : (
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 text-sm text-ink-muted">
                Research links are not available for this remedy yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'Warnings' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-amber/10 border border-amber/30 p-6 rounded-2xl flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-dark shrink-0" />
              <p className="text-ink-muted leading-relaxed text-sm">{remedy.warnings}</p>
            </div>

            {!isAuthenticated ? (
              <div className="rounded-2xl border-l-4 border-forest bg-[#F7F1E7] p-5 shadow-card">
                <p className="text-lg font-semibold text-forest">💊 Want to track this remedy?</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Save it to your favorites, set reminders, and get personalized allergy warnings based on your health profile.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/register" className="rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white">
                    Create Free Account
                  </Link>
                  <Link to="/login" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-ink">
                    Log In
                  </Link>
                </div>
                <p className="mt-3 text-xs text-ink-subtle">Free forever. No credit card.</p>
              </div>
            ) : null}
          </div>
        )}

        <div className="mx-4 mt-4 rounded-2xl border border-amber/40 bg-amber/10 p-5">
          <p className="text-lg font-semibold text-ink">📍 Find this remedy near you</p>

          {isAuthenticated ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Nearby pharmacy and health store locations are coming soon.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                We'll notify you when this feature launches in your area.
              </p>
              <button
                type="button"
                onClick={handleNearbyNotify}
                disabled={notifyNearbyEnabled || isSavingNearby}
                className="mt-4 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {notifyNearbyEnabled ? 'Notification Enabled' : isSavingNearby ? 'Saving...' : 'Notify Me When Live'}
              </button>
              {nearbyMessage ? <p className="mt-3 text-sm text-forest">{nearbyMessage}</p> : null}
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                See nearby pharmacies and health stores that carry this remedy. Available with a free account.
              </p>
              <Link to="/register" className="mt-4 inline-flex rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white">
                Sign Up to Get Notified
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-16 md:bottom-auto md:top-[calc(100vh-100px)] left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40 md:bg-transparent md:border-none md:pointer-events-none flex justify-center">
        <div className="max-w-3xl w-full mx-auto flex gap-3 md:pointer-events-auto">
          <div ref={heartAreaRef} className="relative">
            <button 
              onClick={handleFavoriteClick}
              className={cn(
                "p-4 rounded-2xl shadow-sm border transition-colors flex items-center justify-center",
                favorite ? "bg-forest/10 border-forest text-forest" : "bg-white border-gray-200 text-ink-muted hover:text-forest"
              )}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("w-6 h-6", favorite && "fill-forest")} />
            </button>

            <AnimatePresence>
              {showQuickSave ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute bottom-full left-0 mb-3 w-[280px] rounded-2xl border border-gray-100 border-l-4 border-l-forest bg-white p-4 shadow-card"
              >
                <EmailQuickSaveCard
                  remedyId={remedy.id}
                  title="🤍 Save this remedy"
                  description=""
                />
              </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => navigate('/appointments')}
            className="flex-1 bg-ink text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-ink-muted transition-colors shadow-lg"
          >
            <CalendarIcon className="w-5 h-5" />
            Book Consultation
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isAuthenticated && showExitIntent ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-0 bottom-0 z-50 px-4"
        >
          <div className="mx-auto max-w-2xl rounded-t-3xl bg-white p-5 shadow-2xl">
            <EmailQuickSaveCard
              remedyId={remedy.id}
              title="Before you go..."
              description={`Save "${truncatedRemedyName}" to find it again later.`}
              helperText=""
              showDivider={false}
              showAuthLinks={false}
              showSecondaryDismiss={true}
              onDismiss={() => setShowExitIntent(false)}
            />
          </div>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </PageWrapper>
  );
}
