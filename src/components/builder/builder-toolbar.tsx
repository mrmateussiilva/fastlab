'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  ChevronDown,
  Share2,
  Pencil,
  Check,
  Lock,
  Save,
} from 'lucide-react';
import { GenerationLimitData } from '@/hooks/use-generation-limit';
import GenerationLimitBadge from '@/components/generation-limit-badge';

interface BuilderToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onBack: () => void;
  onExport: () => void;
  onOpenGenerateModal: () => void;
  onOpenARMode: () => void;
  isGenerating: boolean;
  elementCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  viewMode?: '2d' | '3d';
  onToggleViewMode?: () => void;
  limitData?: GenerationLimitData;
  isSignedIn?: boolean;
  onSave?: () => void;
  saving?: boolean;
}

export default function BuilderToolbar({
  projectName,
  onProjectNameChange,
  onBack,
  onExport,
  onOpenGenerateModal,
  onOpenARMode,
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
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          disabled={isGenerating}
          title="Voltar ao início"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Logo mark */}
        <Link href="/dashboard" className="flex items-center gap-1.5 px-1 hover:opacity-80 transition-opacity">
          <Image
            src="/logo-icon.png"
            alt="FestaLab"
            width={28}
            height={28}
            className="w-7 h-7 object-contain shrink-0"
          />
          <span className="font-serif font-medium text-sm text-zinc-900 hidden sm:block tracking-tight">
            FestaLab
          </span>
        </Link>

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
      </div>

      {/* ── RIGHT: Actions ── */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Generation limit badge */}
        {limitData && (
          <div className="hidden md:flex items-center">
            <GenerationLimitBadge limitData={limitData} compact />
          </div>
        )}

        {/* Preview */}
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

        {/* Toggle 2D / 3D */}
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

        {/* Save button */}
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            title="Salvar projeto na nuvem"
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-all cursor-pointer disabled:opacity-40"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        )}

        {/* Export dropdown button */}
        <button
          type="button"
          onClick={onExport}
          disabled={elementCount === 0 || isGenerating}
          title="Exportar mockup"
          className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Exportar</span>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
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
