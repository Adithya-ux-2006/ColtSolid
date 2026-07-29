import { ShieldCheck } from 'lucide-react';

const TRUST_ITEMS = [
  { label: 'Free to use', icon: ShieldCheck },
  { label: 'Research-backed', icon: ShieldCheck },
  { label: 'Trusted by everyone', icon: ShieldCheck },
];

export function TrustBadges({ className = '' }) {
  return (
    <p className={`text-sm font-medium text-ink-muted flex flex-wrap justify-center gap-x-4 gap-y-1 ${className}`}>
      {TRUST_ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <item.icon className="w-4 h-4 text-primary" /> {item.label}
        </span>
      ))}
    </p>
  );
}
