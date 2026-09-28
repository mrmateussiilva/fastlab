'use client';

import React from 'react';
import { LibraryElement } from '@/lib/builder-elements';

interface MobileQuickAddProps {
  items: LibraryElement[];
  onQuickAdd: (item: LibraryElement) => void;
}

export default function MobileQuickAdd({ items, onQuickAdd }: MobileQuickAddProps) {
  return (
    <div className="md:hidden fixed bottom-16 left-0 right-0 z-35 px-3 pb-1 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-2xl shadow-lg px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-medium text-zinc-400 shrink-0 pl-1 pr-0.5 select-none">
          Adicionar rápido:
        </span>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onQuickAdd(item)}
            title={`Adicionar ${item.name} ao cenário`}
            className="shrink-0 px-2.5 h-8 rounded-full bg-zinc-100 text-zinc-700 text-[11px] font-medium font-sans hover:bg-orange-50 hover:text-orange-700 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            + {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
