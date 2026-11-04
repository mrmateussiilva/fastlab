'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Layers,
  Image as ImageIcon,
  Zap,
  CheckCircle2,
  Play,
  MessageCircle,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstallPrompt from '@/components/pwa/install-prompt';
import { FESTA_TEMPLATES, FestaTemplate } from '@/lib/templates';
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

const STATS = [
  { value: '2 min', label: 'do zero à imagem' },
  { value: 'R$ 0', label: '100% gratuito' },
  { value: '0', label: 'programas para instalar' },
];

const FAQ = [
  {
    q: 'Quanto custa?',
    a: 'Nada. O FestaLab está 100% gratuito. Para manter assim para todo mundo, cada pessoa pode gerar 2 imagens com IA por hora. O editor é ilimitado.',
  },
  {
    q: 'Preciso saber design ou mexer com programas complicados?',
    a: 'Não. É só arrastar painéis, mesas e balões e trocar as cores. Se preferir, comece por um dos modelos prontos ou descreva a festa para a IA montar por você.',
  },
  {
    q: 'Preciso criar conta?',
    a: 'Para montar a festa, não. Para gerar a imagem com IA, baixar e salvar seus projetos na nuvem, é só entrar com seu e-mail. É grátis e leva segundos.',
  },
  {
    q: 'Funciona no celular?',
    a: 'Sim. Funciona no navegador do celular, do tablet e do computador, sem instalar nada. Se quiser, dá para adicionar o FestaLab à tela inicial como um app.',
  },
  {
    q: 'A imagem fica igual à montagem real?',
    a: 'A imagem é uma referência visual para o cliente enxergar a ideia: cores, clima e composição. Medidas, materiais e proporções podem variar, e o acabamento final é a sua arte.',
  },
  {
    q: 'Posso usar minhas próprias artes e painéis?',
    a: 'Pode. Faça upload das suas imagens e monte o cenário com o seu acervo, do jeito que você já trabalha.',
  },
];

