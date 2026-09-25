'use client';

import React, { useRef } from 'react';
import { 
  CanvasElement, 
  COLOR_PALETTE, 
  EnvironmentConfig, 
  WALL_OPTIONS, 
  FLOOR_OPTIONS, 
  SCALE 
} from '@/lib/builder-elements';
import { 
  ArrowUpToLine, 
  ArrowDownToLine, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Trash2, 
  Lock, 
  Unlock, 
  Building2, 
  Ruler, 
  Layers,
  Image as ImageIcon,
  UploadCloud,
  RefreshCw,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertiesSidebarProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (updated: Partial<CanvasElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSendToBack: () => void;
  environment: EnvironmentConfig;
  onUpdateEnvironment: (updated: Partial<EnvironmentConfig>) => void;
  mode?: 'auto' | 'element' | 'environment';
  className?: string;
  onClose?: () => void;
}

export default function PropertiesSidebar({
  selectedElement,
  onUpdateElement,
  onDuplicate,
  onDelete,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  environment,
  onUpdateEnvironment,
  mode = 'auto',
  className,
  onClose,
}: PropertiesSidebarProps) {
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Formato inválido. Use PNG, JPG ou WEBP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateEnvironment({ backgroundImage: dataUrl });
      }
    };
    reader.readAsDataURL(file);

    if (bgFileInputRef.current) {
      bgFileInputRef.current.value = '';
    }
  };

  // Determina se exibe configurações do Ambiente ou do Elemento
  const isEnvMode = mode === 'environment' || (mode !== 'element' && !selectedElement);

  if (isEnvMode) {
    return (
      <aside className={className || "w-64 sm:w-72 bg-white border-l border-zinc-200/80 flex flex-col h-[calc(100vh-3.5rem)] select-none"}>
        <input
          ref={bgFileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleBgUpload}
          className="hidden"
        />

        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-zinc-500" />
            <div>
              <h2 className="text-xs font-semibold text-zinc-900 font-sans">
                Ambiente & Fundo
              </h2>
              <p className="text-[10px] text-zinc-400 font-sans">
                Configurações do espaço físico
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Foto Real do Ambiente / Parede */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                Foto do Ambiente Real
              </label>
              {environment.backgroundImage && (
                <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-sans">
                  Ativa
                </span>
              )}
            </div>

            {environment.backgroundImage ? (
              <div className="space-y-2">
                <div className="relative rounded-xl border border-zinc-200/80 overflow-hidden bg-zinc-50 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={environment.backgroundImage}
                    alt="Foto do ambiente"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => bgFileInputRef.current?.click()}
                    className="text-[11px] h-8 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 mr-1.5 text-zinc-400" />
                    Substituir
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateEnvironment({ backgroundImage: null })}
                    className="text-[11px] h-8 border-zinc-200 text-red-600 hover:bg-red-50 font-sans cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 mr-1.5 text-red-400" />
                    Remover
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => bgFileInputRef.current?.click()}
                className="p-3.5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 hover:border-orange-400 hover:bg-orange-50/20 text-center cursor-pointer transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-white border border-zinc-200/80 mx-auto flex items-center justify-center mb-1.5 text-zinc-500 group-hover:text-orange-600 shadow-2xs transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-zinc-800 font-sans mb-0.5">
                  Importar foto do ambiente
                </div>
                <div className="text-[10px] text-zinc-400 font-sans leading-tight">
                  PNG, JPG ou WEBP (salão ou parede real)
                </div>
              </div>
            )}
          </div>
          
          {/* Dimensões do Ambiente */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Ruler className="w-3.5 h-3.5 text-zinc-400" />
              <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans">
                Medidas do Ambiente
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/60 text-center">
              <div>
                <span className="text-[10px] text-zinc-400 font-sans block">Largura Total</span>
                <span className="text-xs font-semibold text-zinc-800 font-mono">
                  {environment.roomWidthCm} cm
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-sans block">Altura Total</span>
                <span className="text-xs font-semibold text-zinc-800 font-mono">
                  {environment.roomHeightCm} cm
                </span>
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans block mt-1.5 text-center">
              Escala de proporção: 1 cm = 2 pixels
            </span>
          </div>

          {/* Acabamento da Parede */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans block mb-2">
              Cor da Parede
            </label>
            <div className="space-y-1.5">
              {WALL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateEnvironment({ wallColor: opt.value })}
                  className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    environment.wallColor === opt.value
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-zinc-200/80 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-5 h-5 rounded-full border border-zinc-300 shadow-2xs" 
                      style={{ backgroundColor: opt.value }} 
                    />
                    <span className="text-xs font-medium text-zinc-800 font-sans">
                      {opt.name}
                    </span>
                  </div>
                  {environment.wallColor === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Acabamento do Piso */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans block mb-2">
              Tipo de Piso
            </label>
            <div className="space-y-1.5">
              {FLOOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateEnvironment({ floorColor: opt.value })}
                  className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    environment.floorColor === opt.value
                      ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500'
                      : 'border-zinc-200/80 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-5 h-5 rounded-full border border-zinc-300 shadow-2xs" 
                      style={{ backgroundColor: opt.value }} 
                    />
                    <span className="text-xs font-medium text-zinc-800 font-sans">
                      {opt.name}
                    </span>
                  </div>
                  {environment.floorColor === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 text-[11px] text-zinc-400 font-sans leading-relaxed text-center">
            Clique em qualquer item do canvas para ajustar medidas, posições e camadas.
          </div>

        </div>
      </aside>
    );
  }

  if (!selectedElement) {
    return (
      <aside className={className || "w-64 sm:w-72 bg-white border-l border-zinc-200/80 flex flex-col h-[calc(100vh-3.5rem)] select-none"}>
        <div className="p-8 text-center flex-1 flex flex-col items-center justify-center text-zinc-400">
          <Sliders className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-xs font-medium text-zinc-600">Nenhum elemento selecionado</p>
          <p className="text-[11px] text-zinc-400 mt-1">Toque em um item no canvas para editar cor, tamanho ou camada.</p>
        </div>
      </aside>
    );
  }

  const isLocked = Boolean(selectedElement.locked);
  const widthCm = SCALE.pxToCm(selectedElement.width);
  const heightCm = SCALE.pxToCm(selectedElement.height);

  return (
    <aside className={className || "w-64 sm:w-72 bg-white border-l border-zinc-200/80 flex flex-col h-[calc(100vh-3.5rem)] select-none"}>
      
      {/* Título com Nome do Item + Ações Rápidas */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-sans font-semibold">
            Elemento Selecionado
          </span>
          <h2 className="text-xs font-semibold text-zinc-900 font-sans truncate">
            {selectedElement.name}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {/* Botão Travar / Destravar */}
          <button
            type="button"
            onClick={() => onUpdateElement({ locked: !isLocked })}
            title={isLocked ? 'Destravar elemento' : 'Travar elemento'}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isLocked 
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          {/* Botão Excluir */}
          <button
            type="button"
            onClick={onDelete}
            title="Excluir item (Delete)"
            className="w-7 h-7 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md text-xs font-bold ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Aviso de Item Travado */}
        {isLocked && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-sans flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Elemento travado. Destrave acima para mover ou redimensionar.</span>
          </div>
        )}

        {/* Preview se for imagem personalizada */}
        {selectedElement.shapeType === 'custom-image' && selectedElement.imageUrl && (
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans block mb-1.5">
              Imagem Importada
            </label>
            <div className="w-full h-24 rounded-xl bg-zinc-50 border border-zinc-200/80 p-2 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedElement.imageUrl}
                alt={selectedElement.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Edição de Texto se for elemento Texto */}
        {selectedElement.shapeType === 'text' && (
          <div className="space-y-3.5 p-3.5 bg-orange-50/30 rounded-xl border border-orange-200/60">
            {/* Conteúdo do Texto */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Type className="w-3.5 h-3.5 text-orange-600" />
                <label className="text-[11px] font-semibold text-zinc-800 tracking-wide font-sans">
                  Texto
                </label>
              </div>
              <textarea
                rows={2}
                disabled={isLocked}
                value={selectedElement.text || ''}
                onChange={(e) => onUpdateElement({ text: e.target.value })}
                placeholder="Digite o texto aqui..."
                className="w-full text-xs font-sans text-zinc-800 bg-white border border-zinc-200 rounded-lg p-2 outline-none focus:border-orange-400 disabled:bg-zinc-100 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Tamanho da Fonte */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-zinc-600 font-sans">Tamanho da fonte</span>
                <span className="text-xs font-mono font-semibold text-zinc-800">
                  {selectedElement.fontSize || 32}px
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="96"
                step="2"
                disabled={isLocked}
                value={selectedElement.fontSize || 32}
                onChange={(e) => onUpdateElement({ fontSize: parseInt(e.target.value) || 32 })}
                className="w-full accent-orange-600 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none disabled:opacity-50"
              />
            </div>

            {/* Estilo (Peso) e Alinhamento */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] font-medium text-zinc-600 font-sans block mb-1">
                  Peso
                </span>
                <div className="grid grid-cols-2 gap-1 bg-white p-0.5 rounded-lg border border-zinc-200">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onUpdateElement({ fontWeight: 'normal' })}
                    className={`py-1 text-[11px] font-sans rounded transition-colors cursor-pointer ${
                      selectedElement.fontWeight !== 'bold'
                        ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onUpdateElement({ fontWeight: 'bold' })}
                    className={`py-1 text-[11px] font-sans font-bold rounded transition-colors cursor-pointer ${
                      selectedElement.fontWeight === 'bold'
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    Negrito
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-medium text-zinc-600 font-sans block mb-1">
                  Alinhamento
                </span>
                <div className="grid grid-cols-3 gap-0.5 bg-white p-0.5 rounded-lg border border-zinc-200">
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onUpdateElement({ align: 'left' })}
                    title="Alinhar à esquerda"
                    className={`py-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                      selectedElement.align === 'left'
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onUpdateElement({ align: 'center' })}
                    title="Centralizar"
                    className={`py-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                      !selectedElement.align || selectedElement.align === 'center'
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => onUpdateElement({ align: 'right' })}
                    title="Alinhar à direita"
                    className={`py-1 flex items-center justify-center rounded transition-colors cursor-pointer ${
                      selectedElement.align === 'right'
                        ? 'bg-zinc-900 text-white shadow-2xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. Medidas Reais (Centímetros & Pixels) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-zinc-400" />
              Medidas do Elemento
            </label>
            <span className="text-[10px] text-zinc-400 font-mono">1cm = 2px</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 font-sans block mb-1">Largura (cm)</span>
              <div className="relative">
                <input
                  type="number"
                  disabled={isLocked}
                  value={widthCm}
                  onChange={(e) => {
                    const cm = Math.max(10, parseInt(e.target.value) || 10);
                    onUpdateElement({ width: SCALE.cmToPx(cm) });
                  }}
                  className="w-full text-xs font-mono text-zinc-800 border border-zinc-200 rounded-md px-2.5 py-1.5 outline-none focus:border-orange-400 disabled:bg-zinc-100 disabled:cursor-not-allowed"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-zinc-400 pointer-events-none">cm</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{Math.round(selectedElement.width)} px</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 font-sans block mb-1">Altura (cm)</span>
              <div className="relative">
                <input
                  type="number"
                  disabled={isLocked}
                  value={heightCm}
                  onChange={(e) => {
                    const cm = Math.max(10, parseInt(e.target.value) || 10);
                    onUpdateElement({ height: SCALE.cmToPx(cm) });
                  }}
                  className="w-full text-xs font-mono text-zinc-800 border border-zinc-200 rounded-md px-2.5 py-1.5 outline-none focus:border-orange-400 disabled:bg-zinc-100 disabled:cursor-not-allowed"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-zinc-400 pointer-events-none">cm</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{Math.round(selectedElement.height)} px</span>
            </div>
          </div>
        </div>

        {/* 2. Posição e Rotação */}
        <div>
          <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans block mb-2">
            Posição & Rotação
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 font-sans block mb-1">X</span>
              <input
                type="number"
                disabled={isLocked}
                value={Math.round(selectedElement.x)}
                onChange={(e) => onUpdateElement({ x: parseInt(e.target.value) || 0 })}
                className="w-full text-xs font-mono text-zinc-800 border border-zinc-200 rounded-md px-2 py-1 outline-none focus:border-orange-400 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-sans block mb-1">Y</span>
              <input
                type="number"
                disabled={isLocked}
                value={Math.round(selectedElement.y)}
                onChange={(e) => onUpdateElement({ y: parseInt(e.target.value) || 0 })}
                className="w-full text-xs font-mono text-zinc-800 border border-zinc-200 rounded-md px-2 py-1 outline-none focus:border-orange-400 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-sans block mb-1">Giro (°)</span>
              <input
                type="number"
                disabled={isLocked}
                value={Math.round(selectedElement.rotation)}
                onChange={(e) => onUpdateElement({ rotation: parseInt(e.target.value) || 0 })}
                className="w-full text-xs font-mono text-zinc-800 border border-zinc-200 rounded-md px-2 py-1 outline-none focus:border-orange-400 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 3. Cores (se não for imagem) */}
        {selectedElement.shapeType !== 'custom-image' && (
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans block mb-2">
              {selectedElement.shapeType === 'text' ? 'Cor do Texto' : 'Cor do Elemento'}
            </label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onUpdateElement({ fill: color.value })}
                  title={color.name}
                  className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                    selectedElement.fill.toLowerCase() === color.value.toLowerCase()
                      ? 'ring-2 ring-orange-500 ring-offset-2 scale-110 border-transparent'
                      : 'border-zinc-300 hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                disabled={isLocked}
                value={selectedElement.fill.startsWith('#') ? selectedElement.fill : '#E7DFD5'}
                onChange={(e) => onUpdateElement({ fill: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border border-zinc-200 p-0 disabled:cursor-not-allowed"
              />
              <input
                type="text"
                disabled={isLocked}
                value={selectedElement.fill}
                onChange={(e) => onUpdateElement({ fill: e.target.value })}
                className="flex-1 text-xs font-mono text-zinc-700 border border-zinc-200 rounded-md px-2 py-1 outline-none focus:border-zinc-400 disabled:bg-zinc-100"
              />
            </div>
          </div>
        )}

        {/* 4. Opacidade */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans">
              Opacidade
            </label>
            <span className="text-[11px] text-zinc-500 font-mono">
              {Math.round(selectedElement.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            disabled={isLocked}
            value={selectedElement.opacity}
            onChange={(e) => onUpdateElement({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-orange-600 cursor-pointer h-1.5 bg-zinc-200 rounded-lg appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* 5. Ordem das Camadas (4 comandos: Top, Up, Down, Bottom) */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <label className="text-[11px] font-semibold text-zinc-700 tracking-wide font-sans">
              Ordem de Camadas
            </label>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBringToFront}
              className="text-[11px] h-7.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans cursor-pointer justify-start px-2"
            >
              <ArrowUpToLine className="w-3 h-3 mr-1 text-zinc-400" />
              Trazer p/ frente
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBringForward}
              className="text-[11px] h-7.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans cursor-pointer justify-start px-2"
            >
              <ArrowUp className="w-3 h-3 mr-1 text-zinc-400" />
              Avançar camada
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSendBackward}
              className="text-[11px] h-7.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans cursor-pointer justify-start px-2"
            >
              <ArrowDown className="w-3 h-3 mr-1 text-zinc-400" />
              Recuar camada
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSendToBack}
              className="text-[11px] h-7.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans cursor-pointer justify-start px-2"
            >
              <ArrowDownToLine className="w-3 h-3 mr-1 text-zinc-400" />
              Enviar p/ trás
            </Button>
          </div>
        </div>

        {/* 6. Ações Rápidas (Duplicar, Travar, Excluir) */}
        <div className="pt-2 border-t border-zinc-100 flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDuplicate}
            className="w-full text-xs h-8 border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans cursor-pointer justify-center"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
            Duplicar item (Ctrl+D)
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onUpdateElement({ locked: !isLocked })}
            className={`w-full text-xs h-8 border font-sans cursor-pointer justify-center ${
              isLocked 
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' 
                : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {isLocked ? (
              <>
                <Unlock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Destravar posição
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                Travar posição
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="w-full text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-sans cursor-pointer justify-center"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Excluir elemento
          </Button>
        </div>

      </div>
    </aside>
  );
}
