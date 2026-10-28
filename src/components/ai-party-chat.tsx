'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { CanvasElement, EnvironmentConfig } from '@/lib/builder-elements';

interface AIPartyChatProps {
  onStartWithGeneratedScene: (data: {
    name: string;
    elements: CanvasElement[];
    environment: EnvironmentConfig;
  }) => void;
}

const SUGGESTIONS = [
  { label: '🦁 Rei Leão em tons terrosos', prompt: 'Festa infantil do Rei Leão com tons terrosos e amadeirados, mesa com toalha verde musgo, arco de balões desconstruído e dois cilindros laterais com folhagens' },
  { label: '🌸 Jardim Encantado com mesa de babado', prompt: 'Jardim Encantado delicado em tons de rosa blush, lavanda e dourado suave, com mesa de babado plissada, trio de painéis e arranjos florais exuberantes' },
  { label: '🚀 Astronauta & Galáxia moderna', prompt: 'Festa Astronauta e Espaço com painel redondo, cilindros nas cores azul marinho e prata, arco de balões orgânicos cromados e bolo cenográfico temático' },
  { label: '🎪 Circo vintage elegante', prompt: 'Circo vintage sofisticado em vermelho rubi, azul petróleo e dourado, com mesa de babado, cilindros decorados e balão gigante com laço de fita' },
  { label: '💍 Noivado rústico chic', prompt: 'Noivado rústico chic ao ar livre com painéis em madeira e linho cru, flores brancas e folhagens, mesa de doces com bolo de dois andares e toalha drapeada' },
];

const LOADING_STEPS = [
  'Interpretando o tema e estilo da festa...',
  'Criando a paleta de cores harmônica...',
  'Dimensionando painéis e mesa cenográfica...',
  'Distribuindo balões orgânicos e arranjos florais...',
  'Finalizando composição espacial 2D e 3D...',
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
    <div className="w-full max-w-4xl mx-auto my-6 sm:my-8 px-4">
      <div className="relative rounded-3xl bg-gradient-to-b from-white via-white to-orange-50/40 p-4 sm:p-7 border border-orange-200/70 shadow-xl shadow-orange-500/5 backdrop-blur-md">
        
        {/* Badge superior */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            <span>Criador Inteligente de Festas</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-zinc-400 font-medium">
            Gera o cenário 2D e 3D completo em segundos
          </span>
        </div>

        {/* Título de chamada */}
        <h3 className="text-lg sm:text-2xl font-serif font-semibold text-zinc-900 mb-1.5 tracking-tight">
          Qual festa você quer criar hoje?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 mb-4 leading-relaxed">
          Digite o tema, cores e detalhes que você imagina. A IA monta a composição de painéis, mesas, cilindros e balões pronta para você editar.
        </p>

        {/* Formulário do Chat */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="relative flex flex-col sm:flex-row items-stretch gap-2.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              placeholder="Ex: Festa do Rei Leão rústica em tons terrosos com arco de balões verde oliva e mesa de babado..."
              className="w-full h-13 sm:h-14 pl-4 pr-10 text-sm bg-white border-2 border-orange-200/90 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 placeholder:text-zinc-400 text-zinc-900 shadow-inner transition-all disabled:opacity-60"
            />
            {prompt && !loading && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs px-1.5 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="h-13 sm:h-14 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Montando Festa...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-100" />
                <span>Criar Cenário</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Animação / Feedback de Carregamento */}
        {loading && (
          <div className="mt-4 p-3.5 bg-orange-100/60 border border-orange-200/80 rounded-xl flex items-center gap-3 animate-fade-in">
            <RefreshCw className="w-4 h-4 text-orange-600 animate-spin shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-orange-950">
                {LOADING_STEPS[loadingStepIdx]}
              </p>
              <div className="w-full bg-orange-200 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-orange-500 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 font-bold ml-2">✕</button>
          </div>
        )}

        {/* Sugestões Rápidas em 1 Clique */}
        <div className="mt-4 pt-3.5 border-t border-orange-100/80">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            💡 Ou experimente uma ideia em 1 clique:
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                disabled={loading}
                onClick={() => {
                  setPrompt(s.prompt);
                  handleGenerate(s.prompt);
                }}
                className="text-left text-xs bg-white hover:bg-orange-50 border border-zinc-200/80 hover:border-orange-300 rounded-xl px-2.5 py-1.5 text-zinc-700 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98] disabled:opacity-50"
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
