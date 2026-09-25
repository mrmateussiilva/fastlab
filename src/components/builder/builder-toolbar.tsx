'use client';

import { ArrowLeft, Download, Sparkles, Loader2, Undo2, Redo2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerationLimitData } from '@/hooks/use-generation-limit';
import GenerationLimitBadge from '@/components/generation-limit-badge';

interface BuilderToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onBack: () => void;
  onExport: () => void;
  onOpenGenerateModal: () => void;
  isGenerating: boolean;
  elementCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  limitData?: GenerationLimitData;
}

export default function BuilderToolbar({
  projectName,
  onProjectNameChange,
  onBack,
  onExport,
  onOpenGenerateModal,
  isGenerating,
  elementCount,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isPreviewMode,
  onTogglePreview,
  limitData,
}: BuilderToolbarProps) {
  return (
    <header className="w-full border-b border-zinc-200/80 bg-white sticky top-0 z-30 select-none">
      <div className="w-full px-2.5 sm:px-4 h-14 flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Esquerda: Botão Voltar + Logo + Desfazer / Refazer */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isGenerating}
            title="Voltar ao Início"
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Início</span>
          </button>

          <span className="text-zinc-300 font-light hidden xs:inline">|</span>
          
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-base sm:text-lg font-normal tracking-tight text-zinc-950">
              FestaLab
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 hidden sm:inline">
              Editor
            </span>
          </div>

          <span className="text-zinc-200 font-light hidden md:inline">|</span>

          {/* Botões de Undo e Redo */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo || isGenerating}
              title="Desfazer (Ctrl+Z)"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo || isGenerating}
              title="Refazer (Ctrl+Shift+Z)"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Centro: Nome do Projeto (oculto em telas pequenas) */}
        <div className="hidden lg:flex items-center">
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="Nome do Projeto"
            className="text-xs sm:text-sm font-medium text-center text-zinc-800 bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:bg-zinc-50/50 rounded-md px-3 py-1 outline-none transition-all max-w-[200px] truncate"
          />
        </div>

        {/* Direita: Preview, Exportar & Gerar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Botão de Preview Limpo */}
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
            title={isPreviewMode ? 'Voltar para modo de edição' : 'Visualizar mockup limpo'}
            className={`h-8 px-2 sm:px-3 text-xs font-medium border-zinc-200/80 font-sans cursor-pointer transition-all ${
              isPreviewMode
                ? 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900'
                : 'bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {isPreviewMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Sair do preview</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Pré-visualizar</span>
              </>
            )}
          </Button>

          {limitData && (
            <div className="hidden md:flex items-center mr-1">
              <GenerationLimitBadge limitData={limitData} compact />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={elementCount === 0 || isGenerating}
            title="Exportar mockup"
            className="h-8 px-2 sm:px-3 text-xs font-medium text-zinc-700 border-zinc-200/80 bg-white hover:bg-zinc-50 cursor-pointer font-sans"
          >
            <Download className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Exportar mockup</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenGenerateModal}
            disabled={elementCount === 0 || isGenerating || limitData?.remaining === 0 || limitData?.globalLimitReached}
            className="h-8 px-2.5 sm:px-3.5 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:mr-1.5 animate-spin" />
                <span className="hidden sm:inline">Gerando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Gerar imagem realista</span>
                <span className="sm:hidden">Gerar</span>
              </>
            )}
          </Button>
        </div>

      </div>
    </header>
  );
}
