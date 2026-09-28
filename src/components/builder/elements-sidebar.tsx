'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from 'react';
import {
  CATEGORIES,
  ELEMENT_LIBRARY,
  ElementCategory,
  LibraryElement,
  CustomUploadItem,
  CustomItemCategory,
  CUSTOM_CATEGORIES,
  ShapeType,
} from '@/lib/builder-elements';
import {
  UploadCloud,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Edit2,
  Check,
  Search,
  LayoutGrid,
  Table2,
  Cylinder,
  Layers,
  Wind,
  Square,
  Box,
  ChevronLeft,
  X,
} from 'lucide-react';

interface ElementsSidebarProps {
  onAddElement: (element: LibraryElement) => void;
  customUploads: CustomUploadItem[];
  onUploadItem: (file: File, category?: CustomItemCategory) => void;
  onDeleteCustomUpload: (id: string) => void;
  onRenameCustomUpload: (id: string, newName: string) => void;
  onAddCustomElement: (item: CustomUploadItem) => void;
  isUploadingItem?: boolean;
  className?: string;
  onClose?: () => void;
}

// Ícones por categoria (Canva-style nav icons)
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  paineis:   <LayoutGrid className="w-5 h-5" />,
  mesas:     <Table2 className="w-5 h-5" />,
  cilindros: <Cylinder className="w-5 h-5" />,
  acrilicos: <Layers className="w-5 h-5" />,
  baloes:    <Wind className="w-5 h-5" />,
  tapetes:   <Square className="w-5 h-5" />,
  extras:    <Box className="w-5 h-5" />,
  uploads:   <ImageIcon className="w-5 h-5" />,
};

