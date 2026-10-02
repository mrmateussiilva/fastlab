'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Layers, ArrowLeftRight, Wand2, CheckCircle2 } from 'lucide-react';

type Phase = 'mockup' | 'generating' | 'result' | 'compare';

const GENERATION_STEPS = [
  { label: 'Analisando composição…', pct: 15 },
  { label: 'Identificando elementos…', pct: 32 },
  { label: 'Calculando profundidade…', pct: 51 },
  { label: 'Aplicando iluminação…', pct: 67 },
  { label: 'Renderizando materiais…', pct: 82 },
  { label: 'Finalizando detalhes…', pct: 95 },
  { label: 'Imagem gerada com sucesso!', pct: 100 },
];

function ScanLine() {
  return (
    <div
      className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-80 pointer-events-none"
      style={{
        animation: 'scanline 2.2s ease-in-out infinite',
      }}
    />
  );
}

function ParticleDots() {
  const dots = Array.from({ length: 18 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-orange-400"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0,
            animation: `particle-fade ${1.2 + Math.random() * 1.5}s ease-in-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function AIDemoSection() {
  const [phase, setPhase] = useState<Phase>('mockup');
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Auto-play on scroll into view
  useEffect(() => {
    if (hasAutoPlayed) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAutoPlayed(true);
          setTimeout(() => startGeneration(), 800);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAutoPlayed]);

  function startGeneration() {
    setPhase('generating');
    setStepIndex(0);
    setProgress(0);

    let step = 0;
    const interval = setInterval(() => {
      if (step >= GENERATION_STEPS.length - 1) {
        clearInterval(interval);
        setStepIndex(GENERATION_STEPS.length - 1);
        setProgress(100);
        setTimeout(() => {
          setPhase('result');
          setTimeout(() => setPhase('compare'), 1800);
        }, 600);
        return;
      }
      step++;
      setStepIndex(step);
      setProgress(GENERATION_STEPS[step].pct);
    }, 520);
  }

  function reset() {
    setPhase('mockup');
    setStepIndex(0);
    setProgress(0);
    setSliderPos(50);
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <>
      <style>{`
        @keyframes scanline {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes particle-fade {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes reveal-right {
          from { clip-path: inset(0 100% 0 0); opacity: 0; }
          to { clip-path: inset(0 0% 0 0); opacity: 1; }
        }
        @keyframes shimmer-slide {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px 2px rgba(234,88,12,0.15); }
          50% { box-shadow: 0 0 40px 8px rgba(234,88,12,0.35); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ea580c 0%, #f97316 40%, #fbbf24 50%, #f97316 60%, #ea580c 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-slide 2s linear infinite;
        }
        .result-reveal {
          animation: reveal-right 1.2s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .glow-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div ref={sectionRef} className="w-full">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 shadow-xl bg-white">

          {/* Phase: Mockup */}
          {phase === 'mockup' && (
            <div className="relative">
              <div className="absolute top-4 left-4 z-10 bg-zinc-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 border border-zinc-700">
                <Layers className="w-3.5 h-3.5" />
                Mockup no editor
              </div>
              <img
                src="/demo-mockup.jpg"
                alt="Mockup criado no editor FestaLab"
                className="w-full aspect-[16/9] object-cover block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-8">
                <button
                  onClick={startGeneration}
                  className="glow-pulse flex items-center gap-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-8 py-4 rounded-full shadow-2xl shadow-orange-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer text-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  Gerar visualização com IA
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Phase: Generating */}
          {phase === 'generating' && (
            <div className="relative bg-zinc-950">
              <img
                src="/demo-mockup.jpg"
                alt="Mockup sendo processado"
                className="w-full aspect-[16/9] object-cover block opacity-30"
              />
              <ScanLine />
              <ParticleDots />
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(251,146,60,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.5) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 px-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-zinc-700" />
                  <div
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500"
                    style={{ animation: 'spin 0.9s linear infinite' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-orange-400" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="shimmer-text text-lg font-semibold mb-1">
                    {GENERATION_STEPS[stepIndex].label}
                  </p>
                  <p className="text-zinc-500 text-xs">IA processando seu cenário…</p>
                </div>
                <div className="w-full max-w-sm">
                  <div className="flex justify-between text-[10px] text-zinc-500 mb-1.5">
                    <span>Gerando</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {GENERATION_STEPS.slice(0, -1).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        i < stepIndex ? 'bg-orange-500' : i === stepIndex ? 'bg-orange-400 scale-125' : 'bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phase: Result reveal */}
          {phase === 'result' && (
            <div className="relative overflow-hidden">
              <img
                src="/demo-mockup.jpg"
                alt="Mockup original"
                className="w-full aspect-[16/9] object-cover block"
              />
              <img
                src="/demo-real.jpg"
                alt="Resultado gerado pela IA"
                className="absolute inset-0 w-full h-full object-cover result-reveal"
              />
              <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white text-xs font-bold rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Gerado com IA!
              </div>
            </div>
          )}

          {/* Phase: Compare slider */}
          {phase === 'compare' && (
            <div
              ref={containerRef}
              className="relative w-full aspect-[16/9] select-none touch-none cursor-ew-resize overflow-hidden"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <img
                src="/demo-mockup.jpg"
                alt="Mockup criado no FestaLab"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src="/demo-real.jpg"
                  alt="Resultado fotorrealista gerado por IA"
                  className="absolute inset-0 h-full object-cover pointer-events-none"
                  style={{ width: containerRef.current?.clientWidth ?? '100vw' }}
                  draggable={false}
                />
              </div>
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-orange-700 shadow-sm flex items-center gap-1.5 border border-orange-200/60 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Resultado IA
              </div>
              <div className="absolute top-4 right-4 z-10 bg-zinc-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 border border-zinc-700 pointer-events-none">
                <Layers className="w-3.5 h-3.5" />
                Mockup
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-zinc-200 text-zinc-500 cursor-ew-resize hover:scale-105 transition-transform pointer-events-auto"
                  onPointerDown={handlePointerDown}
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
              </div>
              <input
                type="range" min="0" max="100" value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                aria-label="Arraste para comparar mockup com resultado da IA"
                className="absolute opacity-0 w-full h-full z-30 cursor-ew-resize"
              />
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-4 flex flex-col items-center gap-2">
          {phase === 'compare' && (
            <>
              <p className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-zinc-400" />
                Arraste para comparar mockup e resultado
              </p>
              <button
                onClick={reset}
                className="text-xs text-zinc-400 hover:text-orange-600 transition-colors cursor-pointer underline underline-offset-2"
              >
                Ver demo novamente
              </button>
            </>
          )}
          {(phase === 'generating' || phase === 'result') && (
            <p className="text-sm text-zinc-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              IA gerando visualização fotorrealista…
            </p>
          )}
          {phase === 'mockup' && (
            <p className="text-sm text-zinc-500">
              ↑ Clique no botão para ver a IA em ação
            </p>
          )}
          <p className="text-xs text-zinc-400 max-w-md text-center">
            Visualização com IA para referência criativa. Medidas, materiais e proporções podem variar.
          </p>
        </div>
      </div>
    </>
  );
}
