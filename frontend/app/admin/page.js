'use client';
import Link from 'next/link';
import { useAdminStats } from '@/lib/accountQueries';
import { formatDate, formatPrice } from '@/lib/format';
import { ErrorState, Skeleton } from '@/components/ui/Feedback';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function StatCard({ label, value }) {
  return (
    <div className="border border-brand-border rounded-md p-5 bg-white">
      <p className="text-[11px] font-bold tracking-widest uppercase text-brand-mutedGray">{label}</p>
      <p className="text-2xl font-semibold tracking-tight mt-1">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, isError, refetch } = useAdminStats();

  if (isError) return <ErrorState message="Couldn't load dashboard stats." onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <StatCard label="Revenue" value={formatPrice(data.totalRevenue)} />
            <StatCard label="Orders" value={data.totalOrders} />
            <StatCard label="Active products" value={data.totalProducts} />
            <StatCard label="Customers" value={data.totalCustomers} />
          </>
        )}
      </div>

      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}`}
              className="flex items-center gap-2 border border-brand-border rounded-sm px-3 py-2 hover:border-brand-ink"
            >
              <OrderStatusBadge status={s} />
              <span className="text-sm font-semibold">{data.ordersByStatus[s] || 0}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="border border-brand-border rounded-md">
          <header className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="text-sm font-semibold tracking-widest uppercase">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-brand-blue">View all</Link>
          </header>
          {isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : data.recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-brand-mutedGray">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {data.recentOrders.map((o) => (
                <li key={o._id}>
                  <Link href={`/orders/${o._id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-brand-offwhite">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{o.orderNumber}</p>
                      <p className="text-xs text-brand-mutedGray truncate">
                        {o.user?.name} &middot; {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={o.status} />
                      <span className="text-sm font-semibold whitespace-nowrap">{formatPrice(o.totalPrice)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-brand-border rounded-md">
          <header className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="text-sm font-semibold tracking-widest uppercase">Low stock</h2>
            <Link href="/admin/products?lowStock=true" className="text-xs font-semibold text-brand-blue">Manage stock</Link>
          </header>
          {isLoading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : data.lowStock.length === 0 ? (
            <p className="p-5 text-sm text-brand-mutedGray">All variants are well stocked.</p>
          ) : (
            <ul className="divide-y divide-brand-border">
              {data.lowStock.map((v) => (
                <li key={v.variantId} className="flex items-center gap-3 px-5 py-3">
                  <img src={v.image} alt="" className="w-9 h-11 object-cover rounded-sm bg-brand-surface" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{v.name}</p>
                    <p className="text-xs text-brand-mutedGray">
                      {v.color} / {v.size}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold ${v.stock === 0 ? 'text-red-600' : 'text-brand-orange'}`}>
                    {v.stock === 0 ? 'Out' : `${v.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
