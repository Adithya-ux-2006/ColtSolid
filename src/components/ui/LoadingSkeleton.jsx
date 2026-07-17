import { cn } from '../../utils/cn';

export function LoadingSkeleton({ count = 1, className }) {
  return (
    <div role="status" aria-label="Loading content" className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-mint rounded-full animate-pulse" />
        <div className="h-10 w-48 bg-mint rounded-2xl animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-mint rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-mint rounded-full animate-pulse" />
        </div>
      </div>

      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-white rounded-[2rem] p-6 shadow-soft animate-pulse',
            className
          )}
        >
          <div className="md:flex md:gap-6">
            <div className="md:w-[45%]">
              <div className="w-full aspect-square bg-mint rounded-3xl" />
            </div>
            <div className="flex-1 mt-4 md:mt-0 space-y-3">
              <div className="h-5 w-20 bg-mint rounded-full" />
              <div className="h-7 w-3/4 bg-mint rounded-lg" />
              <div className="h-4 w-full bg-mint rounded-lg" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-28 bg-mint rounded-xl" />
                <div className="h-8 w-20 bg-mint rounded-lg" />
                <div className="h-8 w-24 bg-mint rounded-lg" />
              </div>
              <div className="h-11 w-full bg-mint rounded-xl mt-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
