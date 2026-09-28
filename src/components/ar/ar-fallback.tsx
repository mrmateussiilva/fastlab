'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Move } from 'lucide-react';

interface ARFallbackProps {
  imageUrl: string;
}

export default function ARFallback({ imageUrl }: ARFallbackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCamera(true);
      } catch (err) {
        console.error("Camera access denied or error:", err);
        setHasCamera(false);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative bg-zinc-900 overflow-hidden flex flex-col items-center justify-center">
      {hasCamera === false && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 text-zinc-400">
          <Camera className="w-12 h-12 mb-4 opacity-50" />
          <p className="font-sans text-sm">Não foi possível acessar a câmera.</p>
          <p className="text-xs mt-2 opacity-70 font-sans">Permita o acesso ou tente em outro dispositivo.</p>
        </div>
      )}

      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay Mockup Image */}
      {hasCamera !== false && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20 overflow-hidden">
          {/* Container simulando perspectiva */}
          <div className="relative w-[90%] sm:w-[80%] max-w-lg pointer-events-auto cursor-move group mt-20">
            <img 
              src={imageUrl} 
              alt="Mockup AR Fallback" 
              className="w-full h-auto drop-shadow-2xl"
              style={{
                transform: 'perspective(1000px) rotateX(5deg)',
                transformOrigin: 'bottom center'
              }}
            />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-black/60 text-white text-[10px] px-3 py-1.5 rounded-full backdrop-blur-md">
              <Move className="w-3 h-3" /> Posição Fixa na Tela
            </div>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none">
         <div className="bg-black/60 text-white px-4 py-2 text-xs rounded-full backdrop-blur-md font-sans flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
           Modo de Simulação Ativo (Câmera + Overlay)
         </div>
      </div>
    </div>
  );
}
