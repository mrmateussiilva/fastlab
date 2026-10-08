'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  Plus, 
  Image as ImageIcon, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Palette, 
  LogOut, 
  ExternalLink,
  Layers,
  CheckCircle2,
  X,
  UploadCloud,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Theme } from '@/lib/supabase';
import { FestaTemplate } from '@/lib/templates';

const THEME_CATEGORIES = [
  'Infantil Menino',
  'Infantil Menina',
  'Infantil Unissex',
  'Casamento',
  'Chá de Bebê',
  'Debutante',
  'Adulto',
  'Corporativo',
  'Outros'
];

const TEMPLATE_CATEGORIES = [
  'Todos',
  'Infantil',
  'Casamento',
  'Chá de Bebê',
  'Debutante',
  'Temática',
  'Adulto',
];

const POPULAR_EMOJIS = [
  '🎈', '💍', '🍼', '🦁', '👑', '🌺', '🍺', '🥂', '👶', '🎂', 
  '🎉', '✨', '🦄', '⚽', '🚀', '🎪', '🌴', '🌻', '🌽', '🧸'
];

const PRESET_GRADIENTS = [
  { label: 'Céu & Rosa', value: 'from-sky-200 via-pink-100 to-yellow-100' },
  { label: 'Dourado & Branco', value: 'from-amber-100 via-yellow-50 to-zinc-100' },
  { label: 'Rosa Bebê', value: 'from-pink-200 via-rose-100 to-pink-50' },
  { label: 'Junino Vibrante', value: 'from-amber-300 via-orange-200 to-red-300' },
  { label: 'Selva & Terra', value: 'from-emerald-200 via-amber-100 to-lime-200' },
  { label: 'Lilás & Real', value: 'from-purple-200 via-fuchsia-100 to-amber-100' },
  { label: 'Tropical', value: 'from-teal-200 via-orange-100 to-rose-200' },
  { label: 'Boteco & Malte', value: 'from-orange-200 via-amber-200 to-yellow-100' },
  { label: 'Bodas & Prata', value: 'from-slate-200 via-sky-100 to-zinc-200' },
  { label: 'Azul Bebê', value: 'from-blue-200 via-sky-100 to-indigo-100' },
];

