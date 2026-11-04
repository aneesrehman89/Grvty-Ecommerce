'use client';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateStock } from '@/lib/accountQueries';
import { Spinner } from '@/components/ui/Feedback';
import { cn } from '@/lib/format';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Inline per-variant stock editor (colour rows × size columns)
export default function StockEditor({ product, onDone }) {
  const updateStock = useUpdateStock();
  const [values, setValues] = useState(() =>
    Object.fromEntries(product.variants.map((v) => [v._id, String(v.stock)]))
  );

  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color))], [product]);
  const sizes = useMemo(
    () => SIZE_ORDER.filter((s) => product.variants.some((v) => v.size === s)),
    [product]
  );

  const changed = product.variants.filter((v) => String(v.stock) !== values[v._id]);

  const save = async () => {
    const invalid = changed.some((v) => !/^\d+$/.test(values[v._id]));
    if (invalid) return toast.error('Stock must be a whole number ≥ 0');
    try {
      await updateStock.mutateAsync({
        id: product._id,
        variants: changed.map((v) => ({ variantId: v._id, stock: Number(values[v._id]) })),
      });
      toast.success('Stock updated');
      onDone?.();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-brand-offwhite border-t border-brand-border p-4">
      <div className="overflow-x-auto">
        <table className="text-sm">
          <thead>
            <tr>
              <th className="text-left text-[11px] font-bold tracking-widest uppercase text-brand-mutedGray pr-4 pb-2">Colour</th>
              {sizes.map((s) => (
                <th key={s} className="text-[11px] font-bold tracking-widest uppercase text-brand-mutedGray px-1 pb-2">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((color) => (
              <tr key={color}>
                <td className="pr-4 py-1 font-semibold whitespace-nowrap">{color}</td>
                {sizes.map((size) => {
                  const variant = product.variants.find((v) => v.color === color && v.size === size);
                  if (!variant) return <td key={size} className="px-1 text-center text-brand-mutedGray">—</td>;
                  const value = values[variant._id];
                  return (
                    <td key={size} className="px-1 py-1">
                      <input
                        type="number"
                        min="0"
                        value={value}
                        onChange={(e) => setValues((s) => ({ ...s, [variant._id]: e.target.value }))}
                        className={cn(
                          'w-16 h-9 px-2 text-sm text-center border rounded-sm bg-white focus:outline-none focus:border-brand-ink',
                          Number(value) === 0 ? 'border-red-300 text-red-600' : Number(value) <= 5 ? 'border-amber-300' : 'border-brand-border',
                          String(variant.stock) !== value && 'ring-2 ring-brand-blue/30'
                        )}
                        aria-label={`${color} ${size} stock`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button onClick={save} disabled={!changed.length || updateStock.isPending} className="btn-dark !py-2.5">
          {updateStock.isPending ? <Spinner /> : `Save ${changed.length || ''} change${changed.length === 1 ? '' : 's'}`}
        </button>
        <button onClick={onDone} className="text-xs font-semibold uppercase tracking-wide text-brand-slate hover:text-brand-ink">
          Close
        </button>
      </div>
    </div>
  );
}
