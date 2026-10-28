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
  'table-cloth': 'table covered with a draped tablecloth',
  'table-ruffle': 'realistic event table with pleated ruffle skirt (mesa de babado)',
  'table-round': 'round table',
  'cylinder-low': 'low cylinder pedestal',
  'cylinder-mid': 'medium cylinder pedestal',
  'cylinder-high': 'tall cylinder pedestal',
  'acrylic-cylinder': 'transparent acrylic cylinder',
  'acrylic-table': 'transparent acrylic table',
  'balloon-small': 'small organic balloon cluster',
  'balloon-mid': 'medium organic balloon cluster',
  'balloon-single': 'single latex balloon with tie knot',
  'balloon-giant-bow': 'giant striped event balloon on tailored pedestal with satin ribbon bow',
  'balloon-arch': 'organic arch garland',
  'balloon-arch-l': 'L-shaped organic garland',
  'balloon-arch-half': 'top organic garland',
  'balloon-cascade': 'vertical cascade',
  'balloon-cluster': 'organic floor cluster',
  'balloon-stick': 'single round balloon mounted on a slim stick with satin ribbon bow',
  'flower-arrangement': 'pedestal vase with lush fresh flowers',
  'cake-tiered': 'celebration tiered cake with dessert stands',
  'plant-pot': 'tall ceramic pot with lush tropical greenery and large monstera or banana palm leaves',
  'hay-bale': 'rustic textured golden straw hay bale floor prop',
  'mini-barn': 'rustic wooden mini barn decorative floor prop with white X-frame trim',
  'windmill-wood': 'rustic miniature wooden windmill with four-blade rotor floor prop',
  'milk-can': 'vintage metal milk jug can filled with fresh wild daisies and baby breath flowers',
  'wagon-wheel': 'vintage rustic wooden wagon wheel prop resting on the floor',
  'rug-rect': 'rectangular floor rug',
  'rug-oval': 'oval floor rug',
  box: 'decorative box',
  pedestal: 'pedestal stand',
  text: 'text sign',
  'custom-image': 'custom imported decoration or cutout character totem',
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
  if (shapeType === 'flower-arrangement' || n.includes('flor') || n.includes('buquê') || n.includes('bouquet') || n.includes('arranjo')) {
    return 'REAL FRESH FLORAL ARRANGEMENT with lush natural flowers, lavender, roses and green leaves (NOT balloons)';
  }
  if (shapeType === 'plant-pot' || n.includes('planta') || n.includes('folhagem') || n.includes('bananeira') || n.includes('costela')) {
    return 'TALL LUXURY CERAMIC PLANTER WITH LUSH GREEN TROPICAL LEAVES (Monstera, banana palm) framing the scene border';
  }
  if (shapeType === 'hay-bale' || n.includes('feno') || n.includes('palha')) {
    return 'NATURAL GOLDEN STRAW HAY BALE FLOOR PROP tied with rustic twine';
  }
  if (shapeType === 'mini-barn' || n.includes('celeiro')) {
    return 'RUSTIC WOODEN MINIATURE RED/BROWN BARN CRAFT FLOOR PROP with country door trim';
  }
  if (shapeType === 'windmill-wood' || n.includes('moinho') || n.includes('catavento')) {
    return 'RUSTIC COUNTRY WOODEN WINDMILL DECORATIVE PROP with 4-blade rotor';
  }
  if (shapeType === 'milk-can' || n.includes('leite') || n.includes('latão') || n.includes('latao')) {
    return 'VINTAGE GALVANIZED STEEL MILK CAN WITH LUSH WHITE FIELD DAISIES & GYPSOPHILA FLOWERS';
  }
  if (shapeType === 'wagon-wheel' || n.includes('carroça') || n.includes('carroca') || n.includes('roda')) {
    return 'VINTAGE RUSTIC WOODEN WAGON WHEEL PROP';
  }
  if (shapeType === 'cake-tiered' || n.includes('bolo') || n.includes('cake') || n.includes('doce') || n.includes('cupcake')) {
    return 'DECORATIVE TIERED CELEBRATION CAKE & LUXURY DESSERT PLATTERS on cake stands (NOT balloons)';
  }
  if (shapeType === 'balloon-giant-bow' || n.includes('laço') || n.includes('fita') || n.includes('bow')) {
    return 'GIANT DECORATIVE BALLOON WITH SATIN FABRIC BOW ACCENT ON PLEATED PEDESTAL';
  }
  if (shapeType === 'balloon-stick') {
    return 'PERFECT ROUND BALLOON MOUNTED ON SLIM VERTICAL STICK WITH TAILORED SATIN RIBBON BOW';
  }
  if (shapeType === 'balloon-single') {
    return 'NATURAL INFLATED LATEX BALLOON WITH TIE KNOT AND RIBBON';
  }
  if (shapeType === 'table-ruffle' || shapeType === 'table-cloth' || n.includes('toalha') || n.includes('babado') || n.includes('mesa do bolo')) {
    return 'LUXURY EVENT TABLE WITH DRAPED FABRIC TABLECLOTH, SCALLOPED OVERLAY AND REALISTIC PLEATED RUFFLE SKIRT (MESA DE BABADO)';
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
