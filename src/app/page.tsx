'use client';

import { useState } from 'react';
import ModeSelector from '@/components/mode-selector';
import UploadWorkspace from '@/components/upload-workspace';
import MockupBuilder from '@/components/builder/mockup-builder';

export default function Home() {
  const [mode, setMode] = useState<'select' | 'upload' | 'builder'>('select');

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-zinc-900 flex flex-col relative overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
      {mode === 'select' && (
        <ModeSelector onSelectMode={(selected) => setMode(selected)} />
      )}

      {mode === 'upload' && (
        <UploadWorkspace onBack={() => setMode('select')} />
      )}

      {mode === 'builder' && (
        <MockupBuilder onBackToHome={() => setMode('select')} />
      )}
    </main>
  );
}
