'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/format';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products & Stock' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const isActive = (href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={cn(
            'px-3 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-sm whitespace-nowrap transition-colors',
            isActive(l.href) ? 'bg-brand-ink text-white' : 'text-brand-slate hover:bg-brand-surface hover:text-brand-ink'
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
