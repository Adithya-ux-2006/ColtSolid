import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { CategoryTag } from './CategoryTag';
import { AllergyBadge } from './AllergyBadge';

export function RemedyCard({ remedy, className, featured, isSafe = true }) {
  if (featured) {
    return (
      <Link
        to={`/remedy/${remedy.id}`}
        className={cn(
          "block bg-gradient-card rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-shadow",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <CategoryTag category={remedy.category} />
          <span className="text-xs font-medium text-primary-light bg-white/60 px-2.5 py-0.5 rounded-full">Featured</span>
        </div>
        <h3 className="text-xl font-semibold text-ink mb-2">{remedy.name}</h3>
        <p className="text-ink-muted text-sm mb-4">{remedy.shortDescription}</p>
        <div className="flex items-center gap-4 text-sm text-ink-muted">
          <span>{remedy.timeToEffect}</span>
          <span>{remedy.difficulty}</span>
        </div>
        <AllergyBadge isSafe={isSafe} className="mt-4" />
      </Link>
    );
  }

  return (
    <Link
      to={`/remedy/${remedy.id}`}
      className={cn(
        "flex items-center gap-4 bg-white rounded-3xl p-5 shadow-soft hover:shadow-card transition-shadow",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center shrink-0 text-primary-light text-lg font-semibold">
        {remedy.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-ink truncate">{remedy.name}</h3>
        </div>
        <p className="text-xs text-ink-muted">{remedy.timeToEffect}</p>
      </div>
      <AllergyBadge isSafe={isSafe} compact />
    </Link>
  );
}
