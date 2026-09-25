'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { 
  Stage, 
  Layer, 
  Rect, 
  Circle, 
  Ellipse, 
  Path, 
  Line, 
  Group, 
  Text as KonvaText,
  Image as KonvaImage,
  Transformer 
} from 'react-konva';
import Konva from 'konva';
import { 
  CanvasElement, 
  EnvironmentConfig, 
  DEFAULT_ENVIRONMENT 
} from '@/lib/builder-elements';
import { Lock } from 'lucide-react';

export interface CanvasStageRef {
  exportImage: () => string;
}

interface AlignmentGuide {
  points: number[];
  orientation: 'vertical' | 'horizontal';
}

interface CanvasStageProps {
  elements: CanvasElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updated: Partial<CanvasElement>) => void;
  environment?: EnvironmentConfig;
  zoom?: number;
  onZoomChange?: (z: number) => void;
  panOffset?: { x: number; y: number };
  onPanChange?: (offset: { x: number; y: number }) => void;
  isPreviewMode?: boolean;
}

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 750;
const SNAP_THRESHOLD = 7;

// Componente para carregar e renderizar imagens personalizadas no Konva
const KonvaCustomImage = ({
  url,
  width,
  height,
}: {
  url: string;
  width: number;
  height: number;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      setImage(img);
    };
  }, [url]);

  if (!image) {
    return <Rect width={width} height={height} fill="#E8E8E8" cornerRadius={4} opacity={0.5} />;
  }

  return <KonvaImage image={image} width={width} height={height} />;
};

