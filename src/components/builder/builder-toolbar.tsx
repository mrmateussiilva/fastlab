'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Download,
  Sparkles,
  Loader2,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Box,
  Pencil,
  Check,
  CheckCircle2,
  Lock,
  Save,
  Camera,
} from 'lucide-react';
import { GenerationLimitData } from '@/hooks/use-generation-limit';
import GenerationLimitBadge from '@/components/generation-limit-badge';

interface BuilderToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onBack: () => void;
  onExport: () => void;
  onOpenGenerateModal: () => void;
  onOpenARMode?: () => void;
  isGenerating: boolean;
  elementCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isPreviewMode: boolean;
  /** Opcional: sem ele o botão de Preview não aparece (MVP). */
  onTogglePreview?: () => void;
  viewMode?: '2d' | '3d';
  /** Opcional: sem ele a alternância 2D/3D não aparece (MVP). */
  onToggleViewMode?: () => void;
  limitData?: GenerationLimitData;
  isSignedIn?: boolean;
  onSave?: () => void;
  saving?: boolean;
  /** true quando não há alterações desde o último salvamento. */
  saved?: boolean;
  adminMode?: {
    themeName: string;
    onSaveModel: () => void;
    onSetCoverFromCanvas?: () => void;
    savingModel?: boolean;
    savingCover?: boolean;
  };
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
  viewMode = '2d',
  onToggleViewMode,
  limitData,
  isSignedIn = true,
  onSave,
  saving = false,
  saved = false,
  adminMode,
}: BuilderToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(projectName);

  const handleNameSubmit = () => {
    onProjectNameChange(tempName.trim() || 'Meu projeto');
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleNameSubmit();
    if (e.key === 'Escape') {
      setTempName(projectName);
      setIsEditingName(false);
    }
  };

  return (
    <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-30 select-none h-14 flex items-center px-3 gap-2">
      
      {/* ── LEFT: Logo + Undo/Redo ── */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Voltar ao início (seta + logo em um único botão) */}
        <button
          type="button"
          onClick={onBack}
          disabled={isGenerating}
          title="Voltar ao início"
          aria-label="Voltar ao início"
          className="flex items-center gap-1 h-9 pl-1.5 pr-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" />
          <Image
            src="/logo-icon.png"
            alt=""
            width={28}
            height={28}
            className="w-7 h-7 object-contain shrink-0"
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-zinc-200 mx-1 hidden sm:block" />

        {/* Undo / Redo */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo || isGenerating}
            title="Desfazer (Ctrl+Z)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo || isGenerating}
            title="Refazer (Ctrl+Shift+Z)"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── CENTER: Project name (Canva-style editable) ── */}
      <div className="flex-1 flex justify-center items-center min-w-0 px-2">
        {isEditingName ? (
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-orange-300 rounded-lg px-2 py-1 ring-2 ring-orange-100">
            <Pencil className="w-3 h-3 text-orange-500 shrink-0" />
            <input
              autoFocus
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleNameKeyDown}
              className="text-sm font-medium text-zinc-900 bg-transparent outline-none w-44 sm:w-56"
              maxLength={60}
            />
            <button
              type="button"
              onClick={handleNameSubmit}
              className="w-5 h-5 rounded flex items-center justify-center text-orange-600 hover:bg-orange-50"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTempName(projectName);
              setIsEditingName(true);
            }}
            title="Clique para renomear"
            className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer max-w-xs"
          >
            <span className="text-sm font-medium text-zinc-800 truncate">
              {projectName}
            </span>
            <Pencil className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        )}

        {adminMode && (
          <span className="hidden lg:inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            Admin • Modelo Oficial
          </span>
        )}
      </div>

      {/* ── RIGHT: Actions ── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Generation limit badge */}
        {limitData && !adminMode && (
          <div className="hidden md:flex items-center">
            <GenerationLimitBadge limitData={limitData} compact />
          </div>
        )}

        {/* Preview (escondido no MVP: só aparece se onTogglePreview for passado) */}
        {onTogglePreview && (
        <button
          type="button"
          onClick={onTogglePreview}
          title={isPreviewMode ? 'Voltar para edição' : 'Pré-visualizar'}
          className={`hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            isPreviewMode
              ? 'bg-zinc-900 text-white hover:bg-zinc-800'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Sair</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </>
          )}
        </button>
        )}

        {/* Toggle 2D / 3D (escondido no MVP: só aparece se onToggleViewMode for passado) */}
        {onToggleViewMode && (
        <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
          <button
            type="button"
            onClick={() => onToggleViewMode && viewMode !== '2d' && onToggleViewMode()}
            title="Editor 2D"
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              viewMode === '2d'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            2D
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode && viewMode !== '3d' && onToggleViewMode()}
            title="Visualização 3D com rotação 360°"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '3d'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-zinc-600 hover:text-orange-600'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>
        </div>
        )}

        {/* Botão Admin: Definir Canvas como Foto de Capa da Landing Page */}
        {adminMode?.onSetCoverFromCanvas && (
          <button
            type="button"
            onClick={adminMode.onSetCoverFromCanvas}
            disabled={adminMode.savingCover || elementCount === 0}
            title="Tirar foto do canvas e atualizar a foto de capa exibida na landing page"
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-300 transition-all cursor-pointer disabled:opacity-40"
          >
            {adminMode.savingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{adminMode.savingCover ? 'Atualizando Capa...' : 'Definir Capa'}</span>
          </button>
        )}

        {/* Botão Admin: Salvar Modelo Oficial */}
        {adminMode && (
          <button
            type="button"
            onClick={adminMode.onSaveModel}
            disabled={adminMode.savingModel}
            title="Salvar alterações do modelo oficial no catálogo"
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all cursor-pointer disabled:opacity-40"
          >
            {adminMode.savingModel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-orange-400" />}
            <span>{adminMode.savingModel ? 'Salvando...' : 'Salvar Modelo'}</span>
          </button>
        )}

        {/* Save button (Normal user project) */}
        {onSave && !adminMode && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving || saved}
            title={saved ? 'Todas as alterações estão salvas' : 'Salvar projeto na nuvem'}
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-all cursor-pointer disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-zinc-600"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? 'Salvando…' : saved ? 'Salvo' : 'Salvar'}</span>
          </button>
        )}

        {/* Baixar rascunho: ação secundária, só ícone */}
        <button
          type="button"
          onClick={onExport}
          disabled={elementCount === 0 || isGenerating}
          title="Baixar rascunho (PNG)"
          aria-label="Baixar rascunho (PNG)"
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Primary CTA: Generate */}
        <button
          type="button"
          onClick={onOpenGenerateModal}
          disabled={
            elementCount === 0 ||
            isGenerating ||
            (isSignedIn && (limitData?.remaining === 0 || limitData?.globalLimitReached))
          }
          title={!isSignedIn ? 'Faça login para gerar imagens com IA' : 'Gerar imagem com IA'}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Gerando...</span>
            </>
          ) : !isSignedIn ? (
            <>
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Gerar com IA</span>
              <span className="sm:hidden">IA</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Gerar com IA</span>
              <span className="sm:hidden">IA</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
