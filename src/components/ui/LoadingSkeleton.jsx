import { cn } from '../../utils/cn';

export function LoadingSkeleton({ count = 1, className }) {
  return (
    <div role="status" aria-label="Loading content" className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-28 bg-mint rounded-full animate-pulse" />
        <div className="h-14 w-64 bg-mint rounded-2xl animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-mint rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-mint rounded-full animate-pulse" />
          <div className="h-6 w-28 bg-mint rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-56 bg-mint/60 rounded-lg animate-pulse" />
      </div>

      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-card rounded-[28px] border border-border shadow-soft-lg animate-pulse overflow-hidden',
            className
          )}
        >
          <div className="grid grid-cols-1 md:grid-cols-[25%_45%_30%] md:min-h-[400px]">
            <div className="flex items-center justify-center py-8 px-4 bg-mint/30">
              <div className="w-[180px] h-[180px] rounded-full bg-mint/60 shrink-0" />
            </div>
            <div className="p-8 flex flex-col gap-3 min-w-0">
              <div className="h-5 w-20 bg-mint rounded-full" />
              <div className="h-9 w-48 bg-mint rounded-lg" />
              <div className="h-4 w-full bg-mint rounded-lg" />
              <div className="h-4 w-3/4 bg-mint rounded-lg" />
              <div className="grid grid-cols-3 gap-6 w-full mt-6">
                <div className="h-4 w-24 bg-mint rounded" />
                <div className="h-4 w-20 bg-mint rounded" />
                <div className="h-4 w-24 bg-mint rounded" />
              </div>
              <div className="flex-1" />
              <div className="h-14 w-[90%] bg-mint rounded-2xl shrink-0" />
            </div>
            <div className="bg-mint/40 px-8 py-8">
              <div className="h-3 w-32 bg-mint/80 rounded mb-4" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-mint/60 rounded" />
                <div className="h-4 w-4/5 bg-mint/60 rounded" />
                <div className="h-4 w-3/4 bg-mint/60 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
