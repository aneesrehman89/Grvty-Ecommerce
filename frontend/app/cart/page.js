'use client';
import Link from 'next/link';
import { useCartStore, selectSubtotal } from '@/store/cartStore';
import { useMounted } from '@/lib/hooks';
import { formatPrice, shippingFor } from '@/lib/format';
import CartLineItem from '@/components/cart/CartLineItem';
import FreeShippingBar from '@/components/cart/FreeShippingBar';
import { EmptyState, Skeleton } from '@/components/ui/Feedback';

export default function CartPage() {
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);
  const shipping = shippingFor(subtotal);

  if (!mounted) {
    return (
      <div className="container-page py-10 space-y-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Looks like you haven't added anything yet."
        actionHref="/shop"
        actionLabel="Start Shopping"
      />
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="divide-y divide-brand-border border-y border-brand-border">
          {items.map((item) => (
            <div key={item.id} className="py-6">
              <CartLineItem item={item} />
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-28 self-start bg-brand-offwhite border border-brand-border rounded-md p-6 space-y-4">
          <h2 className="text-sm font-semibold tracking-widest uppercase">Order Summary</h2>
          <FreeShippingBar subtotal={subtotal} />
          <dl className="space-y-2 text-sm pt-2">
            <div className="flex justify-between">
              <dt className="text-brand-slate">Subtotal</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-slate">Shipping</dt>
              <dd className="font-semibold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-brand-border pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold">{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary w-full">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="block text-center text-xs font-semibold tracking-wide uppercase text-brand-slate hover:text-brand-blue">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
