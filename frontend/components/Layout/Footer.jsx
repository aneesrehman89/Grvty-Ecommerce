import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-brand-white border-t border-brand-border px-6 py-10 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <a href="/" className="font-display text-2xl tracking-[0.2em] flex items-center gap-1 hover:opacity-80 transition-opacity">
          GRVTY<span className="text-brand-blue">.</span>
        </a>

        <p className="text-sm text-brand-mutedGray font-mono">support@grvty.store</p>

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

        <p className="text-xs text-brand-mutedGray">&copy; 2026 GRVTY. All rights reserved.</p>
      </div>
    </footer>
  );
}