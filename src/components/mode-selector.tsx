'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import InstallPrompt from '@/components/pwa/install-prompt';
import { FestaTemplate } from '@/lib/templates';
import AIDemoSection from '@/components/ai-demo-section';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import ProjectsDashboard from '@/components/projects-dashboard';
import { TemplateGallery } from '@/components/templates/template-gallery';
import { ThemeGallery } from '@/components/themes/theme-gallery';
import AIPartyChat from '@/components/ai-party-chat';

interface ModeSelectorProps {
  onSelectMode: (mode: 'upload' | 'builder') => void;
  onOpenProject?: (projectId: string) => void;
}

const STEPS = [
  {
    title: 'Monte a festa',
    desc: 'Arraste painéis, mesas, cilindros e balões, comece por um modelo ou suba as artes do seu acervo.',
  },
  {
    title: 'Deixe com a cara do cliente',
    desc: 'Troque cores, estampas e posições até chegar no tema que ele pediu.',
  },
  {
    title: 'Gere a foto e envie',
    desc: 'A IA transforma a montagem em uma foto realista. Baixe e mande no WhatsApp do cliente.',
  },
];

const FAQ = [
  {
    q: 'Quanto custa?',
    a: 'Nada. O FestaLab está 100% gratuito. Para manter assim para todo mundo, cada pessoa pode gerar 2 imagens com IA por hora. O editor é ilimitado.',
  },
  {
    q: 'Preciso saber design?',
    a: 'Não. É só arrastar os elementos e trocar as cores. Se preferir, comece por um modelo pronto ou descreva a festa para a IA montar por você.',
  },
  {
    q: 'Preciso criar conta?',
    a: 'Para montar a festa, não. Para gerar a foto com IA, baixar e salvar seus projetos, é só entrar com seu e-mail. É grátis.',
  },
  {
    q: 'Funciona no celular?',
    a: 'Sim. Funciona no navegador do celular, do tablet e do computador, sem instalar nada.',
  },
  {
    q: 'A foto fica igual à montagem real?',
    a: 'A foto é uma referência para o cliente enxergar cores, clima e composição. Medidas e materiais podem variar, e o acabamento final é a sua arte.',
  },
  {
    q: 'Posso usar minhas próprias artes?',
    a: 'Pode. Faça upload dos seus painéis e imagens e monte com o seu acervo.',
  },
];

const btnPrimary =
  'inline-flex items-center justify-center h-12 px-7 rounded-full bg-brand text-white font-semibold text-[15px] hover:bg-brand-deep transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink';

