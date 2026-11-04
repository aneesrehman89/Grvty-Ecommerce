'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminOrders, useUpdateOrderStatus } from '@/lib/accountQueries';
import { formatDate, formatPrice, cn } from '@/lib/format';
import { ErrorState, Skeleton, Spinner } from '@/components/ui/Feedback';
import Pagination from '@/components/ui/Pagination';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Mirrors the backend's allowed transitions
const NEXT_STATUSES = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

function StatusControl({ order }) {
  const update = useUpdateOrderStatus();
  const options = NEXT_STATUSES[order.status];

  if (!options.length) return <span className="text-xs text-brand-mutedGray">Final</span>;

  const change = async (status) => {
    if (status === 'cancelled' && !window.confirm(`Cancel order ${order.orderNumber}? Stock will be restored.`)) return;
    try {
      await update.mutateAsync({ id: order._id, status });
      toast.success(`Order marked ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      {update.isPending && <Spinner className="text-brand-blue" />}
      {options.map((s) => (
        <button
          key={s}
          disabled={update.isPending}
          onClick={() => change(s)}
          className={cn(
            'text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1.5 rounded-sm border transition-colors',
            s === 'cancelled'
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white'
          )}
        >
          {s === 'cancelled' ? 'Cancel' : `Mark ${s}`}
        </button>
      ))}
    </div>
  );
}

export default function AdminOrders() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useAdminOrders({ status, page, limit: 15 });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Orders</h1>

      <div className="flex flex-wrap items-center gap-2">
        {['', ...STATUSES].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
            className={cn(
              'text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-sm border',
              status === s ? 'bg-brand-ink border-brand-ink text-white' : 'border-brand-border text-brand-slate hover:border-brand-ink'
            )}
          >
            {s || 'All'}
          </button>
        ))}
        {isFetching && !isLoading && <Spinner className="text-brand-blue ml-2" />}
      </div>

      {isError ? (
        <ErrorState message="Couldn't load orders." onRetry={refetch} />
      ) : (
        <div className="border border-brand-border rounded-md overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : data.orders.length === 0 ? (
            <p className="p-6 text-sm text-brand-mutedGray">No orders found.</p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {data.orders.map((o) => (
                <li key={o._id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_110px_auto] gap-3 items-center px-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/orders/${o._id}`} className="text-sm font-semibold hover:text-brand-blue">
                      {o.orderNumber}
                    </Link>
                    <p className="text-xs text-brand-mutedGray truncate">
                      {o.user?.name || o.shippingAddress.fullName} &middot; {o.shippingAddress.city} &middot;{' '}
                      {formatDate(o.createdAt)} &middot; {o.items.reduce((n, i) => n + i.quantity, 0)} items
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(o.totalPrice)}</span>
                  <span>
                    <OrderStatusBadge status={o.status} />
                  </span>
                  <StatusControl order={o} />
                </li>
              ))}
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
