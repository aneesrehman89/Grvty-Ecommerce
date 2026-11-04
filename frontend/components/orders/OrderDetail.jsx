'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useOrder, useCancelOrder } from '@/lib/accountQueries';
import { useAuthStore } from '@/store/authStore';
import { formatDate, formatPrice, cn } from '@/lib/format';
import { EmptyState, Skeleton, Spinner } from '@/components/ui/Feedback';
import { CheckIcon } from '@/components/ui/Icons';
import OrderStatusBadge from './OrderStatusBadge';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STEP_LABELS = { pending: 'Placed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };

function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
        This order was cancelled.
      </div>
    );
  }
  const current = STEPS.indexOf(status);
  return (
    <ol className="grid grid-cols-4">
      {STEPS.map((step, i) => (
        <li key={step} className="flex flex-col items-center text-center relative">
          {i > 0 && (
            <span
              className={cn('absolute top-3.5 right-1/2 w-full h-0.5 -z-0', i <= current ? 'bg-brand-blue' : 'bg-brand-border')}
            />
          )}
          <span
            className={cn(
              'relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2',
              i <= current ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-brand-border text-brand-mutedGray'
            )}
          >
            {i < current || status === 'delivered' ? <CheckIcon className="w-3.5 h-3.5" /> : i + 1}
          </span>
          <span className={cn('text-[11px] font-semibold mt-2', i <= current ? 'text-brand-ink' : 'text-brand-mutedGray')}>
            {STEP_LABELS[step]}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function OrderDetail({ id }) {
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get('placed') === '1';
  const user = useAuthStore((s) => s.user);
  const { data: order, isLoading, isError } = useOrder(id);
  const cancel = useCancelOrder();

  if (isLoading) {
    return (
      <div className="container-page py-10 space-y-4 max-w-4xl">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !order) {
    return <EmptyState title="Order not found" message="We couldn't find this order." actionHref="/account" actionLabel="My Orders" />;
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? Items will be released back to stock.')) return;
    try {
      await cancel.mutateAsync(order._id);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // `user` is populated on GET but a plain id in the create-order response
  const ownerId = order.user?._id || order.user;
  const isOwner = ownerId === user?._id;

  return (
    <div className="container-page py-10 max-w-4xl">
      {justPlaced && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-md p-5 flex gap-4 items-start">
          <span className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
            <CheckIcon className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-semibold text-green-800">Thank you, your order is confirmed!</h2>
            <p className="text-sm text-green-700 mt-0.5">
              We&apos;ll call you on {order.shippingAddress.phone} to confirm delivery. Pay in cash when it arrives.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <Link href={user?.role === 'admin' && !isOwner ? '/admin/orders' : '/account'} className="text-xs text-brand-mutedGray hover:text-brand-ink">
            &larr; Back to orders
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">Order {order.orderNumber}</h1>
          <p className="text-sm text-brand-mutedGray">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {isOwner && order.status === 'pending' && (
            <button onClick={handleCancel} disabled={cancel.isPending} className="btn-outline !py-2 !px-4">
              {cancel.isPending ? <Spinner /> : 'Cancel order'}
            </button>
          )}
        </div>
      </div>

      <div className="mb-10">
        <StatusTimeline status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <section className="border border-brand-border rounded-md divide-y divide-brand-border">
          {order.items.map((item) => (
            <div key={item._id} className="flex gap-4 p-4">
              <Link href={`/products/${item.slug}`} className="relative w-16 h-20 flex-shrink-0 bg-brand-surface rounded-sm overflow-hidden">
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="text-sm font-semibold hover:text-brand-blue">
                  {item.name}
                </Link>
                <p className="text-xs text-brand-mutedGray">
                  {item.color} / {item.size} &middot; Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </section>

        <aside className="space-y-6">
          <div className="bg-brand-offwhite border border-brand-border rounded-md p-5">
            <h3 className="label">Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-slate">Subtotal</dt>
                <dd>{formatPrice(order.itemsPrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-slate">Shipping</dt>
                <dd>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</dd>
              </div>
              <div className="flex justify-between border-t border-brand-border pt-2 font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.totalPrice)}</dd>
              </div>
            </dl>
            <p className="text-xs text-brand-mutedGray mt-3">
              Cash on Delivery &middot; {order.isPaid ? 'Paid' : 'Payment due on delivery'}
            </p>
          </div>
          <div className="bg-brand-offwhite border border-brand-border rounded-md p-5 text-sm">
            <h3 className="label">Shipping to</h3>
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p className="text-brand-slate">{order.shippingAddress.address}</p>
            <p className="text-brand-slate">
              {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </p>
            <p className="text-brand-slate">{order.shippingAddress.phone}</p>
            {order.notes && <p className="text-xs text-brand-mutedGray mt-2">Note: {order.notes}</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
