import { Suspense } from 'react';
import AdminProducts from '@/components/admin/AdminProducts';

export default function AdminProductsPage() {
  return (
    <Suspense>
      <AdminProducts />
    </Suspense>
  );
}
