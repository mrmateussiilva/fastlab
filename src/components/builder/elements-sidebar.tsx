'use client';

import { useState, useRef } from 'react';
import { 
  CATEGORIES, 
  ELEMENT_LIBRARY, 
  ElementCategory, 
  LibraryElement,
  CustomUploadItem,
  CustomItemCategory,
  CUSTOM_CATEGORIES,
  ShapeType 
} from '@/lib/builder-elements';
import { Plus, UploadCloud, Trash2, Sparkles, Image as ImageIcon, Edit2, Check } from 'lucide-react';

interface ElementsSidebarProps {
  onAddElement: (element: LibraryElement) => void;
  customUploads: CustomUploadItem[];
  onUploadItem: (file: File, category?: CustomItemCategory) => void;
  onDeleteCustomUpload: (id: string) => void;
  onRenameCustomUpload: (id: string, newName: string) => void;
  onAddCustomElement: (item: CustomUploadItem) => void;
}

// Mini SVG preview simplificado para representar a forma do elemento no menu
function ElementMiniPreview({ shapeType, fill }: { shapeType: ShapeType; fill: string }) {
  const stroke = '#A0A0A0';

  switch (shapeType) {
    case 'panel-arch':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <path d="M12 36 V18 A8 8 0 0 1 28 18 V36 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'panel-rect':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <rect x="12" y="8" width="16" height="28" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'panel-round':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <circle cx="20" cy="18" r="14" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <line x1="20" y1="32" x2="20" y2="38" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'panel-wavy':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <path d="M12 36 C10 24 18 20 12 12 Q20 8 28 12 C22 20 30 24 28 36 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'table-rect':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <rect x="6" y="16" width="28" height="6" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <line x1="10" y1="22" x2="10" y2="34" stroke={stroke} strokeWidth="1.5" />
          <line x1="30" y1="22" x2="30" y2="34" stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'table-cloth':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <path d="M6 18 Q20 16 34 18 L32 34 Q20 36 8 34 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'table-round':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <ellipse cx="20" cy="16" rx="14" ry="5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <line x1="20" y1="21" x2="20" y2="34" stroke={stroke} strokeWidth="2" />
          <line x1="14" y1="34" x2="26" y2="34" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    case 'cylinder-high':
    case 'cylinder-mid':
    case 'cylinder-low':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <ellipse cx="20" cy="12" rx="10" ry="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="10" y="12" width="20" height="20" fill={fill} />
          <line x1="10" y1="12" x2="10" y2="32" stroke={stroke} strokeWidth="1.5" />
          <line x1="30" y1="12" x2="30" y2="32" stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="20" cy="32" rx="10" ry="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
    case 'acrylic-cylinder':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <ellipse cx="20" cy="12" rx="10" ry="4" fill={fill} opacity="0.6" stroke="#4A90E2" strokeWidth="1.5" />
          <rect x="10" y="12" width="20" height="20" fill={fill} opacity="0.4" stroke="#4A90E2" strokeWidth="1" />
          <ellipse cx="20" cy="32" rx="10" ry="4" fill={fill} opacity="0.6" stroke="#4A90E2" strokeWidth="1.5" />
        </svg>
      );
    case 'acrylic-table':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <rect x="6" y="16" width="28" height="5" rx="1" fill={fill} opacity="0.6" stroke="#4A90E2" strokeWidth="1.5" />
          <line x1="10" y1="21" x2="10" y2="34" stroke="#4A90E2" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1="30" y1="21" x2="30" y2="34" stroke="#4A90E2" strokeWidth="1.5" strokeDasharray="2,2" />
        </svg>
      );
    case 'balloon-small':
    case 'balloon-mid':
    case 'balloon-arch':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <circle cx="16" cy="16" r="7" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="24" cy="18" r="8" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="18" cy="26" r="6" fill={fill} stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    case 'rug-rect':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <rect x="6" y="20" width="28" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3,1" />
        </svg>
      );
    case 'rug-oval':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <ellipse cx="20" cy="24" rx="15" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3,1" />
        </svg>
      );
    case 'text':
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <text x="20" y="27" fontSize="22" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill={fill}>T</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <rect x="10" y="10" width="20" height="20" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
  }
}

