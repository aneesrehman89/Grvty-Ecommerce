import Link from 'next/link';
import { formatPrice, discountPercent, cn } from '@/lib/format';
import { Skeleton } from '@/components/ui/Feedback';

/**
 * Product tile used on the homepage, shop grid and related products.
 * `variant="square"` matches the Best Sellers layout, default is the 4:5 Latest Drops card.
 */
export default function ProductCard({ product, variant = 'portrait' }) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.inStock === false;
  const isNew = product.tags?.includes('new-drop');
  const hoverImage = product.images?.[1];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="premium-border-glow bg-white rounded-md overflow-hidden flex flex-col group"
    >
      <div
        className={cn(
          'bg-brand-darkGray w-full relative overflow-hidden',
          variant === 'square' ? 'aspect-square' : 'aspect-[4/5]'
        )}
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className={cn(
            'absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-500',
            hoverImage && 'group-hover:opacity-0'
          )}
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {soldOut && (
            <span className="bg-white text-brand-ink text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              Sold out
            </span>
          )}
          {!soldOut && discount > 0 && (
            <span className="bg-brand-blue text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              -{discount}%
            </span>
          )}
          {!soldOut && isNew && (
            <span className="bg-white/90 text-brand-ink text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
              New
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="block text-center w-full bg-white text-brand-ink py-2.5 font-semibold text-[11px] tracking-wide uppercase rounded-sm group-hover:bg-brand-blue group-hover:text-white transition-colors">
            View Product
          </span>
        </div>
      </div>

      <div className="p-4 space-y-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
          <h3 className="text-sm font-semibold text-brand-ink leading-tight">{product.name}</h3>
          <div className="sm:text-right flex items-baseline gap-2 sm:block">
            <span className="text-sm font-semibold text-brand-ink whitespace-nowrap">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span className="block text-[11px] text-brand-mutedGray line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-brand-mutedGray line-clamp-1">
          {product.category?.name}
          {product.numReviews > 0 && (
            <>
              {' '}
              &middot; <span className="text-brand-orange">★</span> {product.rating.toFixed(1)} ({product.numReviews})
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton({ variant = 'portrait' }) {
  return (
    <div className="bg-white rounded-md overflow-hidden border border-brand-border/60">
      <Skeleton className={cn('rounded-none w-full', variant === 'square' ? 'aspect-square' : 'aspect-[4/5]')} />
      <div className="p-4 space-y-2">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading, count = 8, variant, className }) {
  return (
    <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6', className)}>
      {isLoading
        ? Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} variant={variant} />)
        : products?.map((p) => <ProductCard key={p._id} product={p} variant={variant} />)}
    </div>
  );
}
