"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore, selectCartCount } from '@/store/cartStore';
import { useMounted } from '@/lib/hooks';
import { cn } from '@/lib/format';
import { CartIcon, SearchIcon, MenuIcon, CloseIcon } from '@/components/ui/Icons';
import SearchBar from './SearchBar';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop?tags=new-drop', label: 'New Drops' },
  { href: '/shop?tags=best-seller', label: 'Best Sellers' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const mounted = useMounted();
  const count = useCartStore(selectCartCount);
  const openCart = useCartStore((s) => s.openCart);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = (href) => (href === '/' ? pathname === '/' : href === '/shop' && pathname === '/shop');

  return (
    <nav className="w-full bg-brand-white/95 backdrop-blur-md border-b border-brand-border sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          {/* Logo Mark */}
          <Link href="/" className="font-display text-2xl tracking-[0.2em] flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            GRVTY<span className="text-brand-blue">.</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative py-2 transition-colors',
                  isActive(link.href) ? 'text-brand-ink' : 'text-brand-slate hover:text-brand-blue'
                )}
              >
                {link.label}
                {isActive(link.href) && <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-brand-blue" />}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Controls Panel */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className="p-2 text-brand-ink hover:text-brand-blue transition-colors"
            aria-label="Search"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          <button onClick={openCart} className="relative p-2 text-brand-ink hover:text-brand-blue transition-colors" aria-label="Open cart">
            <CartIcon className="w-5 h-5" />
            {mounted && count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-blue text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-brand-ink hover:text-brand-blue transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {searchOpen && <SearchBar onClose={closeSearch} />}

      {/* Mobile Drawer Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-white border-b border-brand-border px-6 py-6 space-y-4 text-sm font-semibold tracking-widest uppercase animate-fadeIn">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn('block', isActive(link.href) ? 'text-brand-ink' : 'text-brand-slate hover:text-brand-blue')}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
