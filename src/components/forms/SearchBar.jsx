import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SearchBar({ value, onChange, onSearch, placeholder = "Search symptoms...", className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-center bg-white rounded-2xl shadow-soft">
        <Search className="absolute left-5 h-6 w-6 text-ink-muted pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && onSearch) onSearch(); }}
          placeholder={placeholder}
          className="w-full bg-transparent pl-14 pr-4 py-5 text-lg text-ink placeholder-ink-muted focus:outline-none"
        />
      </div>
      {onSearch && (
        <button
          onClick={onSearch}
          className="w-full mt-3 bg-coral text-white rounded-2xl py-4 font-semibold text-lg hover:bg-coral-dark transition-colors shadow-coral"
        >
          Search Remedies
        </button>
      )}
    </div>
  );
}
