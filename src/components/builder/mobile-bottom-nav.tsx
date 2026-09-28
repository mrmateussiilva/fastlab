'use client';

import React from 'react';
import { 
  Plus, 
  Building2, 
  Sliders, 
  Sparkles, 
  Loader2, 
  Box, 
  Play, 
  Pause, 
  Camera, 
  Smartphone 
} from 'lucide-react';
import { GenerationLimitData } from '@/hooks/use-generation-limit';

interface MobileBottomNavProps {
  onOpenItems: () => void;
  onOpenEnvironment: () => void;
  onOpenProperties: () => void;
  onOpenGenerateModal: () => void;
  onOpenARMode: () => void;
  viewMode?: '2d' | '3d';
  onToggleViewMode?: () => void;
  onToggle3DAutoRotate?: () => void;
  is3DAutoRotating?: boolean;
  onCycle3DCamera?: () => void;
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
  onOpenARMode,
  viewMode = '2d',
  onToggleViewMode,
  onToggle3DAutoRotate,
  is3DAutoRotating = false,
  onCycle3DCamera,
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

  // -------------------------------------------------------------------
  // Barra Especial para o MODO 3D no Celular
  // -------------------------------------------------------------------
  if (viewMode === '3d') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-2 flex items-center justify-between gap-1 select-none">
        
        {/* 1. Voltar ao Editor 2D */}
        <button
          type="button"
          onClick={onToggleViewMode}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-600 hover:text-zinc-950 active:bg-zinc-100 transition-colors cursor-pointer"
        >
          <Box className="w-5 h-5 mb-1 text-zinc-700" />
          <span className="text-[9px] font-medium font-sans">Editor 2D</span>
        </button>

        {/* 2. Girar 360° */}
        <button
          type="button"
          onClick={onToggle3DAutoRotate}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            is3DAutoRotating ? 'text-orange-600 font-semibold' : 'text-zinc-600 hover:text-zinc-950 active:bg-zinc-100'
          }`}
        >
          {is3DAutoRotating ? (
            <Pause className="w-5 h-5 mb-1 text-orange-600 animate-pulse" />
          ) : (
            <Play className="w-5 h-5 mb-1" />
          )}
          <span className="text-[9px] font-medium font-sans">
            {is3DAutoRotating ? 'Pausar' : 'Girar 360°'}
          </span>
        </button>

        {/* 3. Alternar Ângulo de Câmera */}
        <button
          type="button"
          onClick={onCycle3DCamera}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-600 hover:text-zinc-950 active:bg-zinc-100 transition-colors cursor-pointer"
        >
          <Camera className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium font-sans">Câmera</span>
        </button>

        {/* 4. Realidade Aumentada (AR na câmera do celular) */}
        <button
          type="button"
          onClick={onOpenARMode}
          className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-600 hover:text-zinc-950 active:bg-zinc-100 transition-colors cursor-pointer"
        >
          <Smartphone className="w-5 h-5 mb-1 text-zinc-700" />
          <span className="text-[9px] font-medium font-sans">Ver em AR</span>
        </button>

        {/* 5. Renderizar com IA a partir do 3D (Destaque Principal) */}
        <button
          type="button"
          onClick={onOpenGenerateModal}
          disabled={isGenerateDisabled}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            isGenerateDisabled
              ? 'text-zinc-400 opacity-50 cursor-not-allowed'
              : 'text-orange-600 font-bold active:scale-95'
          }`}
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 mb-1 animate-spin text-orange-600" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs mb-0.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
          )}
          <span className="text-[9px] font-bold font-sans text-orange-600">
            {isGenerating ? 'Gerando...' : 'Renderizar ✨'}
          </span>
        </button>

      </nav>
    );
  }

  // -------------------------------------------------------------------
  // Barra Padrão para o MODO 2D (Canva)
  // -------------------------------------------------------------------
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 py-2 flex items-center justify-between gap-1 select-none">
      
      {/* 1. Botão Ambiente */}
      <button
        type="button"
        onClick={onOpenEnvironment}
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-600 hover:text-zinc-950 active:bg-zinc-100 transition-colors cursor-pointer"
      >
        <Building2 className="w-5 h-5 mb-1" />
        <span className="text-[9px] font-medium font-sans">Ambiente</span>
      </button>

      {/* 2. Botão 3D */}
      <button
        type="button"
        onClick={onToggleViewMode}
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-600 hover:text-zinc-950 active:bg-zinc-100 transition-colors cursor-pointer"
      >
        <Box className="w-5 h-5 mb-1 text-orange-600" />
        <span className="text-[9px] font-semibold text-orange-600 font-sans">
          Ver em 3D
        </span>
      </button>

      {/* 3. Botão Adicionar (Centro, Destaque) */}
      <div className="flex-1 flex justify-center -mt-6">
        <button
          type="button"
          onClick={onOpenItems}
          className="w-14 h-14 bg-zinc-900 hover:bg-black text-white rounded-full flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* 4. Botão Item (Propriedades) */}
      <button
        type="button"
        onClick={onOpenProperties}
        disabled={!hasSelectedElement}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
          hasSelectedElement
            ? 'text-orange-600 hover:text-orange-700 active:bg-orange-50 relative'
            : 'text-zinc-400 opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="relative">
          <Sliders className="w-5 h-5 mb-1" />
          {hasSelectedElement && (
            <span className="w-2 h-2 rounded-full bg-orange-600 absolute -top-1 -right-1 border-2 border-white" />
          )}
        </div>
        <span className="text-[9px] font-medium font-sans">Item</span>
      </button>

      {/* 5. Botão Gerar */}
      <button
        type="button"
        onClick={onOpenGenerateModal}
        disabled={isGenerateDisabled}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
          isGenerateDisabled
            ? 'text-zinc-400 opacity-50 cursor-not-allowed'
            : 'text-orange-600 hover:text-orange-700 active:bg-orange-50'
        }`}
      >
        {isGenerating ? (
          <Loader2 className="w-5 h-5 mb-1 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5 mb-1" />
        )}
        <span className="text-[9px] font-medium font-sans">
          {isGenerating ? 'Gerando' : 'Gerar ✨'}
        </span>
      </button>

    </nav>
  );
}
