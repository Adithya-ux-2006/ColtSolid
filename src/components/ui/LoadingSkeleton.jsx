import { cn } from '../../utils/cn';

export function LoadingSkeleton({ count = 1, className }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-white rounded-2xl p-6 shadow-soft animate-pulse",
            className
          )}
        >
          <div className="h-5 w-20 bg-gray-100 rounded-full mb-4" />
          <div className="h-6 w-3/4 bg-gray-100 rounded-md mb-3" />
          <div className="h-4 w-full bg-gray-100 rounded-md" />
        </div>
      ))}
    </>
  );
}
