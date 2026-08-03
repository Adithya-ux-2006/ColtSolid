import { useState, useMemo } from 'react';
import { Search, ExternalLink, X, Database } from 'lucide-react';
import { cn } from '../../utils/cn';
import { KAGGLE_DATASETS, DATASET_FILTERS } from '../../data/kaggleDatasets';

function DatasetCard({ dataset }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 hover:shadow-soft transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-kaggle/10 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-kaggle" />
          </div>
          <span className="text-xs font-semibold text-kaggle bg-kaggle/10 px-2 py-0.5 rounded-full">
            {dataset.provider}
          </span>
        </div>
        <a
          href={dataset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          aria-label={`View ${dataset.title} on Kaggle`}
        >
          View on Kaggle
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <h3 className="font-semibold text-ink mb-2 group-hover:text-primary transition-colors leading-snug">
        {dataset.title}
      </h3>

      <p className="text-sm text-ink-muted mb-4 leading-relaxed">
        {dataset.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {dataset.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface text-ink-muted border border-ink/5"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-ink-muted pt-3 border-t border-ink/5">
        <span>
          <span className="font-medium text-ink">Type:</span> {dataset.dataType}
        </span>
        <span>
          <span className="font-medium text-ink">Area:</span> {dataset.medicalArea}
        </span>
        {dataset.license !== 'Not specified by the dataset publisher' && (
          <span>
            <span className="font-medium text-ink">Licence:</span> {dataset.license}
          </span>
        )}
      </div>
    </article>
  );
}

export function DatasetCatalogue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredDatasets = useMemo(() => {
    return KAGGLE_DATASETS.filter((dataset) => {
      const matchesSearch = !searchTerm ||
        dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = activeFilter === 'all' ||
        dataset.medicalArea === activeFilter ||
        dataset.dataType === activeFilter ||
        dataset.tags.some(tag => tag === activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  return (
    <section className="rounded-3xl bg-card border border-border overflow-hidden shadow-soft" role="region" aria-label="Kaggle Datasets">
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-kaggle/10 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-kaggle" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Research Datasets</h2>
            <p className="text-sm text-ink-muted mt-1">
              Relevant Kaggle datasets for blood clot research and medical imaging.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search datasets..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              aria-label="Search datasets"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {DATASET_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                activeFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-surface text-ink-muted hover:bg-primary/10 hover:text-primary border border-ink/5'
              )}
            >
              {filter.label}
            </button>
          ))}
          {activeFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-danger hover:bg-danger/10 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredDatasets.length === 0 ? (
          <div className="text-center py-8">
            <Database className="w-10 h-10 text-ink-muted mx-auto mb-3" />
            <p className="font-semibold text-ink">No datasets found</p>
            <p className="text-sm text-ink-muted mt-1">
              Try a different search term or clear the filters.
            </p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
              className="mt-3 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        )}

        <p className="text-xs text-ink-muted mt-6 pt-4 border-t border-ink/5 leading-relaxed">
          These datasets are provided for learning and research. Availability, licensing and access requirements are controlled by the original dataset publishers.
        </p>
      </div>
    </section>
  );
}
