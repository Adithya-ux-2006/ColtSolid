import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout';
import { SearchBar } from '../components/forms/SearchBar';
import { trackSearchEvent } from '../utils/analytics';

const SYMPTOM_CARDS = [
  { label: 'Eye Pain', emoji: '👁️', remedy: 'Visine' },
  { label: 'Headache', emoji: '🤕', remedy: 'Tylenol' },
  { label: 'Anxiety', emoji: '🧘', remedy: 'Ashwagandha' },
  { label: 'Insomnia', emoji: '🌙', remedy: 'Melatonin' },
  { label: 'Cold & Flu', emoji: '🤧', remedy: 'Zinc Lozenges' },
];

export function SymptomSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (term) => {
    const query = (term || searchTerm).trim();
    if (!query) return;
    trackSearchEvent({ source: term ? 'symptom_card' : 'search_input', queryText: query }).catch(() => {});
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <PageWrapper className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-6 py-16 max-w-2xl mx-auto w-full">
        <h1 className="text-display font-bold text-ink mb-2">
          Feel Better,
          <br />
          Naturally.
        </h1>
        <p className="text-lg text-ink-muted mb-10 leading-relaxed">
          Evidence-backed remedies for common symptoms.{' '}
          <span className="text-primary font-medium">No sign-up needed.</span>
        </p>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => handleSearch()}
          placeholder="Search symptoms..."
          className="mb-12"
        />

        <div>
          <p className="text-sm font-medium text-ink-muted mb-4">Popular symptoms</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYMPTOM_CARDS.map((item) => (
              <button
                key={item.label}
                onClick={() => { setSearchTerm(item.label); handleSearch(item.label); }}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all text-center"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-sm font-semibold text-ink">{item.label}</span>
                <span className="text-[10px] text-ink-subtle">{item.remedy}</span>
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
