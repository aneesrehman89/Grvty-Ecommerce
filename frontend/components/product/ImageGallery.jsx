'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons';
import { cn } from '@/lib/format';

export default function ImageGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  const go = (dir) => setActive((i) => (i + dir + images.length) % images.length);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      on: true,
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:w-20 flex-shrink-0">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                'relative w-16 md:w-20 aspect-[4/5] flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors bg-brand-surface',
                i === active ? 'border-brand-ink' : 'border-transparent hover:border-brand-border'
              )}
            >
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image with hover zoom */}
      <div
        className="relative flex-1 aspect-[4/5] bg-brand-darkGray rounded-md overflow-hidden cursor-zoom-in group"
        onMouseMove={handleMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
      >
        <img
          key={images[active]}
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          className="absolute inset-0 w-full h-full object-cover animate-fadeSoft transition-transform duration-200"
          style={{
            transform: zoom.on ? 'scale(1.8)' : 'scale(1)',
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-card opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-card opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="absolute bottom-3 right-3 text-[11px] font-semibold bg-white/90 text-brand-ink px-2 py-1 rounded-sm">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
