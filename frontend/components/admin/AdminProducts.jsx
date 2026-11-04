'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminProducts, useSaveProduct } from '@/lib/accountQueries';
import { useDebounce } from '@/lib/hooks';
import { formatPrice, cn } from '@/lib/format';
import { ErrorState, Skeleton, Spinner } from '@/components/ui/Feedback';
import Pagination from '@/components/ui/Pagination';
import StockEditor from './StockEditor';

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [lowStock, setLowStock] = useState(searchParams.get('lowStock') === 'true');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const q = useDebounce(search, 300);

  const { data, isLoading, isFetching, isError, refetch } = useAdminProducts({
    q,
    status,
    lowStock: lowStock ? 'true' : '',
    page,
    limit: 15,
  });
  const saveProduct = useSaveProduct();

  const toggleActive = async (product) => {
    try {
      await saveProduct.mutateAsync({ id: product._id, body: { isActive: !product.isActive } });
      toast.success(product.isActive ? 'Product hidden from store' : 'Product is live');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Products & Stock</h1>
        <Link href="/admin/products/new" className="btn-primary !py-2.5">
          + New product
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products…"
          className="input h-10 max-w-xs"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-10 px-3 text-sm border border-brand-border rounded-sm bg-white"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Hidden</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-brand-slate">
          <input
            type="checkbox"
            checked={lowStock}
            onChange={(e) => {
              setLowStock(e.target.checked);
              setPage(1);
            }}
            className="accent-brand-blue w-4 h-4"
          />
          Low stock only
        </label>
        {isFetching && !isLoading && <Spinner className="text-brand-blue" />}
      </div>

      {isError ? (
        <ErrorState message="Couldn't load products." onRetry={refetch} />
      ) : (
        <div className="border border-brand-border rounded-md overflow-hidden">
          <div className="hidden xl:grid grid-cols-[1fr_110px_100px_90px_170px] gap-4 px-4 py-3 bg-brand-offwhite text-[11px] font-bold tracking-widest uppercase text-brand-mutedGray">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : data.products.length === 0 ? (
            <p className="p-6 text-sm text-brand-mutedGray">No products match these filters.</p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {data.products.map((p) => {
                const outCount = p.variants.filter((v) => v.stock === 0).length;
                return (
                  <li key={p._id}>
                    <div className="grid grid-cols-2 xl:grid-cols-[1fr_110px_100px_90px_170px] gap-4 items-center px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0 col-span-2 xl:col-span-1">
                        <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded-sm bg-brand-surface" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{p.name}</p>
                          <p className="text-xs text-brand-mutedGray">
                            {p.category?.name} &middot; {p.variants.length} variants
                          </p>
                        </div>
                      </div>
                      <span className="text-sm">{formatPrice(p.price)}</span>
                      <span className="text-sm">
                        {p.totalStock}
                        {outCount > 0 && <span className="block text-[11px] text-red-600">{outCount} sold out</span>}
                      </span>
                      <span>
                        <span
                          className={cn(
                            'text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm',
                            p.isActive ? 'bg-green-50 text-green-700' : 'bg-brand-surface text-brand-mutedGray'
                          )}
                        >
                          {p.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </span>
                      <div className="flex justify-end gap-3 text-xs font-semibold uppercase tracking-wide col-span-2 xl:col-span-1">
                        <button
                          onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                          className="uppercase text-brand-blue hover:text-brand-blueDark"
                        >
                          Stock
                        </button>
                        <Link href={`/admin/products/${p._id}`} className="uppercase text-brand-slate hover:text-brand-ink">
                          Edit
                        </Link>
                        <button onClick={() => toggleActive(p)} className="uppercase text-brand-slate hover:text-brand-ink">
                          {p.isActive ? 'Hide' : 'Publish'}
                        </button>
                      </div>
                    </div>
                    {expanded === p._id && <StockEditor product={p} onDone={() => setExpanded(null)} />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {data?.pagination && (
        <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />
      )}
    </div>
  );
}
