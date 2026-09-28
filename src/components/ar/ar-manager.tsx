'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ARViewer = dynamic(() => import('./ar-viewer'), { 
  ssr: false,
  loading: () => <LoadingAR />
});

const ARFallback = dynamic(() => import('./ar-fallback'), { 
  ssr: false,
  loading: () => <LoadingAR />
});

function LoadingAR() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p className="font-sans text-sm">Iniciando ambiente AR...</p>
    </div>
  );
}

interface ARManagerProps {
  onClose: () => void;
  imageUrl: string | null;
}

export default function ARManager({ onClose, imageUrl }: ARManagerProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator && navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsSupported(supported);
      });
    } else {
      setIsSupported(false);
    }
  }, []);

  if (!imageUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col items-center justify-center p-4">
        <p className="mb-4 font-sans text-sm">Não foi possível capturar o projeto para AR.</p>
        <Button onClick={onClose} variant="outline" className="text-zinc-900 bg-white hover:bg-zinc-100 cursor-pointer">
          Voltar ao Editor
        </Button>
      </div>
    );
  }

  if (isSupported === null) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center text-white">
        <LoadingAR />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-95 transition-transform cursor-pointer"
        title="Fechar AR"
      >
        <X className="w-5 h-5" />
      </button>

      {isSupported ? (
        <ARViewer imageUrl={imageUrl} onClose={onClose} />
      ) : (
        <ARFallback imageUrl={imageUrl} />
      )}
    </div>
  );
}
