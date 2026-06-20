import { useMemo } from 'react';
import DisplayCards from './display-cards';
import { useCatalogStore } from '../../store/catalogStore';
import { Sparkles, ShieldCheck, Zap, Clock } from 'lucide-react';

const categoryIcons = {
  Natural: <Sparkles className="size-4 text-blue-300" />,
  Lifestyle: <ShieldCheck className="size-4 text-green-300" />,
  Ayurveda: <Zap className="size-4 text-amber-300" />,
  TCM: <Clock className="size-4 text-purple-300" />,
};

const categoryStyles = {
  Natural: { icon: 'bg-blue-800', title: 'text-blue-500' },
  Lifestyle: { icon: 'bg-green-800', title: 'text-green-500' },
  Ayurveda: { icon: 'bg-amber-800', title: 'text-amber-500' },
  TCM: { icon: 'bg-purple-800', title: 'text-purple-500' },
};

const stackClasses = [
  '[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[\'\'] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0',
  '[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[\'\'] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0',
  '[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10',
];

function remedyToCardProps(remedy, index) {
  const cat = remedy.category || 'Natural';
  const style = categoryStyles[cat] || categoryStyles.Natural;
  return {
    icon: categoryIcons[cat] || categoryIcons.Natural,
    title: remedy.name || 'Remedy',
    description: remedy.shortDescription?.slice(0, 40) + (remedy.shortDescription?.length > 40 ? '...' : '') || remedy.category || '',
    date: remedy.timeToEffect || `★ ${remedy.rating || ''}`.trim(),
    iconClassName: style.icon,
    titleClassName: style.title,
    className: stackClasses[index % stackClasses.length],
  };
}

export function DisplayCardsRow() {
  const remedies = useCatalogStore((state) => state.remedies);

  const remedyCards = useMemo(() => {
    return remedies
      .filter((r) => r.isFeatured)
      .slice(0, 3)
      .map(remedyToCardProps);
  }, [remedies]);

  const moreCards = useMemo(() => {
    const count = remedyCards.length;
    return remedies
      .filter((r) => !r.isFeatured)
      .slice(0, 3 - count)
      .map((r, i) => remedyToCardProps(r, i + count));
  }, [remedies, remedyCards.length]);

  if (remedyCards.length === 0 && moreCards.length === 0) return null;

  const allCards = remedyCards.length > 0 ? remedyCards : moreCards;
  const extraCards = remedyCards.length > 0 ? moreCards : [];

  return (
    <section className="py-20 px-6 bg-white/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-heading font-semibold text-ink text-center mb-2">
          Evidence-Backed Remedies
        </h2>
        <p className="text-ink-muted text-center mb-12 max-w-xl mx-auto">
          Curated from clinical research across Natural, Lifestyle, Ayurveda, and TCM approaches.
        </p>
        <div className="flex flex-wrap items-start justify-center gap-8 lg:gap-16">
          <DisplayCards cards={allCards} />
          {extraCards.length > 0 && <DisplayCards cards={extraCards} />}
        </div>
      </div>
    </section>
  );
}

export function SymptomDisplayCards({ remedies }) {
  if (!remedies?.length) return null;

  const cards = remedies.slice(0, 6).map(remedyToCardProps);

  const chunks = [];
  for (let i = 0; i < cards.length; i += 3) {
    chunks.push(cards.slice(i, i + 3));
  }

  return (
    <div className="flex flex-wrap items-start justify-center gap-8 lg:gap-16">
      {chunks.map((chunk, i) => (
        <DisplayCards key={i} cards={chunk} />
      ))}
    </div>
  );
}
