'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (localStorage.getItem('festalab_install_dismissed') === 'true') return;
    } catch {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      try {
        localStorage.setItem('festalab_install_dismissed', 'true');
      } catch {
        // ignora falha de persistência
      }
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem('festalab_install_dismissed', 'true');
    } catch {
      // ignora falha de persistência
    }
    setDeferredPrompt(null);
  }, []);

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/95 text-white backdrop-blur-md rounded-full shadow-2xl pl-4 pr-2 py-2 flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-200 max-w-[calc(100vw-2rem)]">
      <Download className="w-4 h-4 text-orange-400 shrink-0" />
      <span className="text-xs font-medium font-sans whitespace-nowrap">
        Instale o FestaLab no seu celular
      </span>
      <button
        type="button"
        onClick={handleInstall}
        className="h-8 px-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium font-sans active:scale-95 transition-all cursor-pointer whitespace-nowrap"
      >
        Instalar
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        title="Dispensar"
        className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-colors cursor-pointer shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
