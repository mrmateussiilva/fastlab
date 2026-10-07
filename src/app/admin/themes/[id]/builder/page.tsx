'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import MockupBuilder from '@/components/builder/mockup-builder';
import { Theme } from '@/lib/supabase';
import { CanvasElement, EnvironmentConfig } from '@/lib/builder-elements';
import { Button } from '@/components/ui/button';

export default function AdminThemeBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params?.id as string;

  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  // 1. Carregar token de admin do sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('festalab_admin_token');
    if (!stored) {
      setAuthRequired(true);
      setLoading(false);
    } else {
      setPassword(stored);
    }
  }, []);

  // 2. Buscar o tema na API
  const fetchTheme = useCallback(async (token: string) => {
    if (!themeId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/themes/${themeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        sessionStorage.removeItem('festalab_admin_token');
        setAuthRequired(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Não foi possível carregar os dados deste modelo.');
      }

      const data: Theme = await res.json();
      setTheme(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar modelo');
    } finally {
      setLoading(false);
    }
  }, [themeId]);

  useEffect(() => {
    if (password) {
      fetchTheme(password);
    }
  }, [password, fetchTheme]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;
    sessionStorage.setItem('festalab_admin_token', inputPassword.trim());
    setPassword(inputPassword.trim());
    setAuthRequired(false);
  };

  // 3. Callback: Salvar elementos do modelo no banco
  const handleSaveModel = async (
    elements: CanvasElement[],
    environment: EnvironmentConfig
  ): Promise<boolean> => {
    if (!password || !themeId) return false;
    try {
      const res = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          elements,
          environment,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao salvar modelo.');
      }

      const updated = await res.json();
      setTheme(updated);
      return true;
    } catch (err) {
      console.error('[AdminBuilder] Erro ao salvar modelo:', err);
      return false;
    }
  };

  // 4. Callback: Definir o Canvas como Foto de Capa da Landing Page
  const handleSetCoverFromCanvas = async (thumbnailBase64: string): Promise<boolean> => {
    if (!password || !themeId) return false;
    try {
      const res = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          cover_image_base64: thumbnailBase64,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro ao atualizar foto de capa.');
      }

      const updated = await res.json();
      setTheme(updated);
      return true;
    } catch (err) {
      console.error('[AdminBuilder] Erro ao definir capa:', err);
      return false;
    }
  };

  if (authRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 w-full max-w-md">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold mb-2 text-center text-zinc-900">Autenticação de Administrador</h1>
          <p className="text-zinc-500 text-xs text-center mb-6">
            Informe a senha de admin para editar o cenário deste modelo oficial.
          </p>
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Senha de Administrador"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="px-4 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white h-10 text-sm">
              Acessar Editor do Modelo
            </Button>
            <button
              type="button"
              onClick={() => router.push('/admin/themes')}
              className="text-xs text-zinc-400 hover:text-zinc-700 text-center mt-1"
            >
              Voltar ao painel de temas
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#F4F4F2] gap-3 text-zinc-500 text-sm">
        <Loader2 className="w-7 h-7 text-orange-600 animate-spin" />
        <span>Carregando modelo para edição...</span>
      </div>
    );
  }

  if (error || !theme) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-50 p-4 gap-4 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl max-w-md border border-red-200">
          <p className="font-semibold text-sm mb-1">Erro ao carregar modelo</p>
          <p className="text-xs">{error || 'Modelo não encontrado.'}</p>
        </div>
        <Button onClick={() => router.push('/admin/themes')} variant="outline" className="text-xs">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Voltar ao Painel de Temas
        </Button>
      </div>
    );
  }

  const initialElements = Array.isArray(theme.elements) && theme.elements.length > 0
    ? (theme.elements as CanvasElement[])
    : undefined;

  const initialEnvironment = theme.environment && typeof theme.environment === 'object'
    ? (theme.environment as EnvironmentConfig)
    : undefined;

  return (
    <MockupBuilder
      onBackToHome={() => router.push('/admin/themes')}
      initialElements={initialElements}
      initialEnvironment={initialEnvironment}
      initialProjectName={theme.name}
      adminThemeConfig={{
        themeId: theme.id,
        themeName: theme.name,
        onSaveModel: handleSaveModel,
        onSetCoverFromCanvas: handleSetCoverFromCanvas,
      }}
    />
  );
}
