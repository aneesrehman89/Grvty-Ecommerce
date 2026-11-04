import { cn } from '@/lib/format';

const STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-brand-blue border-blue-200',
  shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm border',
        STYLES[status] || 'bg-brand-surface text-brand-slate border-brand-border'
      )}
    >
      {status}
    </span>
  );
}
