import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share, AlertTriangle, ExternalLink, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { CategoryBadge, RatingStars } from '../components/ui';
import { useFavoritesStore } from '../store/favoritesStore';
import { REMEDIES } from '../data/remedies';
import { cn } from '../utils/cn';

export function RemedyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [showToast, setShowToast] = useState(false);

  const remedy = REMEDIES.find(r => r.id === id);
  if (!remedy) return <div className="p-8 text-center">Remedy not found</div>;

  const favorite = isFavorite(remedy.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const tabs = ['Overview', 'How to Use', 'Research', 'Warnings'];

  return (
    <PageWrapper className="min-h-screen bg-cream pb-24">
      {/* Toast */}
      <div className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-2 rounded-full font-medium text-sm z-50 transition-all shadow-lg flex items-center gap-2",
        showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <CheckCircle2 className="w-4 h-4 text-teal" /> Copied link!
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
                  activeTab === tab ? "border-coral text-coral" : "border-transparent text-ink-muted hover:text-ink"
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
                <div className="w-8 h-8 shrink-0 bg-teal/10 text-teal-dark rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-ink mt-1">{step.replace(/^\d+\.\s*/, '')}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Research' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-ink-muted mb-4">Scientific studies backing this remedy:</p>
            {remedy.researchLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:border-coral/30 hover:shadow-md transition-all"
              >
                <span className="font-medium text-ink group-hover:text-coral transition-colors">{link.label}</span>
                <ExternalLink className="w-4 h-4 text-ink-muted group-hover:text-coral" />
              </a>
            ))}
          </div>
        )}

        {activeTab === 'Warnings' && (
          <div className="bg-yellow/10 border border-yellow/30 p-6 rounded-2xl flex gap-4 animate-fade-in">
            <AlertTriangle className="w-6 h-6 text-yellow-dark shrink-0" />
            <p className="text-ink-muted leading-relaxed text-sm">{remedy.warnings}</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 md:bottom-auto md:top-[calc(100vh-100px)] left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40 md:bg-transparent md:border-none md:pointer-events-none flex justify-center">
        <div className="max-w-3xl w-full mx-auto flex gap-3 md:pointer-events-auto">
          <button 
            onClick={() => toggleFavorite(remedy)}
            className={cn(
              "p-4 rounded-2xl shadow-sm border transition-colors flex items-center justify-center",
              favorite ? "bg-coral/10 border-coral text-coral" : "bg-white border-gray-200 text-ink-muted hover:text-coral"
            )}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-6 h-6", favorite && "fill-coral")} />
          </button>
          
          <button 
            onClick={() => navigate('/appointments')}
            className="flex-1 bg-ink text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-ink-muted transition-colors shadow-lg"
          >
            <CalendarIcon className="w-5 h-5" />
            Book Consultation
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
