import Link from 'next/link';
import { cn } from '@/lib/format';

export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-md', className)} />;
}

export function Spinner({ className }) {
  return (
    <span
      className={cn(
        'inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin',
        className
      )}
      aria-label="Loading"
    />
  );
}

export function Stars({ value = 0, className }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-brand-orange', className)} aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < Math.round(value) ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

export function EmptyState({ title, message, actionHref, actionLabel, children }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-12 h-12 rounded-full bg-brand-surface flex items-center justify-center mb-4 text-brand-mutedGray">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
      {message && <p className="text-sm text-brand-mutedGray mt-1 max-w-sm">{message}</p>}
      {actionHref && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4">
      <p className="text-sm text-brand-slate">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, href, linkLabel = 'View All' }) {
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        {eyebrow && (
          <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">{eyebrow}</span>
        )}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-ink">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs font-semibold tracking-wide uppercase text-brand-slate hover:text-brand-blue transition-colors flex items-center gap-1"
        >
          {linkLabel} <span aria-hidden="true">&rarr;</span>
        </Link>
      )}
    </div>
  );
}
