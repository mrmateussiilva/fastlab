'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  CanvasElement, 
  LibraryElement,
  CustomUploadItem,
  CustomItemCategory,
  EnvironmentConfig,
  DEFAULT_ENVIRONMENT
} from '@/lib/builder-elements';
import { idbGetAll, idbSave, idbDelete } from '@/lib/idb';
import { RealisticPromptOptions } from '@/lib/prompts';
import BuilderToolbar from './builder-toolbar';
import ElementsSidebar from './elements-sidebar';
import PropertiesSidebar from './properties-sidebar';
import GenerationModal from './generation-modal';
import ResultComparison from '../result-comparison';
import { CanvasStageRef } from './canvas-stage';
import { ZoomIn, ZoomOut, RotateCcw, Plus, Building2, Sliders } from 'lucide-react';
import { useGenerationLimit } from '@/hooks/use-generation-limit';
import GenerationLimitBadge from '../generation-limit-badge';
import MobileSheet from './mobile-sheet';
import MobileQuickActions from './mobile-quick-actions';
import MobileBottomNav from './mobile-bottom-nav';

// Importação dinâmica do CanvasStage para evitar erros de SSR com Konva/Canvas
const CanvasStage = dynamic(() => import('./canvas-stage'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F4F4F2]/50 text-xs text-zinc-400 font-sans">
      Carregando editor visual...
    </div>
  ),
});

interface MockupBuilderProps {
  onBackToHome: () => void;
}

const INITIAL_ELEMENTS: CanvasElement[] = [
  {
    id: 'arch-1',
    elementId: 'panel-arch',
    name: 'Painel Arqueado',
    shapeType: 'panel-arch',
    x: 350,
    y: 220,
    width: 170,
    height: 340,
    rotation: 0,
    zIndex: 1,
    fill: '#E7DFD5',
    stroke: '#D1C6BA',
    opacity: 1,
  },
  {
    id: 'round-1',
    elementId: 'panel-round',
    name: 'Painel Redondo',
    shapeType: 'panel-round',
    x: 480,
    y: 240,
    width: 250,
    height: 320,
    rotation: 0,
    zIndex: 2,
    fill: '#C97A63',
    stroke: '#B56852',
    opacity: 1,
  },
  {
    id: 'cyl-1',
    elementId: 'cylinder-mid',
    name: 'Cilindro Médio',
    shapeType: 'cylinder-mid',
    x: 380,
    y: 410,
    width: 100,
    height: 160,
    rotation: 0,
    zIndex: 3,
    fill: '#F5F3EF',
    stroke: '#D1C6BA',
    opacity: 1,
  },
  {
    id: 'cyl-2',
    elementId: 'cylinder-low',
    name: 'Cilindro Baixo',
    shapeType: 'cylinder-low',
    x: 460,
    y: 450,
    width: 110,
    height: 120,
    rotation: 0,
    zIndex: 4,
    fill: '#D5C7B7',
    stroke: '#BFAFA0',
    opacity: 1,
  },
  {
    id: 'balloons-1',
    elementId: 'balloon-mid',
    name: 'Cacho de Balões',
    shapeType: 'balloon-mid',
    x: 300,
    y: 190,
    width: 190,
    height: 210,
    rotation: -10,
    zIndex: 5,
    fill: '#E2B1B6',
    stroke: '#CCA0A5',
    opacity: 1,
  },
];

