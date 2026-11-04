'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCategories } from '@/lib/queries';
import { useSaveProduct } from '@/lib/accountQueries';
import { Spinner } from '@/components/ui/Feedback';
import { TrashIcon } from '@/components/ui/Icons';
import { SIZES, COLLECTIONS } from '@/components/shop/FilterPanel';

const emptyVariant = () => ({ size: 'M', color: '', stock: 0 });

const toFormState = (p) => ({
  name: p?.name || '',
  description: p?.description || '',
  details: p?.details?.join('\n') || '',
  price: p?.price ?? '',
  compareAtPrice: p?.compareAtPrice ?? '',
  category: p?.category?._id || p?.category || '',
  images: p?.images?.join('\n') || '',
  tags: p?.tags || [],
  isActive: p?.isActive ?? true,
  variants: p?.variants?.map(({ _id, size, color, stock }) => ({ _id, size, color, stock })) || [emptyVariant()],
});

export default function ProductForm({ product }) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const saveProduct = useSaveProduct();
  const [form, setForm] = useState(() => toFormState(product));

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setVariant = (i, key, value) =>
    setForm((f) => ({ ...f, variants: f.variants.map((v, idx) => (idx === i ? { ...v, [key]: value } : v)) }));

  const toggleTag = (tag) =>
    setForm((f) => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      details: form.details.split('\n').map((s) => s.trim()).filter(Boolean),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === '' ? null : Number(form.compareAtPrice),
      category: form.category,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: form.tags,
      isActive: form.isActive,
      variants: form.variants.map((v) => ({ ...v, color: v.color.trim(), stock: Number(v.stock) })),
    };

    const duplicate = new Set();
    for (const v of body.variants) {
      const key = `${v.color.toLowerCase()}-${v.size}`;
      if (duplicate.has(key)) return toast.error(`Duplicate variant: ${v.color} / ${v.size}`);
      duplicate.add(key);
    }

    try {
      await saveProduct.mutateAsync({ id: product?._id, body });
      toast.success(product ? 'Product updated' : 'Product created');
      router.push('/admin/products');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/admin/products" className="text-xs text-brand-mutedGray hover:text-brand-ink">
            &larr; Products
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{product ? 'Edit product' : 'New product'}</h1>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="accent-brand-blue w-4 h-4"
          />
          Visible in store
        </label>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Name</label>
          <input id="name" required value={form.name} onChange={set('name')} className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" required rows={4} value={form.description} onChange={set('description')} className="input h-auto py-2.5" />
        </div>
        <div>
          <label className="label" htmlFor="price">Price (PKR)</label>
          <input id="price" type="number" min="0" required value={form.price} onChange={set('price')} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="compareAtPrice">Compare-at price (optional)</label>
          <input id="compareAtPrice" type="number" min="0" value={form.compareAtPrice} onChange={set('compareAtPrice')} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" required value={form.category} onChange={set('category')} className="input">
            <option value="">Select a category</option>
            {categories?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="label">Collections</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {COLLECTIONS.map((t) => (
              <label key={t.value} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" checked={form.tags.includes(t.value)} onChange={() => toggleTag(t.value)} className="accent-brand-blue" />
                {t.label}
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="images">Image URLs (one per line)</label>
          <textarea id="images" required rows={3} value={form.images} onChange={set('images')} className="input h-auto py-2.5 font-mono text-xs" />
          {form.images.trim() && (
            <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
              {form.images
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((src) => (
                  <img key={src} src={src} alt="" className="w-14 h-16 object-cover rounded-sm bg-brand-surface flex-shrink-0" />
                ))}
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="details">Details & fit bullets (one per line)</label>
          <textarea id="details" rows={3} value={form.details} onChange={set('details')} className="input h-auto py-2.5" />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-widest uppercase">Variants & stock</h2>
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }))}
            className="text-xs font-semibold uppercase tracking-wide text-brand-blue"
          >
            + Add variant
          </button>
        </div>
        <div className="space-y-2">
          {form.variants.map((v, i) => (
            <div key={v._id || i} className="grid grid-cols-[1fr_90px_90px_32px] gap-2">
              <input
                placeholder="Colour"
                required
                value={v.color}
                onChange={(e) => setVariant(i, 'color', e.target.value)}
                className="input h-10"
              />
              <select value={v.size} onChange={(e) => setVariant(i, 'size', e.target.value)} className="input h-10">
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                required
                value={v.stock}
                onChange={(e) => setVariant(i, 'stock', e.target.value)}
                className="input h-10"
                aria-label="Stock"
              />
              <button
                type="button"
                disabled={form.variants.length === 1}
                onClick={() => setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))}
                className="text-brand-mutedGray hover:text-red-600 disabled:opacity-30"
                aria-label="Remove variant"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saveProduct.isPending} className="btn-primary">
          {saveProduct.isPending ? <Spinner /> : product ? 'Save changes' : 'Create product'}
        </button>
        <Link href="/admin/products" className="btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
