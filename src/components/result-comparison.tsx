'use client';
/* eslint-disable @next/next/no-img-element */

import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Loader2, ArrowLeft } from 'lucide-react';

interface ResultComparisonProps {
  originalImage: string;
  resultImage: string;
  originalLabel?: string;
  isGenerating?: boolean;
  onRegenerate: () => void;
  onBack?: () => void;
  backLabel?: string;
  isRegenerateDisabled?: boolean;
  limitBadge?: React.ReactNode;
}

export default function ResultComparison({
  originalImage,
  resultImage,
  originalLabel = 'Projeto original',
  isGenerating = false,
  onRegenerate,
  onBack,
  backLabel = 'Voltar',
  isRegenerateDisabled = false,
  limitBadge,
}: ResultComparisonProps) {
  const handleDownload = async () => {
    if (!resultImage) return;
    try {
      if (resultImage.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = resultImage;
        a.download = 'festalab-render.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const response = await fetch(resultImage);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'festalab-render.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      }
    } catch {
      window.open(resultImage, '_blank');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        
        {/* Coluna 1: Imagem Original / Mockup Criado */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between h-7">
            <h3 className="text-sm sm:text-base font-semibold text-zinc-700 tracking-tight font-sans">
              {originalLabel}
            </h3>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 font-sans transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {backLabel}
              </button>
            )}
          </div>

          <div className="w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[500px] rounded-xl bg-[#F4F4F2] border border-zinc-200/60 overflow-hidden flex items-center justify-center p-3 relative">
            <img
              src={originalImage}
              alt={originalLabel}
              className="w-full h-full object-contain select-none"
            />
          </div>
        </div>

        {/* Coluna 2: Resultado Fotorealista */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between h-7">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-zinc-950 tracking-tight font-sans">
                Resultado realista
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/60 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Fotorealista
              </span>
            </div>
          </div>

          <div className="w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[500px] rounded-xl bg-[#F4F4F2] border border-zinc-200/60 overflow-hidden flex items-center justify-center p-3 relative">
            <img
              src={resultImage}
              alt="Resultado realista"
              className="w-full h-full object-contain select-none"
            />
          </div>

          {/* Ações integradas diretamente sob o resultado */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div>
              {limitBadge}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onRegenerate}
                disabled={isGenerating || isRegenerateDisabled}
                className="h-10 px-4 text-xs font-medium text-zinc-700 border-zinc-200/80 bg-white hover:bg-zinc-50 shadow-xs cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-zinc-500" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                )}
                Gerar novamente
              </Button>
              <Button
                onClick={handleDownload}
                className="h-10 px-5 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer font-sans"
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                Baixar imagem
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
