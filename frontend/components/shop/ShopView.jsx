'use client';
import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCategories, useProducts } from '@/lib/queries';
import { ProductGrid } from '@/components/product/ProductCard';
import { EmptyState, ErrorState, Spinner } from '@/components/ui/Feedback';
import Pagination from '@/components/ui/Pagination';
import { CloseIcon, FilterIcon } from '@/components/ui/Icons';
import { useLockBodyScroll } from '@/lib/hooks';
import FilterPanel, { COLLECTIONS } from './FilterPanel';

const FILTER_KEYS = ['category', 'tags', 'size', 'minPrice', 'maxPrice', 'inStock', 'q', 'sort', 'page'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popularity', label: 'Most popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function ShopView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  useLockBodyScroll(filtersOpen);

  // The URL is the single source of truth for filters → shareable, back-button friendly
  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) || ''])),
    [searchParams]
  );

  const params = useMemo(() => ({ ...filters, page: filters.page || 1, limit: 12 }), [filters]);
  const { data, isLoading, isFetching, isError, refetch } = useProducts(params);
  const { data: categories } = useCategories();

  const updateFilters = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      if (!('page' in patch)) next.delete('page'); // new filters → back to page 1
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      if ('page' in patch) window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => router.replace(pathname, { scroll: false });

  const categoryName = categories?.find((c) => c.slug === filters.category)?.name;
  const collectionName = COLLECTIONS.find((t) => t.value === filters.tags)?.label;
  const title = filters.q ? `Results for “${filters.q}”` : categoryName || collectionName || 'All Products';

  // Active filter chips
  const chips = [
    filters.q && { key: 'q', label: `Search: ${filters.q}` },
    categoryName && { key: 'category', label: categoryName },
    collectionName && { key: 'tags', label: collectionName },
    filters.size && { key: 'size', label: `Size: ${filters.size.replace(/,/g, ', ')}` },
    (filters.minPrice || filters.maxPrice) && {
      key: 'price',
      label: `PKR ${filters.minPrice || 0} – ${filters.maxPrice || '∞'}`,
    },
    filters.inStock && { key: 'inStock', label: 'In stock' },
  ].filter(Boolean);

  const removeChip = (key) =>
    key === 'price' ? updateFilters({ minPrice: '', maxPrice: '' }) : updateFilters({ [key]: '' });

  const pagination = data?.pagination;

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">Shop</span>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-brand-ink">{title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <FilterPanel filters={filters} onChange={updateFilters} onClear={clearAll} />
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-brand-border">
            <div className="flex items-center gap-3">
              <button onClick={() => setFiltersOpen(true)} className="lg:hidden btn-outline !px-4 !py-2.5">
                <FilterIcon className="w-4 h-4" /> Filters
              </button>
              <p className="text-sm text-brand-mutedGray flex items-center gap-2">
                {pagination ? `${pagination.total} ${pagination.total === 1 ? 'product' : 'products'}` : 'Loading…'}
                {isFetching && !isLoading && <Spinner className="w-3 h-3 text-brand-blue" />}
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm text-brand-slate">
              Sort by
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => updateFilters({ sort: e.target.value === 'newest' ? '' : e.target.value })}
                className="h-9 px-2 text-sm border border-brand-border rounded-sm bg-white focus:outline-none focus:border-brand-ink"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => removeChip(chip.key)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-surface text-brand-ink px-3 py-1.5 rounded-full hover:bg-brand-border transition-colors"
                >
                  {chip.label}
                  <CloseIcon className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {isError ? (
            <ErrorState message="We couldn't load products right now." onRetry={refetch} />
          ) : !isLoading && data?.products.length === 0 ? (
            <EmptyState title="No products found" message="Try removing a filter or searching for something else.">
              <button onClick={clearAll} className="btn-primary mt-6">
                Clear filters
              </button>
            </EmptyState>
          ) : (
            <div className={isFetching && !isLoading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
              <ProductGrid
                products={data?.products}
                isLoading={isLoading}
                count={12}
                className="lg:!grid-cols-3"
              />
            </div>
          )}

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={(page) => updateFilters({ page: page > 1 ? String(page) : '' })}
            />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white animate-slideInLeft flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-brand-border">
              <h3 className="text-sm font-semibold tracking-widest uppercase">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel filters={filters} onChange={updateFilters} onClear={clearAll} />
            </div>
            <div className="p-5 border-t border-brand-border">
              <button onClick={() => setFiltersOpen(false)} className="btn-dark w-full">
                Show {pagination?.total ?? ''} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
