'use client';

import React from 'react';
import { Plus, Building2, Sliders, Sparkles, Loader2 } from 'lucide-react';
import { GenerationLimitData } from '@/hooks/use-generation-limit';

interface MobileBottomNavProps {
  onOpenItems: () => void;
  onOpenEnvironment: () => void;
  onOpenProperties: () => void;
  onOpenGenerateModal: () => void;
  hasSelectedElement: boolean;
  elementCount: number;
  isGenerating: boolean;
  limitData?: GenerationLimitData;
}

export default function MobileBottomNav({
  onOpenItems,
  onOpenEnvironment,
  onOpenProperties,
  onOpenGenerateModal,
  hasSelectedElement,
  elementCount,
  isGenerating,
  limitData,
}: MobileBottomNavProps) {
  const isGenerateDisabled =
    elementCount === 0 ||
    isGenerating ||
    limitData?.remaining === 0 ||
    limitData?.globalLimitReached;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-3 py-2 flex items-center justify-between gap-1 select-none">
      
      {/* 1. Botão Adicionar Itens / Meus Itens */}
      <button
        type="button"
        onClick={onOpenItems}
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-700 hover:text-zinc-950 active:bg-zinc-100 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 relative">
          <Plus className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-medium font-sans mt-0.5">
          Adicionar
        </span>
      </button>

      {/* 2. Botão Ambiente (Foto, Parede, Piso) */}
      <button
        type="button"
        onClick={onOpenEnvironment}
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-700 hover:text-zinc-950 active:bg-zinc-100 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
          <Building2 className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-medium font-sans mt-0.5">
          Ambiente
        </span>
      </button>

      {/* 3. Botão Propriedades (Item Selecionado) */}
      <button
        type="button"
        onClick={onOpenProperties}
        disabled={!hasSelectedElement}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
          hasSelectedElement
            ? 'text-orange-600 hover:text-orange-700 active:bg-orange-50'
            : 'text-zinc-400 opacity-60 cursor-not-allowed'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center relative ${
            hasSelectedElement ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-500/20' : 'bg-zinc-100 text-zinc-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          {hasSelectedElement && (
            <span className="w-2 h-2 rounded-full bg-orange-600 absolute -top-0.5 -right-0.5" />
          )}
        </div>
        <span className="text-[10px] font-medium font-sans mt-0.5">
          Item
        </span>
      </button>

      {/* 4. Botão Gerar Apresentação / Realista */}
      <button
        type="button"
        onClick={onOpenGenerateModal}
        disabled={isGenerateDisabled}
        className="flex-[1.3] flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-orange-600 active:bg-orange-700 text-white font-medium text-xs font-sans shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-[11px]">Gerando...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gerar</span>
          </>
        )}
      </button>

    </nav>
  );
}