function FloatingOrb({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

export default function ModeSelector({ onSelectMode, onOpenProject }: ModeSelectorProps) {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [galleryTab, setGalleryTab] = useState<'themes' | 'templates'>('templates');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col flex-1 bg-[#FAFAF8] text-zinc-900 font-sans selection:bg-orange-100 selection:text-orange-900">

      {/* ── HEADER ── */}
      <header
        className={`w-full sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-zinc-200/60 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="FestaLab — início" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
            <Image src="/logo-horizontal.png" alt="FestaLab" width={160} height={40} className="h-8 sm:h-9 w-auto object-contain" priority />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <button onClick={() => scrollTo('como-funciona')} className="hover:text-zinc-900 transition-colors cursor-pointer">Como funciona</button>
            <button onClick={() => scrollTo('exemplos')} className="hover:text-zinc-900 transition-colors cursor-pointer">Exemplos</button>
            <button onClick={() => scrollTo('perguntas')} className="hover:text-zinc-900 transition-colors cursor-pointer">Dúvidas</button>
          </nav>

          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button variant="ghost" className="h-9 px-4 font-medium cursor-pointer text-zinc-600 hover:text-zinc-900">
                  Entrar
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-zinc-600 hover:text-orange-600 transition-colors">
                  Minha Área
                </Link>
                <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              </div>
            )}
            <Button
              onClick={() => handleSelectTemplate(null)}
              className="h-9 px-5 text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-full shadow-sm shadow-orange-200 transition-all cursor-pointer"
            >
              Montar festa grátis
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden bg-[#FAFAF8]">
        {/* Decorative background */}
        <FloatingOrb className="w-[600px] h-[600px] bg-orange-300 -top-48 -right-32" />
        <FloatingOrb className="w-[400px] h-[400px] bg-amber-200 top-32 -left-48" />
        <FloatingOrb className="w-[300px] h-[300px] bg-rose-200 bottom-0 right-1/3" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 md:pt-28 md:pb-14 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left copy */}
          <div className="flex-1 text-left z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Para decoradoras e festeiras · 100% grátis
            </div>

            <h1 className="font-serif text-[clamp(2.4rem,5.5vw,4.2rem)] font-medium tracking-tight text-zinc-900 leading-[1.07] mb-6">
              Seu cliente vê a festa<br />
              <span className="italic text-orange-600">pronta</span>{' '}
              antes de você montar.
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-8 max-w-[480px]">
              Monte a mesa, os painéis e os balões em minutos. A IA transforma sua montagem em uma foto realista para mandar no WhatsApp do cliente. Chega de &ldquo;não consegui imaginar&rdquo;.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10">
              <Button
                onClick={() => handleSelectTemplate(null)}
                className="h-12 px-8 text-base font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-200/60 rounded-full transition-all cursor-pointer"
              >
                Montar minha festa grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <button
                onClick={() => scrollTo('como-funciona')}
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer px-3 py-2"
              >
                <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-zinc-700 ml-0.5" fill="currentColor" />
                </span>
                Ver como funciona
              </button>
            </div>

            {/* Mini stats */}
            <div className="flex items-center gap-6 flex-wrap">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-xl font-bold text-zinc-900">{s.value}</span>
                  <span className="text-xs text-zinc-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: product screenshot */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none z-10">
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-rose-200 rounded-2xl blur-2xl opacity-30 scale-95 translate-y-4" />
              <div className="relative bg-white rounded-2xl overflow-hidden border border-zinc-200/70 shadow-2xl shadow-zinc-900/10">
                {/* Fake browser bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-50 border-b border-zinc-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="flex-1 mx-3 h-5 bg-zinc-200/60 rounded-md text-[10px] text-zinc-400 flex items-center px-2">
                    festalab.com.br/editor
                  </div>
                </div>
                <img
                  src="/editor-preview.jpg"
                  alt="Editor visual de festas FestaLab"
                  className="w-full h-auto object-cover block"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 -left-3 bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Pronta para o WhatsApp</p>
                  <p className="text-[10px] text-zinc-400">é só baixar e enviar</p>
                </div>
              </div>

              {/* Floating AI badge */}
              <div className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs font-bold rounded-xl px-3 py-2 shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Gerado com IA
              </div>
            </div>
          </div>
        </div>

        {/* ── CHAT IA PARA CRIAÇÃO INSTANTÂNEA DE CENÁRIO ── */}
        <AIPartyChat
          onStartWithGeneratedScene={() => {
            onSelectMode('builder');
          }}
        />

        {/* Wave divider */}
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-zinc-50">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAND ── */}
      <section className="w-full bg-zinc-50 border-y border-zinc-100 py-5">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-zinc-500 font-medium">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100% gratuito, sem cartão</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Funciona no celular e no computador</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Modelos prontos para editar</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Seus projetos salvos na nuvem</span>
        </div>
      </section>

      {/* ── BEFORE / AFTER COMPARISON ── */}
      <section className="w-full bg-zinc-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">O resultado</p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 mb-4">
              Você monta a ideia.<br />
              <span className="italic">A IA faz o cliente enxergar.</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              À esquerda, a montagem feita no editor. À direita, a foto realista que o seu cliente recebe.
            </p>
          </div>

          <AIDemoSection />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="w-full py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">Simples assim</p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-zinc-900">
              Da ideia ao &ldquo;pode fechar&rdquo; em 3 passos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-zinc-200 via-orange-200 to-zinc-200" />

            {[
              { icon: Layers, step: '01', title: 'Monte a festa', desc: 'Arraste painéis, mesas, cilindros e balões, use um modelo pronto ou suba as artes do seu próprio acervo.', color: 'bg-zinc-100 text-zinc-700' },
              { icon: ImageIcon, step: '02', title: 'Deixe com a sua cara', desc: 'Troque cores, estampas e posições até chegar no tema exato que o cliente pediu.', color: 'bg-orange-50 text-orange-600' },
              { icon: Wand2, step: '03', title: 'Gere a foto e envie', desc: 'Com um clique, a IA transforma sua montagem em uma foto realista. Baixe e mande no WhatsApp: é aí que o cliente fecha.', color: 'bg-amber-50 text-amber-600' },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div key={step} className="relative flex flex-col bg-white rounded-2xl border border-zinc-100 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-zinc-300 tracking-widest mb-2">{step}</span>
                <h3 className="text-xl font-semibold text-zinc-900 mb-3">{title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm flex-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section id="exemplos" className="w-full bg-[#FAFAF8] py-14 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-orange-600 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2 sm:mb-3">Modelos prontos</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight text-zinc-900">
                Não comece do zero
              </h2>
              <p className="text-zinc-500 text-sm sm:text-lg mt-2 sm:mt-3">
                Escolha um tema, troque as cores e os detalhes, e em minutos a proposta está pronta.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleSelectTemplate(null)}
              className="bg-white h-10 px-5 sm:px-6 border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-full cursor-pointer shrink-0 self-start md:self-auto text-xs sm:text-sm active:scale-95 transition-transform"
            >
              Criar do zero
            </Button>
          </div>

          <div className="mb-6 sm:mb-8 flex items-center justify-start">
            <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 shadow-xs">
              <button
                type="button"
                onClick={() => setGalleryTab('templates')}
                className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                  galleryTab === 'templates'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Temas Prontos (21 Modelos)
              </button>
              <button
                type="button"
                onClick={() => setGalleryTab('themes')}
                className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                  galleryTab === 'themes'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Modelos Oficiais
              </button>
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
                  handleSelectTemplate(null);
                }
              }}
            />
          ) : (
            <TemplateGallery onSelectTemplate={(template) => handleSelectTemplate(template)} />
          )}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="w-full bg-white py-24 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">Feito para quem decora</p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-zinc-900">
              Menos conversa, mais festa fechada
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '💬', title: 'Acabou o "não consegui imaginar"', desc: 'O cliente vê a festa antes de ela existir. Entende, se apaixona e aprova sem dezenas de mensagens de vai e vem.' },
              { icon: '💰', title: 'Saia na frente no orçamento', desc: 'Enquanto outras mandam uma lista de itens, você manda a festa pronta em foto. Proposta bonita vende mais.' },
              { icon: '🔁', title: 'Mude na hora, sem retrabalho', desc: 'O cliente quer o balão em outra cor? Troque e gere uma nova imagem em segundos, ali mesmo na conversa.' },
              { icon: '📦', title: 'Confira o acervo antes de montar', desc: 'Veja se painéis, cilindros e cores combinam antes de carregar o carro. Menos surpresa no dia do evento.' },
              { icon: '📱', title: 'Do celular, onde você estiver', desc: 'Funciona no navegador do celular e do computador. Seus projetos ficam salvos na nuvem e nunca se perdem.' },
              { icon: '✨', title: 'Sem saber design', desc: 'Nada de programa complicado. Se sabe arrastar e escolher cores, você já sabe usar o FestaLab.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="group flex flex-col p-6 rounded-2xl border border-zinc-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-300">
                <span className="text-3xl mb-4">{icon}</span>
                <h4 className="font-semibold text-zinc-900 mb-2 text-base">{title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="perguntas" className="w-full bg-zinc-50 py-24 border-t border-zinc-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">Dúvidas</p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
              Perguntas frequentes
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="group bg-white rounded-2xl border border-zinc-100 shadow-sm open:border-orange-200 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 font-semibold text-zinc-900 text-sm sm:text-base [&::-webkit-details-marker]:hidden">
                  {q}
                  <Plus className="w-4 h-4 text-zinc-400 shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p className="px-6 pb-5 -mt-1 text-zinc-500 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS DASHBOARD ── */}
      <ProjectsDashboard
        onNewProject={() => handleSelectTemplate(null)}
        onOpenProject={onOpenProject ?? (() => {})}
      />

      {/* ── FINAL CTA ── */}
      <section className="w-full relative overflow-hidden bg-zinc-950 py-28">
        <FloatingOrb className="w-[500px] h-[500px] bg-orange-600 -top-48 -left-32 opacity-15" />
        <FloatingOrb className="w-[400px] h-[400px] bg-rose-600 -bottom-32 -right-32 opacity-10" />

        <div className="relative max-w-3xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <Zap className="w-3.5 h-3.5" />
            100% gratuito
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-white mb-6 leading-tight">
            Sua próxima festa fechada<br />
            <span className="italic text-orange-400">começa aqui.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Monte sua primeira festa agora, sem precisar de conta. Quando quiser a foto realista, é só entrar com seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => handleSelectTemplate(null)}
              className="h-14 px-10 text-lg font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-900/30 rounded-full transition-all cursor-pointer"
            >
              Montar minha festa grátis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer px-4 py-3">
                  Já tenho uma conta →
                </button>
              </SignInButton>
            )}
          </div>
          <p className="mt-6 text-xs text-zinc-600">Grátis de verdade. Sem cartão, sem instalar nada, funciona no celular.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-zinc-950 border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Image src="/logo-horizontal.png" alt="FestaLab" width={120} height={30} className="h-7 w-auto object-contain brightness-0 invert opacity-60" />
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <Link href="/privacidade" className="hover:text-zinc-400 transition-colors">Privacidade</Link>
            <span>·</span>
            <span>© {new Date().getFullYear()} FestaLab</span>
            <span>·</span>
            <span>Feito com ✦ no Brasil</span>
          </div>
        </div>
      </footer>

      <InstallPrompt />
    </div>
  );
}