export default function ModeSelector({ onSelectMode, onOpenProject }: ModeSelectorProps) {
  const { isSignedIn } = useAuth();
  const [galleryTab, setGalleryTab] = useState<'templates' | 'themes'>('templates');

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

  const startBlank = () => handleSelectTemplate(null);

  return (
    <div className="w-full flex flex-col flex-1 bg-white text-ink font-sans selection:bg-orange-100">

      {/* Header */}
      <header className="w-full sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" aria-label="FestaLab, início" className="shrink-0">
            <Image src="/logo-horizontal.png" alt="FestaLab" width={160} height={40} className="h-7 sm:h-8 w-auto" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
            <a href="#como-funciona" className="hover:text-ink transition-colors">Como funciona</a>
            <a href="#modelos" className="hover:text-ink transition-colors">Modelos</a>
            <a href="#duvidas" className="hover:text-ink transition-colors">Dúvidas</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-ink-soft hover:text-ink px-2 py-2 cursor-pointer">Entrar</button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-sm font-medium text-ink-soft hover:text-ink">Meus projetos</Link>
                <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              </div>
            )}
            <button onClick={startBlank} className="hidden sm:inline-flex items-center h-10 px-5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-black transition-colors cursor-pointer">
              Montar festa grátis
            </button>
          </div>
        </div>
      </header>

      {/* Hero: a demo é o destaque */}
      <section className="w-full px-4 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.05] tracking-[-0.01em] text-balance">
            Seu cliente vê a festa pronta antes de você montar
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-soft leading-relaxed max-w-[34rem] mx-auto text-pretty">
            Monte a mesa, os painéis e os balões no FestaLab. A IA transforma a montagem em uma foto realista para você mandar no WhatsApp.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            <button onClick={startBlank} className={btnPrimary}>Montar minha festa grátis</button>
            <a href="#ia" className="text-[15px] font-medium text-ink underline underline-offset-4 decoration-line hover:decoration-ink">
              Ou descreva a festa para a IA
            </a>
          </div>
          <p className="mt-5 text-sm text-ink-soft">Grátis, sem cartão e funciona no celular.</p>
        </div>

        <div className="max-w-5xl mx-auto mt-12 sm:mt-16">
          <AIDemoSection />
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="w-full bg-mist px-4 sm:px-6 py-16 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl leading-tight">Como funciona</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5 md:flex-col md:gap-4">
                <span className="font-display text-5xl leading-none text-brand shrink-0 w-8" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-ink-soft leading-relaxed max-w-[32ch]">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* IA monta a festa a partir de uma descrição */}
      <section id="ia" className="w-full px-4 sm:px-6 py-16 sm:py-24 scroll-mt-16">
        <AIPartyChat onStartWithGeneratedScene={() => onSelectMode('builder')} />
      </section>

      {/* Modelos */}
      <section id="modelos" className="w-full border-t border-line px-4 sm:px-6 py-16 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl leading-tight">Comece por um modelo</h2>
              <p className="mt-3 text-ink-soft text-lg max-w-[40ch]">Escolha um tema, troque as cores e os detalhes, e a proposta fica pronta em minutos.</p>
            </div>
            <div role="tablist" aria-label="Tipo de modelo" className="inline-flex self-start md:self-auto p-1 rounded-full bg-mist">
              {([
                ['templates', 'Modelos prontos'],
                ['themes', 'Temas com foto'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={galleryTab === key}
                  onClick={() => setGalleryTab(key)}
                  className={`h-9 px-4 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    galleryTab === key ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {galleryTab === 'themes' ? (
            <ThemeGallery
              onSelectTheme={(theme) => {
                if (theme.elements && Array.isArray(theme.elements) && theme.elements.length > 0) {
                  localStorage.setItem('festalab_project_elements', JSON.stringify(theme.elements));
                  if (theme.environment) {
                    localStorage.setItem('festalab_environment_state', JSON.stringify(theme.environment));
                  } else {
                    localStorage.removeItem('festalab_environment_state');
                  }
                  localStorage.setItem('festalab_project_name', theme.name);
                  onSelectMode('builder');
                } else {
                  startBlank();
                }
              }}
            />
          ) : (
            <TemplateGallery onSelectTemplate={(template) => handleSelectTemplate(template)} />
          )}
        </div>
      </section>

      {/* Projetos do usuário (só aparece logado) */}
      <ProjectsDashboard onNewProject={startBlank} onOpenProject={onOpenProject ?? (() => {})} />

      {/* Dúvidas */}
      <section id="duvidas" className="w-full bg-mist px-4 sm:px-6 py-16 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <h2 className="font-display text-3xl sm:text-4xl leading-tight">Dúvidas</h2>
          <div className="border-t border-line">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group border-b border-line">
                <summary className="flex items-center justify-between gap-6 cursor-pointer list-none py-5 text-base sm:text-lg font-medium [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-ink rounded-sm">
                  {q}
                  <Plus className="w-5 h-5 text-ink-soft shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" />
                </summary>
                <p className="pb-6 -mt-1 text-ink-soft leading-relaxed max-w-[60ch]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full px-4 sm:px-6 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] text-balance">
            Monte a próxima festa e mostre antes de montar
          </h2>
          <p className="mt-5 text-lg text-ink-soft">Comece sem criar conta. Para gerar a foto, é só entrar com seu e-mail.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={startBlank} className={btnPrimary}>Montar minha festa grátis</button>
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="text-[15px] font-medium text-ink-soft hover:text-ink px-2 py-2 cursor-pointer">Já tenho conta</button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="w-full border-t border-line px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-soft">
          <Image src="/logo-horizontal.png" alt="FestaLab" width={120} height={30} className="h-6 w-auto" />
          <div className="flex items-center gap-5">
            <Link href="/privacidade" className="hover:text-ink">Privacidade</Link>
            <span>© {new Date().getFullYear()} FestaLab, feito no Brasil</span>
          </div>
        </div>
      </footer>

      <InstallPrompt />
    </div>
  );
}
