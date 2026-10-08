'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, Layers } from 'lucide-react';
import { Theme } from '@/lib/supabase';

interface ThemeGalleryProps {
  onSelectTheme: (theme: Theme) => void;
}

const CATEGORIES = [
  'Todos',
  'Infantil Menino',
  'Infantil Menina',
  'Infantil Unissex',
  'Casamento',
  'Chá de Bebê',
  'Debutante',
  'Adulto',
  'Corporativo',
];

export function ThemeGallery({ onSelectTheme }: ThemeGalleryProps) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/themes', window.location.origin);
      if (category !== 'Todos') {
        url.searchParams.append('category', category);
      }
      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setThemes(data);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const filteredThemes = themes.filter(t => 
    search ? t.name.toLowerCase().includes(search.toLowerCase()) || 
             t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) 
           : true
  );

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Category filter & search */}
      <div className="w-full mb-6 sm:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer active:scale-95 ${
                category === cat 
                  ? 'bg-zinc-900 text-white' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-xs sm:text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Carregando temas...</p>
        </div>
      ) : filteredThemes.length === 0 ? (
        <div className="py-20 text-center text-zinc-500">
          <p>Nenhum tema encontrado para &quot;{search || category}&quot;.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 w-full">
          {filteredThemes.map(theme => (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              className="group bg-white rounded-xl sm:rounded-2xl border border-zinc-200 overflow-hidden cursor-pointer hover:border-orange-300 hover:shadow-xl active:scale-[0.98] sm:hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] w-full bg-zinc-100 flex items-center justify-center relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={theme.cover_image_url} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity items-end p-4">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-white text-sm font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Abrir no editor
                  </div>
                </div>
              </div>
              <div className="p-2.5 sm:p-5 flex-1 flex flex-col">
                <h4 className="text-xs sm:text-base md:text-lg font-semibold text-zinc-900 mb-0.5 sm:mb-1 line-clamp-1">{theme.name}</h4>
                <p className="text-[10px] sm:text-sm text-zinc-500 mb-1.5 sm:mb-3 line-clamp-1">{theme.category}</p>
                {theme.tags && theme.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {theme.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] sm:text-[10px] font-medium bg-orange-50 text-orange-700 px-1.5 sm:px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                    {theme.tags.length > 3 && (
                      <span className="text-[9px] sm:text-[10px] font-medium bg-zinc-100 text-zinc-500 px-1.5 sm:px-2 py-0.5 rounded">
                        +{theme.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
