'use client';
/* eslint-disable @next/next/no-img-element */

import { ArrowRight, Sparkles, Wand2, Layers, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstallPrompt from '@/components/pwa/install-prompt';
import { FESTA_TEMPLATES, FestaTemplate } from '@/lib/templates';
import ImageComparator from '@/components/image-comparator';

interface ModeSelectorProps {
  onSelectMode: (mode: 'upload' | 'builder') => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const handleSelectTemplate = (template: FestaTemplate | null) => {
    if (template) {
      localStorage.setItem('festalab_project_elements', JSON.stringify(template.elements));
      localStorage.setItem('festalab_environment_state', JSON.stringify(template.environment));
    } else {
      localStorage.removeItem('festalab_project_elements');
      localStorage.removeItem('festalab_environment_state');
    }
    onSelectMode('builder');
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('como-funciona');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full flex flex-col flex-1 bg-white text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* HEADER */}
      <header className="w-full border-b border-zinc-100 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif text-2xl tracking-tight text-zinc-900 select-none font-medium">
            FestaLab
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <button onClick={scrollToHowItWorks} className="hover:text-zinc-900 transition-colors cursor-pointer">Como funciona</button>
            <button onClick={() => {
              const el = document.getElementById('exemplos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-zinc-900 transition-colors cursor-pointer">Exemplos</button>
          </nav>
          <div>
            <Button
              onClick={() => handleSelectTemplate(null)}
              className="h-9 px-5 text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-md transition-colors cursor-pointer"
            >
              Criar meu cenário
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full px-6 pt-20 pb-24 md:pt-32 md:pb-32 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 text-left">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[64px] font-medium tracking-tight text-zinc-900 leading-[1.1] mb-6">
            Mostre como a festa vai ficar antes de montar.
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-10 max-w-lg">
            Monte cenários com painéis, balões e móveis. Explore combinações e use a IA para visualizar sua ideia antes de apresentar ao cliente.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={() => handleSelectTemplate(null)}
              className="w-full sm:w-auto h-12 px-8 text-base font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-sm rounded-md transition-all cursor-pointer"
            >
              Criar meu cenário grátis
            </Button>
            <Button
              variant="outline"
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto h-12 px-8 text-base font-medium border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-md transition-colors cursor-pointer bg-white"
            >
              Ver como funciona
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl lg:max-w-none">
          <div className="bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 shadow-md">
            <img
              src="/editor-preview.jpg"
              alt="Editor visual de festas FestaLab"
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="w-full bg-zinc-50 py-24 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
              Você monta a ideia. A IA ajuda a visualizar.
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Compare seu mockup com a visualização gerada a partir dele.
            </p>
          </div>

          <ImageComparator 
            pairs={[
              {
                id: '1',
                name: 'Decoração Inicial',
                mockupUrl: '/demo-mockup.jpg',
                realUrl: '/demo-real.jpg',
                isComparable: false // Definido como false porque o mockup atual tem UI ao redor. (Troque para true quando tiver uma imagem de mockup limpa com a mesma proporção)
              }
            ]}
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
              Como funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col">
              <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-800 mb-6 border border-zinc-200">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">1. Monte a base</h3>
              <p className="text-zinc-600 leading-relaxed">
                Escolha os elementos disponíveis (painéis, mesas, balões) e organize a composição no canvas 2D de forma visual.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-800 mb-6 border border-zinc-200">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">2. Dê a sua identidade</h3>
              <p className="text-zinc-600 leading-relaxed">
                Combine cores, faça o upload das suas próprias imagens e estampas para desenvolver o tema exato da festa.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-6 border border-orange-100">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">3. Visualize a ideia</h3>
              <p className="text-zinc-600 leading-relaxed">
                Use os recursos de IA integrados para explorar o resultado realista e exportar uma apresentação profissional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES (Possibilidades Visuais) */}
      <section id="exemplos" className="w-full bg-zinc-50 py-24 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 mb-4">
                Comece por um modelo
              </h2>
              <p className="text-zinc-500 text-lg">
                Projetos estruturados para você editar e transformar.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleSelectTemplate(null)}
              className="bg-white h-10 px-6 border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-md cursor-pointer"
            >
              Criar cenário do zero
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FESTA_TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="group bg-white rounded-xl border border-zinc-200 overflow-hidden cursor-pointer hover:border-orange-300 hover:shadow-md transition-all flex flex-col"
              >
                <div className={`w-full h-48 bg-gradient-to-br ${template.previewColor} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <Layers className="w-10 h-10 text-white/50" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="text-lg font-semibold text-zinc-900 mb-2">
                    {template.name}
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                    {template.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
                    Usar este modelo <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="w-full py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 mb-12">
            Por que usar o FestaLab?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="border-l-2 border-zinc-200 pl-5">
              <h4 className="font-semibold text-zinc-900 mb-2">Apresentar a ideia</h4>
              <p className="text-zinc-600 text-sm leading-relaxed">Mostre ao cliente exatamente o que você planejou de forma visual e clara, reduzindo dúvidas na aprovação.</p>
            </div>
            <div className="border-l-2 border-zinc-200 pl-5">
              <h4 className="font-semibold text-zinc-900 mb-2">Explorar alternativas</h4>
              <p className="text-zinc-600 text-sm leading-relaxed">Troque cores, posições e painéis rapidamente sem precisar de ferramentas complexas de design ou arquitetura.</p>
            </div>
            <div className="border-l-2 border-zinc-200 pl-5">
              <h4 className="font-semibold text-zinc-900 mb-2">Alinhar a montagem</h4>
              <p className="text-zinc-600 text-sm leading-relaxed">Tenha uma direção visual sólida antes do evento, garantindo que o acervo escolhido funciona bem junto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-zinc-900 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
            Sua próxima decoração começa aqui.
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            Acesse o estúdio e crie sua primeira proposta.
          </p>
          <Button
            onClick={() => handleSelectTemplate(null)}
            className="h-14 px-10 text-lg font-medium bg-orange-600 hover:bg-orange-500 text-white shadow-sm rounded-md transition-colors cursor-pointer"
          >
            Criar meu cenário grátis
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-zinc-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
          <div className="font-serif text-lg font-medium text-zinc-900">
            FestaLab
          </div>
          <div className="mt-4 md:mt-0">
            Estúdio digital para profissionais de decoração.
          </div>
        </div>
      </footer>

      <InstallPrompt />
    </div>
  );
}
