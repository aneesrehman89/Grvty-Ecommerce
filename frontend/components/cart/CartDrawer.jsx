'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore, selectCartCount, selectSubtotal } from '@/store/cartStore';
import { useLockBodyScroll, useMounted } from '@/lib/hooks';
import { formatPrice } from '@/lib/format';
import { CloseIcon } from '@/components/ui/Icons';
import CartLineItem from './CartLineItem';
import FreeShippingBar from './FreeShippingBar';

export default function CartDrawer() {
  const mounted = useMounted();
  const pathname = usePathname();
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectSubtotal);

  useLockBodyScroll(isOpen);

  // Close on route change and on Escape
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={closeCart} />
      <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white flex flex-col animate-slideInRight shadow-2xl">
        <header className="flex items-center justify-between px-5 h-16 border-b border-brand-border">
          <h2 className="text-sm font-semibold tracking-widest uppercase">
            Your Cart <span className="text-brand-mutedGray">({count})</span>
          </h2>
          <button onClick={closeCart} aria-label="Close cart" className="p-1 hover:text-brand-blue">
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-sm text-brand-mutedGray mt-1">Gear up — the grind won&apos;t wait.</p>
            <Link href="/shop" onClick={closeCart} className="btn-primary mt-6">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-brand-border">
              <FreeShippingBar subtotal={subtotal} />
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} compact onNavigate={closeCart} />
              ))}
            </div>
            <footer className="border-t border-brand-border p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-slate">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-brand-mutedGray">Shipping calculated at checkout.</p>
              <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
                Checkout
              </Link>
              <Link href="/cart" onClick={closeCart} className="btn-outline w-full">
                View Cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
