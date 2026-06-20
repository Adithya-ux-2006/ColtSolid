import DisplayCards from './display-cards';
import { Sparkles, ShieldCheck, Zap, Clock } from 'lucide-react';

const remedyCards = [
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: 'Peppermint Oil',
    description: 'Headache relief in 10-15 min',
    date: 'Research-backed',
    iconClassName: 'text-blue-500',
    titleClassName: 'text-blue-500',
    className:
      '[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[\'\'] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0',
  },
  {
    icon: <ShieldCheck className="size-4 text-green-300" />,
    title: 'Box Breathing',
    description: 'Anxiety calm in 2-5 minutes',
    date: '4.8 ★ rating',
    iconClassName: 'text-green-500',
    titleClassName: 'text-green-500',
    className:
      '[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[\'\'] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0',
  },
  {
    icon: <Zap className="size-4 text-amber-300" />,
    title: 'Zinc Lozenges',
    description: 'Cold duration reduced',
    date: 'Clinically studied',
    iconClassName: 'text-amber-500',
    titleClassName: 'text-amber-500',
    className:
      '[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10',
  },
];

const moreCards = [
  {
    icon: <Clock className="size-4 text-purple-300" />,
    title: 'Sleep Hygiene',
    description: 'Better sleep in 1-3 weeks',
    date: 'CBT-I backed',
    iconClassName: 'text-purple-500',
    titleClassName: 'text-purple-500',
    className:
      '[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[\'\'] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0',
  },
];

export function DisplayCardsRow() {
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
          <DisplayCards cards={remedyCards} />
          <DisplayCards cards={moreCards} />
        </div>
      </div>
    </section>
  );
}
