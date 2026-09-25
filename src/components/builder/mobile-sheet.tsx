'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxHeight?: string;
}

export default function MobileSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxHeight = 'max-h-[82vh]',
}: MobileSheetProps) {
  // Previne scroll do body quando o sheet estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* Backdrop com blur suave */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Painel do Bottom Sheet */}
      <div
        className={`relative z-10 w-full bg-white rounded-t-2xl shadow-2xl flex flex-col ${maxHeight} animate-in slide-in-from-bottom duration-250 ease-out`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Puxador decorativo para arrastar/fechar */}
        <div className="w-full pt-3 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-zinc-300 rounded-full hover:bg-zinc-400 transition-colors" />
        </div>

        {/* Header do Sheet */}
        <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 font-sans leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-zinc-400 font-sans leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
