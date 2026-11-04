'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useMounted } from '@/lib/hooks';
import { EmptyState, Spinner } from '@/components/ui/Feedback';

/**
 * Client-side route guard. Auth lives in localStorage (persisted Zustand),
 * so the check runs after mount; the API still enforces auth on every request.
 */
export default function RequireAuth({ children, admin = false }) {
  const mounted = useMounted();
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (mounted && !token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, token, router, pathname]);

  if (!mounted || !token) {
    return (
      <div className="flex justify-center py-32 text-brand-blue">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (admin && user?.role !== 'admin') {
    return (
      <EmptyState
        title="Admins only"
        message="You don't have permission to view this page."
        actionHref="/"
        actionLabel="Back to store"
      />
    );
  }

  return children;
}
