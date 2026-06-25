import React from 'react';
import { CATEGORIES, CORE_PRODUCTS, BEST_SELLERS, REVIEWS } from '@/data/homePage';
import brandStoryImg from '@/assets/brand-story.jpg';


export default function Page() {
  return (
    <div className="w-full bg-brand-white min-h-screen">

      {/* 1. Hero Section */}
      <section className="relative w-full border-b border-brand-border overflow-hidden">
        <div className="relative w-full h-[480px] md:h-[560px]">
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1600&h=900&fit=crop&q=80"
            alt="Man training with a GRVTY dumbbell"
            className="absolute inset-0 w-full h-full object-cover object-[70%_center]"
          />
          {/* Light fade so the dark text block stays legible, like the reference */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />

          {/* Carousel Arrows */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-brand-border flex items-center justify-center text-brand-ink hover:bg-white transition-colors shadow-card">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-brand-border flex items-center justify-center text-brand-ink hover:bg-white transition-colors shadow-card">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18l6-6-6-6" /></svg>
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ink/30" />
            <span className="w-5 h-1.5 rounded-full bg-brand-blue" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ink/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ink/30" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ink/30" />
          </div>

          {/* Hero Copy */}
          <div className="relative z-10 max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-lg space-y-5">
              <span className="text-[11px] tracking-[0.2em] font-bold text-brand-mutedGray uppercase">
                New Drop — Phase 01
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-brand-ink leading-[1.05]">
                Move with<br />
                <span className="text-brand-blue">Purpose.</span>
              </h1>
              <p className="text-sm md:text-[15px] text-brand-slate max-w-md leading-relaxed">
                Performance streetwear built for men who live between the gym and the streets. No compromises. No noise. Just gear for the grind.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="/shop" className="inline-flex items-center gap-2 bg-brand-blue text-white hover:bg-brand-blueDark font-semibold text-xs tracking-wide uppercase px-6 py-3.5 transition-colors duration-200 rounded-sm">
                  Shop the Drop <span aria-hidden="true">&rarr;</span>
                </a>
                <a href="/shop" className="inline-flex items-center bg-white text-brand-ink border border-brand-border hover:border-brand-ink font-semibold text-xs tracking-wide uppercase px-6 py-3.5 transition-colors duration-200 rounded-sm">
                  Train Edit
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition Strip */}
        <div className="w-full bg-brand-offwhite border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 text-xs sm:text-[13px] text-brand-slate">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 8h11v8H3V8zm11 3h4l3 3v2h-7v-5zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm12 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
              <span><span className="font-semibold text-brand-ink">Free shipping</span> on orders over PKR 5,000</span>
            </div>
            <div className="flex items-center gap-2 sm:justify-center">
              <svg className="w-4 h-4 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0112-4.5M19 15a7 7 0 01-12 4.5" /></svg>
              <span className="font-semibold text-brand-ink">7-day</span><span>&nbsp;easy returns</span>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <svg className="w-4 h-4 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /></svg>
              <span className="font-semibold text-brand-ink">30-day</span><span>&nbsp;quality guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-ink mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <a
              href="/shop"
              key={idx}
              className="group relative aspect-[4/5] overflow-hidden rounded-md bg-brand-darkGray"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute top-3 right-3 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18l6-6-6-6" /></svg>
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/70 mb-0.5">Shop Now</p>
                <h3 className="text-base font-semibold text-white">{cat.name}</h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. Latest Drops */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">Featured</span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-ink">Latest Drops</h2>
          </div>
          <a href="/shop" className="text-xs font-semibold tracking-wide uppercase text-brand-slate hover:text-brand-blue transition-colors flex items-center gap-1">
            View All <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_PRODUCTS.map((prod) => (
            <div key={prod.id} className="premium-border-glow bg-white rounded-md overflow-hidden flex flex-col group">
              <div className="aspect-[4/5] bg-brand-darkGray w-full relative overflow-hidden">
                <img
                  src={prod.img}
                  alt={prod.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 right-3 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <a href="/shop" className="block text-center w-full bg-white text-brand-ink py-2.5 font-semibold text-[11px] tracking-wide uppercase rounded-sm hover:bg-brand-blue hover:text-white transition-colors">
                    View Product
                  </a>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-semibold text-brand-ink leading-tight">{prod.name}</h3>
                  <span className="text-sm font-semibold text-brand-ink whitespace-nowrap">{prod.price}</span>
                </div>
                <p className="text-xs text-brand-mutedGray line-clamp-1">{prod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Best Sellers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-ink mb-8">
          Best Sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BEST_SELLERS.map((prod) => (
            <div key={prod.id} className="premium-border-glow bg-white rounded-md overflow-hidden flex flex-col group">
              <div className="aspect-square bg-brand-darkGray w-full relative overflow-hidden">
                <img
                  src={prod.img}
                  alt={prod.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-semibold text-brand-ink leading-tight">{prod.name}</h3>
                  <span className="text-sm font-semibold text-brand-ink whitespace-nowrap">{prod.price}</span>
                </div>
                <p className="text-xs text-brand-mutedGray line-clamp-1">{prod.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Heritage / Story Block */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
         <div className="aspect-[4/5] overflow-hidden">
            <img
              src={brandStoryImg.src}
              alt="GRVTY brand story"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">Our Story</span>
              <h2 className="font-display text-4xl md:text-6xl tracking-wide leading-none">
              Built for the
              <br />
              <span className="text-brand-blue">grind.</span>
            </h2>
            <p className="text-sm text-brand-slate leading-relaxed max-w-md">
              GRVTY was built for men who live between the gym and the streets. Born from the idea that your clothes shouldn't slow you down — whether you're training at 6am or heading out at night, GRVTY moves with you.
            </p>
            <p className="text-sm text-brand-slate leading-relaxed max-w-md">
              No compromises. No noise. Just gear built for the grind.
            </p>
            <a href="/shop" className="inline-flex items-center gap-2 border border-brand-border text-brand-ink hover:border-brand-ink font-semibold text-xs tracking-wide uppercase px-6 py-3 rounded-sm transition-colors">
              Shop Now <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-1.5 mb-12">
          <span className="text-[11px] font-bold text-brand-blue tracking-widest uppercase">Customer Reviews</span>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-brand-ink">From the Brotherhood</h2>
          <p className="text-sm text-brand-mutedGray">Real words from men putting GRVTY through the grind.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div key={idx} className="bg-brand-offwhite border border-brand-border rounded-md p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-surface flex items-center justify-center text-xs font-semibold text-brand-slate">
                      <img
                        src={rev.img.src}
                        alt={rev.user}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-brand-ink">{rev.user}</h3>
                      <p className="text-[11px] text-brand-mutedGray">{rev.city}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-brand-orange text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < rev.rate ? '★' : '☆'}</span>
                  ))}
                  <span className="text-xs text-brand-mutedGray ml-1.5 font-mono">{rev.rate}.0</span>
                </div>
                <p className="text-[13px] text-brand-slate leading-relaxed">{rev.body}</p>
              </div>
              <p className="text-[11px] font-semibold tracking-wide uppercase text-brand-blue">
                Verified Buyer &middot; {rev.product}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}