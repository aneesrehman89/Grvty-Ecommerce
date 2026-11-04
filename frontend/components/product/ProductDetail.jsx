'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useProduct, useRelatedProducts } from '@/lib/queries';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, discountPercent, cn, FREE_SHIPPING_THRESHOLD } from '@/lib/format';
import { EmptyState, ErrorState, Skeleton, Spinner, Stars, SectionHeader } from '@/components/ui/Feedback';
import { TruckIcon, ReturnIcon, ShieldIcon } from '@/components/ui/Icons';
import QuantityStepper from '@/components/ui/QuantityStepper';
import Accordion from '@/components/ui/Accordion';
import ImageGallery from './ImageGallery';
import ProductReviews from './ProductReviews';
import { ProductGrid } from './ProductCard';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const LOW_STOCK = 5;

function DetailSkeleton() {
  return (
    <div className="container-page py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <Skeleton className="aspect-[4/5]" />
      <div className="space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export default function ProductDetail({ slug }) {
  const { data: product, isLoading, isError, error, refetch } = useProduct(slug);
  const { data: related, isLoading: relatedLoading } = useRelatedProducts(slug);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);

  const colors = useMemo(() => [...new Set(product?.variants.map((v) => v.color) || [])], [product]);

  // Default to the first colour that has stock
  useEffect(() => {
    if (!product) return;
    const firstInStock = product.variants.find((v) => v.stock > 0) || product.variants[0];
    setColor(firstInStock.color);
    setSize(null);
    setQuantity(1);
  }, [product]);

  const sizesForColor = useMemo(
    () =>
      (product?.variants.filter((v) => v.color === color) || []).sort(
        (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
      ),
    [product, color]
  );

  const selectedVariant = sizesForColor.find((v) => v.size === size);
  const maxQty = Math.min(selectedVariant?.stock || 1, 20);

  if (isLoading) return <DetailSkeleton />;
  if (isError) {
    return error?.status === 404 ? (
      <EmptyState
        title="Product not found"
        message="This product may have been removed or is no longer available."
        actionHref="/shop"
        actionLabel="Back to shop"
      />
    ) : (
      <ErrorState message={error?.message} onRetry={refetch} />
    );
  }

  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setShowSizeError(true);
      return;
    }
    setAdding(true);
    try {
      await addItem({ product, variant: selectedVariant, quantity });
      toast.success(`${product.name} added to cart`);
      openCart();
      setQuantity(1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="container-page py-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-brand-mutedGray mb-6 flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-ink">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-ink">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-ink">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-brand-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          <ImageGallery images={product.images} name={product.name} />

          <div className="md:sticky md:top-28 self-start space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">
                {product.category?.name}
              </span>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-brand-ink">{product.name}</h1>
              {product.numReviews > 0 && (
                <a href="#reviews" className="flex items-center gap-2 text-xs text-brand-slate hover:text-brand-ink">
                  <Stars value={product.rating} /> {product.rating.toFixed(1)} · {product.numReviews} reviews
                </a>
              )}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-semibold text-brand-ink">{formatPrice(product.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-sm text-brand-mutedGray line-through">{formatPrice(product.compareAtPrice)}</span>
                    <span className="text-[11px] font-bold tracking-widest uppercase bg-brand-blue text-white px-2 py-0.5 rounded-sm">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-brand-slate leading-relaxed">{product.description}</p>

            {/* Colour */}
            <div>
              <p className="label">
                Colour: <span className="text-brand-ink normal-case tracking-normal font-semibold">{color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => {
                  const hasStock = product.variants.some((v) => v.color === c && v.stock > 0);
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c);
                        setSize(null);
                        setQuantity(1);
                      }}
                      className={cn(
                        'px-4 h-10 text-xs font-semibold border rounded-sm transition-colors',
                        c === color ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-border hover:border-brand-ink',
                        !hasStock && 'opacity-40 line-through'
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between">
                <p className="label">
                  Size {size && <span className="text-brand-ink normal-case tracking-normal font-semibold">: {size}</span>}
                </p>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {sizesForColor.map((v) => {
                  const out = v.stock === 0;
                  return (
                    <button
                      key={v._id}
                      disabled={out}
                      onClick={() => {
                        setSize(v.size);
                        setShowSizeError(false);
                        setQuantity((q) => Math.min(q, v.stock));
                      }}
                      title={out ? 'Out of stock' : `${v.stock} in stock`}
                      aria-label={`Size ${v.size}${out ? ' — out of stock' : ''}`}
                      aria-pressed={size === v.size}
                      className={cn(
                        'h-11 text-xs font-semibold border rounded-sm transition-colors relative',
                        size === v.size
                          ? 'border-brand-ink bg-brand-ink text-white'
                          : 'border-brand-border hover:border-brand-ink',
                        out && 'text-brand-mutedGray/60 cursor-not-allowed hover:border-brand-border bg-brand-offwhite line-through'
                      )}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
              <div className="min-h-[20px] mt-2 text-xs">
                {showSizeError && !selectedVariant && <p className="text-red-600">Please select a size.</p>}
                {selectedVariant && selectedVariant.stock <= LOW_STOCK && (
                  <p className="text-brand-orange font-semibold">Only {selectedVariant.stock} left in this size — order soon.</p>
                )}
                {selectedVariant && selectedVariant.stock > LOW_STOCK && (
                  <p className="text-green-700">In stock and ready to ship.</p>
                )}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-stretch gap-3">
              <QuantityStepper value={quantity} onChange={setQuantity} max={maxQty} disabled={!selectedVariant} />
              <button
                onClick={handleAddToCart}
                disabled={adding || !product.inStock}
                className="btn-primary flex-1"
              >
                {adding ? <Spinner /> : product.inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-slate">
              <li className="flex items-center gap-2">
                <TruckIcon className="w-4 h-4 text-brand-blue" /> Free over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </li>
              <li className="flex items-center gap-2">
                <ReturnIcon className="w-4 h-4 text-brand-blue" /> 7-day easy returns
              </li>
              <li className="flex items-center gap-2">
                <ShieldIcon className="w-4 h-4 text-brand-blue" /> Cash on delivery
              </li>
            </ul>

            <Accordion
              items={[
                {
                  title: 'Details & Fit',
                  content: product.details?.length ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  ) : (
                    product.description
                  ),
                },
                {
                  title: 'Shipping & Returns',
                  content: (
                    <p>
                      Delivery in 3–5 working days across Pakistan. Free shipping on orders over{' '}
                      {formatPrice(FREE_SHIPPING_THRESHOLD)}. Unworn items can be returned within 7 days of delivery.
                    </p>
                  ),
                },
                {
                  title: 'Care',
                  content: <p>Machine wash cold, inside out. Do not tumble dry. Do not iron directly on prints.</p>,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <ProductReviews product={product} />

      {(relatedLoading || related?.length > 0) && (
        <section className="container-page py-16 border-t border-brand-border">
          <SectionHeader eyebrow="You may also like" title="Complete the Fit" href={`/shop?category=${product.category?.slug}`} />
          <ProductGrid products={related} isLoading={relatedLoading} count={4} />
        </section>
      )}
    </>
  );
}
