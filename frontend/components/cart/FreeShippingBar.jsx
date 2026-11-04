import { FREE_SHIPPING_THRESHOLD, formatPrice } from '@/lib/format';

export default function FreeShippingBar({ subtotal }) {
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="space-y-2">
      <p className="text-xs text-brand-slate">
        {remaining > 0 ? (
          <>
            Add <span className="font-semibold text-brand-ink">{formatPrice(remaining)}</span> more for{' '}
            <span className="font-semibold text-brand-ink">free shipping</span>
          </>
        ) : (
          <span className="font-semibold text-green-700">You&apos;ve unlocked free shipping!</span>
        )}
      </p>
      <div className="h-1.5 w-full bg-brand-surface rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${remaining > 0 ? 'bg-brand-blue' : 'bg-green-600'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
