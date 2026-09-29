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

// Auxiliar para desenhar retângulo arredondado no contexto 2D de clip
function drawCanvasRoundRect(
  ctx: Konva.Context,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const nativeCtx = ctx._context as (CanvasRenderingContext2D & { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void }) | undefined;
  if (nativeCtx && typeof nativeCtx.roundRect === 'function') {
    nativeCtx.roundRect(x, y, w, h, r);
  } else {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
  }
}

// Componente para renderizar a imagem/arte interna mascarada na forma
const ClippedArtworkImage = ({
  url,
  boxX = 0,
  boxY = 0,
  boxWidth,
  boxHeight,
  fillMode = 'cover',
  fillScale = 1,
  fillOffsetX = 0,
  fillOffsetY = 0,
}: {
  url: string;
  boxX?: number;
  boxY?: number;
  boxWidth: number;
  boxHeight: number;
  fillMode?: 'cover' | 'contain';
  fillScale?: number;
  fillOffsetX?: number;
  fillOffsetY?: number;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) return;
    let active = true;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      if (active) {
        setImage(img);
      }
    };
    return () => {
      active = false;
    };
  }, [url]);

  if (!image || !image.width || !image.height) {
    return null;
  }

  const imgRatio = image.width / image.height;
  const boxRatio = boxWidth / boxHeight;

  let baseWidth = boxWidth;
  let baseHeight = boxHeight;

  if (fillMode === 'contain') {
    if (imgRatio > boxRatio) {
      baseWidth = boxWidth;
      baseHeight = boxWidth / imgRatio;
    } else {
      baseHeight = boxHeight;
      baseWidth = boxHeight * imgRatio;
    }
  } else {
    // 'cover'
    if (imgRatio > boxRatio) {
      baseHeight = boxHeight;
      baseWidth = boxHeight * imgRatio;
    } else {
      baseWidth = boxWidth;
      baseHeight = boxWidth / imgRatio;
    }
  }

  const scale = fillScale || 1;
  const finalWidth = baseWidth * scale;
  const finalHeight = baseHeight * scale;

  const posX = boxX + (boxWidth - finalWidth) / 2 + (fillOffsetX || 0);
  const posY = boxY + (boxHeight - finalHeight) / 2 + (fillOffsetY || 0);

  return (
    <KonvaImage
      image={image}
      x={posX}
      y={posY}
      width={finalWidth}
      height={finalHeight}
      listening={false}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSIÇÃO DE BALÕES ORGÂNICOS (Acabamentos: Matte, Chrome, Pearl e 3 Cores)
// ─────────────────────────────────────────────────────────────────────────────

interface BalloonSpec {
  nx: number;
  ny: number;
  nr: number;
  slot: 1 | 2 | 3;
  z: number;
}

// 1. Arco em L Desconstruído (Emoldura painéis com subida lateral e topo horizontal)
const L_ARCH_SPECS: BalloonSpec[] = [
  // Base do chão
  { nx: 0.12, ny: 0.94, nr: 0.15, slot: 1, z: 1 },
  { nx: 0.24, ny: 0.92, nr: 0.13, slot: 2, z: 2 },
  { nx: 0.08, ny: 0.88, nr: 0.11, slot: 3, z: 2 },
  { nx: 0.18, ny: 0.87, nr: 0.07, slot: 1, z: 5 },
  { nx: 0.17, ny: 0.80, nr: 0.14, slot: 1, z: 1 },
  { nx: 0.09, ny: 0.76, nr: 0.11, slot: 2, z: 3 },
  { nx: 0.25, ny: 0.74, nr: 0.10, slot: 3, z: 2 },
  { nx: 0.16, ny: 0.72, nr: 0.06, slot: 2, z: 5 },
  // Coluna vertical
  { nx: 0.16, ny: 0.65, nr: 0.14, slot: 1, z: 1 },
  { nx: 0.07, ny: 0.60, nr: 0.10, slot: 3, z: 2 },
  { nx: 0.24, ny: 0.58, nr: 0.12, slot: 2, z: 3 },
  { nx: 0.15, ny: 0.54, nr: 0.06, slot: 1, z: 5 },
  { nx: 0.14, ny: 0.47, nr: 0.13, slot: 1, z: 1 },
  { nx: 0.23, ny: 0.43, nr: 0.11, slot: 3, z: 2 },
  { nx: 0.08, ny: 0.40, nr: 0.10, slot: 2, z: 3 },
  { nx: 0.16, ny: 0.38, nr: 0.06, slot: 3, z: 5 },
  { nx: 0.18, ny: 0.31, nr: 0.14, slot: 1, z: 2 },
  { nx: 0.09, ny: 0.27, nr: 0.11, slot: 2, z: 1 },
  { nx: 0.26, ny: 0.25, nr: 0.12, slot: 3, z: 3 },
  { nx: 0.17, ny: 0.23, nr: 0.07, slot: 2, z: 5 },
  // Cotovelo / Curva
  { nx: 0.20, ny: 0.15, nr: 0.15, slot: 1, z: 1 },
  { nx: 0.12, ny: 0.13, nr: 0.11, slot: 3, z: 2 },
  { nx: 0.28, ny: 0.14, nr: 0.12, slot: 2, z: 3 },
  { nx: 0.22, ny: 0.09, nr: 0.07, slot: 1, z: 5 },
  // Braço superior horizontal
  { nx: 0.36, ny: 0.13, nr: 0.14, slot: 1, z: 1 },
  { nx: 0.44, ny: 0.10, nr: 0.11, slot: 2, z: 2 },
  { nx: 0.50, ny: 0.15, nr: 0.12, slot: 3, z: 3 },
  { nx: 0.42, ny: 0.17, nr: 0.06, slot: 3, z: 5 },
  { nx: 0.58, ny: 0.12, nr: 0.13, slot: 1, z: 1 },
  { nx: 0.65, ny: 0.15, nr: 0.11, slot: 2, z: 2 },
  { nx: 0.72, ny: 0.11, nr: 0.12, slot: 3, z: 3 },
  { nx: 0.64, ny: 0.08, nr: 0.06, slot: 2, z: 5 },
  { nx: 0.79, ny: 0.13, nr: 0.12, slot: 1, z: 2 },
  { nx: 0.86, ny: 0.11, nr: 0.10, slot: 2, z: 1 },
  { nx: 0.92, ny: 0.14, nr: 0.09, slot: 3, z: 3 },
  { nx: 0.84, ny: 0.16, nr: 0.05, slot: 1, z: 5 },
  { nx: 0.97, ny: 0.12, nr: 0.07, slot: 2, z: 2 },
];

// 2. Guirlanda Superior / Meio Arco (Contorna topo de painel redondo/romano)
const HALF_ARCH_SPECS: BalloonSpec[] = [
  { nx: 0.06, ny: 0.70, nr: 0.13, slot: 1, z: 1 },
  { nx: 0.12, ny: 0.55, nr: 0.14, slot: 2, z: 2 },
  { nx: 0.08, ny: 0.42, nr: 0.11, slot: 3, z: 1 },
  { nx: 0.14, ny: 0.45, nr: 0.07, slot: 1, z: 5 },
  { nx: 0.20, ny: 0.34, nr: 0.15, slot: 1, z: 2 },
  { nx: 0.27, ny: 0.24, nr: 0.13, slot: 2, z: 1 },
  { nx: 0.32, ny: 0.30, nr: 0.11, slot: 3, z: 3 },
  { nx: 0.25, ny: 0.20, nr: 0.06, slot: 2, z: 5 },
  { nx: 0.40, ny: 0.18, nr: 0.15, slot: 1, z: 2 },
  { nx: 0.48, ny: 0.15, nr: 0.16, slot: 2, z: 1 },
  { nx: 0.55, ny: 0.16, nr: 0.14, slot: 3, z: 3 },
  { nx: 0.47, ny: 0.23, nr: 0.07, slot: 1, z: 5 },
  { nx: 0.63, ny: 0.20, nr: 0.15, slot: 1, z: 2 },
  { nx: 0.70, ny: 0.26, nr: 0.13, slot: 2, z: 1 },
  { nx: 0.75, ny: 0.32, nr: 0.12, slot: 3, z: 3 },
  { nx: 0.68, ny: 0.22, nr: 0.06, slot: 3, z: 5 },
  { nx: 0.82, ny: 0.40, nr: 0.14, slot: 1, z: 2 },
  { nx: 0.88, ny: 0.52, nr: 0.13, slot: 2, z: 1 },
  { nx: 0.94, ny: 0.65, nr: 0.11, slot: 3, z: 2 },
  { nx: 0.86, ny: 0.48, nr: 0.07, slot: 2, z: 5 },
];

// 3. Cascata Vertical (Coluna desconstruída com volume na base)
const CASCADE_SPECS: BalloonSpec[] = [
  { nx: 0.50, ny: 0.06, nr: 0.12, slot: 1, z: 1 },
  { nx: 0.58, ny: 0.11, nr: 0.10, slot: 2, z: 2 },
  { nx: 0.42, ny: 0.14, nr: 0.11, slot: 3, z: 1 },
  { nx: 0.52, ny: 0.16, nr: 0.06, slot: 1, z: 5 },
  { nx: 0.48, ny: 0.23, nr: 0.14, slot: 1, z: 2 },
  { nx: 0.60, ny: 0.28, nr: 0.12, slot: 2, z: 1 },
  { nx: 0.38, ny: 0.32, nr: 0.13, slot: 3, z: 3 },
  { nx: 0.53, ny: 0.34, nr: 0.07, slot: 2, z: 5 },
  { nx: 0.50, ny: 0.42, nr: 0.16, slot: 1, z: 1 },
  { nx: 0.36, ny: 0.48, nr: 0.13, slot: 2, z: 2 },
  { nx: 0.62, ny: 0.50, nr: 0.14, slot: 3, z: 3 },
  { nx: 0.46, ny: 0.53, nr: 0.07, slot: 1, z: 5 },
  { nx: 0.52, ny: 0.61, nr: 0.15, slot: 1, z: 2 },
  { nx: 0.38, ny: 0.66, nr: 0.13, slot: 3, z: 1 },
  { nx: 0.64, ny: 0.68, nr: 0.12, slot: 2, z: 3 },
  { nx: 0.51, ny: 0.70, nr: 0.07, slot: 3, z: 5 },
  { nx: 0.45, ny: 0.78, nr: 0.17, slot: 1, z: 1 },
  { nx: 0.62, ny: 0.82, nr: 0.15, slot: 2, z: 2 },
  { nx: 0.32, ny: 0.85, nr: 0.14, slot: 3, z: 3 },
  { nx: 0.48, ny: 0.87, nr: 0.08, slot: 2, z: 5 },
  { nx: 0.50, ny: 0.94, nr: 0.18, slot: 1, z: 1 },
  { nx: 0.34, ny: 0.95, nr: 0.15, slot: 2, z: 2 },
  { nx: 0.66, ny: 0.95, nr: 0.16, slot: 3, z: 2 },
  { nx: 0.55, ny: 0.96, nr: 0.09, slot: 1, z: 5 },
];

// 4. Cacho Orgânico / Buquê (Cluster compacto e volumoso)
const CLUSTER_SPECS: BalloonSpec[] = [
  { nx: 0.40, ny: 0.35, nr: 0.24, slot: 1, z: 1 },
  { nx: 0.62, ny: 0.38, nr: 0.22, slot: 2, z: 2 },
  { nx: 0.35, ny: 0.60, nr: 0.25, slot: 3, z: 1 },
  { nx: 0.65, ny: 0.62, nr: 0.23, slot: 1, z: 3 },
  { nx: 0.50, ny: 0.50, nr: 0.18, slot: 2, z: 4 },
  { nx: 0.24, ny: 0.45, nr: 0.16, slot: 2, z: 2 },
  { nx: 0.76, ny: 0.48, nr: 0.15, slot: 3, z: 1 },
  { nx: 0.48, ny: 0.24, nr: 0.17, slot: 1, z: 3 },
  { nx: 0.52, ny: 0.76, nr: 0.19, slot: 2, z: 2 },
  { nx: 0.38, ny: 0.46, nr: 0.09, slot: 3, z: 5 },
  { nx: 0.60, ny: 0.52, nr: 0.08, slot: 1, z: 5 },
  { nx: 0.46, ny: 0.62, nr: 0.09, slot: 2, z: 5 },
  { nx: 0.56, ny: 0.34, nr: 0.08, slot: 3, z: 5 },
];

const renderSingleOrganicBalloon = (
  bx: number,
  by: number,
  br: number,
  color: string,
  finish: 'matte' | 'chrome' | 'pearl' | undefined,
  key: string | number
) => {
  const isChrome = finish === 'chrome';
  const isPearl = finish === 'pearl';

  return (
    <Group key={key}>
      {/* Sombra de oclusão sutil entre balões */}
      <Circle
        x={bx + br * 0.08}
        y={by + br * 0.12}
        radius={br}
        fill="#000000"
        opacity={0.12}
        listening={false}
      />

      {/* Corpo esférico do Balão */}
      <Circle
        x={bx}
        y={by}
        radius={br}
        fill={color}
        stroke={isChrome ? '#FFFFFF' : 'rgba(0,0,0,0.12)'}
        strokeWidth={isChrome ? 0.8 : 0.6}
      />

      {/* Acabamento CROMADO (Alto Brilho Metálico) */}
      {isChrome && (
        <>
          <Ellipse
            x={bx - br * 0.32}
            y={by - br * 0.32}
            radiusX={br * 0.32}
            radiusY={br * 0.14}
            rotation={-35}
            fill="#FFFFFF"
            opacity={0.92}
            listening={false}
          />
          <Circle
            x={bx - br * 0.38}
            y={by - br * 0.38}
            radius={Math.max(1.5, br * 0.08)}
            fill="#FFFFFF"
            opacity={1}
            listening={false}
          />
          <Ellipse
            x={bx + br * 0.28}
            y={by + br * 0.28}
            radiusX={br * 0.22}
            radiusY={br * 0.09}
            rotation={-35}
            fill="#FFFFFF"
            opacity={0.4}
            listening={false}
          />
        </>
      )}

      {/* Acabamento PEROLADO (Acetinado suave) */}
      {isPearl && (
        <>
          <Ellipse
            x={bx - br * 0.3}
            y={by - br * 0.3}
            radiusX={br * 0.35}
            radiusY={br * 0.2}
            rotation={-30}
            fill="#FFFFFF"
            opacity={0.55}
            listening={false}
          />
          <Circle
            x={bx - br * 0.32}
            y={by - br * 0.32}
            radius={Math.max(1.5, br * 0.07)}
            fill="#FFFFFF"
            opacity={0.8}
            listening={false}
          />
        </>
      )}

      {/* Acabamento FOSCO / MATTE (Padrão) */}
      {!isChrome && !isPearl && (
        <Ellipse
          x={bx - br * 0.3}
          y={by - br * 0.3}
          radiusX={br * 0.28}
          radiusY={br * 0.15}
          rotation={-35}
          fill="#FFFFFF"
          opacity={0.42}
          listening={false}
        />
      )}
    </Group>
  );
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
            {el.fillImageSrc && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.moveTo(0, h);
                  ctx.lineTo(0, radius);
                  ctx.arc(radius, radius, radius, Math.PI, 0, false);
                  ctx.lineTo(w, h);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.fillImageSrc}
                  boxWidth={w}
                  boxHeight={h}
                  fillMode={el.fillMode}
                  fillScale={el.fillScale}
                  fillOffsetX={el.fillOffsetX}
                  fillOffsetY={el.fillOffsetY}
                />
              </Group>
            )}
            <Path data={archPath} stroke={strokeColor} strokeWidth={strokeWidth} fillEnabled={false} />
            <Line points={[w * 0.15, h * 0.15, w * 0.15, h * 0.85]} stroke="#FFFFFF" strokeWidth={1} opacity={0.4} />
          </>
        );
      }

      case 'panel-rect': {
        return (
          <>
            <Rect width={w} height={h} cornerRadius={6} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            {el.fillImageSrc && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  drawCanvasRoundRect(ctx, 0, 0, w, h, 6);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.fillImageSrc}
                  boxWidth={w}
                  boxHeight={h}
                  fillMode={el.fillMode}
                  fillScale={el.fillScale}
                  fillOffsetX={el.fillOffsetX}
                  fillOffsetY={el.fillOffsetY}
                />
              </Group>
            )}
            <Rect width={w} height={h} cornerRadius={6} stroke={strokeColor} strokeWidth={strokeWidth} fillEnabled={false} />
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
            {el.fillImageSrc && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.arc(w / 2, r, r, 0, Math.PI * 2, false);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.fillImageSrc}
                  boxX={w / 2 - r}
                  boxY={0}
                  boxWidth={2 * r}
                  boxHeight={2 * r}
                  fillMode={el.fillMode}
                  fillScale={el.fillScale}
                  fillOffsetX={el.fillOffsetX}
                  fillOffsetY={el.fillOffsetY}
                />
              </Group>
            )}
            <Circle x={w / 2} y={r} radius={r} stroke={strokeColor} strokeWidth={strokeWidth} fillEnabled={false} />
            <Circle x={w / 2} y={r} radius={r * 0.9} stroke="#FFFFFF" strokeWidth={1} opacity={0.3} />
          </>
        );
      }

      case 'panel-wavy': {
        const path = `M 0 ${h} Q ${w * 0.2} ${h * 0.66} 0 ${h * 0.33} Q ${w * 0.2} 0 ${w * 0.5} 0 Q ${w * 0.8} 0 ${w} ${h * 0.33} Q ${w * 0.8} ${h * 0.66} ${w} ${h} Z`;
        return (
          <>
            <Path data={path} fill={el.fill} stroke={strokeColor} strokeWidth={strokeWidth} />
            {el.fillImageSrc && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.moveTo(0, h);
                  ctx.quadraticCurveTo(w * 0.2, h * 0.66, 0, h * 0.33);
                  ctx.quadraticCurveTo(w * 0.2, 0, w * 0.5, 0);
                  ctx.quadraticCurveTo(w * 0.8, 0, w, h * 0.33);
                  ctx.quadraticCurveTo(w * 0.8, h * 0.66, w, h);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.fillImageSrc}
                  boxWidth={w}
                  boxHeight={h}
                  fillMode={el.fillMode}
                  fillScale={el.fillScale}
                  fillOffsetX={el.fillOffsetX}
                  fillOffsetY={el.fillOffsetY}
                />
              </Group>
            )}
            <Path data={path} stroke={strokeColor} strokeWidth={strokeWidth} fillEnabled={false} />
          </>
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
        // Proporção de perspectiva realista para cilindros de festa
        const ry = Math.max(16, Math.min(w * 0.16, 32));
        const bodyTopY = ry;
        const bodyBottomY = h - ry;
        const topColor = el.topFill || el.fill || '#FFFFFF';

        return (
          <>
            {/* 1. Sombra suave de contato com o chão */}
            <Ellipse
              x={w / 2}
              y={h - ry * 0.35}
              radiusX={w / 2 * 0.95}
              radiusY={ry * 0.55}
              fill="#000000"
              opacity={0.16}
              listening={false}
            />

            {/* 2. Base do Corpo (Fundo inferior do cilindro) */}
            <Ellipse
              x={w / 2}
              y={bodyBottomY}
              radiusX={w / 2}
              radiusY={ry}
              fill={el.fill}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />

            {/* 3. Corpo Lateral do Cilindro */}
            <Rect
              x={0}
              y={bodyTopY}
              width={w}
              height={bodyBottomY - bodyTopY}
              fill={el.fill}
            />

            {/* Curva inferior de fechamento do corpo para acompanhar a base */}
            <Path
              data={`M 0 ${bodyBottomY} A ${w / 2} ${ry} 0 0 0 ${w} ${bodyBottomY} L ${w} ${bodyTopY} L 0 ${bodyTopY} Z`}
              fill={el.fill}
            />

            {/* 4. Arte / Estampa da Capa Sublimada (Veste-Fácil) no corpo */}
            {el.fillImageSrc && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.moveTo(0, bodyTopY);
                  ctx.lineTo(w, bodyTopY);
                  ctx.lineTo(w, bodyBottomY);
                  ctx.ellipse(w / 2, bodyBottomY, w / 2, ry, 0, 0, Math.PI, false);
                  ctx.lineTo(0, bodyTopY);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.fillImageSrc}
                  boxX={0}
                  boxY={bodyTopY}
                  boxWidth={w}
                  boxHeight={h - bodyTopY}
                  fillMode={el.fillMode || 'cover'}
                  fillScale={el.fillScale}
                  fillOffsetX={el.fillOffsetX}
                  fillOffsetY={el.fillOffsetY}
                />
              </Group>
            )}

            {/* 5. Iluminação e Sombra Cilíndrica 3D Realista (Dá o efeito de tubo arredondado) */}
            <Group
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.moveTo(0, bodyTopY);
                ctx.lineTo(w, bodyTopY);
                ctx.lineTo(w, bodyBottomY);
                ctx.ellipse(w / 2, bodyBottomY, w / 2, ry, 0, 0, Math.PI, false);
                ctx.lineTo(0, bodyTopY);
                ctx.closePath();
              }}
              listening={false}
            >
              <Rect
                x={0}
                y={bodyTopY}
                width={w}
                height={h - bodyTopY}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: w, y: 0 }}
                fillLinearGradientColorStops={[
                  0.0, 'rgba(0, 0, 0, 0.32)',
                  0.12, 'rgba(0, 0, 0, 0.08)',
                  0.4, 'rgba(255, 255, 255, 0.22)',
                  0.7, 'rgba(0, 0, 0, 0.04)',
                  1.0, 'rgba(0, 0, 0, 0.36)',
                ]}
                listening={false}
              />
            </Group>

            {/* 6. Linhas de contorno lateral e da curva da base */}
            <Line points={[0, bodyTopY, 0, bodyBottomY]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Line points={[w, bodyTopY, w, bodyBottomY]} stroke={strokeColor} strokeWidth={strokeWidth} />
            <Path
              data={`M ${w} ${bodyBottomY} A ${w / 2} ${ry} 0 0 1 0 ${bodyBottomY}`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fillEnabled={false}
            />

            {/* 7. O TAMPO (Tampa Superior) */}
            <Ellipse
              x={w / 2}
              y={ry}
              radiusX={w / 2}
              radiusY={ry}
              fill={topColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />

            {/* Imagem dedicada para o Tampo OU estampa contínua da lateral */}
            {(el.topImageSrc || (el.includeTopArtwork && el.fillImageSrc)) && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.ellipse(w / 2, ry, w / 2, ry, 0, 0, Math.PI * 2, false);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.topImageSrc || el.fillImageSrc!}
                  boxX={0}
                  boxY={0}
                  boxWidth={w}
                  boxHeight={ry * 2}
                  fillMode="cover"
                  fillScale={el.topImageSrc ? 1 : el.fillScale}
                />
              </Group>
            )}

            {/* Borda do Tampo com acabamento e brilho de costura/reflexo */}
            <Ellipse
              x={w / 2}
              y={ry}
              radiusX={w / 2}
              radiusY={ry}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fillEnabled={false}
            />
            <Ellipse
              x={w / 2}
              y={ry}
              radiusX={w / 2 * 0.9}
              radiusY={ry * 0.86}
              stroke="#FFFFFF"
              strokeWidth={1.2}
              opacity={0.45}
              fillEnabled={false}
              listening={false}
            />
          </>
        );
      }

      case 'acrylic-cylinder': {
        const ry = Math.max(16, Math.min(w * 0.16, 32));
        const bodyTopY = ry;
        const bodyBottomY = h - ry;

        return (
          <>
            {/* Sombra de apoio no chão */}
            <Ellipse
              x={w / 2}
              y={h - ry * 0.35}
              radiusX={w / 2 * 0.9}
              radiusY={ry * 0.5}
              fill="#000000"
              opacity={0.12}
              listening={false}
            />

            {/* Base translúcida */}
            <Ellipse
              x={w / 2}
              y={bodyBottomY}
              radiusX={w / 2}
              radiusY={ry}
              fill="#E3EDF8"
              stroke="#90B6DE"
              strokeWidth={1.5}
              opacity={0.5}
            />

            {/* Corpo acrílico com transparência */}
            <Rect
              x={0}
              y={bodyTopY}
              width={w}
              height={bodyBottomY - bodyTopY}
              fill="#E3EDF8"
              opacity={0.35}
            />
            <Path
              data={`M 0 ${bodyBottomY} A ${w / 2} ${ry} 0 0 0 ${w} ${bodyBottomY} L ${w} ${bodyTopY} L 0 ${bodyTopY} Z`}
              fill="#E3EDF8"
              opacity={0.35}
            />

            {/* Arte da Capa ou Adesivo no Acrílico */}
            {el.fillImageSrc && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.moveTo(0, bodyTopY);
                  ctx.lineTo(w, bodyTopY);
                  ctx.lineTo(w, bodyBottomY);
                  ctx.ellipse(w / 2, bodyBottomY, w / 2, ry, 0, 0, Math.PI, false);
                  ctx.lineTo(0, bodyTopY);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.fillImageSrc}
                  boxX={0}
                  boxY={bodyTopY}
                  boxWidth={w}
                  boxHeight={h - bodyTopY}
                  fillMode={el.fillMode || 'cover'}
                  fillScale={el.fillScale}
                  fillOffsetX={el.fillOffsetX}
                  fillOffsetY={el.fillOffsetY}
                />
              </Group>
            )}

            {/* Gradiente de reflexo vítreo / acrílico */}
            <Group
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.moveTo(0, bodyTopY);
                ctx.lineTo(w, bodyTopY);
                ctx.lineTo(w, bodyBottomY);
                ctx.ellipse(w / 2, bodyBottomY, w / 2, ry, 0, 0, Math.PI, false);
                ctx.lineTo(0, bodyTopY);
                ctx.closePath();
              }}
              listening={false}
            >
              <Rect
                x={0}
                y={bodyTopY}
                width={w}
                height={h - bodyTopY}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: w, y: 0 }}
                fillLinearGradientColorStops={[
                  0.0, 'rgba(144, 182, 222, 0.4)',
                  0.2, 'rgba(255, 255, 255, 0.55)',
                  0.5, 'rgba(227, 237, 248, 0.1)',
                  0.85, 'rgba(255, 255, 255, 0.35)',
                  1.0, 'rgba(144, 182, 222, 0.45)',
                ]}
                listening={false}
              />
            </Group>

            {/* Contornos e reflexos brancos */}
            <Line points={[0, bodyTopY, 0, bodyBottomY]} stroke="#90B6DE" strokeWidth={1.5} />
            <Line points={[w, bodyTopY, w, bodyBottomY]} stroke="#90B6DE" strokeWidth={1.5} />
            <Line points={[w * 0.18, bodyTopY + 8, w * 0.18, bodyBottomY - 8]} stroke="#FFFFFF" strokeWidth={2} opacity={0.7} />
            <Path
              data={`M ${w} ${bodyBottomY} A ${w / 2} ${ry} 0 0 1 0 ${bodyBottomY}`}
              stroke="#90B6DE"
              strokeWidth={1.5}
              fillEnabled={false}
            />

            {/* Tampo de Acrílico */}
            <Ellipse
              x={w / 2}
              y={ry}
              radiusX={w / 2}
              radiusY={ry}
              fill={el.topFill || '#EDF4FC'}
              stroke="#90B6DE"
              strokeWidth={1.5}
              opacity={0.85}
            />
            {el.topImageSrc && (
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();
                  ctx.ellipse(w / 2, ry, w / 2, ry, 0, 0, Math.PI * 2, false);
                  ctx.closePath();
                }}
              >
                <ClippedArtworkImage
                  url={el.topImageSrc}
                  boxX={0}
                  boxY={0}
                  boxWidth={w}
                  boxHeight={ry * 2}
                  fillMode="cover"
                  fillScale={1}
                />
              </Group>
            )}
            <Ellipse
              x={w / 2}
              y={ry}
              radiusX={w / 2 * 0.88}
              radiusY={ry * 0.85}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              opacity={0.65}
              fillEnabled={false}
              listening={false}
            />
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

      case 'balloon-arch-l':
      case 'balloon-arch-half':
      case 'balloon-cascade':
      case 'balloon-cluster':
      case 'balloon-small':
      case 'balloon-mid':
      case 'balloon-arch': {
        let specs: BalloonSpec[];
        if (el.shapeType === 'balloon-arch-l' || el.shapeType === 'balloon-arch') {
          specs = L_ARCH_SPECS;
        } else if (el.shapeType === 'balloon-arch-half') {
          specs = HALF_ARCH_SPECS;
        } else if (el.shapeType === 'balloon-cascade') {
          specs = CASCADE_SPECS;
        } else {
          specs = CLUSTER_SPECS;
        }

        const color1 = el.fill || '#E2B1B6';
        const color2 = el.balloonSecondaryFill || '#F5EBE0';
        const color3 = el.balloonTertiaryFill || '#D4AF37';
        const invert = !!el.balloonInvert;
        const finish = el.balloonFinish || 'matte';

        // Ordenar por Z para renderizar profundidade
        const sorted = [...specs].sort((a, b) => a.z - b.z);
        const baseDim = Math.min(w, h);

        return (
          <Group>
            {sorted.map((b, idx) => {
              const nx = invert ? 1 - b.nx : b.nx;
              const bx = nx * w;
              const by = b.ny * h;
              const br = b.nr * baseDim;
              const bColor = b.slot === 1 ? color1 : (b.slot === 2 ? color2 : color3);
              return renderSingleOrganicBalloon(bx, by, br, bColor, finish, `${el.id}-b-${idx}`);
            })}
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
