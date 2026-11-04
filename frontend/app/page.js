import Link from 'next/link';
import { REVIEWS } from '@/data/homePage';
import brandStoryImg from '@/assets/brand-story.jpg';
import HeroCarousel from '@/components/home/HeroCarousel';
import { CategorySection, LatestDropsSection, BestSellersSection } from '@/components/home/HomeSections';
import { TruckIcon, ReturnIcon, ShieldIcon } from '@/components/ui/Icons';

export default function Page() {
  return (
    <div className="w-full bg-brand-white min-h-screen">

      {/* 1. Hero Section */}
      <section className="relative w-full border-b border-brand-border overflow-hidden">
        <HeroCarousel />

        {/* Value Proposition Strip */}
        <div className="w-full bg-brand-offwhite border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-0 text-xs sm:text-[13px] text-brand-slate">
            <div className="flex items-center gap-2">
              <TruckIcon className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span><span className="font-semibold text-brand-ink">Free shipping</span> on orders over PKR 5,000</span>
            </div>
            <div className="flex items-center gap-2 sm:justify-center">
              <ReturnIcon className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span className="font-semibold text-brand-ink">7-day</span><span>&nbsp;easy returns</span>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <ShieldIcon className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span className="font-semibold text-brand-ink">30-day</span><span>&nbsp;quality guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category (live) */}
      <CategorySection />

      {/* 3. Latest Drops (live) */}
      <LatestDropsSection />

      {/* 4. Best Sellers (live) */}
      <BestSellersSection />

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
              GRVTY was built for men who live between the gym and the streets. Born from the idea that your clothes shouldn&apos;t slow you down — whether you&apos;re training at 6am or heading out at night, GRVTY moves with you.
            </p>
            <p className="text-sm text-brand-slate leading-relaxed max-w-md">
              No compromises. No noise. Just gear built for the grind.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 border border-brand-border text-brand-ink hover:border-brand-ink font-semibold text-xs tracking-wide uppercase px-6 py-3 rounded-sm transition-colors">
              Shop Now <span aria-hidden="true">&rarr;</span>
            </Link>
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
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-brand-surface flex items-center justify-center text-xs font-semibold text-brand-slate">
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
