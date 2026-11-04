'use client';

import React, { useState, useEffect } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { CanvasElement, EnvironmentConfig } from '@/lib/builder-elements';

interface AIPartyChatProps {
  onStartWithGeneratedScene: (data: {
    name: string;
    elements: CanvasElement[];
    environment: EnvironmentConfig;
  }) => void;
}

const SUGGESTIONS = [
  { label: 'Rei Leão em tons terrosos', prompt: 'Festa infantil do Rei Leão com tons terrosos e amadeirados, mesa com toalha verde musgo, arco de balões desconstruído e dois cilindros laterais com folhagens' },
  { label: 'Jardim Encantado', prompt: 'Jardim Encantado delicado em tons de rosa blush, lavanda e dourado suave, com mesa de babado plissada, trio de painéis e arranjos florais exuberantes' },
  { label: 'Astronauta e galáxia', prompt: 'Festa Astronauta e Espaço com painel redondo, cilindros nas cores azul marinho e prata, arco de balões orgânicos cromados e bolo cenográfico temático' },
  { label: 'Circo vintage', prompt: 'Circo vintage sofisticado em vermelho rubi, azul petróleo e dourado, com mesa de babado, cilindros decorados e balão gigante com laço de fita' },
  { label: 'Noivado rústico', prompt: 'Noivado rústico chic ao ar livre com painéis em madeira e linho cru, flores brancas e folhagens, mesa de doces com bolo de dois andares e toalha drapeada' },
];

const LOADING_STEPS = [
  'Entendendo o tema da festa…',
  'Escolhendo a paleta de cores…',
  'Posicionando painéis e mesa…',
  'Distribuindo balões e flores…',
  'Abrindo no editor…',
];

export default function AIPartyChat({ onStartWithGeneratedScene }: AIPartyChatProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Ciclo dinâmico das mensagens de carregamento
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (textToUse?: string) => {
    const text = (textToUse || prompt).trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    setLoadingStepIdx(0);

    try {
      const res = await fetch('/api/ai/generate-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível gerar a festa. Tente novamente.');
      }

      // Salva no localStorage para sincronizar com o builder
      if (Array.isArray(data.elements) && data.elements.length > 0) {
        localStorage.setItem('festalab_project_elements', JSON.stringify(data.elements));
        localStorage.setItem('festalab_environment_state', JSON.stringify(data.environment));
        localStorage.setItem('festalab_project_name', data.name || 'Festa Criada por IA');

        onStartWithGeneratedScene({
          name: data.name,
          elements: data.elements,
          environment: data.environment,
        });
      } else {
        throw new Error('A IA não retornou elementos para a cena.');
      }
    } catch (err) {
      console.error('[AIPartyChat Error]:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar sua solicitação com a IA.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16 items-start">
      <div>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight">Sem tempo? Descreva a festa e a IA monta</h2>
        <p className="mt-4 text-ink-soft text-lg leading-relaxed max-w-[38ch]">
          Escreva o tema, as cores e os detalhes. A IA posiciona painéis, mesa, cilindros e balões e abre tudo no editor para você ajustar.
        </p>
      </div>

      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="rounded-2xl bg-white ring-1 ring-line focus-within:ring-2 focus-within:ring-ink transition-shadow"
        >
          <label htmlFor="ai-party-prompt" className="sr-only">Descreva a festa</label>
          <textarea
            id="ai-party-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            disabled={loading}
            placeholder="Ex.: Festa do Rei Leão rústica em tons terrosos, arco de balões verde-oliva e mesa de babado"
            className="w-full resize-none bg-transparent px-5 pt-5 pb-2 text-base text-ink placeholder:text-ink-soft/70 focus:outline-none disabled:opacity-60"
          />
          <div className="flex items-center justify-end gap-3 px-3 pb-3">
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-brand-deep text-white font-semibold text-sm hover:bg-brand-deeper transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Montando sua festa
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" aria-hidden="true" />
                  Montar com IA
                </>
              )}
            </button>
          </div>
        </form>

        <div aria-live="polite">
          {loading && (
            <p className="mt-3 text-sm text-ink-soft">{LOADING_STEPS[loadingStepIdx]}</p>
          )}
          {error && (
            <p className="mt-3 text-sm text-red-700">{error}</p>
          )}
        </div>

        <div className="mt-5">
          <p className="text-sm text-ink-soft mb-2.5">Ou teste uma ideia:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                disabled={loading}
                onClick={() => {
                  setPrompt(s.prompt);
                  handleGenerate(s.prompt);
                }}
                className="text-sm bg-white ring-1 ring-line hover:ring-ink rounded-full px-3.5 py-1.5 text-ink transition-shadow cursor-pointer disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