// Mini SVG preview — mantido compacto para o card
function ElementMiniPreview({ shapeType, fill }: { shapeType: ShapeType; fill: string }) {
  const stroke = '#C0B8B0';
  switch (shapeType) {
    case 'panel-arch':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M12 36 V18 A8 8 0 0 1 28 18 V36 Z" fill={fill} stroke={stroke} strokeWidth="1.5" /></svg>;
    case 'panel-rect':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><rect x="12" y="8" width="16" height="28" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" /></svg>;
    case 'panel-round':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><circle cx="20" cy="18" r="14" fill={fill} stroke={stroke} strokeWidth="1.5" /><line x1="20" y1="32" x2="20" y2="38" stroke={stroke} strokeWidth="2" /></svg>;
    case 'panel-wavy':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M12 36 C10 24 18 20 12 12 Q20 8 28 12 C22 20 30 24 28 36 Z" fill={fill} stroke={stroke} strokeWidth="1.5" /></svg>;
    case 'table-rect':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><rect x="6" y="16" width="28" height="6" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" /><line x1="10" y1="22" x2="10" y2="34" stroke={stroke} strokeWidth="1.5" /><line x1="30" y1="22" x2="30" y2="34" stroke={stroke} strokeWidth="1.5" /></svg>;
    case 'table-cloth':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M6 18 Q20 16 34 18 L32 34 Q20 36 8 34 Z" fill={fill} stroke={stroke} strokeWidth="1.5" /></svg>;
    case 'table-round':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><ellipse cx="20" cy="16" rx="14" ry="5" fill={fill} stroke={stroke} strokeWidth="1.5" /><line x1="20" y1="21" x2="20" y2="34" stroke={stroke} strokeWidth="2" /><line x1="14" y1="34" x2="26" y2="34" stroke={stroke} strokeWidth="2" /></svg>;
    case 'cylinder-high':
    case 'cylinder-mid':
    case 'cylinder-low':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><ellipse cx="20" cy="12" rx="10" ry="4" fill={fill} stroke={stroke} strokeWidth="1.5" /><rect x="10" y="12" width="20" height="20" fill={fill} /><line x1="10" y1="12" x2="10" y2="32" stroke={stroke} strokeWidth="1.5" /><line x1="30" y1="12" x2="30" y2="32" stroke={stroke} strokeWidth="1.5" /><ellipse cx="20" cy="32" rx="10" ry="4" fill={fill} stroke={stroke} strokeWidth="1.5" /></svg>;
    case 'acrylic-cylinder':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><ellipse cx="20" cy="12" rx="10" ry="4" fill={fill} opacity="0.6" stroke="#4A90E2" strokeWidth="1.5" /><rect x="10" y="12" width="20" height="20" fill={fill} opacity="0.4" stroke="#4A90E2" strokeWidth="1" /><ellipse cx="20" cy="32" rx="10" ry="4" fill={fill} opacity="0.6" stroke="#4A90E2" strokeWidth="1.5" /></svg>;
    case 'acrylic-table':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><rect x="6" y="16" width="28" height="5" rx="1" fill={fill} opacity="0.6" stroke="#4A90E2" strokeWidth="1.5" /><line x1="10" y1="21" x2="10" y2="34" stroke="#4A90E2" strokeWidth="1.5" strokeDasharray="2,2" /><line x1="30" y1="21" x2="30" y2="34" stroke="#4A90E2" strokeWidth="1.5" strokeDasharray="2,2" /></svg>;
    case 'balloon-small':
    case 'balloon-mid':
    case 'balloon-arch':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><circle cx="16" cy="16" r="7" fill={fill} stroke={stroke} strokeWidth="1.2" /><circle cx="24" cy="18" r="8" fill={fill} stroke={stroke} strokeWidth="1.2" /><circle cx="18" cy="26" r="6" fill={fill} stroke={stroke} strokeWidth="1.2" /></svg>;
    case 'rug-rect':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><rect x="6" y="20" width="28" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3,1" /></svg>;
    case 'rug-oval':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><ellipse cx="20" cy="24" rx="15" ry="6" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray="3,1" /></svg>;
    case 'text':
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><text x="20" y="27" fontSize="22" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill={fill}>T</text></svg>;
    default:
      return <svg viewBox="0 0 40 40" className="w-10 h-10"><rect x="10" y="10" width="20" height="20" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" /></svg>;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

type ActivePanel = ElementCategory | 'uploads' | null;

export default function ElementsSidebar({
  onAddElement,
  customUploads,
  onUploadItem,
  onDeleteCustomUpload,
  onRenameCustomUpload,
  onAddCustomElement,
  isUploadingItem,
  onClose,
}: ElementsSidebarProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>('paineis');
  const [selectedUploadCategory, setSelectedUploadCategory] = useState<string>('Todos');
  const [targetUploadCategory, setTargetUploadCategory] = useState<CustomItemCategory>('Extra');
  const [isDragging, setIsDragging] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems: { id: ActivePanel; label: string }[] = [
    ...CATEGORIES.map((c) => ({ id: c.id as ActivePanel, label: c.name })),
    { id: 'uploads', label: 'Meus itens' },
  ];

  const filteredElements = ELEMENT_LIBRARY.filter((item) => {
    if (searchQuery.trim()) return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return item.category === (activePanel as ElementCategory);
  });

  const filteredUploads = customUploads.filter((item) => {
    if (selectedUploadCategory === 'Todos') return true;
    return (item.category || 'Extra') === selectedUploadCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUploadItem(file, targetUploadCategory);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUploadItem(file, targetUploadCategory);
  };

  const handleSaveRename = (id: string) => {
    if (editNameValue.trim()) onRenameCustomUpload(id, editNameValue.trim());
    setEditingItemId(null);
  };

  const togglePanel = (id: ActivePanel) => {
    setActivePanel((prev) => (prev === id ? null : id));
    setSearchQuery('');
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] select-none shrink-0">

      {/* ── RAIL: narrow icon column ── */}
      <nav className="w-[72px] bg-white border-r border-zinc-200 flex flex-col items-center pt-2 gap-1 overflow-y-auto shrink-0">
        {navItems.map((item) => {
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id as string}
              type="button"
              onClick={() => togglePanel(item.id)}
              title={item.label}
              className={`w-14 flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
              }`}
            >
              <span className={`${isActive ? 'text-orange-600' : 'text-zinc-500'}`}>
                {CATEGORY_ICONS[item.id as string] ?? <Box className="w-5 h-5" />}
              </span>
              <span className="text-[9px] font-medium leading-tight font-sans">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── PANEL: slides open next to rail ── */}
      {activePanel !== null && (
        <aside className="w-60 bg-white border-r border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-left-2 duration-150">

          {/* Panel header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-100">
            <h2 className="text-xs font-semibold text-zinc-800 font-sans">
              {activePanel === 'uploads'
                ? 'Meus itens'
                : CATEGORIES.find((c) => c.id === activePanel)?.name ?? activePanel}
            </h2>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* ── LIBRARY panel ── */}
          {activePanel !== 'uploads' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Search */}
              <div className="px-3 pt-2.5 pb-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-100 text-xs font-sans rounded-lg pl-8 pr-3 py-1.5 outline-none border border-transparent focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-200 transition-all placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto px-2 pb-3">
                {filteredElements.length === 0 ? (
                  <div className="text-center py-10 text-zinc-400 text-xs font-sans">
                    Nenhum item encontrado.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredElements.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onAddElement(item);
                          onClose?.();
                        }}
                        title={`Adicionar ${item.name}`}
                        className="group flex flex-col items-center gap-1.5 p-2 rounded-xl border border-zinc-200 bg-white hover:border-orange-400 hover:shadow-sm hover:bg-orange-50/30 cursor-pointer transition-all text-left"
                      >
                        {/* Thumbnail */}
                        <div className="w-full h-16 flex items-center justify-center rounded-lg bg-zinc-50 overflow-hidden relative">
                          {item.defaultFillImageSrc ? (
                            <img
                              src={item.defaultFillImageSrc}
                              alt={item.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                          ) : null}
                          <div className="relative z-10 group-hover:scale-110 transition-transform">
                            <ElementMiniPreview shapeType={item.shapeType} fill={item.defaultFill} />
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-zinc-700 font-sans text-center leading-tight w-full truncate px-0.5">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── UPLOADS panel ── */}
          {activePanel === 'uploads' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Upload area + category select */}
              <div className="p-3 border-b border-zinc-100 space-y-2">
                {/* Category picker */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-sans whitespace-nowrap">
                    Categoria:
                  </label>
                  <select
                    value={targetUploadCategory}
                    onChange={(e) => setTargetUploadCategory(e.target.value as CustomItemCategory)}
                    className="flex-1 text-xs font-medium text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 outline-none cursor-pointer"
                  >
                    {CUSTOM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/webp, image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Drop zone */}
                <div
                  onClick={() => !isUploadingItem && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border-2 border-dashed text-center transition-all ${
                    isUploadingItem
                      ? 'border-orange-300 bg-orange-50 cursor-wait'
                      : isDragging
                      ? 'border-orange-400 bg-orange-50/50 cursor-copy'
                      : 'border-zinc-200 bg-zinc-50 hover:border-orange-300 hover:bg-orange-50/30 cursor-pointer'
                  }`}
                >
                  {isUploadingItem ? (
                    <>
                      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-orange-700">Removendo fundo...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-sm">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-800">Enviar imagem</p>
                        <p className="text-[10px] text-zinc-400">PNG, WEBP, JPG · até 8MB</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 text-left w-full">
                        <p className="text-[9.5px] text-amber-800 leading-tight">
                          💡 <span className="font-semibold">Fundo removido automaticamente</span> com IA ao fazer upload.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Category filter for existing uploads */}
                {customUploads.length > 0 && (
                  <div className="flex gap-1 overflow-x-auto scrollbar-none pt-0.5">
                    {['Todos', ...CUSTOM_CATEGORIES].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedUploadCategory(cat)}
                        className={`px-2 py-0.5 text-[10px] rounded-full font-sans shrink-0 transition-colors cursor-pointer ${
                          selectedUploadCategory === cat
                            ? 'bg-zinc-900 text-white font-medium'
                            : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload grid */}
              <div className="flex-1 overflow-y-auto p-2.5">
                {filteredUploads.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8 px-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-2">
                      <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <p className="text-xs font-medium text-zinc-600 mb-1">Nenhum item ainda</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      Envie painéis, personagens ou qualquer elemento recortado.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredUploads.map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-orange-400 hover:shadow-sm cursor-pointer transition-all flex flex-col"
                        onClick={() => {
                          onAddCustomElement(item);
                          onClose?.();
                        }}
                      >
                        {item.category && item.category !== 'Extra' && (
                          <span className="absolute top-1.5 left-1.5 z-10 text-[9px] font-medium bg-zinc-900/70 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                            {item.category}
                          </span>
                        )}

                        {/* Preview */}
                        <div className="w-full h-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] bg-zinc-50 flex items-center justify-center p-2">
                          <img
                            src={item.dataUrl}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Footer */}
                        <div className="px-1.5 py-1 bg-white border-t border-zinc-100 flex items-center justify-between gap-1">
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
                                className="w-full text-[10px] border border-orange-300 rounded px-1 py-0.5 outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveRename(item.id)}
                                className="p-0.5 text-orange-600"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span title={item.name} className="text-[10px] font-medium text-zinc-700 truncate flex-1">
                                {item.name}
                              </span>
                              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingItemId(item.id);
                                    setEditNameValue(item.name);
                                  }}
                                  title="Renomear"
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
                                  title="Excluir"
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
      )}
    </div>
  );
}