export default function ElementsSidebar({ 
  onAddElement,
  customUploads,
  onUploadItem,
  onDeleteCustomUpload,
  onRenameCustomUpload,
  onAddCustomElement,
}: ElementsSidebarProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'uploads'>('library');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory>('paineis');
  const [selectedUploadCategory, setSelectedUploadCategory] = useState<string>('Todos');
  const [targetUploadCategory, setTargetUploadCategory] = useState<CustomItemCategory>('Extra');
  const [isDragging, setIsDragging] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredElements = ELEMENT_LIBRARY.filter(
    (item) => item.category === selectedCategory
  );

  const filteredUploads = customUploads.filter((item) => {
    if (selectedUploadCategory === 'Todos') return true;
    return (item.category || 'Extra') === selectedUploadCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadItem(file, targetUploadCategory);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onUploadItem(file, targetUploadCategory);
    }
  };

  const handleStartRename = (item: CustomUploadItem) => {
    setEditingItemId(item.id);
    setEditNameValue(item.name);
  };

  const handleSaveRename = (id: string) => {
    if (editNameValue.trim()) {
      onRenameCustomUpload(id, editNameValue.trim());
    }
    setEditingItemId(null);
  };

  return (
    <aside className="w-64 sm:w-72 bg-white border-r border-zinc-200/80 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      
      {/* Abas Principais: Biblioteca vs Meus Itens */}
      <div className="p-2 border-b border-zinc-100 grid grid-cols-2 gap-1 bg-[#FAFAF8]/60">
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`py-1.5 text-xs font-sans rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'library'
              ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/80'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/40'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Biblioteca
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('uploads')}
          className={`py-1.5 text-xs font-sans rounded-lg font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'uploads'
              ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/80'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/40'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Meus itens
          {customUploads.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] flex items-center justify-center font-semibold">
              {customUploads.length}
            </span>
          )}
        </button>
      </div>

      {/* VISÃO 1: BIBLIOTECA PADRÃO */}
      {activeTab === 'library' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Categorias */}
          <div className="flex flex-wrap gap-1 p-2.5 border-b border-zinc-100 bg-[#FAFAF8]/50">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-xs rounded-md font-sans transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white font-medium shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Grid de Itens */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredElements.map((item) => (
              <div
                key={item.id}
                onClick={() => onAddElement(item)}
                className="group flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/60 bg-white hover:border-orange-300 hover:shadow-sm hover:bg-orange-50/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ElementMiniPreview shapeType={item.shapeType} fill={item.defaultFill} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-zinc-800 group-hover:text-zinc-950 font-sans">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-sans">
                      {Math.round(item.defaultWidth / 2)} × {Math.round(item.defaultHeight / 2)} cm
                    </span>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-md bg-zinc-50 text-zinc-400 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISÃO 2: MEUS ITENS / UPLOADS */}
      {activeTab === 'uploads' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Caixa de Upload com seleção de categoria */}
          <div className="p-3 border-b border-zinc-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-sans">
                Categoria do upload:
              </span>
              <select
                value={targetUploadCategory}
                onChange={(e) => setTargetUploadCategory(e.target.value as CustomItemCategory)}
                className="text-xs font-medium text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md px-2 py-0.5 outline-none cursor-pointer"
              >
                {CUSTOM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/webp, image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`p-3.5 rounded-xl border border-dashed text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-orange-500 bg-orange-50/30'
                  : 'border-zinc-200 bg-zinc-50/70 hover:border-zinc-300 hover:bg-zinc-100/50'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-white border border-zinc-200/80 mx-auto flex items-center justify-center mb-1.5 text-zinc-600 shadow-2xs">
                <UploadCloud className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-800 font-sans mb-0.5">
                Enviar elemento próprio
              </h4>
              <p className="text-[10px] text-zinc-400 font-sans mb-2">
                PNG, WEBP ou JPG (até 8MB)
              </p>
              <div className="bg-amber-50/90 border border-amber-200/70 rounded-lg p-2 text-left space-y-0.5">
                <div className="text-[10px] font-semibold text-amber-900 font-sans flex items-center gap-1">
                  <span>💡</span> Recomendação: PNG Transparente
                </div>
                <p className="text-[9.5px] text-amber-800/80 font-sans leading-tight">
                  Envie elementos já recortados para um encaixe perfeito no cenário.
                </p>
              </div>
            </div>

            {/* Filtro por categoria nos uploads existentes */}
            {customUploads.length > 0 && (
              <div className="flex gap-1 overflow-x-auto pb-1 pt-1 scrollbar-none">
                {['Todos', ...CUSTOM_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedUploadCategory(cat)}
                    className={`px-2 py-0.5 text-[10px] rounded-md font-sans shrink-0 transition-colors cursor-pointer ${
                      selectedUploadCategory === cat
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lista / Galeria de Itens Customizados */}
          <div className="flex-1 overflow-y-auto p-3">
            {filteredUploads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-2.5">
                  <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <p className="text-xs font-medium text-zinc-700 font-sans mb-1">
                  Nenhum item encontrado
                </p>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Envie imagens de painéis, personagens ou cilindros com fundo transparente para usar no mockup.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {filteredUploads.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-zinc-200/80 bg-white overflow-hidden hover:border-orange-400 hover:shadow-xs transition-all cursor-pointer flex flex-col"
                    onClick={() => onAddCustomElement(item)}
                  >
                    {/* Badge de Categoria */}
                    {item.category && item.category !== 'Extra' && (
                      <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-medium bg-zinc-900/75 text-white px-1.5 py-0.5 rounded backdrop-blur-2xs">
                        {item.category}
                      </span>
                    )}

                    {/* Preview da Imagem */}
                    <div className="w-full h-24 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] bg-zinc-50 flex items-center justify-center p-2 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.dataUrl}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Rodapé com nome e ações */}
                    <div className="p-1.5 bg-white border-t border-zinc-100 flex items-center justify-between gap-1">
                      {editingItemId === item.id ? (
                        <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(item.id);
                              if (e.key === 'Escape') setEditingItemId(null);
                            }}
                            autoFocus
                            className="w-full text-[10px] font-sans border border-orange-300 rounded px-1 py-0.5 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(item.id)}
                            className="p-0.5 text-orange-600 hover:text-orange-700"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span 
                            title={item.name}
                            className="text-[10px] font-medium text-zinc-700 font-sans truncate flex-1"
                          >
                            {item.name}
                          </span>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartRename(item);
                              }}
                              title="Renomear item"
                              className="text-zinc-400 hover:text-zinc-700 p-0.5 rounded cursor-pointer"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCustomUpload(item.id);
                              }}
                              title="Excluir item"
                              className="text-zinc-400 hover:text-red-600 p-0.5 rounded cursor-pointer ml-0.5"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </aside>
  );
}