// Renderizador de formato personalizado baseado em shapeType
const ElementShape = ({
  el,
  onSelect,
  onChange,
  onDragMove,
  onDragEnd,
}: {
  el: CanvasElement;
  onSelect: () => void;
  onChange: (updated: Partial<CanvasElement>) => void;
  onDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
}) => {
  const shapeRef = useRef<Konva.Group>(null);

  const strokeColor = el.stroke || '#B8B0A5';
  const strokeWidth = 1.5;
  const w = el.width;
  const h = el.height;

  // Renderiza formas internas de acordo com o tipo
  const renderGeometry = () => {
    switch (el.shapeType) {
      case 'panel-arch': {
        const radius = w / 2;
        const archPath = `M 0 ${h} L 0 ${radius} A ${radius} ${radius} 0 0 1 ${w} ${radius} L ${w} ${h} Z`;
        return (
          <>
            <Path data={archPath} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[w * 0.15, h * 0.15, w * 0.15, h * 0.85]} stroke="#FFFFFF" strokeWidth={1} opacity={0.4} />
          </>
        );
      }

      case 'panel-rect': {
        return (
          <>
            <Rect width={w} height={h} cornerRadius={6} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[w * 0.1, 10, w * 0.1, h - 10]} stroke="#FFFFFF" strokeWidth={1} opacity={0.3} />
          </>
        );
      }

      case 'panel-round': {
        const r = Math.min(w, h * 0.85) / 2;
        return (
          <>
            <Line points={[w / 2, h * 0.8, w / 2, h]} stroke="#4A4A4A" strokeWidth={4} />
            <Line points={[w / 2 - 25, h, w / 2 + 25, h]} stroke="#4A4A4A" strokeWidth={4} />
            <Circle x={w / 2} y={r} radius={r} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Circle x={w / 2} y={r} radius={r * 0.9} stroke="#FFFFFF" strokeWidth={1} opacity={0.3} />
          </>
        );
      }

      case 'panel-wavy': {
        const path = `M 0 ${h} Q ${w * 0.2} ${h * 0.66} 0 ${h * 0.33} Q ${w * 0.2} 0 ${w * 0.5} 0 Q ${w * 0.8} 0 ${w} ${h * 0.33} Q ${w * 0.8} ${h * 0.66} ${w} ${h} Z`;
        return (
          <Path data={path} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
        );
      }

      case 'table-rect': {
        return (
          <>
            <Line points={[15, 20, 15, h]} stroke="#7A7067" strokeWidth={4} />
            <Line points={[w - 15, 20, w - 15, h]} stroke="#7A7067" strokeWidth={4} />
            <Line points={[35, 20, 35, h - 5]} stroke="#9C9287" strokeWidth={3} opacity={0.6} />
            <Line points={[w - 35, 20, w - 35, h - 5]} stroke="#9C9287" strokeWidth={3} opacity={0.6} />
            <Rect x={0} y={0} width={w} height={20} cornerRadius={3} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
          </>
        );
      }

      case 'table-cloth': {
        const path = `M 0 15 Q ${w / 2} 10 ${w} 15 L ${w - 10} ${h} Q ${w / 2} ${h + 8} 10 ${h} Z`;
        return (
          <>
            <Path data={path} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[w * 0.25, 20, w * 0.22, h - 5]} stroke="#000000" strokeWidth={1} opacity={0.15} />
            <Line points={[w * 0.5, 20, w * 0.5, h - 5]} stroke="#000000" strokeWidth={1} opacity={0.15} />
            <Line points={[w * 0.75, 20, w * 0.78, h - 5]} stroke="#000000" strokeWidth={1} opacity={0.15} />
          </>
        );
      }

      case 'table-round': {
        const topH = 18;
        return (
          <>
            <Line points={[w / 2, topH, w / 2, h]} stroke="#7A7067" strokeWidth={6} />
            <Line points={[w / 2 - 30, h, w / 2 + 30, h]} stroke="#7A7067" strokeWidth={5} />
            <Ellipse x={w / 2} y={topH / 2} radiusX={w / 2} radiusY={topH / 2} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
          </>
        );
      }

      case 'cylinder-low':
      case 'cylinder-mid':
      case 'cylinder-high': {
        const ry = 14;
        const bodyH = h - ry;
        return (
          <>
            <Ellipse x={w / 2} y={bodyH} radiusX={w / 2} radiusY={ry} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x={0} y={ry} width={w} height={bodyH - ry} fill={el.fill} />
            <Line points={[0, ry, 0, bodyH]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[w, ry, w, bodyH]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Ellipse x={w / 2} y={ry} radiusX={w / 2} radiusY={ry} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Ellipse x={w / 2} y={ry} radiusX={w / 2 * 0.85} radiusY={ry * 0.85} stroke="#FFFFFF" strokeWidth={1} opacity={0.4} />
          </>
        );
      }

      case 'acrylic-cylinder': {
        const ry = 14;
        const bodyH = h - ry;
        return (
          <>
            <Ellipse x={w / 2} y={bodyH} radiusX={w / 2} radiusY={ry} fill="#E3EDF8" stroke="#90B6DE" strokeWidth={1.5} opacity={0.6} />
            <Rect x={0} y={ry} width={w} height={bodyH - ry} fill="#E3EDF8" opacity={0.4} />
            <Line points={[0, ry, 0, bodyH]} stroke="#90B6DE" strokeWidth={1.5} />
            <Line points={[w, ry, w, bodyH]} stroke="#90B6DE" strokeWidth={1.5} />
            <Line points={[w * 0.15, ry + 10, w * 0.15, bodyH - 10]} stroke="#FFFFFF" strokeWidth={2} opacity={0.7} />
            <Ellipse x={w / 2} y={ry} radiusX={w / 2} radiusY={ry} fill="#EDF4FC" stroke="#90B6DE" strokeWidth={1.5} opacity={0.8} />
          </>
        );
      }

      case 'acrylic-table': {
        return (
          <>
            <Rect x={10} y={15} width={6} height={h - 15} fill="#D3E5F8" stroke="#90B6DE" strokeWidth={1} opacity={0.5} />
            <Rect x={w - 16} y={15} width={6} height={h - 15} fill="#D3E5F8" stroke="#90B6DE" strokeWidth={1} opacity={0.5} />
            <Rect x={0} y={0} width={w} height={16} cornerRadius={2} fill="#EDF4FC" stroke="#90B6DE" strokeWidth={1.5} opacity={0.7} />
            <Line points={[10, 8, w - 10, 8]} stroke="#FFFFFF" strokeWidth={2} opacity={0.8} />
          </>
        );
      }

      case 'balloon-small':
      case 'balloon-mid':
      case 'balloon-arch': {
        const scale = w / 200;
        const bFill = el.fill;
        return (
          <Group scaleX={scale} scaleY={scale}>
            <Circle x={60} y={60} radius={36} fill={bFill} stroke={strokeColor} strokeWidth={1.2} />
            <Ellipse x={50} y={48} radiusX={8} radiusY={4} rotation={-30} fill="#FFFFFF" opacity={0.5} />

            <Circle x={120} y={55} radius={32} fill={bFill} stroke={strokeColor} strokeWidth={1.2} />
            <Ellipse x={110} y={45} radiusX={7} radiusY={3.5} rotation={-30} fill="#FFFFFF" opacity={0.5} />

            <Circle x={90} y={110} radius={42} fill={bFill} stroke={strokeColor} strokeWidth={1.2} />
            <Ellipse x={78} y={96} radiusX={10} radiusY={5} rotation={-30} fill="#FFFFFF" opacity={0.5} />

            <Circle x={145} y={120} radius={30} fill={bFill} stroke={strokeColor} strokeWidth={1.2} />
            <Ellipse x={138} y={110} radiusX={6} radiusY={3} rotation={-30} fill="#FFFFFF" opacity={0.5} />

            <Circle x={45} y={130} radius={28} fill={bFill} stroke={strokeColor} strokeWidth={1.2} />
            <Ellipse x={38} y={122} radiusX={6} radiusY={3} rotation={-30} fill="#FFFFFF" opacity={0.5} />

            <Circle x={105} y={170} radius={35} fill={bFill} stroke={strokeColor} strokeWidth={1.2} />
            <Ellipse x={95} y={158} radiusX={8} radiusY={4} rotation={-30} fill="#FFFFFF" opacity={0.5} />
          </Group>
        );
      }

      case 'rug-oval': {
        return (
          <>
            <Ellipse x={w / 2} y={h / 2} radiusX={w / 2} radiusY={h / 2} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Ellipse x={w / 2} y={h / 2} radiusX={w / 2 * 0.88} radiusY={h / 2 * 0.85} stroke={strokeColor} strokeWidth={1} dash={[6, 3]} opacity={0.6} />
          </>
        );
      }

      case 'rug-rect': {
        return (
          <>
            <Rect x={0} y={0} width={w} height={h} cornerRadius={8} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x={6} y={6} width={w - 12} height={h - 12} cornerRadius={5} stroke={strokeColor} strokeWidth={1} dash={[6, 3]} opacity={0.6} />
          </>
        );
      }

      case 'box': {
        return (
          <>
            <Rect x={0} y={0} width={w} height={h} cornerRadius={4} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[w / 2, 0, w / 2, h]} stroke={strokeColor} strokeWidth={1} opacity={0.3} />
            <Line points={[0, h / 2, w, h / 2]} stroke={strokeColor} strokeWidth={1} opacity={0.3} />
          </>
        );
      }

      case 'pedestal': {
        return (
          <>
            <Rect x={w * 0.15} y={0} width={w * 0.7} height={h - 10} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x={0} y={0} width={w} height={10} cornerRadius={2} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Rect x={w * 0.05} y={h - 10} width={w * 0.9} height={10} cornerRadius={2} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
          </>
        );
      }

      case 'text': {
        return (
          <KonvaText
            text={el.text || 'Texto'}
            fontSize={el.fontSize || 32}
            fontStyle={el.fontWeight === 'bold' ? 'bold' : 'normal'}
            fontFamily="sans-serif"
            fill={el.fill || '#363636'}
            align={el.align || 'center'}
            verticalAlign="middle"
            width={w}
            height={h}
            wrap="word"
            lineHeight={1.2}
          />
        );
      }

      case 'custom-image': {
        if (!el.imageUrl) {
          return <Rect width={w} height={h} fill="#E5E5E5" cornerRadius={4} />;
        }
        return <KonvaCustomImage url={el.imageUrl} width={w} height={h} />;
      }

      default:
        return <Rect width={w} height={h} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />;
    }
  };

  return (
    <Group
      ref={shapeRef}
      id={el.id}
      x={el.x}
      y={el.y}
      width={el.width}
      height={el.height}
      rotation={el.rotation}
      opacity={el.opacity}
      draggable={!el.locked}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect();
      }}
      onDragMove={(e) => {
        if (onDragMove) onDragMove(e);
      }}
      onDragEnd={(e) => {
        if (onDragEnd) onDragEnd(e);
        onChange({
          x: Math.round(e.target.x()),
          y: Math.round(e.target.y()),
        });
      }}
      onTransformEnd={() => {
        const node = shapeRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: Math.round(node.x()),
          y: Math.round(node.y()),
          width: Math.max(20, Math.round(node.width() * scaleX)),
          height: Math.max(20, Math.round(node.height() * scaleY)),
          rotation: Math.round(node.rotation()),
        });
      }}
    >
      {renderGeometry()}
    </Group>
  );
};

