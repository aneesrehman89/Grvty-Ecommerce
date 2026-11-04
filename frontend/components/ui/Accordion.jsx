'use client';
import { useState } from 'react';
import { ChevronDown } from './Icons';
import { cn } from '@/lib/format';

export default function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-brand-border">
      {items.map((item, i) => (
        <div key={item.title} className="border-b border-brand-border">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between py-4 text-left text-xs font-bold tracking-widest uppercase text-brand-ink"
            aria-expanded={open === i}
          >
            {item.title}
            <ChevronDown className={cn('w-4 h-4 transition-transform', open === i && 'rotate-180')} />
          </button>
          {open === i && <div className="pb-5 text-sm text-brand-slate leading-relaxed animate-fadeIn">{item.content}</div>}
        </div>
      ))}
    </div>
  );
}
