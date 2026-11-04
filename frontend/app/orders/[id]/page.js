import { Suspense } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import OrderDetail from '@/components/orders/OrderDetail';

export const metadata = { title: 'Order Details' };

export default function OrderPage({ params }) {
  return (
    <RequireAuth>
      <Suspense>
        <OrderDetail id={params.id} />
      </Suspense>
    </RequireAuth>
  );
}
