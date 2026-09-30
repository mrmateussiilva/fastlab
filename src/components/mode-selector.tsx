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
  Star,
  Zap,
  CheckCircle2,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstallPrompt from '@/components/pwa/install-prompt';
import { FESTA_TEMPLATES, FestaTemplate } from '@/lib/templates';
import ImageComparator from '@/components/image-comparator';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import ProjectsDashboard from '@/components/projects-dashboard';
import { ThemeGallery } from '@/components/themes/theme-gallery';

interface ModeSelectorProps {
  onSelectMode: (mode: 'upload' | 'builder') => void;
  onOpenProject?: (projectId: string) => void;
}

const STATS = [
  { value: '2 min', label: 'para criar um cenário' },
  { value: '100%', label: 'visual e sem código' },
  { value: 'IA', label: 'para visualizar a festa' },
];

const TESTIMONIALS = [
  {
    name: 'Mariana Costa',
    role: 'Decoradora de festas, SP',
    text: 'Reduzi o tempo de apresentação ao cliente pela metade. Eles aprovam na hora!',
    stars: 5,
  },
  {
    name: 'Juliana Alves',
    role: 'Festeira Profissional, RJ',
    text: 'A IA gera exatamente o que imagino. Virou indispensável no meu trabalho.',
    stars: 5,
  },
  {
    name: 'Patrícia Lima',
    role: 'Assessora de eventos, MG',
    text: 'Nunca mais cheguei a uma reunião sem uma proposta visual. Game changer!',
    stars: 5,
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
            <button onClick={() => scrollTo('depoimentos')} className="hover:text-zinc-900 transition-colors cursor-pointer">Depoimentos</button>
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
              Criar cenário grátis
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
              Editor visual + IA generativa
            </div>

            <h1 className="font-serif text-[clamp(2.4rem,5.5vw,4.2rem)] font-medium tracking-tight text-zinc-900 leading-[1.07] mb-6">
              Mostre como a festa<br />
              <span className="italic text-orange-600">vai ficar</span>{' '}
              antes de montar.
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-8 max-w-[480px]">
              Monte cenários com painéis, balões e móveis. Use a IA para transformar seu esboço em uma visualização fotorrealista antes de apresentar ao cliente.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10">
              <Button
                onClick={() => handleSelectTemplate(null)}
                className="h-12 px-8 text-base font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-200/60 rounded-full transition-all cursor-pointer"
              >
                Criar meu cenário grátis
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
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-900">Cliente aprovou!</p>
                  <p className="text-[10px] text-zinc-400">há 2 minutos</p>
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
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Sem instalação — funciona no browser</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Primeiras gerações de IA gratuitas</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Projetos salvos na nuvem</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Usado por decoradores do Brasil</span>
        </div>
      </section>

      {/* ── BEFORE / AFTER COMPARISON ── */}
      <section className="w-full bg-zinc-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">O resultado</p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 mb-4">
              Você monta a ideia.<br />
              <span className="italic">A IA ajuda a visualizar.</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto">
              Compare o mockup montado no editor com a visualização fotorrealista gerada.
            </p>
          </div>

          <ImageComparator
            pairs={[
              {
                id: '1',
                name: 'Decoração Inicial',
                mockupUrl: '/demo-mockup.jpg',
                realUrl: '/demo-real.jpg',
                isComparable: false,
              }
            ]}
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="w-full py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">Simples assim</p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-zinc-900">
              Como funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-zinc-200 via-orange-200 to-zinc-200" />

            {[
              { icon: Layers, step: '01', title: 'Monte a base', desc: 'Arraste painéis, mesas, balões e elementos da biblioteca ou faça upload das suas próprias artes.', color: 'bg-zinc-100 text-zinc-700' },
              { icon: ImageIcon, step: '02', title: 'Dê a sua identidade', desc: 'Customize cores, texturas e posicionamento para criar o tema exato da festa com total liberdade.', color: 'bg-orange-50 text-orange-600' },
              { icon: Wand2, step: '03', title: 'Gere com IA', desc: 'Com um clique, nossa IA transforma o esboço em uma imagem fotorrealista pronta para apresentar ao cliente.', color: 'bg-amber-50 text-amber-600' },
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
      <section id="exemplos" className="w-full bg-[#FAFAF8] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">Templates prontos</p>
              <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-zinc-900">
                Comece por um modelo
              </h2>
              <p className="text-zinc-500 text-lg mt-3">
                Projetos estruturados para você editar e transformar no seu estilo.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleSelectTemplate(null)}
              className="bg-white h-10 px-6 border-zinc-200 text-zinc-800 hover:bg-zinc-50 rounded-full cursor-pointer shrink-0"
            >
              Criar do zero
            </Button>
          </div>

          <ThemeGallery onSelectTheme={(theme) => {
            // we map the selected Theme to what handleSelectTemplate expects, or just start empty project for now
            // since themes now represent character themes, they might just start empty with specific colors.
            // Let's just start from scratch when selecting a theme for now, we can pre-configure colors later.
            handleSelectTemplate(null);
          }} />
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="w-full bg-white py-24 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">Por que escolher</p>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-zinc-900">
              Por que usar o FestaLab?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Apresentar a ideia', desc: 'Mostre ao cliente exatamente o que você planejou de forma visual e clara, reduzindo dúvidas e aprovações demoradas.' },
              { icon: '🎨', title: 'Explorar alternativas', desc: 'Troque cores, posições e painéis rapidamente sem precisar de ferramentas complexas de design ou arquitetura.' },
              { icon: '📋', title: 'Alinhar a montagem', desc: 'Tenha uma direção visual sólida antes do evento, garantindo que o acervo escolhido funciona bem junto.' },
              { icon: '☁️', title: 'Projetos na nuvem', desc: 'Salve e acesse seus cenários de qualquer dispositivo. Seus projetos nunca se perdem.' },
              { icon: '⚡', title: 'Resultado em minutos', desc: 'Da ideia à apresentação em poucos minutos. Sem curva de aprendizado, sem software para instalar.' },
              { icon: '🤖', title: 'IA generativa integrada', desc: 'Transforme qualquer esboço em uma imagem fotorrealista com um único clique usando a melhor IA do mercado.' },
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

      {/* ── TESTIMONIALS ── */}
      <section id="depoimentos" className="w-full bg-zinc-50 py-24 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-orange-600 text-sm font-semibold tracking-widest uppercase mb-3">Depoimentos</p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
              Quem já usa o FestaLab
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed flex-1 italic">"{t.text}"</p>
                <div className="mt-5 pt-5 border-t border-zinc-100">
                  <p className="font-semibold text-zinc-900 text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-400">{t.role}</p>
                </div>
              </div>
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
            Grátis para começar
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-white mb-6 leading-tight">
            Sua próxima decoração<br />
            <span className="italic text-orange-400">começa aqui.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Crie sua conta gratuitamente e monte seu primeiro cenário em menos de 2 minutos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => handleSelectTemplate(null)}
              className="h-14 px-10 text-lg font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-xl shadow-orange-900/30 rounded-full transition-all cursor-pointer"
            >
              Criar meu cenário grátis
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
          <p className="mt-6 text-xs text-zinc-600">Sem cartão de crédito. Sem instalação. Funciona no browser.</p>
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
