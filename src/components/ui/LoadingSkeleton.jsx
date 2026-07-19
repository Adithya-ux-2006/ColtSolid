import { cn } from '../../utils/cn';

export function LoadingSkeleton({ count = 1, className }) {
  return (
    <div role="status" aria-label="Loading content" className="space-y-16 md:space-y-20">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        <div className="w-40 h-40 md:w-52 md:h-52 rounded-full bg-mint animate-pulse shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <div className="flex gap-2 justify-center md:justify-start">
            <div className="h-6 w-20 bg-mint rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-mint rounded-full animate-pulse" />
          </div>
          <div className="h-10 w-64 bg-mint rounded-lg animate-pulse mx-auto md:mx-0" />
          <div className="flex gap-3 justify-center md:justify-start">
            <div className="h-5 w-24 bg-mint rounded-lg animate-pulse" />
            <div className="h-5 w-20 bg-mint rounded-lg animate-pulse" />
          </div>
          <div className="h-4 w-72 bg-mint/60 rounded-lg animate-pulse mx-auto md:mx-0" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2.5 animate-pulse py-2">
            <div className="w-10 h-10 rounded-xl bg-mint" />
            <div className="h-4 w-16 bg-mint rounded" />
            <div className="h-3 w-12 bg-mint/60 rounded" />
          </div>
        ))}
      </div>

      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'section-card animate-pulse space-y-5',
            className
          )}
        >
          <div className="h-6 w-32 bg-mint rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-mint rounded" />
            <div className="h-4 w-4/5 bg-mint rounded" />
            <div className="h-4 w-3/4 bg-mint rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
