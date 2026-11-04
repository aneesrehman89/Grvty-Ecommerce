'use client';
import { cn } from '@/lib/format';
import { ChevronLeft, ChevronRight } from './Icons';

// Compact page list: 1 … 4 5 6 … 12
const pageList = (page, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['…', p] : [p]));
};

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const item = 'min-w-9 h-9 px-2 flex items-center justify-center text-xs font-semibold rounded-sm border transition-colors';

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label="Pagination">
      <button
        className={cn(item, 'border-brand-border text-brand-slate hover:border-brand-ink disabled:opacity-30')}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-brand-mutedGray">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              item,
              p === page
                ? 'bg-brand-ink text-white border-brand-ink'
                : 'border-brand-border text-brand-slate hover:border-brand-ink'
            )}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        className={cn(item, 'border-brand-border text-brand-slate hover:border-brand-ink disabled:opacity-30')}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
