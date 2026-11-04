'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons';
import { cn } from '@/lib/format';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1600&h=900&fit=crop&q=80',
    alt: 'Man training with a GRVTY dumbbell',
    eyebrow: 'New Drop — Phase 01',
    title: 'Move with',
    highlight: 'Purpose.',
    copy: 'Performance streetwear built for men who live between the gym and the streets. No compromises. No noise. Just gear for the grind.',
    primary: { label: 'Shop the Drop', href: '/shop?tags=new-drop' },
    secondary: { label: 'Train Edit', href: '/shop?category=athletic-wear' },
  },
  {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&h=900&fit=crop&q=80',
    alt: 'Athlete training in GRVTY gear',
    eyebrow: 'Best Sellers',
    title: 'Proven in',
    highlight: 'the Gym.',
    copy: 'The pieces the brotherhood keeps coming back for — heavyweight tees, core hoodies and joggers that take a beating.',
    primary: { label: 'Shop Best Sellers', href: '/shop?tags=best-seller' },
    secondary: { label: 'Hoodies', href: '/shop?category=hoodies' },
  },
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=900&fit=crop&q=80',
    alt: 'Gym floor with weights',
    eyebrow: 'Summer Edit',
    title: 'Light. Fast.',
    highlight: 'Built Hot.',
    copy: 'Breathable tanks, quick-dry shorts and essential tees for sessions that run hot.',
    primary: { label: 'Shop Summer Edit', href: '/shop?tags=summer-edit' },
    secondary: { label: 'Shorts', href: '/shop?category=shorts' },
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 6000);
    return () => clearInterval(id);
  }, [paused, go]);

  const slide = SLIDES[index];

  return (
    <div
      className="relative w-full h-[480px] md:h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <img
        key={slide.image}
        src={slide.image}
        alt={slide.alt}
        className="absolute inset-0 w-full h-full object-cover object-[70%_center] animate-fadeSoft"
      />
      {/* Light fade so the dark text block stays legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />

      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute z-20 left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-brand-border flex items-center justify-center text-brand-ink hover:bg-white transition-colors shadow-card"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute z-20 right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-brand-border flex items-center justify-center text-brand-ink hover:bg-white transition-colors shadow-card"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.image}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-5 bg-brand-blue' : 'w-1.5 bg-brand-ink/30'
            )}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div key={index} className="max-w-lg space-y-5 animate-fadeSoft">
          <span className="text-[11px] tracking-[0.2em] font-bold text-brand-mutedGray uppercase">{slide.eyebrow}</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-brand-ink leading-[1.05]">
            {slide.title}
            <br />
            <span className="text-brand-blue">{slide.highlight}</span>
          </h1>
          <p className="text-sm md:text-[15px] text-brand-slate max-w-md leading-relaxed">{slide.copy}</p>
          <div className="flex items-center gap-3 pt-2">
            <Link href={slide.primary.href} className="btn-primary">
              {slide.primary.label} <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href={slide.secondary.href} className="btn-outline">
              {slide.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
