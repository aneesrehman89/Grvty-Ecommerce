'use client';
import { useAdminProduct } from '@/lib/accountQueries';
import ProductForm from '@/components/admin/ProductForm';
import { ErrorState, Skeleton } from '@/components/ui/Feedback';

export default function EditProductPage({ params }) {
  const { data: product, isLoading, isError, error } = useAdminProduct(params.id);

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (isError) return <ErrorState message={error.message} />;

  return <ProductForm product={product} />;
}
