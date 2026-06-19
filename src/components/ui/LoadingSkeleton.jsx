import { cn } from '../../utils/cn';

export function LoadingSkeleton({ count = 1, className }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-white rounded-3xl p-6 shadow-soft animate-pulse",
            className
          )}
        >
          <div className="h-5 w-20 bg-surface rounded-full mb-4" />
          <div className="h-6 w-3/4 bg-surface rounded-lg mb-3" />
          <div className="h-4 w-full bg-surface rounded-lg" />
        </div>
      ))}
    </>
  );
}
