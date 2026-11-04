'use client';
import { useEffect, useState } from 'react';
import { useCategories } from '@/lib/queries';
import { Skeleton } from '@/components/ui/Feedback';
import { cn } from '@/lib/format';

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const COLLECTIONS = [
  { value: 'new-drop', label: 'New Drops' },
  { value: 'best-seller', label: 'Best Sellers' },
  { value: 'summer-edit', label: 'Summer Edit' },
  { value: 'featured', label: 'Featured' },
];
const PRICE_PRESETS = [
  { label: 'Under PKR 2,000', min: '', max: '2000' },
  { label: 'PKR 2,000 – 3,500', min: '2000', max: '3500' },
  { label: 'Over PKR 3,500', min: '3500', max: '' },
];

function Group({ title, children }) {
  return (
    <div className="py-5 border-b border-brand-border first:pt-0">
      <h4 className="label mb-3">{title}</h4>
      {children}
    </div>
  );
}

const optionClass = (active) =>
  cn(
    'w-full text-left text-sm py-1.5 flex items-center justify-between transition-colors',
    active ? 'text-brand-blue font-semibold' : 'text-brand-slate hover:text-brand-ink'
  );

export default function FilterPanel({ filters, onChange, onClear }) {
  const { data: categories, isLoading } = useCategories();
  const [price, setPrice] = useState({ min: filters.minPrice || '', max: filters.maxPrice || '' });

  // Keep the inputs in sync when filters change from elsewhere (chips, clear all)
  useEffect(() => {
    setPrice({ min: filters.minPrice || '', max: filters.maxPrice || '' });
  }, [filters.minPrice, filters.maxPrice]);

  const selectedSizes = filters.size ? filters.size.split(',') : [];
  const toggleSize = (size) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onChange({ size: next.join(',') });
  };

  return (
    <div>
      <Group title="Category">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-3/4" />
            ))}
          </div>
        ) : (
          <ul>
            <li>
              <button className={optionClass(!filters.category)} onClick={() => onChange({ category: '' })}>
                All products
              </button>
            </li>
            {categories?.filter((c) => c.productCount > 0 || c.slug === filters.category).map((c) => (
              <li key={c._id}>
                <button className={optionClass(filters.category === c.slug)} onClick={() => onChange({ category: c.slug })}>
                  {c.name}
                  <span className="text-xs text-brand-mutedGray font-normal">{c.productCount}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Group>

      <Group title="Collection">
        <ul>
          {COLLECTIONS.map((t) => (
            <li key={t.value}>
              <button
                className={optionClass(filters.tags === t.value)}
                onClick={() => onChange({ tags: filters.tags === t.value ? '' : t.value })}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Size">
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                'h-9 text-xs font-semibold border rounded-sm transition-colors',
                selectedSizes.includes(size)
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'border-brand-border text-brand-slate hover:border-brand-ink'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Price">
        <ul className="mb-3">
          {PRICE_PRESETS.map((p) => {
            const active = (filters.minPrice || '') === p.min && (filters.maxPrice || '') === p.max;
            return (
              <li key={p.label}>
                <button
                  className={optionClass(active)}
                  onClick={() => onChange(active ? { minPrice: '', maxPrice: '' } : { minPrice: p.min, maxPrice: p.max })}
                >
                  {p.label}
                </button>
              </li>
            );
          })}
        </ul>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onChange({ minPrice: price.min, maxPrice: price.max });
          }}
        >
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={price.min}
            onChange={(e) => setPrice((p) => ({ ...p, min: e.target.value }))}
            className="input h-9 text-xs"
          />
          <span className="text-brand-mutedGray">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={price.max}
            onChange={(e) => setPrice((p) => ({ ...p, max: e.target.value }))}
            className="input h-9 text-xs"
          />
          <button type="submit" className="h-9 px-3 text-xs font-semibold bg-brand-ink text-white rounded-sm hover:bg-brand-blue">
            Go
          </button>
        </form>
      </Group>

      <Group title="Availability">
        <label className="flex items-center gap-2.5 text-sm text-brand-slate cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => onChange({ inStock: e.target.checked ? 'true' : '' })}
            className="w-4 h-4 accent-brand-blue"
          />
          In stock only
        </label>
      </Group>

      <button onClick={onClear} className="mt-5 text-xs font-semibold tracking-wide uppercase text-brand-slate hover:text-brand-blue">
        Clear all filters
      </button>
    </div>
  );
}
