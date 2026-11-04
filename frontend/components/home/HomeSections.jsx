'use client';
import Link from 'next/link';
import { useCategories, useNewArrivals, useProductsByTag } from '@/lib/queries';
import { ProductGrid } from '@/components/product/ProductCard';
import { SectionHeader, Skeleton, ErrorState } from '@/components/ui/Feedback';
import { ChevronRight } from '@/components/ui/Icons';

export function CategorySection() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  return (
    <section className="container-page py-16">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-ink mb-8">Shop by Category</h2>

      {isError ? (
        <ErrorState message="Couldn't load categories." onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)
            : categories
                .filter((cat) => cat.productCount > 0)
                .slice(0, 6)
                .map((cat) => (
                <Link
                  href={`/shop?category=${cat.slug}`}
                  key={cat._id}
                  className="group relative aspect-[3/4] overflow-hidden rounded-md bg-brand-darkGray"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-3 right-3 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/70 mb-0.5">
                      {cat.productCount} {cat.productCount === 1 ? 'Style' : 'Styles'}
                    </p>
                    <h3 className="text-base font-semibold text-white">{cat.name}</h3>
                  </div>
                </Link>
              ))}
        </div>
      )}
    </section>
  );
}

export function LatestDropsSection() {
  const { data, isLoading, isError, refetch } = useNewArrivals(4);

  return (
    <section className="container-page py-10">
      <SectionHeader eyebrow="Featured" title="Latest Drops" href="/shop?sort=newest" />
      {isError ? (
        <ErrorState message="Couldn't load the latest drops." onRetry={refetch} />
      ) : (
        <ProductGrid products={data} isLoading={isLoading} count={4} />
      )}
    </section>
  );
}

export function BestSellersSection() {
  const { data, isLoading, isError, refetch } = useProductsByTag('best-seller', 3);

  return (
    <section className="container-page py-10">
      <SectionHeader title="Best Sellers" href="/shop?tags=best-seller" />
      {isError ? (
        <ErrorState message="Couldn't load best sellers." onRetry={refetch} />
      ) : (
        <ProductGrid
          products={data}
          isLoading={isLoading}
          count={3}
          variant="square"
          className="!grid-cols-1 sm:!grid-cols-3"
        />
      )}
    </section>
  );
}
