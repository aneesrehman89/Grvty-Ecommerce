import React from 'react';
import Link from 'next/link';

const SHOP_LINKS = [
  { href: '/shop?category=t-shirts', label: 'T-Shirts' },
  { href: '/shop?category=hoodies', label: 'Hoodies' },
  { href: '/shop?category=joggers', label: 'Joggers' },
  { href: '/shop?category=shorts', label: 'Shorts' },
];

const HELP_LINKS = [
  { href: '/shop?tags=new-drop', label: 'New Drops' },
  { href: '/shop?tags=best-seller', label: 'Best Sellers' },
  { href: '/cart', label: 'Cart' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-brand-white border-t border-brand-border px-6 py-10 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-brand-border">
        <div className="col-span-2 md:col-span-2 space-y-3">
          <Link href="/" className="font-display text-2xl tracking-[0.2em] inline-flex items-center gap-1 hover:opacity-80 transition-opacity">
            GRVTY<span className="text-brand-blue">.</span>
          </Link>
          <p className="text-sm text-brand-mutedGray max-w-xs">
            Performance streetwear for men who live between the gym and the streets.
          </p>
          <p className="text-sm text-brand-mutedGray font-mono">support@grvty.store</p>
        </div>
        <div>
          <h4 className="label">Shop</h4>
          <ul className="space-y-2 text-sm text-brand-slate">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-blue transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="label">Explore</h4>
          <ul className="space-y-2 text-sm text-brand-slate">
            {HELP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-blue transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 pt-6">
        <p className="text-xs text-brand-mutedGray">&copy; {new Date().getFullYear()} GRVTY. All rights reserved.</p>

        {/* Social Icons */}
        <div className="flex items-center space-x-4 text-brand-slate">
          <a href="#" aria-label="Instagram" className="hover:text-brand-blue transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3.5" strokeWidth="1.6" />
              <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-brand-blue transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2.5" y="5.5" width="19" height="13" rx="3" strokeWidth="1.6" />
              <path d="M10.5 9.5l4 2.5-4 2.5v-5z" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="#" aria-label="Twitter / X" className="hover:text-brand-blue transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 4l16 16M20 4L4 20" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
