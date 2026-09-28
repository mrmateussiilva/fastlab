'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Loader2, Check, X } from 'lucide-react';
import { formatWhatsapp, isValidEmail, isValidWhatsapp, normalizeWhatsapp } from '@/lib/lead-validation';

const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export default function LeadCaptureCard() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<'form' | 'sending' | 'done'>('form');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem('festalab_lead_submitted') === 'true') return;
      const dismissedAt = Number(localStorage.getItem('festalab_lead_dismissed_at') || 0);
      if (dismissedAt && Date.now() - dismissedAt < DISMISS_COOLDOWN_MS) return;
    } catch {
      return;
    }
    setVisible(true);
  }, []);

  const handleWhatsappChange = (value: string) => {
    setWhatsapp(formatWhatsapp(normalizeWhatsapp(value)));
  };

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem('festalab_lead_dismissed_at', String(Date.now()));
    } catch {
      // ignora falha de persistência
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isValidWhatsapp(whatsapp)) {
      setError('Informe um WhatsApp válido com DDD, ex.: (11) 99999-9999.');
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      setError('Informe um e-mail válido ou deixe o campo vazio.');
      return;
    }
    if (!consent) {
      setError('É necessário aceitar receber o contato para continuar.');
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp,
          email: email.trim(),
          company: '',
          consent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Erro ao enviar. Tente novamente.');
      }

      setAlreadyRegistered(Boolean(data.alreadyRegistered));
      setStatus('done');

      try {
        localStorage.setItem('festalab_lead_submitted', 'true');
      } catch {
        // ignora falha de persistência
      }
    } catch (err) {
      setStatus('form');
      setError(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.');
    }
  };

  if (!visible) return null;

  if (status === 'done') {
    return (
      <div className="w-full bg-emerald-50/70 border border-emerald-200/70 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </span>
        <p className="text-xs sm:text-sm text-emerald-900 font-medium font-sans">
          {alreadyRegistered
            ? 'Você já estava na lista! Avisaremos você quando liberar novas gerações.'
            : 'Pronto! Avisaremos você quando liberar novas gerações.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-orange-50/40 border border-orange-200/70 rounded-xl px-4 py-3.5 relative">
      <button
        type="button"
        onClick={handleDismiss}
        title="Dispensar"
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-white/70 active:scale-95 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 mb-2.5 pr-7">
        <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
          <MessageCircle className="w-4 h-4" />
        </span>
        <p className="text-xs sm:text-sm font-semibold text-zinc-900 font-sans leading-tight">
          Quer aviso quando liberar novas gerações?
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="tel"
          inputMode="tel"
          value={whatsapp}
          onChange={(e) => handleWhatsappChange(e.target.value)}
          placeholder="(11) 99999-9999"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 font-sans outline-none focus:border-orange-400 w-full sm:w-44"
        />
        <input
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail (opcional)"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 font-sans outline-none focus:border-orange-400 w-full sm:flex-1"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === 'sending'}
          className="h-10 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-medium font-sans active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Enviando
            </>
          ) : (
            'Avise-me'
          )}
        </button>
      </div>

      <label className="flex items-start gap-2 mt-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 accent-orange-600 cursor-pointer"
        />
        <span className="text-[10px] sm:text-[11px] text-zinc-500 font-sans leading-relaxed">
          Concordo em receber contato do FestaLab pelo WhatsApp ou e-mail e aceito a{' '}
          <Link
            href="/privacidade"
            target="_blank"
            className="underline text-orange-700 hover:text-orange-800"
          >
            Política de Privacidade
          </Link>
          .
        </span>
      </label>

      {error && (
        <p className="mt-2 text-[11px] text-red-600 font-sans">{error}</p>
      )}
    </div>
  );
}
