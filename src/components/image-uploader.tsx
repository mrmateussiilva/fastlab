'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download, RefreshCw, Loader2, Plus } from 'lucide-react';

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 10MB.');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Formato inválido. Use PNG, JPG ou WEBP.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResultUrl(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsGenerating(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar imagem');
      }

      setResultUrl(data.image);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNewProject = () => {
    handleReset();
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'festalab-render.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Grid sutil limitado à região superior */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Header simples e discreto */}
      <header className="w-full border-b border-zinc-200/70 bg-[#FAFAF8]/90 backdrop-blur-xs sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-950 select-none">
            FestaLab
          </span>
          <button
            type="button"
            onClick={handleNewProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50 transition-colors cursor-pointer font-sans"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo projeto
          </button>
        </div>
      </header>

      {/* Hero compacto (altura reduzida) */}
      <section className="text-center pt-8 pb-5 md:pt-10 md:pb-6 px-4 max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-normal tracking-tight text-zinc-900 leading-tight">
          Do projeto à realidade.
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-500 font-sans leading-relaxed">
          Envie seu mockup e gere uma apresentação fotorealista em segundos.
        </p>
      </section>

      {/* Input de arquivo invisível */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Área de Trabalho / Workspace */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 flex-1 flex flex-col">
        {/* Mensagem de erro amigável */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mb-6 p-3.5 bg-red-50/90 border border-red-200/80 rounded-xl text-red-700 text-xs sm:text-sm text-center flex items-center justify-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        {/* Estado 1: Upload (nenhuma imagem selecionada) */}
        {!file && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full max-w-3xl mx-auto bg-white rounded-2xl border ${
              isDragging
                ? 'border-orange-500/80 bg-orange-50/20 ring-2 ring-orange-500/20'
                : 'border-zinc-200/80 hover:border-zinc-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
            } p-12 sm:p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group`}
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center mb-5 text-zinc-500 group-hover:text-zinc-800 group-hover:scale-105 transition-all">
              <UploadCloud className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight mb-1 font-sans">
              Arraste sua imagem aqui
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 mb-5 font-sans">
              ou clique para selecionar do seu computador
            </p>
            <span className="text-[11px] font-medium tracking-wide text-zinc-400 bg-zinc-50 border border-zinc-200/60 px-3 py-1 rounded-full uppercase">
              PNG, JPG ou WEBP (até 10MB)
            </span>
          </div>
        )}

        {/* Estado 2: Imagem selecionada (preview antes de gerar) */}
        {file && previewUrl && !resultUrl && (
          <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-zinc-800 tracking-tight font-sans">
                  Projeto original
                </h3>
                <span className="text-xs text-zinc-400 font-sans truncate max-w-[200px] sm:max-w-none">
                  ({file.name})
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
                className="text-xs text-zinc-500 hover:text-zinc-900 font-sans transition-colors cursor-pointer"
              >
                Trocar imagem
              </button>
            </div>

            <div className="w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-xl bg-[#F4F4F2] border border-zinc-200/60 overflow-hidden flex items-center justify-center p-3 relative">
              <img
                src={previewUrl}
                alt="Preview do mockup"
                className="w-full h-full object-contain select-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isGenerating}
                className="h-10 px-4 text-xs font-medium text-zinc-700 border-zinc-200/80 bg-white hover:bg-zinc-50 cursor-pointer font-sans"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-10 px-6 text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer font-sans min-w-[190px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Gerando sua imagem...
                  </>
                ) : (
                  <>Gerar imagem realista</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Estado 3: Comparação (Resultado gerado com sucesso) */}
        {resultUrl && (
          <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 sm:p-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Coluna Original */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between h-7">
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-700 tracking-tight font-sans">
                    Projeto original
                  </h3>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-zinc-400 hover:text-zinc-600 font-sans transition-colors cursor-pointer"
                  >
                    Trocar imagem
                  </button>
                </div>

                <div className="w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[500px] rounded-xl bg-[#F4F4F2] border border-zinc-200/60 overflow-hidden flex items-center justify-center p-3 relative">
                  <img
                    src={previewUrl!}
                    alt="Projeto original"
                    className="w-full h-full object-contain select-none"
                  />
                </div>
              </div>

              {/* Coluna Resultado */}
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
                    src={resultUrl}
                    alt="Resultado realista"
                    className="w-full h-full object-contain select-none"
                  />
                </div>

                {/* Ações integradas diretamente sob o resultado */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="h-10 px-4 text-xs font-medium text-zinc-700 border-zinc-200/80 bg-white hover:bg-zinc-50 shadow-xs cursor-pointer font-sans"
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
        )}
      </div>
    </div>
  );
}
