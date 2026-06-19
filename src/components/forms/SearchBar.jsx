import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SearchBar({ value, onChange, onSearch, placeholder = "Search symptoms...", className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-center bg-white rounded-full shadow-soft border border-surface/50">
        <Search className="absolute left-5 h-5 w-5 text-ink-muted pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && onSearch) onSearch(); }}
          placeholder={placeholder}
          className="w-full bg-transparent pl-12 pr-4 py-4 text-base text-ink placeholder-ink-muted focus:outline-none"
        />
      </div>
      {onSearch && (
        <button
          onClick={onSearch}
          className="w-full mt-3 bg-primary text-white rounded-full py-4 font-semibold text-base hover:bg-primary-dark transition-colors shadow-glow"
        >
          Search Remedies
        </button>
      )}
    </div>
  );
}
