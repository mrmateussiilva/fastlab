'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Image as ImageIcon, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Theme } from '@/lib/supabase';

export default function AdminThemesPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Infantil Unissex',
    tags: '',
    description: '',
    is_published: true,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/themes', {
        headers: { Authorization: `Bearer ${password}` }
      });
      if (res.ok) {
        setIsAuthenticated(true);
        const data = await res.json();
        setThemes(data);
      } else {
        setError('Senha incorreta');
      }
    } catch (err) {
      setError('Erro ao conectar');
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/themes', {
      headers: { Authorization: `Bearer ${password}` }
    });
    if (res.ok) {
      const data = await res.json();
      setThemes(data);
    }
    setLoading(false);
  };

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      setError('Selecione uma imagem de capa');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('tags', formData.tags);
    data.append('description', formData.description);
    data.append('is_published', String(formData.is_published));
    data.append('cover_image', coverImage);

    try {
      const res = await fetch('/api/admin/themes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${password}` },
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao criar tema');
      }

      await fetchThemes();
      setIsFormOpen(false);
      setFormData({ name: '', category: 'Infantil Unissex', tags: '', description: '', is_published: true });
      setCoverImage(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 w-full max-w-md">
          <h1 className="text-2xl font-serif mb-6 text-center text-zinc-900">Acesso Restrito Admin</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Senha de Administrador" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white h-10">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-zinc-900">Painel de Temas</h1>
            <p className="text-zinc-500">Gerencie a galeria de temas do FestaLab</p>
          </div>
          <Button onClick={() => setIsFormOpen(!isFormOpen)} className="bg-zinc-900 text-white hover:bg-zinc-800">
            <Plus className="w-4 h-4 mr-2" />
            Novo Tema
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {isFormOpen && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 mb-8">
            <h2 className="text-xl font-semibold mb-6">Cadastrar Novo Tema</h2>
            <form onSubmit={handleCreateTheme} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Nome do Personagem/Franquia</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-3 py-2 border border-zinc-300 rounded-md" placeholder="Ex: Safari Kids, Patrulha Canina..." />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Categoria</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="px-3 py-2 border border-zinc-300 rounded-md bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
                <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="px-3 py-2 border border-zinc-300 rounded-md" placeholder="Ex: dinossauro, verde, infantil" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Descrição Curta (opcional)</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="px-3 py-2 border border-zinc-300 rounded-md" placeholder="Uma breve descrição sobre a decoração." />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Imagem de Capa (Obrigatório)</label>
                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-50 relative overflow-hidden">
                  {coverImage ? (
                    <div className="flex flex-col items-center">
                      <span className="text-zinc-700 font-medium">{coverImage.name}</span>
                      <button type="button" onClick={() => setCoverImage(null)} className="text-red-500 text-sm mt-2 underline">Remover</button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-zinc-400 mb-2" />
                      <span className="text-sm text-zinc-500">Clique ou arraste a imagem de capa (alta qualidade)</span>
                      <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" required />
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="published" checked={formData.is_published} onChange={(e) => setFormData({...formData, is_published: e.target.checked})} className="w-4 h-4 text-orange-600 rounded" />
                <label htmlFor="published" className="text-sm font-medium">Publicar imediatamente na Galeria?</label>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-zinc-100 pt-5">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={submitting} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px]">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Tema'}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {themes.map(theme => (
            <div key={theme.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col">
              <div className="aspect-[4/3] bg-zinc-100 relative">
                {theme.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={theme.cover_image_url} alt={theme.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-zinc-300" /></div>
                )}
                {!theme.is_published && (
                  <div className="absolute top-2 left-2 bg-zinc-900/80 text-white text-xs px-2 py-1 rounded">Rascunho</div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg text-zinc-900">{theme.name}</h3>
                <p className="text-sm text-zinc-500 mb-4">{theme.category}</p>
                {theme.tags && theme.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {theme.tags.map(t => <span key={t} className="bg-zinc-100 text-zinc-600 text-[10px] px-2 py-0.5 rounded-full">{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {themes.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-zinc-500 bg-white rounded-2xl border border-zinc-200 border-dashed">
              Nenhum tema cadastrado. Crie o seu primeiro!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
