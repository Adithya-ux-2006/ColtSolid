import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { CategoryTag } from './CategoryTag';

export function RemedyCard({ remedy, className, featured }) {
  if (featured) {
    return (
      <Link
        to={`/remedy/${remedy.id}`}
        className={cn(
          "block bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <CategoryTag category={remedy.category} />
          <span className="text-xs font-medium text-coral">Featured</span>
        </div>
        <h3 className="text-xl font-semibold text-ink mb-2">{remedy.name}</h3>
        <p className="text-ink-muted mb-4">{remedy.shortDescription}</p>
        <div className="flex items-center gap-4 text-sm text-ink-muted">
          <span className="flex items-center gap-1">{remedy.timeToEffect}</span>
          <span className="flex items-center gap-1">{remedy.difficulty}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/remedy/${remedy.id}`}
      className={cn(
        "block bg-white rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <CategoryTag category={remedy.category} className="mb-2" />
          <h3 className="text-base font-semibold text-ink truncate">{remedy.name}</h3>
        </div>
      </div>
      <p className="text-sm text-ink-muted mt-1 line-clamp-1">{remedy.shortDescription}</p>
      <div className="flex items-center gap-3 mt-3 text-xs text-ink-muted">
        <span>{remedy.timeToEffect}</span>
      </div>
    </Link>
  );
}
