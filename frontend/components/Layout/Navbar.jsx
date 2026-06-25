"use client";
import React, { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-brand-white/95 backdrop-blur-md border-b border-brand-border sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          {/* Logo Mark */}
          <a href="/" className="font-display text-2xl tracking-[0.2em] flex items-center gap-0.5 hover:opacity-80 transition-opacity">
            GRVTY<span className="text-brand-blue">.</span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase">
            <a href="/" className="text-brand-ink relative py-2 transition-colors">
              Home
            </a>
            <a href="/shop" className="text-brand-slate hover:text-brand-blue py-2 transition-colors">
              Shop
            </a>
          </div>
        </div>

        {/* Action Controls Panel */}
        <div className="flex items-center space-x-6">
          <button className="relative p-2 text-brand-ink hover:text-brand-blue transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 bg-brand-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-brand-ink hover:text-brand-blue transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-white border-b border-brand-border px-6 py-6 space-y-4 text-sm font-semibold tracking-widest uppercase animate-fadeIn">
          <a href="/" className="block text-brand-ink">Home</a>
          <a href="/shop" className="block text-brand-slate hover:text-brand-blue">Shop</a>
        </div>
      )}
    </nav>
  );
}