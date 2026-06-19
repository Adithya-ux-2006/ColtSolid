import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { trackSearchEvent } from '../utils/analytics';

const QUICK_LINKS = ['Eye Pain', 'Headache', 'Anxiety', 'Stomach Ache'];

export function SymptomSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    trackSearchEvent({ source: 'search_input', queryText: query }).catch(() => {});
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <PageWrapper className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-16 max-w-xl mx-auto w-full">
        <h1 className="text-display font-bold text-ink mb-3">
          Find Relief
          <br />
          Faster
        </h1>
        <p className="text-lg text-ink-muted mb-8">
          Evidence-backed remedies for common symptoms.
        </p>

        <div className="relative mb-3">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-ink-muted pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="Search symptoms..."
            className="w-full bg-white rounded-2xl pl-14 pr-4 py-5 text-lg text-ink placeholder-ink-muted shadow-soft focus:outline-none focus:ring-2 focus:ring-coral/20"
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-coral text-white rounded-2xl py-4 font-semibold text-lg hover:bg-coral-dark transition-colors shadow-coral"
        >
          Search Remedies
        </button>

        <div className="mt-8">
          <p className="text-sm text-ink-muted mb-3">Common searches</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {QUICK_LINKS.map((text) => (
              <button
                key={text}
                onClick={() => {
                  setSearchTerm(text);
                  trackSearchEvent({ source: 'quick_link', queryText: text }).catch(() => {});
                  navigate(`/results?q=${encodeURIComponent(text)}`);
                }}
                className="text-teal hover:text-teal-dark text-sm font-medium underline underline-offset-4 transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink/5">
          <p className="text-xs text-ink-subtle text-center leading-relaxed">
            Always research-backed. Always free.<br />
            Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
