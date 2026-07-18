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
          <div className="flex flex-col md:flex-row h-[400px]">
            <div className="md:w-[25%] flex items-center justify-center p-8 bg-mint/30">
              <div className="w-[180px] h-[180px] rounded-full bg-mint/60" />
            </div>
            <div className="md:w-[45%] p-8 flex flex-col gap-3">
              <div className="h-5 w-20 bg-mint rounded-full" />
              <div className="h-9 w-48 bg-mint rounded-lg" />
              <div className="h-4 w-full bg-mint rounded-lg" />
              <div className="h-4 w-3/4 bg-mint rounded-lg" />
              <div className="flex gap-6 mt-auto">
                <div className="h-4 w-24 bg-mint rounded" />
                <div className="h-4 w-20 bg-mint rounded" />
                <div className="h-4 w-24 bg-mint rounded" />
              </div>
              <div className="h-14 w-full bg-mint rounded-2xl mt-2" />
            </div>
            <div className="md:w-[30%] bg-mint/40 px-8 py-9">
              <div className="h-3 w-32 bg-mint/80 rounded mb-5" />
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
