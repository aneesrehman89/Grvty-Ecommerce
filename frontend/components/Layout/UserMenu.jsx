'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/lib/session';
import { useMounted } from '@/lib/hooks';
import { UserIcon } from '@/components/ui/Icons';

export default function UserMenu() {
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!mounted || !user) {
    return (
      <Link href="/login" className="p-2 text-brand-ink hover:text-brand-blue transition-colors" aria-label="Log in">
        <UserIcon className="w-5 h-5" />
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: ['account'] });
    queryClient.removeQueries({ queryKey: ['admin'] });
    setOpen(false);
    toast.success('Logged out');
    router.push('/');
  };

  const item = 'block w-full text-left px-4 py-2.5 text-sm text-brand-slate hover:bg-brand-offwhite hover:text-brand-ink';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 p-1.5 text-brand-ink hover:text-brand-blue transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="w-7 h-7 rounded-full bg-brand-ink text-white text-xs font-semibold flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-brand-border rounded-md shadow-cardHover py-2 animate-fadeIn"
        >
          <div className="px-4 py-2 border-b border-brand-border mb-1">
            <p className="text-sm font-semibold text-brand-ink truncate">{user.name}</p>
            <p className="text-xs text-brand-mutedGray truncate">{user.email}</p>
          </div>
          <Link href="/account" className={item} onClick={() => setOpen(false)}>
            My Orders
          </Link>
          <Link href="/account?tab=profile" className={item} onClick={() => setOpen(false)}>
            Profile & Security
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin" className={item} onClick={() => setOpen(false)}>
              Admin Dashboard
            </Link>
          )}
          <button onClick={handleLogout} className={`${item} border-t border-brand-border mt-1`}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
