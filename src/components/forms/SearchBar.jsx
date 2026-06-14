import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';

export function SearchBar({ value, onChange, placeholder = "Search symptoms...", className }) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-ink-muted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all shadow-sm hover:shadow"
        placeholder={placeholder}
      />
    </div>
  );
}
