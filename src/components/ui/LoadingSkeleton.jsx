import { cn } from '../../utils/cn';

export function LoadingSkeleton({ count = 1, className }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "bg-white rounded-2xl p-5 shadow-card animate-pulse flex flex-col h-full",
            className
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-3" />
          <div className="h-4 w-full bg-gray-200 rounded-md mb-2" />
          <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-4" />
          <div className="h-4 w-1/3 bg-gray-200 rounded-md mb-4" />
          <div className="mt-auto h-10 w-full bg-gray-200 rounded-xl" />
        </div>
      ))}
    </>
  );
}
