'use client';

import React, { useState } from 'react';
import { RealisticPromptOptions } from '@/lib/prompts';
import { Sparkles, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
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

type Fidelity = NonNullable<RealisticPromptOptions['fidelity']>;
type Lighting = NonNullable<RealisticPromptOptions['lighting']>;
type Environment = NonNullable<RealisticPromptOptions['environment']>;

const FIDELITY_OPTIONS: { id: Fidelity; label: string }[] = [
  { id: 'high', label: 'Nada' },
  { id: 'balanced', label: 'Um pouco' },
  { id: 'creative', label: 'Mais livre' },
];

const LIGHTING_OPTIONS: { id: Lighting; label: string }[] = [
  { id: 'natural', label: 'Natural' },
  { id: 'warm', label: 'Quente' },
  { id: 'studio', label: 'Estúdio' },
];

const ENVIRONMENT_OPTIONS: { id: Environment; label: string }[] = [
  { id: 'party_hall', label: 'Salão' },
  { id: 'residence', label: 'Casa' },
  { id: 'studio', label: 'Estúdio' },
];

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-700 font-sans mb-1.5">{label}</p>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-1 p-0.5 bg-zinc-100 rounded-lg">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={value === opt.id}
            onClick={() => onChange(opt.id)}
            className={`py-1.5 text-xs font-sans rounded-md transition-colors cursor-pointer ${
              value === opt.id ? 'bg-white text-zinc-900 font-medium shadow-2xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GenerationModal({
  isOpen,
  onClose,
  onConfirm,
  isGenerating,
  limitData,
}: GenerationModalProps) {
  const [fidelity, setFidelity] = useState<Fidelity>('high');
  const [lighting, setLighting] = useState<Lighting>('natural');
  const [environment, setEnvironment] = useState<Environment>('party_hall');
  const [themeNotes, setThemeNotes] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    onConfirm({ fidelity, lighting, environment, themeNotes: themeNotes.trim() || undefined });
  };

  const limitReached = limitData?.remaining === 0 || limitData?.globalLimitReached;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generation-modal-title"
        className="w-full max-w-md bg-white rounded-2xl border border-zinc-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="px-5 pt-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="generation-modal-title" className="text-base font-semibold text-zinc-900 font-sans">
              Gerar foto realista
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              A IA transforma sua montagem em uma foto para mostrar ao cliente.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            aria-label="Fechar"
            className="w-7 h-7 shrink-0 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <label htmlFor="theme-notes" className="text-xs font-medium text-zinc-700 font-sans">
              Tema e detalhes <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <textarea
              id="theme-notes"
              value={themeNotes}
              onChange={(e) => setThemeNotes(e.target.value.slice(0, 600))}
              rows={3}
              placeholder="Ex.: jardim lilás; toalha e cilindros em xadrez lilás e branco; bolo de 2 andares; flores reais nos arranjos."
              className="mt-1.5 w-full resize-none rounded-xl border border-zinc-200/80 bg-white p-3 text-sm text-zinc-800 font-sans placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="mt-1 text-[11px] text-zinc-400 font-sans">
              O editor usa formas simples. Diga o que cada peça é de verdade para a foto sair fiel.
            </p>
          </div>

          {/* Ajustes (recolhido) */}
          <div className="border-t border-zinc-100 pt-3">
            <button
              type="button"
              onClick={() => setShowSettings((v) => !v)}
              aria-expanded={showSettings}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Ajustes
            </button>

            {showSettings && (
              <div className="mt-3 space-y-3">
                <Segmented label="Quanto a IA pode mudar" value={fidelity} options={FIDELITY_OPTIONS} onChange={setFidelity} />
                <Segmented label="Luz" value={lighting} options={LIGHTING_OPTIONS} onChange={setLighting} />
                <Segmented label="Lugar" value={environment} options={ENVIRONMENT_OPTIONS} onChange={setEnvironment} />
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-5 py-4 bg-zinc-50/80 border-t border-zinc-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <div>{limitData && <GenerationLimitBadge limitData={limitData} />}</div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
              disabled={isGenerating || limitReached}
              className="h-9 px-5 text-sm font-semibold bg-orange-700 hover:bg-orange-800 text-white shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Gerando…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Gerar foto
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
