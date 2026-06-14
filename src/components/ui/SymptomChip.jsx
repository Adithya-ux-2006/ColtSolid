import { cn } from '../../utils/cn';

export function SymptomChip({ symptom, isSelected, onClick, className }) {
  // Map colors explicitly to avoid purge issues
  const colorStyles = {
    coral: 'bg-coral/10 border-coral text-coral-dark',
    teal: 'bg-teal/10 border-teal text-teal-dark',
    yellow: 'bg-yellow/20 border-yellow text-yellow-dark',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap",
        isSelected 
          ? `${colorStyles[symptom.color]} font-medium` 
          : "bg-white border-transparent shadow-sm hover:shadow text-ink hover:border-gray-200",
        className
      )}
    >
      <span className="text-lg">{symptom.emoji}</span>
      <span>{symptom.label}</span>
    </button>
  );
}
