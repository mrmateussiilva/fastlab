'use client';

import React, { useState } from 'react';
import { RealisticPromptOptions } from '@/lib/prompts';
import { Sparkles, X, Sliders, Sun, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationLimitData } from '@/hooks/use-generation-limit';
import GenerationLimitBadge from '@/components/generation-limit-badge';

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: RealisticPromptOptions) => void;
  isGenerating: boolean;
  limitData?: GenerationLimitData;
}

export default function GenerationModal({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
  limitData,
}: GenerationModalProps) {
  const [fidelity, setFidelity] = useState<'high' | 'balanced' | 'creative'>('high');
  const [lighting, setLighting] = useState<'natural' | 'warm' | 'studio'>('natural');
  const [environment, setEnvironment] = useState<'party_hall' | 'studio' | 'residence'>('party_hall');

  if (!isOpen) return null;

  const handleGenerate = () => {
    onConfirm({ fidelity, lighting, environment });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 font-sans">
                Apresentação Realista com IA
              </h2>
              <p className="text-[11px] text-zinc-400 font-sans">
                Ajuste os parâmetros visuais da fotografia final
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo com Opções */}
        <div className="p-6 space-y-5">
          
          {/* Opção 1: Fidelidade */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5 text-zinc-500" />
              <label className="text-xs font-semibold text-zinc-800 font-sans">
                Fidelidade ao Mockup
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'high', label: 'Alta', desc: 'Preservação estrita' },
                { id: 'balanced', label: 'Equilibrada', desc: 'Acabamento natural' },
                { id: 'creative', label: 'Criativa', desc: 'Maior liberdade' },
              ] as const).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFidelity(opt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    fidelity === opt.id
                      ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500 text-zinc-900'
                      : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-600 bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold font-sans">{opt.label}</div>
                  <div className="text-[10px] text-zinc-400 font-sans leading-tight mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Opção 2: Iluminação */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sun className="w-3.5 h-3.5 text-zinc-500" />
              <label className="text-xs font-semibold text-zinc-800 font-sans">
                Estilo de Iluminação
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'natural', label: 'Natural', desc: 'Luz diurna suave' },
                { id: 'warm', label: 'Quente', desc: 'Dourado de evento' },
                { id: 'studio', label: 'Estúdio', desc: 'Luz nítida e focada' },
              ] as const).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLighting(opt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    lighting === opt.id
                      ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500 text-zinc-900'
                      : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-600 bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold font-sans">{opt.label}</div>
                  <div className="text-[10px] text-zinc-400 font-sans leading-tight mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Opção 3: Ambiente */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              <label className="text-xs font-semibold text-zinc-800 font-sans">
                Tipo de Ambiente
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'party_hall', label: 'Salão de Festas', desc: 'Espaço profissional' },
                { id: 'studio', label: 'Estúdio', desc: 'Fundo limpo e neutro' },
                { id: 'residence', label: 'Residência', desc: 'Salão contemporâneo' },
              ] as const).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setEnvironment(opt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    environment === opt.id
                      ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500 text-zinc-900'
                      : 'border-zinc-200/80 hover:border-zinc-300 text-zinc-600 bg-white'
                  }`}
                >
                  <div className="text-xs font-semibold font-sans">{opt.label}</div>
                  <div className="text-[10px] text-zinc-400 font-sans leading-tight mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dica de Preservação */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 text-[11px] text-zinc-500 font-sans leading-relaxed">
            🛡️ <strong className="text-zinc-700">Preservação de elementos:</strong> imagens e mockups importados por você terão suas identidades, cores e formas respeitadas durante a renderização.
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50/80 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {limitData && <GenerationLimitBadge limitData={limitData} />}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
              className="h-9 px-4 text-xs font-medium text-zinc-700 border-zinc-200 bg-white hover:bg-zinc-100 cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || limitData?.remaining === 0 || limitData?.globalLimitReached}
              className="h-9 px-5 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Renderizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Gerar apresentação
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
