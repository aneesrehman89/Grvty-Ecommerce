'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import QuantityStepper from '@/components/ui/QuantityStepper';
import { TrashIcon } from '@/components/ui/Icons';
import { formatPrice, cn } from '@/lib/format';

export default function CartLineItem({ item, compact = false, onNavigate }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn('flex gap-4', busy && 'opacity-60 pointer-events-none')}>
      <Link
        href={`/products/${item.slug}`}
        onClick={onNavigate}
        className={cn('relative flex-shrink-0 bg-brand-surface rounded-sm overflow-hidden', compact ? 'w-20 h-24' : 'w-24 h-28')}
      >
        <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            onClick={onNavigate}
            className="text-sm font-semibold text-brand-ink leading-tight hover:text-brand-blue line-clamp-2"
          >
            {item.name}
          </Link>
          <span className="text-sm font-semibold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
        </div>
        <p className="text-xs text-brand-mutedGray mt-1">
          {item.color} / {item.size}
          {!compact && <> &middot; {formatPrice(item.price)} each</>}
        </p>
        {item.stock <= 5 && (
          <p className="text-[11px] text-brand-orange font-semibold mt-0.5">Only {item.stock} left</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <QuantityStepper
            size="sm"
            value={item.quantity}
            max={Math.min(item.stock, 20)}
            onChange={(q) => run(() => updateQuantity(item.id, q))}
          />
          <button
            onClick={() => run(() => removeItem(item.id))}
            className="text-brand-mutedGray hover:text-red-600 transition-colors p-1"
            aria-label={`Remove ${item.name}`}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