export default function MockupBuilder({ onBackToHome }: MockupBuilderProps) {
  const limitData = useGenerationLimit();

  // Carrega estado salvo do localStorage com fallback
  const [elements, setElements] = useState<CanvasElement[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ELEMENTS;
    try {
      const saved = localStorage.getItem('festalab_project_elements');
      return saved ? JSON.parse(saved) : INITIAL_ELEMENTS;
    } catch {
      return INITIAL_ELEMENTS;
    }
  });

  const [environment, setEnvironment] = useState<EnvironmentConfig>(() => {
    if (typeof window === 'undefined') return DEFAULT_ENVIRONMENT;
    try {
      const saved = localStorage.getItem('festalab_environment_state');
      return saved ? JSON.parse(saved) : DEFAULT_ENVIRONMENT;
    } catch {
      return DEFAULT_ENVIRONMENT;
    }
  });

  const [projectName, setProjectName] = useState(() => {
    if (typeof window === 'undefined') return 'Decoração Principal';
    try {
      return localStorage.getItem('festalab_project_name') || 'Decoração Principal';
    } catch {
      return 'Decoração Principal';
    }
  });

  // Histórico de Undo / Redo
  const [history, setHistory] = useState<CanvasElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportedMockupUrl, setExportedMockupUrl] = useState<string | null>(null);
  const [realisticResultUrl, setRealisticResultUrl] = useState<string | null>(null);
  const [customUploads, setCustomUploads] = useState<CustomUploadItem[]>([]);
  
  // Modos de visualização, zoom e modal de opções
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [mobileSheet, setMobileSheet] = useState<'items' | 'environment' | 'properties' | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<CanvasStageRef>(null);

  // Carrega uploads do IndexedDB na montagem
  useEffect(() => {
    idbGetAll<CustomUploadItem>().then((items) => {
      if (items && items.length > 0) {
        setCustomUploads(items);
      } else {
        // Fallback localStorage para uploads antigos
        try {
          const saved = localStorage.getItem('festalab_custom_uploads');
          if (saved) {
            const parsed = JSON.parse(saved);
            setCustomUploads(parsed);
            parsed.forEach((it: CustomUploadItem) => idbSave(it));
          }
        } catch (e) {
          console.warn(e);
        }
      }
    });

    // Restaura foto de ambiente se salva no IndexedDB
    idbGetAll<{ id: string; dataUrl: string }>().then((items) => {
      const bg = items.find((it) => it.id === 'festalab_background_image');
      if (bg?.dataUrl) {
        setEnvironment((prev) => ({ ...prev, backgroundImage: bg.dataUrl }));
      }
    });
  }, []);

  // Salva elementos e configurações no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('festalab_project_elements', JSON.stringify(elements));
    } catch (e) {
      console.warn(e);
    }
  }, [elements]);

  useEffect(() => {
    try {
      const envToSave = { ...environment };
      if (envToSave.backgroundImage && envToSave.backgroundImage.startsWith('data:')) {
        idbSave({
          id: 'festalab_background_image',
          name: 'Ambiente Real',
          dataUrl: envToSave.backgroundImage,
        });
        envToSave.backgroundImage = '__IDB_SAVED__';
      } else if (!envToSave.backgroundImage) {
        idbDelete('festalab_background_image');
      }
      localStorage.setItem('festalab_environment_state', JSON.stringify(envToSave));
    } catch (e) {
      console.warn(e);
    }
  }, [environment]);

  useEffect(() => {
    try {
      localStorage.setItem('festalab_project_name', projectName);
    } catch (e) {
      console.warn(e);
    }
  }, [projectName]);

  // Função para adicionar estado ao histórico de Undo/Redo
  const commitChange = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      const nextHistory = [...upToCurrent, newElements];
      if (nextHistory.length > 30) {
        nextHistory.shift();
      }
      return nextHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  // Desfazer (Undo)
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setElements(history[newIdx]);
    }
  }, [history, historyIndex]);

  // Refazer (Redo)
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setElements(history[newIdx]);
    }
  }, [history, historyIndex]);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // Processa o upload de uma imagem personalizada
  const handleUploadCustomItem = (uploadedFile: File, category: CustomItemCategory = 'Extra') => {
    const validTypes = ['image/png', 'image/webp', 'image/jpeg'];
    if (!validTypes.includes(uploadedFile.type)) {
      setError('Formato inválido. Use PNG, WEBP ou JPG.');
      return;
    }
    if (uploadedFile.size > 8 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new window.Image();
      img.onload = () => {
        const newItem: CustomUploadItem = {
          id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: uploadedFile.name.replace(/\.[^/.]+$/, ''),
          category,
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          createdAt: Date.now(),
        };

        setCustomUploads((prev) => [newItem, ...prev]);
        idbSave(newItem);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Exclui item da lista de uploads
  const handleDeleteCustomUpload = (id: string) => {
    setCustomUploads((prev) => prev.filter((item) => item.id !== id));
    idbDelete(id);
  };

  // Renomeia item da lista de uploads
  const handleRenameCustomUpload = (id: string, newName: string) => {
    setCustomUploads((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, name: newName };
          idbSave(updated);
          return updated;
        }
        return item;
      })
    );
  };

  // Adiciona elemento personalizado ao canvas com proporção calculada
  const handleAddCustomElement = (item: CustomUploadItem) => {
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const offset = Math.floor(Math.random() * 40) - 20;

    const origW = item.width || 200;
    const origH = item.height || 200;
    const maxDim = 220;
    let defW = origW;
    let defH = origH;

    if (origW > origH) {
      defW = maxDim;
      defH = Math.round((origH / origW) * maxDim);
    } else {
      defH = maxDim;
      defW = Math.round((origW / origH) * maxDim);
    }

    const newElement: CanvasElement = {
      id: `el-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      elementId: item.id,
      name: item.name,
      shapeType: 'custom-image',
      imageUrl: item.dataUrl,
      x: 450 + offset,
      y: 350 + offset,
      width: defW,
      height: defH,
      rotation: 0,
      zIndex: maxZ + 1,
      fill: 'transparent',
      opacity: 1,
    };

    const nextElements = [...elements, newElement];
    commitChange(nextElements);
    setSelectedId(newElement.id);
    setMobileSheet(null);
  };

  // Adicionar elemento da biblioteca padrão ao centro
  const handleAddElement = (libItem: LibraryElement) => {
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const offset = Math.floor(Math.random() * 40) - 20;
    const isText = libItem.shapeType === 'text';

    const newElement: CanvasElement = {
      id: `el-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      elementId: libItem.id,
      name: libItem.name,
      shapeType: libItem.shapeType,
      x: 450 + offset,
      y: 350 + offset,
      width: libItem.defaultWidth,
      height: libItem.defaultHeight,
      rotation: 0,
      zIndex: maxZ + 1,
      fill: libItem.defaultFill,
      stroke: libItem.defaultStroke,
      opacity: libItem.defaultOpacity ?? 1,
      text: isText ? 'Texto do Evento' : undefined,
      fontSize: isText ? 32 : undefined,
      fontWeight: isText ? 'bold' : undefined,
      align: isText ? 'center' : undefined,
    };

    const nextElements = [...elements, newElement];
    commitChange(nextElements);
    setSelectedId(newElement.id);
    setMobileSheet(null);
  };

  // Atualizar propriedades do elemento
  const handleUpdateElement = (id: string, updated: Partial<CanvasElement>) => {
    const nextElements = elements.map((el) => (el.id === id ? { ...el, ...updated } : el));
    commitChange(nextElements);
  };

  // Duplicar elemento selecionado
  const handleDuplicate = useCallback(() => {
    if (!selectedElement) return;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const duplicated: CanvasElement = {
      ...selectedElement,
      id: `el-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${selectedElement.name} (cópia)`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
      zIndex: maxZ + 1,
    };
    const nextElements = [...elements, duplicated];
    commitChange(nextElements);
    setSelectedId(duplicated.id);
  }, [selectedElement, elements, commitChange]);

  // Excluir elemento selecionado
  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    const nextElements = elements.filter((el) => el.id !== selectedId);
    commitChange(nextElements);
    setSelectedId(null);
  }, [selectedId, elements, commitChange]);

  // Ordem de camadas: Trazer para frente (Topo)
  const handleBringToFront = () => {
    if (!selectedElement) return;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    handleUpdateElement(selectedElement.id, { zIndex: maxZ + 1 });
  };

  // Ordem de camadas: Avançar uma camada (+1)
  const handleBringForward = () => {
    if (!selectedElement) return;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const currIdx = sorted.findIndex((el) => el.id === selectedElement.id);
    if (currIdx < sorted.length - 1) {
      const nextEl = sorted[currIdx + 1];
      const newElements = elements.map((el) => {
        if (el.id === selectedElement.id) return { ...el, zIndex: nextEl.zIndex };
        if (el.id === nextEl.id) return { ...el, zIndex: selectedElement.zIndex };
        return el;
      });
      commitChange(newElements);
    }
  };

  // Ordem de camadas: Recuar uma camada (-1)
  const handleSendBackward = () => {
    if (!selectedElement) return;
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    const currIdx = sorted.findIndex((el) => el.id === selectedElement.id);
    if (currIdx > 0) {
      const prevEl = sorted[currIdx - 1];
      const newElements = elements.map((el) => {
        if (el.id === selectedElement.id) return { ...el, zIndex: prevEl.zIndex };
        if (el.id === prevEl.id) return { ...el, zIndex: selectedElement.zIndex };
        return el;
      });
      commitChange(newElements);
    }
  };

  // Ordem de camadas: Enviar para trás (Fundo)
  const handleSendToBack = () => {
    if (!selectedElement) return;
    const minZ = elements.reduce((min, el) => Math.min(min, el.zIndex), 0);
    handleUpdateElement(selectedElement.id, { zIndex: minZ - 1 });
  };

  // Atalhos de teclado (Delete, Ctrl+D, Ctrl+Z, Ctrl+Shift+Z, Escape, Setas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z (sem shift)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Shift+Z ou Ctrl+Y
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey) ||
          ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Duplicar: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicate();
        return;
      }

      // Excluir: Delete / Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        handleDelete();
        return;
      }

      // Desselecionar: Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedId(null);
        return;
      }

      // Setas para mover poucos pixels
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && selectedElement && !selectedElement.locked) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 2;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;

        const nextElements = elements.map((el) =>
          el.id === selectedElement.id ? { ...el, x: el.x + dx, y: el.y + dy } : el
        );
        commitChange(nextElements);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedElement, elements, handleUndo, handleRedo, handleDuplicate, handleDelete, commitChange]);

  // Exportar Mockup diretamente como imagem PNG
  const handleExportMockup = () => {
    if (!canvasRef.current) return;
    setSelectedId(null);

    setTimeout(() => {
      const dataUrl = canvasRef.current?.exportImage();
      if (!dataUrl) return;

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-mockup.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 60);
  };

  // Gerar Imagem Realista a partir do Canvas com Opções
  const handleGenerateRealistic = async (options: RealisticPromptOptions) => {
    if (!canvasRef.current) return;
    setSelectedId(null);
    setIsGenerating(true);
    setError(null);
    setIsGenerateModalOpen(false);

    setTimeout(async () => {
      try {
        const dataUrl = canvasRef.current?.exportImage();
        if (!dataUrl) {
          throw new Error('Não foi possível exportar a imagem do canvas.');
        }

        setExportedMockupUrl(dataUrl);

        // Converte Data URL em Blob e depois em File
        const resBlob = await fetch(dataUrl);
        const blob = await resBlob.blob();
        const file = new File([blob], 'mockup-canvas.png', { type: 'image/png' });

        const formData = new FormData();
        formData.append('image', file);
        formData.append('options', JSON.stringify(options));

        const res = await fetch('/api/generate', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429 || data.error === 'RATE_LIMIT' || data.error === 'GLOBAL_LIMIT') {
            limitData.refresh();
          }
          throw new Error(data.message || data.error || 'Erro ao gerar imagem realista');
        }

        setRealisticResultUrl(data.image);
        limitData.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao processar imagem.');
      } finally {
        setIsGenerating(false);
      }
    }, 120);
  };

  // Se já temos o resultado realista gerado, exibe a tela de comparação
  if (realisticResultUrl && exportedMockupUrl) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAF8] flex flex-col">
        {/* Header da Comparação */}
        <header className="w-full border-b border-zinc-200/70 bg-[#FAFAF8]/90 backdrop-blur-xs sticky top-0 z-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            <span className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-zinc-950 select-none">
              FestaLab
            </span>
            <button
              type="button"
              onClick={() => setRealisticResultUrl(null)}
              className="text-xs font-medium text-zinc-600 hover:text-zinc-950 px-3 py-1.5 rounded-lg hover:bg-zinc-200/50 transition-colors cursor-pointer font-sans"
            >
              ← Voltar ao Editor
            </button>
          </div>
        </header>

        {/* Hero compacto */}
        <section className="text-center pt-8 pb-5 px-4 max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-zinc-900 leading-tight">
            Do projeto à realidade.
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-sans">
            Seu mockup montado foi transformado em uma apresentação fotorealista.
          </p>
        </section>

        {/* Comparação lado a lado */}
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 flex-1 flex flex-col">
          <ResultComparison
            originalImage={exportedMockupUrl}
            resultImage={realisticResultUrl}
            originalLabel="Mockup montado"
            isGenerating={isGenerating}
            onRegenerate={() => setIsGenerateModalOpen(true)}
            onBack={() => setRealisticResultUrl(null)}
            backLabel="Voltar ao editor"
            isRegenerateDisabled={limitData.remaining === 0 || limitData.globalLimitReached}
            limitBadge={<GenerationLimitBadge limitData={limitData} compact />}
          />
        </div>

        {/* Modal para gerar novamente com outras opções se desejar */}
        <GenerationModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          onConfirm={handleGenerateRealistic}
          isGenerating={isGenerating}
          limitData={limitData}
        />
      </div>
    );
  }

  // Interface do Editor (3 Colunas: Biblioteca | Canvas | Propriedades)
  return (
    <div className="w-full h-screen flex flex-col bg-[#F4F4F2] overflow-hidden">
      
      {/* Barra Superior / Toolbar */}
      <BuilderToolbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onBack={onBackToHome}
        onExport={handleExportMockup}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
        isGenerating={isGenerating}
        elementCount={elements.length}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => {
          setSelectedId(null);
          setIsPreviewMode(!isPreviewMode);
        }}
        limitData={limitData}
      />

      {/* Alerta de Erro, se houver */}
      {error && (
        <div className="w-full bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-700 flex items-center justify-between z-40">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Área Principal: Sidebars e Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 1. Sidebar Esquerda: Biblioteca de Itens & Uploads (visível em Desktop) */}
        {!isPreviewMode && (
          <div className="hidden md:flex shrink-0">
            <ElementsSidebar 
              onAddElement={handleAddElement}
              customUploads={customUploads}
              onUploadItem={handleUploadCustomItem}
              onDeleteCustomUpload={handleDeleteCustomUpload}
              onRenameCustomUpload={handleRenameCustomUpload}
              onAddCustomElement={handleAddCustomElement}
            />
          </div>
        )}

        {/* 2. Área Central: Canvas Interativo */}
        <main className="flex-1 h-full bg-[#EFECE6] relative overflow-hidden flex flex-col pb-16 md:pb-0">
          <CanvasStage
            ref={canvasRef}
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onUpdateElement={handleUpdateElement}
            environment={environment}
            zoom={zoom}
            onZoomChange={setZoom}
            panOffset={panOffset}
            onPanChange={setPanOffset}
            isPreviewMode={isPreviewMode}
          />

          {/* Controles Flutuantes de Zoom no Canvas */}
          <div className="absolute bottom-20 md:bottom-4 right-3 md:right-4 z-20 bg-white/95 backdrop-blur-xs border border-zinc-200/80 rounded-xl shadow-md p-1 flex items-center gap-1 select-none">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(Math.round((z - 0.25) * 100) / 100, 0.35))}
              disabled={zoom <= 0.35}
              title="Diminuir Zoom"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-mono font-medium text-zinc-700 px-2 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(Math.round((z + 0.25) * 100) / 100, 2.0))}
              disabled={zoom >= 2.0}
              title="Aumentar Zoom"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-zinc-200 mx-0.5" />

            <button
              type="button"
              onClick={() => {
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                setZoom(isMobile ? 0.45 : 1);
                setPanOffset({ x: 0, y: 0 });
              }}
              title="Redefinir Zoom"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Dica de Pan com Espaço */}
          <div className="absolute bottom-4 left-4 z-10 text-[10px] text-zinc-400 font-sans pointer-events-none hidden md:block">
            💡 Dica: Segure <kbd className="px-1.5 py-0.5 bg-white/80 border border-zinc-200 rounded font-mono text-[9px]">Espaço</kbd> para arrastar o cenário
          </div>
        </main>

        {/* 3. Sidebar Direita: Propriedades / Ambiente (visível em Desktop) */}
        {!isPreviewMode && (
          <div className="hidden md:flex shrink-0">
            <PropertiesSidebar
              selectedElement={selectedElement}
              onUpdateElement={(updated) => {
                if (selectedId) handleUpdateElement(selectedId, updated);
              }}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onBringToFront={handleBringToFront}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onSendToBack={handleSendToBack}
              environment={environment}
              onUpdateEnvironment={(updated) => {
                setEnvironment((prev) => ({ ...prev, ...updated }));
              }}
            />
          </div>
        )}

      </div>

      {/* Ações Rápidas Flutuantes no Celular quando um item está selecionado */}
      {!isPreviewMode && selectedElement && (
        <MobileQuickActions
          selectedElement={selectedElement}
          onOpenProperties={() => setMobileSheet('properties')}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onDeselect={() => setSelectedId(null)}
        />
      )}

      {/* Barra de Navegação Inferior para Celular */}
      {!isPreviewMode && (
        <MobileBottomNav
          onOpenItems={() => setMobileSheet('items')}
          onOpenEnvironment={() => setMobileSheet('environment')}
          onOpenProperties={() => setMobileSheet('properties')}
          onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
          hasSelectedElement={Boolean(selectedElement)}
          elementCount={elements.length}
          isGenerating={isGenerating}
          limitData={limitData}
        />
      )}

      {/* Bottom Sheet 1: Biblioteca de Itens & Meus Uploads (Celular) */}
      <MobileSheet
        isOpen={mobileSheet === 'items'}
        onClose={() => setMobileSheet(null)}
        title="Biblioteca de Itens"
        subtitle="Toque em um item para adicionar ao cenário"
        icon={<Plus className="w-4 h-4" />}
        maxHeight="max-h-[85vh]"
      >
        <ElementsSidebar
          className="w-full h-full flex flex-col"
          onClose={() => setMobileSheet(null)}
          onAddElement={(item) => {
            handleAddElement(item);
            setMobileSheet(null);
          }}
          customUploads={customUploads}
          onUploadItem={handleUploadCustomItem}
          onDeleteCustomUpload={handleDeleteCustomUpload}
          onRenameCustomUpload={handleRenameCustomUpload}
          onAddCustomElement={(item) => {
            handleAddCustomElement(item);
            setMobileSheet(null);
          }}
        />
      </MobileSheet>

      {/* Bottom Sheet 2: Ambiente & Fundo (Celular) */}
      <MobileSheet
        isOpen={mobileSheet === 'environment'}
        onClose={() => setMobileSheet(null)}
        title="Ambiente & Fundo"
        subtitle="Foto real, parede e piso do espaço"
        icon={<Building2 className="w-4 h-4" />}
        maxHeight="max-h-[85vh]"
      >
        <PropertiesSidebar
          mode="environment"
          className="w-full h-full flex flex-col"
          onClose={() => setMobileSheet(null)}
          selectedElement={null}
          onUpdateElement={() => {}}
          onDuplicate={() => {}}
          onDelete={() => {}}
          onBringToFront={() => {}}
          onBringForward={() => {}}
          onSendBackward={() => {}}
          onSendToBack={() => {}}
          environment={environment}
          onUpdateEnvironment={(updated) => {
            setEnvironment((prev) => ({ ...prev, ...updated }));
          }}
        />
      </MobileSheet>

      {/* Bottom Sheet 3: Propriedades do Item Selecionado (Celular) */}
      <MobileSheet
        isOpen={mobileSheet === 'properties'}
        onClose={() => setMobileSheet(null)}
        title={selectedElement?.name || "Propriedades do Item"}
        subtitle="Editar cores, dimensões e camadas"
        icon={<Sliders className="w-4 h-4" />}
        maxHeight="max-h-[85vh]"
      >
        <PropertiesSidebar
          mode="element"
          className="w-full h-full flex flex-col"
          onClose={() => setMobileSheet(null)}
          selectedElement={selectedElement}
          onUpdateElement={(updated) => {
            if (selectedId) handleUpdateElement(selectedId, updated);
          }}
          onDuplicate={handleDuplicate}
          onDelete={() => {
            handleDelete();
            setMobileSheet(null);
          }}
          onBringToFront={handleBringToFront}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onSendToBack={handleSendToBack}
          environment={environment}
          onUpdateEnvironment={(updated) => {
            setEnvironment((prev) => ({ ...prev, ...updated }));
          }}
        />
      </MobileSheet>

      {/* Modal de Opções de Geração Realista */}
      <GenerationModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onConfirm={handleGenerateRealistic}
        isGenerating={isGenerating}
        limitData={limitData}
      />

    </div>
  );
}
