import { Suspense } from 'react';
import ShopView from '@/components/shop/ShopView';
import { ProductGrid } from '@/components/product/ProductCard';

export const metadata = {
  title: 'Shop',
  description: 'Shop GRVTY hoodies, tees, joggers, shorts and performance wear.',
};

export default function ShopPage() {
  return (
    // useSearchParams() needs a Suspense boundary for static rendering
    <Suspense
      fallback={
        <div className="container-page py-10">
          <ProductGrid isLoading count={8} />
        </div>
      }
    >
      <ShopView />
    </Suspense>
  );
}
