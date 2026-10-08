'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Search, Layers } from 'lucide-react';
import { FESTA_TEMPLATES, FestaTemplate } from '@/lib/templates';

const CATEGORIES = ['Todos', 'Infantil', 'Casamento', 'Chá de Bebê', 'Debutante', 'Temática', 'Adulto'];

interface TemplateGalleryProps {
  onSelectTemplate: (template: FestaTemplate) => void;
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<FestaTemplate[]>(FESTA_TEMPLATES);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setTemplates(data);
        }
      })
      .catch((err) => console.warn('[TemplateGallery] Usando templates padrão:', err));
  }, []);

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === 'Todos' || t.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Filters */}
      <div className="w-full mb-6 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer active:scale-95 ${
                activeCategory === cat
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'
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
            placeholder="Buscar template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-full text-xs sm:text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-500">
          <p>Nenhum template encontrado para "{search || activeCategory}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 w-full">
          {/* "Começar do zero" card */}
          <button
            onClick={() => onSelectTemplate(null as unknown as FestaTemplate)}
            className="group flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border-2 border-dashed border-zinc-200 bg-white hover:border-orange-300 hover:bg-orange-50/30 active:scale-[0.98] transition-all duration-300 cursor-pointer min-h-[170px] sm:min-h-[220px] p-3 sm:p-6 text-center"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-100 group-hover:bg-orange-100 flex items-center justify-center text-lg sm:text-xl transition-colors">
              ✨
            </div>
            <div className="text-center">
              <p className="font-semibold text-zinc-800 group-hover:text-orange-700 transition-colors text-xs sm:text-sm md:text-base">Começar do zero</p>
              <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1 line-clamp-2">Canvas em branco, sem elementos</p>
            </div>
          </button>

          {filtered.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              onMouseEnter={() => setHovered(template.id)}
              onMouseLeave={() => setHovered(null)}
              className="group text-left bg-white rounded-xl sm:rounded-2xl border border-zinc-200 overflow-hidden cursor-pointer hover:border-orange-300 hover:shadow-xl active:scale-[0.98] sm:hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Preview swatch */}
              <div className={`aspect-[4/3] w-full bg-gradient-to-br ${template.previewColor} flex flex-col items-center justify-center relative overflow-hidden`}>
                {/* Color blobs from elements */}
                <div className="absolute inset-0 flex items-end justify-center gap-1.5 sm:gap-2 pb-3 sm:pb-4 px-3 sm:px-4 opacity-80">
                  {template.elements.slice(0, 5).map((el, i) => (
                    <div
                      key={el.id}
                      className="rounded-md sm:rounded-lg flex-shrink-0 transition-transform duration-500"
                      style={{
                        backgroundColor: el.fill,
                        width: `${14 + (i % 3) * 6}%`,
                        height: `${50 + (i % 2) * 30}%`,
                        opacity: el.opacity,
                        transform: hovered === template.id ? `scaleY(1.06) translateY(-4px)` : 'scaleY(1)',
                        transitionDelay: `${i * 40}ms`,
                      }}
                    />
                  ))}
                </div>
                {/* Emoji icon */}
                <span className="relative text-2xl sm:text-4xl drop-shadow-md mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {template.icon}
                </span>
                {/* Hover CTA (Desktop only) */}
                <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity items-end p-4">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-white text-xs font-semibold flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    Usar este template
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-2.5 sm:p-4 flex flex-col gap-1 flex-1">
                <div className="flex items-start sm:items-center justify-between gap-1">
                  <h4 className="font-semibold text-zinc-900 text-xs sm:text-sm line-clamp-1">{template.name}</h4>
                  <span className="text-[9px] sm:text-[10px] font-medium bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-full shrink-0">{template.category}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-zinc-500 leading-snug line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] sm:text-[10px] font-medium bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
