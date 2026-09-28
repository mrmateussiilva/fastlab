'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ArrowLeftRight, Sparkles, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ComparePair {
  id: string;
  name: string;
  mockupUrl: string;
  realUrl: string;
  isComparable: boolean; // if false, use toggle instead of slider
}

interface ImageComparatorProps {
  pairs: ComparePair[];
}

export default function ImageComparator({ pairs }: ImageComparatorProps) {
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [showReal, setShowReal] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const activePair = pairs[activePairIndex];

  // Reset state when changing pair
  useEffect(() => {
    setSliderPos(50);
    setShowReal(false);
  }, [activePairIndex]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!activePair.isComparable) return;
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activePair.isComparable) return;
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !activePair.isComparable) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPos(percentage);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!activePair.isComparable) return;
    if (e.key === 'ArrowLeft') setSliderPos(p => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setSliderPos(p => Math.min(100, p + 5));
    if (e.key === 'Home') setSliderPos(0);
    if (e.key === 'End') setSliderPos(100);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div 
        ref={containerRef}
        className="relative w-full max-w-[1000px] aspect-[16/10] md:aspect-[16/9] bg-zinc-100 rounded-xl overflow-hidden shadow-sm border border-zinc-200 select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {activePair.isComparable ? (
          <>
            {/* Mockup Image (Background) */}
            <img 
              src={activePair.mockupUrl} 
              alt={`Mockup do projeto: ${activePair.name}`}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
            
            {/* Real Image (Clipped overlay) */}
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img 
                src={activePair.realUrl} 
                alt={`Visualização com IA do projeto: ${activePair.name}`}
                className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
                style={{ width: containerRef.current ? containerRef.current.clientWidth : '100vw' }}
                draggable={false}
              />
            </div>

            {/* Top Labels */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-600 shadow-sm flex items-center gap-1.5 border border-zinc-200/50 pointer-events-none">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Visualização com IA
            </div>
            
            <div className="absolute top-4 right-4 z-10 bg-zinc-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 border border-zinc-700 pointer-events-none">
              <Layers className="w-3.5 h-3.5" />
              Seu mockup
            </div>

            {/* Slider Line & Handle */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)] z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md border border-zinc-200 text-zinc-500 cursor-ew-resize hover:scale-105 active:scale-95 active:bg-zinc-50 transition-transform touch-none"
                onPointerDown={handlePointerDown}
              >
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </div>

            {/* Hidden native range input for accessibility */}
            <input 
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={handleRangeChange}
              onKeyDown={handleKeyDown}
              aria-label="Comparador de imagens: arraste para alternar entre o mockup e a visualização"
              className="absolute opacity-0 w-full h-full z-30 cursor-ew-resize"
            />
          </>
        ) : (
          /* TOGGLE MODE (for non-comparable images) */
          <>
            <img 
              src={showReal ? activePair.realUrl : activePair.mockupUrl} 
              alt={showReal ? `Visualização com IA do projeto: ${activePair.name}` : `Mockup do projeto: ${activePair.name}`}
              className="absolute inset-0 w-full h-full object-contain bg-white pointer-events-none transition-opacity duration-300"
              draggable={false}
            />
            
            <div className="absolute top-4 left-4 z-10">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5 border backdrop-blur-sm transition-colors ${showReal ? 'bg-white/90 text-zinc-600 border-zinc-200/50' : 'bg-zinc-900/80 text-white border-zinc-700'}`}>
                {showReal ? <Sparkles className="w-3.5 h-3.5 text-orange-600" /> : <Layers className="w-3.5 h-3.5" />}
                {showReal ? 'Visualização com IA' : 'Seu mockup'}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        {activePair.isComparable ? (
          <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-zinc-400" /> Arraste para comparar.
          </p>
        ) : (
          <div className="flex items-center gap-3 bg-zinc-100 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReal(false)}
              className={`h-8 px-4 text-xs font-medium rounded-md transition-all ${!showReal ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Ver mockup
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReal(true)}
              className={`h-8 px-4 text-xs font-medium rounded-md transition-all ${showReal ? 'bg-white shadow-sm text-orange-600' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              Ver com IA
            </Button>
          </div>
        )}
        <p className="text-xs text-zinc-400 max-w-md text-center px-4">
          Visualização com IA para referência criativa. Medidas, materiais e proporções podem variar.
        </p>
      </div>

      {/* Thumbnails if multiple pairs */}
      {pairs.length > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {pairs.map((pair, idx) => (
            <button
              key={pair.id}
              onClick={() => setActivePairIndex(idx)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${idx === activePairIndex ? 'bg-zinc-900 text-white shadow-sm' : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
              aria-label={`Visualizar exemplo: ${pair.name}`}
              aria-pressed={idx === activePairIndex}
            >
              {pair.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
