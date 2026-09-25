'use client';

import React from 'react';
import { Sparkles, Clock, AlertCircle } from 'lucide-react';
import { GenerationLimitData } from '@/hooks/use-generation-limit';

interface GenerationLimitBadgeProps {
  limitData: GenerationLimitData;
  className?: string;
  compact?: boolean;
}

export default function GenerationLimitBadge({
  limitData,
  className = '',
  compact = false,
}: GenerationLimitBadgeProps) {
  const { remaining, minutesUntilReset, globalLimitReached, loading } = limitData;

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs text-zinc-400 font-sans ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
        <span>Verificando disponibilidade...</span>
      </div>
    );
  }

  // 1. Limite Global atingido
  if (globalLimitReached) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-sans ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="leading-tight">
          As gerações gratuitas chegaram ao limite. O editor continua disponível normalmente.
        </span>
      </div>
    );
  }

  // 2. Limite por IP atingido (0 restantes)
  if (remaining === 0) {
    const minsText =
      minutesUntilReset && minutesUntilReset > 0
        ? `${minutesUntilReset} min.`
        : 'instantes';

    if (compact) {
      return (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200/80 text-zinc-600 text-[11px] font-sans ${className}`}
        >
          <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
          <span>Disponível em {minsText}</span>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col items-center sm:items-start text-xs font-sans space-y-0.5 ${className}`}
      >
        <div className="inline-flex items-center gap-1 text-zinc-700 font-medium">
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <span>Limite temporário atingido</span>
        </div>
        <div className="text-[11px] text-zinc-500">
          Novas gerações disponíveis em {minsText}
        </div>
      </div>
    );
  }

  // 3. 1 geração restante
  if (remaining === 1) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 text-xs text-zinc-600 font-sans ${className}`}
      >
        <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
        <span>1 geração gratuita disponível nesta hora</span>
      </div>
    );
  }

  // 4. 2 (ou mais) gerações restantes
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs text-zinc-600 font-sans ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
      <span>{remaining} gerações gratuitas disponíveis nesta hora</span>
    </div>
  );
}