export default function AdminThemesPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'templates'>('themes');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ── ESTADO DOS MODELOS OFICIAIS (THEMES) ──
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isCreateThemeOpen, setIsCreateThemeOpen] = useState(false);
  const [submittingCreateTheme, setSubmittingCreateTheme] = useState(false);
  const [createThemeForm, setCreateThemeForm] = useState({
    name: '',
    category: 'Infantil Unissex',
    tags: '',
    description: '',
    is_published: true,
  });
  const [createThemeCoverFile, setCreateThemeCoverFile] = useState<File | null>(null);

  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [submittingEditTheme, setSubmittingEditTheme] = useState(false);
  const [editThemeForm, setEditThemeForm] = useState({
    name: '',
    category: 'Infantil Unissex',
    tags: '',
    description: '',
    is_published: true,
  });
  const [editThemeCoverFile, setEditThemeCoverFile] = useState<File | null>(null);
  const [editThemeCoverPreview, setEditThemeCoverPreview] = useState<string | null>(null);

  const [deletingThemeId, setDeletingThemeId] = useState<string | null>(null);
  const [confirmDeleteThemeId, setConfirmDeleteThemeId] = useState<string | null>(null);

  // ── ESTADO DOS TEMPLATES RÁPIDOS ──
  const [templates, setTemplates] = useState<FestaTemplate[]>([]);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState('Todos');

  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [submittingCreateTemplate, setSubmittingCreateTemplate] = useState(false);
  const [createTemplateForm, setCreateTemplateForm] = useState({
    name: '',
    category: 'Infantil',
    tags: '',
    description: '',
    icon: '🎈',
    previewColor: 'from-sky-200 via-pink-100 to-yellow-100',
  });

  const [editingTemplate, setEditingTemplate] = useState<FestaTemplate | null>(null);
  const [submittingEditTemplate, setSubmittingEditTemplate] = useState(false);
  const [editTemplateForm, setEditTemplateForm] = useState({
    name: '',
    category: 'Infantil',
    tags: '',
    description: '',
    icon: '🎈',
    previewColor: 'from-sky-200 via-pink-100 to-yellow-100',
  });

  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);
  const [confirmDeleteTemplateId, setConfirmDeleteTemplateId] = useState<string | null>(null);

  // ── BUSCA INICIAL E LOGIN ──
  const fetchAll = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Themes
      const themesRes = await fetch('/api/admin/themes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!themesRes.ok) {
        sessionStorage.removeItem('festalab_admin_token');
        setIsAuthenticated(false);
        setError('Senha de administrador incorreta.');
        return;
      }
      setIsAuthenticated(true);
      sessionStorage.setItem('festalab_admin_token', token);
      const themesData = await themesRes.json();
      setThemes(themesData);

      // 2. Fetch Templates
      const templatesRes = await fetch('/api/admin/templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData);
      }
    } catch {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('festalab_admin_token');
    if (savedToken) {
      setPassword(savedToken);
      fetchAll(savedToken);
    }
  }, [fetchAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    await fetchAll(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('festalab_admin_token');
    setIsAuthenticated(false);
    setPassword('');
    setThemes([]);
    setTemplates([]);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // ── AÇÕES DE THEMES (MODELOS OFICIAIS) ──
  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCreateTheme(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', createThemeForm.name);
      data.append('category', createThemeForm.category);
      data.append('tags', createThemeForm.tags);
      data.append('description', createThemeForm.description);
      data.append('is_published', String(createThemeForm.is_published));
      if (createThemeCoverFile) {
        data.append('cover_image', createThemeCoverFile);
      }

      const res = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}` },
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar modelo');
      }

      const newTheme: Theme = await res.json();
      await fetchAll(password);
      setIsCreateThemeOpen(false);
      setCreateThemeForm({ name: '', category: 'Infantil Unissex', tags: '', description: '', is_published: true });
      setCreateThemeCoverFile(null);
      showSuccess('Modelo cadastrado com sucesso!');

      if (confirm('Modelo criado! Deseja abrir o editor 2D/3D agora para montar o cenário dele?')) {
        router.push(`/admin/themes/${newTheme.id}/builder`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar modelo');
    } finally {
      setSubmittingCreateTheme(false);
    }
  };

  const openEditThemeModal = (theme: Theme) => {
    setEditingTheme(theme);
    setEditThemeForm({
      name: theme.name,
      category: theme.category,
      tags: Array.isArray(theme.tags) ? theme.tags.join(', ') : '',
      description: theme.description || '',
      is_published: theme.is_published,
    });
    setEditThemeCoverFile(null);
    setEditThemeCoverPreview(theme.cover_image_url || null);
  };

  const handleSaveEditTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme) return;

    setSubmittingEditTheme(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', editThemeForm.name);
      data.append('category', editThemeForm.category);
      data.append('tags', editThemeForm.tags);
      data.append('description', editThemeForm.description);
      data.append('is_published', String(editThemeForm.is_published));
      if (editThemeCoverFile) {
        data.append('cover_image', editThemeCoverFile);
      }

      const res = await fetch(`/api/admin/themes/${editingTheme.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${password}` },
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao atualizar modelo');
      }

      await fetchAll(password);
      setEditingTheme(null);
      showSuccess('Foto de capa e dados atualizados com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
    } finally {
      setSubmittingEditTheme(false);
    }
  };

  const handleDeleteTheme = async (id: string) => {
    if (confirmDeleteThemeId !== id) {
      setConfirmDeleteThemeId(id);
      setTimeout(() => setConfirmDeleteThemeId(null), 4000);
      return;
    }

    setDeletingThemeId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/themes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${password}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao excluir modelo');
      }

      setThemes((prev) => prev.filter((t) => t.id !== id));
      setConfirmDeleteThemeId(null);
      showSuccess('Modelo excluído do catálogo.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
    } finally {
      setDeletingThemeId(null);
    }
  };

  // ── AÇÕES DE TEMPLATES RÁPIDOS ──
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCreateTemplate(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          name: createTemplateForm.name,
          category: createTemplateForm.category,
          tags: createTemplateForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
          description: createTemplateForm.description,
          icon: createTemplateForm.icon,
          previewColor: createTemplateForm.previewColor,
          elements: [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar template');
      }

      const created: FestaTemplate = await res.json();
      await fetchAll(password);
      setIsCreateTemplateOpen(false);
      setCreateTemplateForm({
        name: '',
        category: 'Infantil',
        tags: '',
        description: '',
        icon: '🎈',
        previewColor: 'from-sky-200 via-pink-100 to-yellow-100',
      });
      showSuccess('Template rápido criado com sucesso!');

      if (confirm('Template criado! Deseja abrir o editor 2D/3D agora para montar as peças do cenário?')) {
        router.push(`/admin/templates/${created.id}/builder`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar template');
    } finally {
      setSubmittingCreateTemplate(false);
    }
  };

  const openEditTemplateModal = (tpl: FestaTemplate) => {
    setEditingTemplate(tpl);
    setEditTemplateForm({
      name: tpl.name,
      category: tpl.category,
      tags: Array.isArray(tpl.tags) ? tpl.tags.join(', ') : '',
      description: tpl.description || '',
      icon: tpl.icon || '🎈',
      previewColor: tpl.previewColor || 'from-sky-200 via-pink-100 to-yellow-100',
    });
  };

  const handleSaveEditTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setSubmittingEditTemplate(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({
          name: editTemplateForm.name,
          category: editTemplateForm.category,
          tags: editTemplateForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
          description: editTemplateForm.description,
          icon: editTemplateForm.icon,
          previewColor: editTemplateForm.previewColor,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao atualizar template');
      }

      await fetchAll(password);
      setEditingTemplate(null);
      showSuccess('Template rápido atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar template');
    } finally {
      setSubmittingEditTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirmDeleteTemplateId !== id) {
      setConfirmDeleteTemplateId(id);
      setTimeout(() => setConfirmDeleteTemplateId(null), 4000);
      return;
    }

    setDeletingTemplateId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${password}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao excluir template');
      }

      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setConfirmDeleteTemplateId(null);
      showSuccess('Template excluído.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir template');
    } finally {
      setDeletingTemplateId(null);
    }
  };

  const handleResetTemplates = async () => {
    if (!confirm('Tem certeza que deseja restaurar todos os templates para o padrão de fábrica original?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ action: 'reset' }),
      });

      if (!res.ok) throw new Error('Falha ao restaurar');
      const resetList = await res.json();
      setTemplates(resetList);
      showSuccess('Templates originais restaurados com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao resetar templates');
    } finally {
      setLoading(false);
    }
  };

  // Filtragem de templates
  const filteredTemplates = templates.filter((t) => {
    const matchCat = templateCategoryFilter === 'Todos' || t.category === templateCategoryFilter;
    const q = templateSearch.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)));
    return matchCat && matchSearch;
  });

  // ── TELA DE LOGIN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200/80 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
              <Palette className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif text-zinc-900 tracking-tight">FestaLab Admin</h1>
            <p className="text-xs text-zinc-500 text-center mt-1">
              Painel de Gestão dos Modelos Oficiais e Templates Rápidos
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Senha de Administrador
              </label>
              <input 
                type="password" 
                placeholder="Digite a senha..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all bg-zinc-50/50"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-orange-600 hover:bg-orange-700 text-white h-11 text-sm font-medium rounded-xl transition-all cursor-pointer shadow-sm mt-1"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Acessar Painel'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ── PAINEL PRINCIPAL COM DUAS ABAS ──
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-zinc-900 font-sans pb-20">
      
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              FL
            </div>
            <div>
              <h1 className="text-lg font-serif font-semibold text-zinc-900 tracking-tight leading-none">
                Gestão da Landing Page
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Edite os modelos oficiais com foto e os templates rápidos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'themes' ? (
              <Button
                onClick={() => setIsCreateThemeOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Modelo Oficial</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetTemplates}
                  title="Restaurar os 10 templates padrão de fábrica"
                  className="h-9 px-3 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restaurar Padrões</span>
                </button>
                <Button
                  onClick={() => setIsCreateTemplateOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Template Rápido</span>
                </Button>
              </div>
            )}

            <button
              onClick={() => router.push('/')}
              title="Ver Landing Page"
              className="h-9 px-3 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site</span>
            </button>

            <button
              onClick={handleLogout}
              title="Encerrar Sessão"
              className="h-9 px-3 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8">

        {/* Feedback Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SELETOR DE ABAS DO ADMIN (IGUAL À LANDING PAGE) */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-zinc-100 rounded-2xl border border-zinc-200">
            <button
              type="button"
              onClick={() => setActiveTab('themes')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'themes'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
              <span>Modelos Oficiais & Vitrine ({themes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'templates'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Templates Rápidos ({templates.length})</span>
            </button>
          </div>

          <span className="text-xs text-zinc-400">
            {activeTab === 'themes'
              ? 'Edite as fotos de capa reais e os cenários 2D/3D dos modelos oficiais'
              : 'Edite os cartões com degradê, emojis e os cenários 2D/3D dos templates rápidos'}
          </span>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            ABA 1: MODELOS OFICIAIS & VITRINE (COM FOTO DE CAPA REAL)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'themes' && (
          <div>
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-400">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <p className="text-xs">Carregando modelos oficiais...</p>
              </div>
            ) : themes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-zinc-800 text-sm mb-1">Nenhum modelo oficial cadastrado</h3>
                <p className="text-xs text-zinc-500 max-w-sm mb-4">
                  Crie o primeiro modelo oficial da plataforma para aparecer na galeria da landing page.
                </p>
                <Button
                  onClick={() => setIsCreateThemeOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Cadastrar Primeiro Modelo
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {themes.map((theme) => {
                  const elementCount = Array.isArray(theme.elements) ? theme.elements.length : 0;
                  const hasElements = elementCount > 0;

                  return (
                    <div
                      key={theme.id}
                      className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                    >
                      {/* Foto de Capa (Landing Page) */}
                      <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                        {theme.cover_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={theme.cover_image_url}
                            alt={theme.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                            <ImageIcon className="w-8 h-8 mb-1" />
                            <span className="text-[10px]">Sem Foto de Capa</span>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 ${
                              theme.is_published
                                ? 'bg-emerald-500 text-white'
                                : 'bg-zinc-800/80 text-zinc-200 backdrop-blur-xs'
                            }`}
                          >
                            {theme.is_published ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Publicado</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Rascunho</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Badge de Peças / Cenário */}
                        <div className="absolute bottom-2.5 left-2.5">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full shadow-xs backdrop-blur-md flex items-center gap-1 ${
                              hasElements
                                ? 'bg-white/90 text-zinc-800 border border-zinc-200/60'
                                : 'bg-amber-500/90 text-white'
                            }`}
                          >
                            <Layers className="w-3 h-3" />
                            <span>{hasElements ? `${elementCount} peças no cenário` : 'Sem peças 2D/3D'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1">
                            {theme.name}
                          </h3>
                        </div>
                        <p className="text-xs text-zinc-500 mb-3">{theme.category}</p>

                        {/* Tags */}
                        {theme.tags && theme.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {theme.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="bg-zinc-100 text-zinc-600 text-[10px] px-2 py-0.5 rounded-md"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Botões de Ação do Card */}
                        <div className="mt-auto pt-3 border-t border-zinc-100 flex flex-col gap-2">
                          
                          {/* 1. Botão Principal: Editar Cenário no Builder */}
                          <Button
                            onClick={() => router.push(`/admin/themes/${theme.id}/builder`)}
                            className="w-full h-8 text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Palette className="w-3.5 h-3.5 text-orange-400" />
                            <span>Editar Cenário no Builder</span>
                          </Button>

                          {/* 2. Botões Secundários: Editar Foto/Dados e Excluir */}
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              onClick={() => openEditThemeModal(theme)}
                              className="flex-1 h-8 text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Foto & Detalhes</span>
                            </Button>

                            <button
                              onClick={() => handleDeleteTheme(theme.id)}
                              disabled={deletingThemeId === theme.id}
                              title={confirmDeleteThemeId === theme.id ? 'Clique novamente para confirmar exclusão' : 'Excluir modelo'}
                              className={`h-8 px-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                confirmDeleteThemeId === theme.id
                                  ? 'bg-red-600 text-white border-red-600 animate-pulse'
                                  : 'text-zinc-400 hover:text-red-600 hover:bg-red-50 border-zinc-200'
                              }`}
                            >
                              {deletingThemeId === theme.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              {confirmDeleteThemeId === theme.id && <span className="text-[10px]">Confirmar?</span>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            ABA 2: TEMPLATES RÁPIDOS (COM CARTOES, EMOJIS E DEGRADE)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'templates' && (
          <div>
            {/* Filtros de Categoria & Busca */}
            <div className="w-full mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      templateCategoryFilter === cat
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar template..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Grid dos Templates Rápidos */}
            {filteredTemplates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center flex flex-col items-center">
                <p className="text-zinc-500 text-xs mb-3">Nenhum template rápido encontrado.</p>
                <Button
                  onClick={() => setIsCreateTemplateOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Cadastrar Template
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((tpl) => {
                  const elementCount = Array.isArray(tpl.elements) ? tpl.elements.length : 0;

                  return (
                    <div
                      key={tpl.id}
                      className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                    >
                      {/* Preview Swatch idêntico à landing page */}
                      <div
                        className={`aspect-[4/3] w-full bg-gradient-to-br ${tpl.previewColor} flex flex-col items-center justify-center relative overflow-hidden`}
                      >
                        {/* Color blobs dos elementos */}
                        <div className="absolute inset-0 flex items-end justify-center gap-2 pb-4 px-4 opacity-80 pointer-events-none">
                          {tpl.elements && tpl.elements.slice(0, 5).map((el, i) => (
                            <div
                              key={el.id || i}
                              className="rounded-lg shrink-0 transition-transform duration-500"
                              style={{
                                backgroundColor: el.fill,
                                width: `${14 + (i % 3) * 6}%`,
                                height: `${50 + (i % 2) * 30}%`,
                                opacity: el.opacity,
                              }}
                            />
                          ))}
                        </div>

                        {/* Emoji icon */}
                        <span className="relative text-4xl drop-shadow-md mb-2 group-hover:scale-110 transition-transform duration-300 select-none">
                          {tpl.icon || '🎈'}
                        </span>

                        {/* Badge de quantidade de peças */}
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-zinc-800 border border-zinc-200/60 shadow-xs backdrop-blur-xs flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>{elementCount} peças</span>
                          </span>
                        </div>
                      </div>

                      {/* Informações do Template */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="font-semibold text-zinc-900 text-sm line-clamp-1">{tpl.name}</h4>
                          <span className="text-[10px] font-medium bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full shrink-0">
                            {tpl.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-snug">{tpl.description}</p>

                        {/* Tags */}
                        {tpl.tags && tpl.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {tpl.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] font-medium bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Botões de Ação */}
                        <div className="mt-auto pt-3 border-t border-zinc-100 flex flex-col gap-2">
                          <Button
                            onClick={() => router.push(`/admin/templates/${tpl.id}/builder`)}
                            className="w-full h-8 text-xs bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Palette className="w-3.5 h-3.5 text-orange-400" />
                            <span>Editar Cenário no Builder</span>
                          </Button>

                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              onClick={() => openEditTemplateModal(tpl)}
                              className="flex-1 h-8 text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Editar Card</span>
                            </Button>

                            <button
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              disabled={deletingTemplateId === tpl.id}
                              title={confirmDeleteTemplateId === tpl.id ? 'Confirmar exclusão?' : 'Excluir template'}
                              className={`h-8 px-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                confirmDeleteTemplateId === tpl.id
                                  ? 'bg-red-600 text-white border-red-600 animate-pulse'
                                  : 'text-zinc-400 hover:text-red-600 hover:bg-red-50 border-zinc-200'
                              }`}
                            >
                              {deletingTemplateId === tpl.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              {confirmDeleteTemplateId === tpl.id && <span className="text-[10px]">Confirmar?</span>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── MODAL: CADASTRAR NOVO MODELO OFICIAL (THEME) ── */}
      {isCreateThemeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
              <h3 className="font-semibold text-zinc-900 text-base">Novo Modelo Oficial</h3>
              <button
                onClick={() => setIsCreateThemeOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTheme} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Nome do Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Safari Kids, Bosque Encantado..."
                  value={createThemeForm.name}
                  onChange={(e) => setCreateThemeForm({ ...createThemeForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Categoria *</label>
                  <select
                    value={createThemeForm.category}
                    onChange={(e) => setCreateThemeForm({ ...createThemeForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {THEME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Tags</label>
                  <input
                    type="text"
                    placeholder="safari, verde, balões"
                    value={createThemeForm.tags}
                    onChange={(e) => setCreateThemeForm({ ...createThemeForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Composição moderna..."
                  value={createThemeForm.description}
                  onChange={(e) => setCreateThemeForm({ ...createThemeForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Foto de Capa (opcional, pode definir depois pelo Builder)</label>
                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors relative cursor-pointer">
                  {createThemeCoverFile ? (
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-zinc-800">{createThemeCoverFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setCreateThemeCoverFile(null)}
                        className="text-[11px] text-red-600 mt-1 underline"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-7 h-7 text-zinc-400 mb-1.5" />
                      <span className="text-xs text-zinc-600">Selecione uma imagem de capa</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCreateThemeCoverFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="create_published"
                  checked={createThemeForm.is_published}
                  onChange={(e) => setCreateThemeForm({ ...createThemeForm, is_published: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded accent-orange-600"
                />
                <label htmlFor="create_published" className="text-xs font-medium text-zinc-700">
                  Publicar na Galeria da Landing Page?
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateThemeOpen(false)} className="text-xs h-9">
                  Cancelar
                </Button>
                <Button type="submit" disabled={submittingCreateTheme} className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl">
                  {submittingCreateTheme ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Modelo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDITAR FOTO E DETALHES DO MODELO OFICIAL (THEME) ── */}
      {editingTheme && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-semibold text-zinc-900 text-base">Editar Foto & Detalhes</h3>
                <p className="text-xs text-zinc-500">Modelo: {editingTheme.name}</p>
              </div>
              <button
                onClick={() => setEditingTheme(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTheme} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">Foto de Capa Exibida na Landing Page</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="w-32 aspect-[4/3] rounded-lg overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
                    {editThemeCoverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editThemeCoverPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px]">Sem foto</div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-1.5 w-full">
                    <p className="text-xs font-medium text-zinc-800">Trocar foto de capa:</p>
                    <div className="relative">
                      <Button type="button" variant="outline" className="text-xs h-8 px-3 rounded-lg border-zinc-300 text-zinc-700 cursor-pointer w-full flex items-center gap-1.5">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{editThemeCoverFile ? editThemeCoverFile.name : 'Escolher nova foto...'}</span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditThemeCoverFile(file);
                            setEditThemeCoverPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Nome do Modelo *</label>
                <input
                  type="text"
                  required
                  value={editThemeForm.name}
                  onChange={(e) => setEditThemeForm({ ...editThemeForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Categoria *</label>
                  <select
                    value={editThemeForm.category}
                    onChange={(e) => setEditThemeForm({ ...editThemeForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {THEME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={editThemeForm.tags}
                    onChange={(e) => setEditThemeForm({ ...editThemeForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={editThemeForm.description}
                  onChange={(e) => setEditThemeForm({ ...editThemeForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_theme_published"
                  checked={editThemeForm.is_published}
                  onChange={(e) => setEditThemeForm({ ...editThemeForm, is_published: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded accent-orange-600"
                />
                <label htmlFor="edit_theme_published" className="text-xs font-medium text-zinc-700">
                  Publicado na Galeria da Landing Page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
                <Button type="button" variant="ghost" onClick={() => setEditingTheme(null)} className="text-xs h-9">
                  Cancelar
                </Button>
                <Button type="submit" disabled={submittingEditTheme} className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl">
                  {submittingEditTheme ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CADASTRAR NOVO TEMPLATE RÁPIDO ── */}
      {isCreateTemplateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
              <h3 className="font-semibold text-zinc-900 text-base">Novo Template Rápido</h3>
              <button
                onClick={() => setIsCreateTemplateOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="flex flex-col gap-4">
              
              {/* Preview do Card em tempo real */}
              <div className="flex items-center justify-center p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className={`w-40 aspect-[4/3] rounded-xl bg-gradient-to-br ${createTemplateForm.previewColor} flex flex-col items-center justify-center shadow-xs`}>
                  <span className="text-4xl drop-shadow-md select-none">{createTemplateForm.icon}</span>
                  <span className="text-[11px] font-semibold text-zinc-800 mt-1 bg-white/70 px-2 py-0.5 rounded-full">
                    {createTemplateForm.name || 'Nome do Template'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Nome do Template *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Safari & Selva, Aniversário Neon..."
                  value={createTemplateForm.name}
                  onChange={(e) => setCreateTemplateForm({ ...createTemplateForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Categoria *</label>
                  <select
                    value={createTemplateForm.category}
                    onChange={(e) => setCreateTemplateForm({ ...createTemplateForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {TEMPLATE_CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Emoji / Ícone *</label>
                  <input
                    type="text"
                    required
                    value={createTemplateForm.icon}
                    onChange={(e) => setCreateTemplateForm({ ...createTemplateForm, icon: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Seletor rápido de emojis */}
              <div>
                <span className="text-[11px] font-medium text-zinc-500 block mb-1">Emojis sugeridos:</span>
                <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setCreateTemplateForm({ ...createTemplateForm, icon: emoji })}
                      className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-lg cursor-pointer hover:shadow-xs transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor de Degradê */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Cores do Degradê do Card *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
                  {PRESET_GRADIENTS.map((preset) => (
                    <button
                      type="button"
                      key={preset.value}
                      onClick={() => setCreateTemplateForm({ ...createTemplateForm, previewColor: preset.value })}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        createTemplateForm.previewColor === preset.value
                          ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50/20'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${preset.value} shrink-0`} />
                      <span className="text-[10px] font-medium text-zinc-700 truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={createTemplateForm.previewColor}
                  onChange={(e) => setCreateTemplateForm({ ...createTemplateForm, previewColor: e.target.value })}
                  placeholder="Classes Tailwind: from-... via-... to-..."
                  className="w-full px-3 py-1.5 text-xs font-mono border border-zinc-200 rounded-lg text-zinc-600 bg-zinc-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Composição vibrante com arcos de balões..."
                  value={createTemplateForm.description}
                  onChange={(e) => setCreateTemplateForm({ ...createTemplateForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="safari, selva, verde"
                  value={createTemplateForm.tags}
                  onChange={(e) => setCreateTemplateForm({ ...createTemplateForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateTemplateOpen(false)} className="text-xs h-9">
                  Cancelar
                </Button>
                <Button type="submit" disabled={submittingCreateTemplate} className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl">
                  {submittingCreateTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Template'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDITAR CARD E DADOS DO TEMPLATE RÁPIDO ── */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-semibold text-zinc-900 text-base">Editar Card do Template</h3>
                <p className="text-xs text-zinc-500">Template: {editingTemplate.name}</p>
              </div>
              <button
                onClick={() => setEditingTemplate(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTemplate} className="flex flex-col gap-4">
              
              {/* Preview do Card em tempo real */}
              <div className="flex items-center justify-center p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                <div className={`w-40 aspect-[4/3] rounded-xl bg-gradient-to-br ${editTemplateForm.previewColor} flex flex-col items-center justify-center shadow-xs`}>
                  <span className="text-4xl drop-shadow-md select-none">{editTemplateForm.icon}</span>
                  <span className="text-[11px] font-semibold text-zinc-800 mt-1 bg-white/70 px-2 py-0.5 rounded-full">
                    {editTemplateForm.name || 'Nome do Template'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Nome do Template *</label>
                <input
                  type="text"
                  required
                  value={editTemplateForm.name}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Categoria *</label>
                  <select
                    value={editTemplateForm.category}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {TEMPLATE_CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Emoji / Ícone *</label>
                  <input
                    type="text"
                    required
                    value={editTemplateForm.icon}
                    onChange={(e) => setEditTemplateForm({ ...editTemplateForm, icon: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Seletor rápido de emojis */}
              <div>
                <span className="text-[11px] font-medium text-zinc-500 block mb-1">Trocar Emoji:</span>
                <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                  {POPULAR_EMOJIS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setEditTemplateForm({ ...editTemplateForm, icon: emoji })}
                      className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-lg cursor-pointer hover:shadow-xs transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor de Degradê */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Cores do Degradê do Card *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
                  {PRESET_GRADIENTS.map((preset) => (
                    <button
                      type="button"
                      key={preset.value}
                      onClick={() => setEditTemplateForm({ ...editTemplateForm, previewColor: preset.value })}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        editTemplateForm.previewColor === preset.value
                          ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50/20'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${preset.value} shrink-0`} />
                      <span className="text-[10px] font-medium text-zinc-700 truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editTemplateForm.previewColor}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, previewColor: e.target.value })}
                  placeholder="Classes Tailwind: from-... via-... to-..."
                  className="w-full px-3 py-1.5 text-xs font-mono border border-zinc-200 rounded-lg text-zinc-600 bg-zinc-50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={editTemplateForm.description}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={editTemplateForm.tags}
                  onChange={(e) => setEditTemplateForm({ ...editTemplateForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
                <Button type="button" variant="ghost" onClick={() => setEditingTemplate(null)} className="text-xs h-9">
                  Cancelar
                </Button>
                <Button type="submit" disabled={submittingEditTemplate} className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl">
                  {submittingEditTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
