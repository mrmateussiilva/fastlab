'use client';
/* eslint-disable @next/next/no-img-element */

import { 
  UploadCloud, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  FolderUp, 
  Boxes, 
  Move
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModeSelectorProps {
  onSelectMode: (mode: 'upload' | 'builder') => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('como-funciona');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 bg-[#FAFAF8] text-zinc-900">
      {/* Background grid sutil decorativo */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* ==================================================
          HEADER
          ================================================== */}
      <header className="w-full border-b border-zinc-200/70 bg-[#FAFAF8]/90 backdrop-blur-xs sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-950 select-none">
              FestaLab
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={scrollToHowItWorks}
              className="text-xs sm:text-sm font-medium text-zinc-600 hover:text-zinc-950 px-2 sm:px-3 py-1.5 transition-colors cursor-pointer font-sans"
            >
              Como funciona
            </button>
            <Button
              size="sm"
              onClick={() => onSelectMode('builder')}
              className="h-8 sm:h-9 px-3.5 sm:px-4 text-xs sm:text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-2xs transition-colors cursor-pointer font-sans"
            >
              Testar grátis
            </Button>
          </div>
        </div>
      </header>

      {/* ==================================================
          1. HERO
          ================================================== */}
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-6 max-w-[1200px] mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-800 border border-orange-200/60 mb-5 font-sans">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Apresentação Fotorealista para Festas</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-[54px] font-normal tracking-tight text-zinc-950 leading-[1.14] max-w-3xl mx-auto">
          Monte a decoração. Mostre o resultado antes da montagem.
        </h1>

        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-zinc-600 font-sans leading-relaxed max-w-2xl mx-auto">
          Crie seu mockup com painéis, mesas, balões e itens do seu acervo ou envie um projeto pronto. O FestaLab transforma a composição em uma apresentação fotorealista.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Button
            onClick={() => onSelectMode('builder')}
            className="w-full sm:w-auto h-12 px-7 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all hover:scale-[1.01] cursor-pointer font-sans"
          >
            Criar projeto grátis
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          <Button
            variant="outline"
            onClick={() => onSelectMode('upload')}
            className="w-full sm:w-auto h-12 px-6 text-sm font-medium text-zinc-800 bg-white hover:bg-zinc-50 border-zinc-200/80 shadow-2xs transition-colors cursor-pointer font-sans"
          >
            Enviar mockup
          </Button>
        </div>

        <p className="text-xs text-zinc-400 mt-3.5 font-sans">
          Grátis durante o período de testes. Sem cartão.
        </p>
      </section>

      {/* ==================================================
          2. ANTES / DEPOIS (Visual & Aspiracional)
          ================================================== */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
            Da composição ao resultado que o cliente entende.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-500 font-sans leading-relaxed">
            O mockup serve como base. O FestaLab transforma a ideia em uma apresentação visual muito mais próxima do resultado final.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-[0_4px_28px_rgba(0,0,0,0.03)] p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8 items-stretch relative">
            
            {/* Lado 1: Mockup */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-zinc-700 font-sans tracking-tight">
                  Mockup do projeto
                </span>
                <span className="text-[11px] text-zinc-400 font-sans">
                  Layout 2D estruturado
                </span>
              </div>

              <div className="w-full h-[300px] sm:h-[380px] md:h-[420px] rounded-xl bg-[#F8F8F6] border border-zinc-200/70 overflow-hidden flex items-center justify-center p-2">
                <img
                  src="/demo-mockup.jpg"
                  alt="Mockup do projeto de festa"
                  className="w-full h-full object-contain select-none rounded-lg"
                />
              </div>
            </div>

            {/* Seta indicativa central discreta no desktop */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-zinc-200 shadow-sm items-center justify-center text-zinc-500 pointer-events-none">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Lado 2: Resultado Fotorealista */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-zinc-950 font-sans tracking-tight flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Resultado fotorealista
                </span>
                <span className="text-[11px] font-medium text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60 font-sans">
                  Fotografia de Evento
                </span>
              </div>

              <div className="w-full h-[300px] sm:h-[380px] md:h-[420px] rounded-xl bg-[#F8F8F6] border-2 border-orange-500/20 overflow-hidden flex items-center justify-center p-2 relative shadow-xs">
                <img
                  src="/demo-real.jpg"
                  alt="Apresentação fotorealista gerada no FestaLab"
                  className="w-full h-full object-contain select-none rounded-lg"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          3. MOSTRAR O EDITOR REAL
          ================================================== */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
            Monte com o seu próprio acervo.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-500 font-sans leading-relaxed">
            Use painéis, mesas, cilindros, balões e imagens dos itens que você já possui para criar a composição.
          </p>
        </div>

        {/* Screenshot grande do editor */}
        <div className="max-w-[1100px] mx-auto bg-white rounded-2xl border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="w-full aspect-[16/9] sm:aspect-[16/10] bg-zinc-100 flex items-center justify-center overflow-hidden">
            <img
              src="/editor-preview.jpg"
              alt="Editor visual do FestaLab"
              className="w-full h-full object-cover select-none"
            />
          </div>
        </div>

        {/* Três benefícios curtos em uma linha */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-zinc-700 mt-8 font-sans">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-orange-600" />
            <span>Use itens da biblioteca</span>
          </div>
          <div className="flex items-center gap-2">
            <FolderUp className="w-4 h-4 text-orange-600" />
            <span>Importe seus próprios elementos</span>
          </div>
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-orange-600" />
            <span>Organize tudo visualmente no canvas</span>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. REFINAR "CRIE DO SEU JEITO"
          ================================================== */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
            Crie do seu jeito
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Monte do zero */}
          <div
            onClick={() => onSelectMode('builder')}
            className="group bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:border-zinc-400 hover:shadow-sm"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center mb-4 text-zinc-700 group-hover:text-orange-600 group-hover:bg-orange-50/50 group-hover:border-orange-200 transition-colors">
                <Layers className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight font-sans mb-1.5">
                Monte do zero
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
                Crie sua composição usando painéis, mesas, balões e elementos do seu acervo.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm font-medium text-zinc-800 group-hover:text-orange-600 transition-colors">
              <span>Montar projeto</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Já tem um projeto? */}
          <div
            onClick={() => onSelectMode('upload')}
            className="group bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:border-zinc-400 hover:shadow-sm"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center mb-4 text-zinc-700 group-hover:text-orange-600 group-hover:bg-orange-50/50 group-hover:border-orange-200 transition-colors">
                <UploadCloud className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight font-sans mb-1.5">
                Já tem um projeto?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
                Envie seu mockup ou layout pronto e transforme direto em uma apresentação realista.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs sm:text-sm font-medium text-zinc-800 group-hover:text-orange-600 transition-colors">
              <span>Enviar mockup</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          5. SEÇÃO DE PASSOS (Editorial, Números Grandes)
          ================================================== */}
      <section id="como-funciona" className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-zinc-950">
            Do projeto à apresentação em quatro passos.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          <div className="border-t border-zinc-200/80 pt-4">
            <span className="font-serif text-3xl sm:text-4xl text-zinc-300 font-light block mb-2">
              01
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 font-sans mb-1">
              Monte ou envie
            </h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Comece do zero ou use um projeto pronto.
            </p>
          </div>

          <div className="border-t border-zinc-200/80 pt-4">
            <span className="font-serif text-3xl sm:text-4xl text-zinc-300 font-light block mb-2">
              02
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 font-sans mb-1">
              Organize
            </h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Posicione os elementos e ajuste a composição.
            </p>
          </div>

          <div className="border-t border-zinc-200/80 pt-4">
            <span className="font-serif text-3xl sm:text-4xl text-zinc-300 font-light block mb-2">
              03
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 font-sans mb-1">
              Gere
            </h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Transforme o mockup em uma versão fotorealista.
            </p>
          </div>

          <div className="border-t border-zinc-200/80 pt-4">
            <span className="font-serif text-3xl sm:text-4xl text-zinc-300 font-light block mb-2">
              04
            </span>
            <h4 className="text-sm font-semibold text-zinc-900 font-sans mb-1">
              Apresente
            </h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Baixe a imagem e mostre ao cliente.
            </p>
          </div>

        </div>
      </section>

      {/* ==================================================
          6. CTA FINAL (Bloco Escuro, Alto Contraste)
          ================================================== */}
      <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="bg-zinc-950 text-white rounded-2xl p-8 sm:p-14 md:p-16 text-center relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-[40px] font-normal tracking-tight text-white leading-tight">
              Seu cliente não precisa imaginar como vai ficar.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 font-sans">
              Mostre antes de montar.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => onSelectMode('builder')}
                className="w-full sm:w-auto h-12 px-8 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-all hover:scale-[1.01] cursor-pointer font-sans"
              >
                Criar meu primeiro projeto
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <p className="text-xs text-zinc-500 mt-3.5 font-sans">
              Grátis durante o período de testes.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          FOOTER
          ================================================== */}
      <footer className="w-full border-t border-zinc-200/70 bg-[#FAFAF8] py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-serif text-base text-zinc-900 font-normal">FestaLab</span>
            <span className="text-zinc-300">|</span>
            <span>Do projeto à realidade.</span>
          </div>

          <p className="text-center sm:text-right text-zinc-400">
            Estúdio fotorealista para decoradores e produtores de festas.
          </p>
        </div>
      </footer>

    </div>
  );
}
