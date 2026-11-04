'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeftRight, Wand2 } from 'lucide-react';

type Phase = 'mockup' | 'generating' | 'result' | 'compare';

const GENERATION_STEPS = [
  'Lendo a montagem…',
  'Aplicando iluminação…',
  'Renderizando balões e tecidos…',
  'Finalizando detalhes…',
];

const MOCKUP_SRC = '/demo-mockup.png?v=3';
const REAL_SRC = '/demo-real.png?v=3';

function Tag({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`absolute top-3 sm:top-4 z-10 px-3 py-1 rounded-full text-xs font-semibold pointer-events-none ${className}`}>
      {children}
    </span>
  );
}

export default function AIDemoSection() {
  const [phase, setPhase] = useState<Phase>('mockup');
  const [stepIndex, setStepIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const startGeneration = useCallback(() => {
    clearTimers();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setPhase('compare');
      return;
    }
    setPhase('generating');
    setStepIndex(0);
    GENERATION_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStepIndex(i), i * 650));
    });
    const total = GENERATION_STEPS.length * 650;
    timers.current.push(setTimeout(() => setPhase('result'), total));
    timers.current.push(setTimeout(() => { setSliderPos(50); setPhase('compare'); }, total + 1300));
  }, []);

  // Roda a demo uma vez quando ela aparece na tela
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timers.current.push(setTimeout(startGeneration, 900));
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [startGeneration]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const progress = phase === 'generating' ? ((stepIndex + 1) / GENERATION_STEPS.length) * 100 : 100;

  return (
    <div ref={sectionRef} className="w-full">
      <style>{`
        @keyframes fl-scan { from { top: 0%; } to { top: 100%; } }
        @keyframes fl-reveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
      `}</style>

      <div className="relative rounded-2xl overflow-hidden bg-mist ring-1 ring-line">
        {phase !== 'compare' ? (
          <div className="relative aspect-[16/10] sm:aspect-[16/9]">
            <img
              src={MOCKUP_SRC}
              alt="Montagem de festa feita no editor do FestaLab"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${phase === 'generating' ? 'opacity-60' : ''}`}
            />

            {phase === 'mockup' && (
              <>
                <Tag className="left-3 sm:left-4 bg-white text-ink">Sua montagem</Tag>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex justify-center bg-gradient-to-t from-black/45 to-transparent">
                  <button
                    onClick={startGeneration}
                    className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-brand text-white font-semibold text-[15px] hover:bg-brand-deep transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <Wand2 className="w-4 h-4" aria-hidden="true" />
                    Gerar foto com IA
                  </button>
                </div>
              </>
            )}

            {phase === 'generating' && (
              <>
                <div
                  className="absolute inset-x-0 h-0.5 bg-brand shadow-[0_0_16px_4px_rgba(238,90,22,0.45)] pointer-events-none"
                  style={{ animation: 'fl-scan 1.3s ease-in-out infinite alternate' }}
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/60 to-transparent" aria-live="polite">
                  <p className="text-white font-medium text-sm sm:text-base">{GENERATION_STEPS[stepIndex]}</p>
                  <div className="mt-3 h-1 w-full max-w-xs rounded-full bg-white/25 overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-[width] duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </>
            )}

            {phase === 'result' && (
              <img
                src={REAL_SRC}
                alt="Foto realista gerada pela IA a partir da montagem"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ animation: 'fl-reveal 1.1s cubic-bezier(0.22,1,0.36,1) forwards' }}
              />
            )}
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative aspect-[16/10] sm:aspect-[16/9] select-none touch-none cursor-ew-resize"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <img src={MOCKUP_SRC} alt="Montagem feita no editor" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />
            <img
              src={REAL_SRC}
              alt="Foto realista gerada pela IA"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              draggable={false}
            />
            <Tag className="left-3 sm:left-4 bg-brand text-white">Foto da IA</Tag>
            <Tag className="right-3 sm:right-4 bg-white text-ink">Sua montagem</Tag>

            <div className="absolute inset-y-0 w-0.5 bg-white z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md text-ink pointer-events-auto cursor-ew-resize"
                onPointerDown={handlePointerDown}
              >
                <ArrowLeftRight className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Comparar a montagem com a foto gerada pela IA"
              className="absolute inset-0 opacity-0 w-full h-full z-30 cursor-ew-resize"
            />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-ink-soft">
        <p>
          {phase === 'compare'
            ? 'Arraste para comparar a montagem com a foto.'
            : 'Montagem feita no FestaLab em poucos minutos.'}
        </p>
        {phase === 'compare' && (
          <button onClick={startGeneration} className="font-medium text-ink underline underline-offset-4 decoration-line hover:decoration-ink cursor-pointer">
            Ver de novo
          </button>
        )}
      </div>
    </div>
  );
}
