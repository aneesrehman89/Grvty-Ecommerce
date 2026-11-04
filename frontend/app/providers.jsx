'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Providers({ children }) {
  // One QueryClient per browser session (not per render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <CartDrawer />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F1111',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '4px',
          },
        }}
      />
    </QueryClientProvider>
  );
}
