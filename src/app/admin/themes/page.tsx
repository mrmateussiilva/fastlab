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
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Theme } from '@/lib/supabase';

const CATEGORIES = [
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

export default function AdminThemesPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal de Criação
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    category: 'Infantil Unissex',
    tags: '',
    description: '',
    is_published: true,
  });
  const [createCoverFile, setCreateCoverFile] = useState<File | null>(null);

  // Modal de Edição (Foto + Detalhes)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Infantil Unissex',
    tags: '',
    description: '',
    is_published: true,
  });
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);

  // Confirmação de exclusão
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchThemes = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/themes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('festalab_admin_token', token);
        const data = await res.json();
        setThemes(data);
      } else {
        sessionStorage.removeItem('festalab_admin_token');
        setIsAuthenticated(false);
        setError('Senha de administrador incorreta.');
      }
    } catch {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar login automático na montagem
  useEffect(() => {
    const savedToken = sessionStorage.getItem('festalab_admin_token');
    if (savedToken) {
      setPassword(savedToken);
      fetchThemes(savedToken);
    }
  }, [fetchThemes]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    await fetchThemes(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('festalab_admin_token');
    setIsAuthenticated(false);
    setPassword('');
    setThemes([]);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // 1. Criar novo tema
  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCreate(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', createForm.name);
      data.append('category', createForm.category);
      data.append('tags', createForm.tags);
      data.append('description', createForm.description);
      data.append('is_published', String(createForm.is_published));
      if (createCoverFile) {
        data.append('cover_image', createCoverFile);
      }

      const res = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}` },
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar tema');
      }

      const newTheme: Theme = await res.json();
      await fetchThemes(password);
      setIsCreateOpen(false);
      setCreateForm({ name: '', category: 'Infantil Unissex', tags: '', description: '', is_published: true });
      setCreateCoverFile(null);
      showSuccess('Modelo cadastrado com sucesso!');

      // Pergunta opcional se deseja abrir direto no builder para desenhar o cenário
      if (confirm('Modelo criado! Deseja abrir o editor 2D/3D agora para montar o cenário dele?')) {
        router.push(`/admin/themes/${newTheme.id}/builder`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar modelo');
    } finally {
      setSubmittingCreate(false);
    }
  };

  // 2. Abrir modal para editar detalhes e foto de capa
  const openEditModal = (theme: Theme) => {
    setEditingTheme(theme);
    setEditForm({
      name: theme.name,
      category: theme.category,
      tags: Array.isArray(theme.tags) ? theme.tags.join(', ') : '',
      description: theme.description || '',
      is_published: theme.is_published,
    });
    setEditCoverFile(null);
    setEditCoverPreview(theme.cover_image_url || null);
  };

  // 3. Salvar edição de detalhes e foto de capa
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme) return;

    setSubmittingEdit(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('name', editForm.name);
      data.append('category', editForm.category);
      data.append('tags', editForm.tags);
      data.append('description', editForm.description);
      data.append('is_published', String(editForm.is_published));
      if (editCoverFile) {
        data.append('cover_image', editCoverFile);
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

      await fetchThemes(password);
      setEditingTheme(null);
      showSuccess('Dados e foto de capa atualizados com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // 4. Excluir tema
  const handleDeleteTheme = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 4000);
      return;
    }

    setDeletingId(id);
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
      setConfirmDeleteId(null);
      showSuccess('Modelo excluído do catálogo.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
    } finally {
      setDeletingId(null);
    }
  };

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
              Painel de Gestão e Edição dos Modelos da Landing Page
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

  // ── PAINEL PRINCIPAL ──
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-zinc-900 font-sans pb-20">
      
      {/* Top Header */}
      <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
              FL
            </div>
            <div>
              <h1 className="text-lg font-serif font-semibold text-zinc-900 tracking-tight leading-none">
                Gestão de Modelos & Vitrine
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Edite os modelos 2D/3D e as fotos exibidas na landing page do FestaLab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Modelo</span>
            </Button>

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
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs font-medium animate-fadeIn">
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

        {/* Grid de Modelos */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">
            Modelos Disponíveis ({themes.length})
          </h2>
          <span className="text-xs text-zinc-400">
            Dica: Clique em &quot;Editar Cenário&quot; para abrir o editor 2D/3D e montar as peças
          </span>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <p className="text-xs">Carregando catálogo de modelos...</p>
          </div>
        ) : themes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-zinc-800 text-sm mb-1">Nenhum modelo cadastrado</h3>
            <p className="text-xs text-zinc-500 max-w-sm mb-4">
              Crie o primeiro modelo oficial da plataforma para aparecer na galeria da landing page.
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
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
                          onClick={() => openEditModal(theme)}
                          className="flex-1 h-8 text-xs border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Foto & Detalhes</span>
                        </Button>

                        <button
                          onClick={() => handleDeleteTheme(theme.id)}
                          disabled={deletingId === theme.id}
                          title={confirmDeleteId === theme.id ? 'Clique novamente para confirmar exclusão' : 'Excluir modelo'}
                          className={`h-8 px-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            confirmDeleteId === theme.id
                              ? 'bg-red-600 text-white border-red-600 animate-pulse'
                              : 'text-zinc-400 hover:text-red-600 hover:bg-red-50 border-zinc-200'
                          }`}
                        >
                          {deletingId === theme.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          {confirmDeleteId === theme.id && <span className="text-[10px]">Confirmar?</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── MODAL: CADASTRAR NOVO TEMA ── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
              <h3 className="font-semibold text-zinc-900 text-base">Novo Modelo Oficial</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTheme} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Nome do Modelo / Tema *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Safari Kids, Bosque Encantado, Casamento Rústico..."
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Categoria *</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    placeholder="safari, verde, balões"
                    value={createForm.tags}
                    onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Descrição Curta (opcional)</label>
                <input
                  type="text"
                  placeholder="Composição vibrante com arcos de balões e cilindros"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Upload da Foto de Capa */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Foto de Capa da Landing Page (opcional, pode definir depois pelo Builder)
                </label>
                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-4 flex flex-col items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors relative cursor-pointer">
                  {createCoverFile ? (
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-medium text-zinc-800">{createCoverFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setCreateCoverFile(null)}
                        className="text-[11px] text-red-600 mt-1 underline"
                      >
                        Remover arquivo
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-7 h-7 text-zinc-400 mb-1.5" />
                      <span className="text-xs text-zinc-600">Selecione uma imagem de capa para a vitrine</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">JPG, PNG ou WEBP</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCreateCoverFile(e.target.files?.[0] || null)}
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
                  checked={createForm.is_published}
                  onChange={(e) => setCreateForm({ ...createForm, is_published: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded accent-orange-600"
                />
                <label htmlFor="create_published" className="text-xs font-medium text-zinc-700">
                  Publicar imediatamente na Galeria da Landing Page?
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs h-9"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submittingCreate}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl"
                >
                  {submittingCreate ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Modelo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDITAR DETALHES E FOTO DE CAPA ── */}
      {editingTheme && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-semibold text-zinc-900 text-base">Editar Detalhes & Foto</h3>
                <p className="text-xs text-zinc-500">Modelo: {editingTheme.name}</p>
              </div>
              <button
                onClick={() => setEditingTheme(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              
              {/* Foto de Capa Atual com Pré-visualização e Troca */}
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Foto de Capa Exibida na Landing Page
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="w-32 aspect-[4/3] rounded-lg overflow-hidden bg-zinc-200 shrink-0 border border-zinc-300">
                    {editCoverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editCoverPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px]">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-1.5 w-full">
                    <p className="text-xs font-medium text-zinc-800">Trocar foto de capa:</p>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-xs h-8 px-3 rounded-lg border-zinc-300 text-zinc-700 cursor-pointer w-full flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{editCoverFile ? editCoverFile.name : 'Escolher nova foto...'}</span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditCoverFile(file);
                            setEditCoverPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400">
                      Você também pode usar o botão &quot;Definir Capa&quot; direto do Builder!
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Nome do Modelo *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Categoria *</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit_published"
                  checked={editForm.is_published}
                  onChange={(e) => setEditForm({ ...editForm, is_published: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded accent-orange-600"
                />
                <label htmlFor="edit_published" className="text-xs font-medium text-zinc-700">
                  Publicado na Galeria da Landing Page
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingTheme(null)}
                  className="text-xs h-9"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submittingEdit}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-9 px-4 rounded-xl"
                >
                  {submittingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
