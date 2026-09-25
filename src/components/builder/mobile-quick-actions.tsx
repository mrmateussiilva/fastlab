'use client';

import React from 'react';
import { Copy, Trash2, Sliders, ArrowUp, ArrowDown, X } from 'lucide-react';
import { CanvasElement } from '@/lib/builder-elements';

interface MobileQuickActionsProps {
  selectedElement: CanvasElement | null;
  onOpenProperties: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDeselect: () => void;
}

export default function MobileQuickActions({
  selectedElement,
  onOpenProperties,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onDeselect,
}: MobileQuickActionsProps) {
  if (!selectedElement) return null;

  return (
    <div className="md:hidden fixed bottom-16 left-1/2 -translate-x-1/2 z-35 bg-zinc-900/95 text-white backdrop-blur-md px-2 py-1.5 rounded-full shadow-2xl border border-zinc-800 flex items-center gap-1 animate-in slide-in-from-bottom-2 duration-200">
      
      {/* Botão Editar Propriedades / Cores */}
      <button
        type="button"
        onClick={onOpenProperties}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium font-sans cursor-pointer transition-colors active:scale-95"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>Editar</span>
      </button>

      <div className="w-px h-4 bg-zinc-700 mx-0.5" />

      {/* Duplicar */}
      <button
        type="button"
        onClick={onDuplicate}
        title="Duplicar"
        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      {/* Trazer para Frente */}
      <button
        type="button"
        onClick={onBringForward}
        title="Avançar camada"
        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>

      {/* Enviar para Trás */}
      <button
        type="button"
        onClick={onSendBackward}
        title="Recuar camada"
        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>

      {/* Excluir */}
      <button
        type="button"
        onClick={onDelete}
        title="Excluir item"
        className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer active:scale-95"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="w-px h-4 bg-zinc-700 mx-0.5" />

      {/* Desmarcar */}
      <button
        type="button"
        onClick={onDeselect}
        title="Desmarcar"
        className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
