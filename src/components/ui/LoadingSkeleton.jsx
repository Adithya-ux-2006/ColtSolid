import { cn } from '../../utils/cn';

export function LoadingSkeleton({ count = 1, className }) {
  return (
    <div role="status" aria-label="Loading content" className="space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
        <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-mint animate-pulse shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <div className="flex gap-2 justify-center md:justify-start">
            <div className="h-6 w-20 bg-mint rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-mint rounded-full animate-pulse" />
          </div>
          <div className="h-9 w-56 bg-mint rounded-lg animate-pulse mx-auto md:mx-0" />
          <div className="flex gap-3 justify-center md:justify-start">
            <div className="h-5 w-24 bg-mint rounded-lg animate-pulse" />
            <div className="h-5 w-20 bg-mint rounded-lg animate-pulse" />
          </div>
          <div className="h-4 w-64 bg-mint/60 rounded-lg animate-pulse mx-auto md:mx-0" />
        </div>
      </div>

      <div className="section-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-mint" />
              <div className="h-4 w-16 bg-mint rounded" />
              <div className="h-3 w-12 bg-mint/60 rounded" />
            </div>
          ))}
        </div>
      </div>

      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'section-card animate-pulse space-y-4',
            className
          )}
        >
          <div className="h-5 w-32 bg-mint rounded" />
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