const CanvasStage = forwardRef<CanvasStageRef, CanvasStageProps>(({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  environment = DEFAULT_ENVIRONMENT,
  zoom = 1,
  onZoomChange,
  panOffset = { x: 0, y: 0 },
  onPanChange,
  isPreviewMode = false,
}, ref) => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const lastDistRef = useRef<number>(0);

  // Auto-fit inicial em telas de celular (< 768px)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768 && onZoomChange) {
      const padding = 20;
      const availableWidth = window.innerWidth - padding;
      const fitZoom = Math.min(Math.max(availableWidth / CANVAS_WIDTH, 0.35), 0.65);
      onZoomChange(Math.round(fitZoom * 100) / 100);
    }
  }, [onZoomChange]);

  // Espaço pressionado para Pan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Expõe a função de exportação em alta qualidade (pixelRatio 2)
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (!stageRef.current) return '';
      // Limpa a seleção e guias para não exportar bordas
      if (transformerRef.current) {
        transformerRef.current.nodes([]);
      }
      setGuides([]);

      // Reseta zoom e pan temporariamente para exportar o canvas exato 1000x750
      const oldWidth = stageRef.current.width();
      const oldHeight = stageRef.current.height();
      const oldScaleX = stageRef.current.scaleX();
      const oldScaleY = stageRef.current.scaleY();
      const oldX = stageRef.current.x();
      const oldY = stageRef.current.y();

      stageRef.current.size({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
      stageRef.current.scale({ x: 1, y: 1 });
      stageRef.current.position({ x: 0, y: 0 });
      stageRef.current.batchDraw();

      const dataUrl = stageRef.current.toDataURL({
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        pixelRatio: 2,
        mimeType: 'image/png',
      });

      // Restaura scale, tamanho e posição
      stageRef.current.size({ width: oldWidth, height: oldHeight });
      stageRef.current.scale({ x: oldScaleX, y: oldScaleY });
      stageRef.current.position({ x: oldX, y: oldY });
      stageRef.current.batchDraw();

      return dataUrl;
    },
  }));

  // Atualiza nós conectados ao Transformer quando a seleção muda
  const selectedElement = elements.find((el) => el.id === selectedId);

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    if (selectedId && !isPreviewMode) {
      const selectedNode = stageRef.current.findOne('#' + selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
        return;
      }
    }
    transformerRef.current.nodes([]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId, elements, isPreviewMode]);

  // Lógica de Snapping leve e guias de alinhamento ao arrastar
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>, activeId: string) => {
    const activeNode = e.target;
    const activeEl = elements.find((el) => el.id === activeId);
    if (!activeEl) return;

    let targetX = activeNode.x();
    let targetY = activeNode.y();
    const w = activeEl.width;
    const h = activeEl.height;

    const newGuides: AlignmentGuide[] = [];

    // Snap com centro do Canvas (X = 500)
    const centerX = targetX + w / 2;
    if (Math.abs(centerX - CANVAS_WIDTH / 2) < SNAP_THRESHOLD) {
      targetX = CANVAS_WIDTH / 2 - w / 2;
      newGuides.push({
        orientation: 'vertical',
        points: [CANVAS_WIDTH / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT],
      });
    }

    // Snap com linha do chão (Floor Y = 560)
    const bottomY = targetY + h;
    if (Math.abs(bottomY - environment.floorY) < SNAP_THRESHOLD) {
      targetY = environment.floorY - h;
      newGuides.push({
        orientation: 'horizontal',
        points: [0, environment.floorY, CANVAS_WIDTH, environment.floorY],
      });
    }

    // Snap com outros elementos (centro, topo, base, laterais)
    for (const other of elements) {
      if (other.id === activeId) continue;

      // Alinhamento vertical de centro
      const otherCenterX = other.x + other.width / 2;
      if (Math.abs(centerX - otherCenterX) < SNAP_THRESHOLD) {
        targetX = otherCenterX - w / 2;
        newGuides.push({
          orientation: 'vertical',
          points: [otherCenterX, Math.min(targetY, other.y) - 20, otherCenterX, Math.max(targetY + h, other.y + other.height) + 20],
        });
      }

      // Alinhamento horizontal de base (pé com pé)
      const otherBottom = other.y + other.height;
      if (Math.abs(bottomY - otherBottom) < SNAP_THRESHOLD) {
        targetY = otherBottom - h;
        newGuides.push({
          orientation: 'horizontal',
          points: [Math.min(targetX, other.x) - 20, otherBottom, Math.max(targetX + w, other.x + other.width) + 20, otherBottom],
        });
      }
    }

    activeNode.x(targetX);
    activeNode.y(targetY);
    setGuides(newGuides);
  };

  const handleDragEnd = () => {
    setGuides([]);
  };

  // Zoom pelo scroll (com Ctrl/Cmd ou tecla de modificador)
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    if (e.evt.ctrlKey || e.evt.metaKey) {
      e.evt.preventDefault();
      if (!onZoomChange) return;
      const zoomFactor = e.evt.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.5), 2.0);
      onZoomChange(Math.round(newZoom * 100) / 100);
    }
  };

  // Ordena elementos por zIndex
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div 
      className={`w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden relative select-none touch-none ${
        isSpacePressed ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div 
        className="relative bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-zinc-200/80 overflow-hidden"
        style={{ width: CANVAS_WIDTH * zoom, height: CANVAS_HEIGHT * zoom }}
      >
        <Stage
          ref={stageRef}
          x={panOffset.x}
          y={panOffset.y}
          width={CANVAS_WIDTH * zoom}
          height={CANVAS_HEIGHT * zoom}
          scaleX={zoom}
          scaleY={zoom}
          draggable={isSpacePressed}
          onWheel={handleWheel}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage() || e.target.name() === 'background') {
              onSelectElement(null);
            }
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage() || e.target.name() === 'background') {
              onSelectElement(null);
            }
          }}
          onTouchMove={(e) => {
            const touch1 = e.evt.touches?.[0];
            const touch2 = e.evt.touches?.[1];

            if (touch1 && touch2 && onZoomChange) {
              const dist = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
              );

              if (!lastDistRef.current) {
                lastDistRef.current = dist;
              }

              const scale = dist / lastDistRef.current;
              const newZoom = Math.min(Math.max(zoom * scale, 0.35), 2.2);
              onZoomChange(Math.round(newZoom * 100) / 100);
              lastDistRef.current = dist;
            }
          }}
          onTouchEnd={() => {
            lastDistRef.current = 0;
          }}
          onDragEnd={(e) => {
            if (isSpacePressed && onPanChange) {
              onPanChange({ x: e.target.x(), y: e.target.y() });
            }
          }}
        >
          {/* Camada de Fundo (Ambiente do Evento: Parede + Piso OU Imagem Real) */}
          <Layer>
            {environment.backgroundImage ? (
              <KonvaCustomImage
                url={environment.backgroundImage}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
              />
            ) : (
              <>
                {/* Parede / Fundo Superior */}
                <Rect
                  name="background"
                  x={0}
                  y={0}
                  width={CANVAS_WIDTH}
                  height={environment.floorY}
                  fill={environment.wallColor}
                />
                {/* Rodapé / Linha divisória sutil */}
                <Line
                  points={[0, environment.floorY, CANVAS_WIDTH, environment.floorY]}
                  stroke="#DEDAD2"
                  strokeWidth={1.5}
                />
                {/* Chão / Piso Inferior */}
                <Rect
                  name="background"
                  x={0}
                  y={environment.floorY}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT - environment.floorY}
                  fill={environment.floorColor}
                />
                {/* Sombra de profundidade no chão */}
                <Line
                  points={[0, environment.floorY + 1, CANVAS_WIDTH, environment.floorY + 1]}
                  stroke="#000000"
                  strokeWidth={2}
                  opacity={0.06}
                />
              </>
            )}
          </Layer>

          {/* Camada de Elementos */}
          <Layer>
            {sortedElements.map((el) => (
              <ElementShape
                key={el.id}
                el={el}
                onSelect={() => onSelectElement(el.id)}
                onChange={(updated) => onUpdateElement(el.id, updated)}
                onDragMove={(e) => handleDragMove(e, el.id)}
                onDragEnd={handleDragEnd}
              />
            ))}

            {/* Guias Visuais Temporárias de Snapping */}
            {!isPreviewMode && guides.map((guide, idx) => (
              <Line
                key={`guide-${idx}`}
                points={guide.points}
                stroke="#EA580C"
                strokeWidth={1}
                dash={[5, 4]}
                opacity={0.75}
              />
            ))}

            {/* Caixa de Transformação (Resize / Rotate) */}
            {!isPreviewMode && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (Math.abs(newBox.width) < 15 || Math.abs(newBox.height) < 15) {
                    return oldBox;
                  }
                  return newBox;
                }}
                rotateEnabled={!selectedElement?.locked}
                enabledAnchors={
                  selectedElement?.locked 
                    ? [] 
                    : ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']
                }
                anchorCornerRadius={4}
                anchorSize={12}
                rotateAnchorOffset={24}
                anchorFill="#FFFFFF"
                anchorStroke={selectedElement?.locked ? '#9CA3AF' : '#EA580C'}
                anchorStrokeWidth={2}
                borderStroke={selectedElement?.locked ? '#9CA3AF' : '#EA580C'}
                borderStrokeWidth={1.5}
                borderDash={selectedElement?.locked ? [3, 3] : [4, 3]}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Indicador se o item selecionado está travado */}
      {selectedElement?.locked && !isPreviewMode && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-zinc-900/80 text-white text-[11px] font-sans px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-xs">
          <Lock className="w-3 h-3 text-orange-400" />
          <span>Item bloqueado (destrave no painel direito para mover)</span>
        </div>
      )}
    </div>
  );
});

CanvasStage.displayName = 'CanvasStage';
export default CanvasStage;
