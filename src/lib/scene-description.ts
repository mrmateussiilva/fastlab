import type { CanvasElement } from '@/lib/builder-elements';

const COLOR_NAMES: { name: string; hex: string }[] = [
  { name: 'white', hex: '#FFFFFF' },
  { name: 'cream / off-white', hex: '#FBF8F2' },
  { name: 'beige / sand', hex: '#E7DFD5' },
  { name: 'light lilac', hex: '#E6DDF2' },
  { name: 'lilac / lavender', hex: '#B79CDA' },
  { name: 'purple', hex: '#7C5CBF' },
  { name: 'terracotta', hex: '#C97A63' },
  { name: 'blush pink', hex: '#E2B1B6' },
  { name: 'light blue', hex: '#A0B6C7' },
  { name: 'olive green', hex: '#8E987B' },
  { name: 'gold', hex: '#D4AF37' },
  { name: 'charcoal', hex: '#363636' },
  { name: 'orange', hex: '#EA580C' },
  { name: 'red', hex: '#D32F2F' },
  { name: 'yellow', hex: '#F2C94C' },
  { name: 'green', hex: '#4CAF50' },
  { name: 'blue', hex: '#3B82F6' },
  { name: 'pink', hex: '#F4A6C1' },
  { name: 'black', hex: '#111111' },
];

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Nome aproximado (em inglês) da cor hex mais próxima. */
export function nearestColorName(hex?: string): string | null {
  if (!hex) return null;
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let best = COLOR_NAMES[0];
  let bestDist = Infinity;
  for (const c of COLOR_NAMES) {
    const crgb = hexToRgb(c.hex)!;
    const d =
      (rgb[0] - crgb[0]) ** 2 + (rgb[1] - crgb[1]) ** 2 + (rgb[2] - crgb[2]) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best.name;
}

const SHAPE_LABELS: Record<string, string> = {
  'panel-rect': 'rectangular backdrop panel',
  'panel-arch': 'arched backdrop panel',
  'panel-wavy': 'wavy-edge backdrop panel',
  'panel-round': 'round backdrop panel',
  'table-rect': 'rectangular table',
  'table-cloth': 'table covered with a tablecloth',
  'table-round': 'round table',
  'cylinder-low': 'low cylinder pedestal',
  'cylinder-mid': 'medium cylinder pedestal',
  'cylinder-high': 'tall cylinder pedestal',
  'acrylic-cylinder': 'transparent acrylic cylinder',
  'acrylic-table': 'transparent acrylic table',
  'balloon-small': 'small decorative cluster',
  'balloon-mid': 'medium decorative cluster',
  'balloon-arch': 'organic arch garland',
  'balloon-arch-l': 'L-shaped organic garland',
  'balloon-arch-half': 'top organic garland',
  'balloon-cascade': 'vertical cascade',
  'balloon-cluster': 'organic floor cluster',
  'rug-rect': 'rectangular floor rug',
  'rug-oval': 'oval floor rug',
  box: 'decorative box',
  pedestal: 'pedestal stand',
  text: 'text sign',
  'custom-image': 'custom imported decoration',
};

function horizontalPosition(el: CanvasElement, canvasWidth: number): string {
  const cx = el.x + el.width / 2;
  const ratio = cx / canvasWidth;
  if (ratio < 0.36) return 'left';
  if (ratio > 0.64) return 'right';
  return 'center';
}

/** Detecta o papel real do elemento com base no nome e formato */
function inferElementRole(name: string, shapeType: string): string | null {
  const n = name.toLowerCase();
  if (n.includes('flor') || n.includes('buquê') || n.includes('bouquet') || n.includes('arranjo')) {
    return 'REAL FRESH FLORAL ARRANGEMENT with lush natural flowers, lavender, roses and green leaves (NOT balloons)';
  }
  if (n.includes('bolo') || n.includes('cake') || n.includes('doce') || n.includes('cupcake')) {
    return 'DECORATIVE TIERED CELEBRATION CAKE & LUXURY DESSERT PLATTERS on cake stands (NOT balloons)';
  }
  if (n.includes('laço') || n.includes('fita') || n.includes('bow')) {
    return 'ELEGANT FABRIC SATIN RIBBON BOW ACCENT';
  }
  if (shapeType === 'table-cloth' || n.includes('toalha') || n.includes('mesa do bolo')) {
    return 'PARTY TABLE WITH DRAPED FABRIC TABLECLOTH, SCALLOPED OVERLAY AND PLEATED SKIRT';
  }
  if (shapeType.startsWith('cylinder') || n.includes('pedestal') || n.includes('cilindro')) {
    return 'EVENT CYLINDER PEDESTAL with tailored smooth fabric cover';
  }
  if (shapeType.startsWith('rug') || n.includes('tapete')) {
    return 'PRINTED PARTY FLOOR MAT with decorative border';
  }
  return null;
}

/**
 * Gera uma lista textual dos elementos do mockup para enviar à IA junto com a imagem.
 * O mockup desenha formas simplificadas; o nome dado a cada peça é a fonte da verdade
 * sobre o que ela representa na festa real.
 */
export function describeScene(elements: CanvasElement[], canvasWidth = 1000): string {
  if (!elements.length) return '';

  const lines = [...elements]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((el) => {
      const shape = SHAPE_LABELS[el.shapeType] ?? el.shapeType;
      const pos = horizontalPosition(el, canvasWidth);
      const color = nearestColorName(el.fill);
      const role = inferElementRole(el.name, el.shapeType);

      const parts = [`"${el.name}" (${shape}, ${pos})`];
      if (role) parts.push(`REAL OBJECT INTENT: ${role}`);
      if (el.shapeType === 'text' && el.text) parts.push(`text: "${el.text}"`);
      if (color) parts.push(`main color: ${color}`);
      if (el.fillImageSrc) parts.push('printed with decorative floral theme pattern');
      if (el.shapeType.startsWith('balloon') && el.balloonSecondaryFill) {
        const c2 = nearestColorName(el.balloonSecondaryFill);
        const c3 = nearestColorName(el.balloonTertiaryFill);
        parts.push(`accent colors: ${[c2, c3].filter(Boolean).join(', ')}`);
      }
      return `- ${parts.join('; ')}`;
    });

  return lines.join('\n');
}
