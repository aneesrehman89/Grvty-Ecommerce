'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/lib/queries';
import { useDebounce } from '@/lib/hooks';
import { formatPrice } from '@/lib/format';
import { SearchIcon, CloseIcon } from '@/components/ui/Icons';
import { Spinner } from '@/components/ui/Feedback';

export default function SearchBar({ onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [term, setTerm] = useState('');
  const debounced = useDebounce(term, 250);
  const { data: results, isFetching } = useSearch(debounced);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (!term.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(term.trim())}`);
    onClose();
  };

  const showResults = debounced.trim().length >= 2;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b border-brand-border shadow-cardHover animate-fadeIn">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={submit} className="flex items-center gap-3 border-b-2 border-brand-ink pb-2">
          <SearchIcon className="w-5 h-5 text-brand-slate" />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search hoodies, tees, joggers…"
            className="flex-1 text-base bg-transparent focus:outline-none placeholder:text-brand-mutedGray"
            aria-label="Search products"
          />
          {isFetching && <Spinner className="text-brand-blue" />}
          <button type="button" onClick={onClose} aria-label="Close search" className="text-brand-slate hover:text-brand-ink">
            <CloseIcon className="w-5 h-5" />
          </button>
        </form>

        {showResults && (
          <div className="pt-3">
            {results?.length === 0 && !isFetching && (
              <p className="text-sm text-brand-mutedGray py-3">No products match “{debounced}”.</p>
            )}
            <ul className="divide-y divide-brand-border">
              {results?.map((p) => (
                <li key={p._id}>
                  <Link
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 py-2.5 hover:bg-brand-offwhite -mx-2 px-2 rounded-sm"
                  >
                    <img src={p.images?.[0]} alt="" className="w-10 h-12 object-cover rounded-sm bg-brand-surface" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-ink truncate">{p.name}</p>
                      <p className="text-xs text-brand-mutedGray">{p.category?.name}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {results?.length > 0 && (
              <button onClick={submit} className="mt-3 text-xs font-semibold tracking-wide uppercase text-brand-blue hover:text-brand-blueDark">
                See all results for “{debounced}” &rarr;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
