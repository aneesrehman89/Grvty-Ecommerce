'use client';
import { cn } from '@/lib/format';

export default function QuantityStepper({ value, onChange, min = 1, max = 20, size = 'md', disabled }) {
  const sizes = size === 'sm' ? 'h-8 text-xs' : 'h-11 text-sm';
  const btn = 'w-8 h-full flex items-center justify-center text-brand-slate hover:text-brand-ink disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div className={cn('inline-flex items-center border border-brand-border rounded-sm', sizes)}>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        &minus;
      </button>
      <span className="w-8 text-center font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
