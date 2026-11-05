export interface RealisticPromptOptions {
  fidelity?: 'high' | 'balanced' | 'creative';
  lighting?: 'natural' | 'warm' | 'studio';
  environment?: 'party_hall' | 'studio' | 'residence';
  /** Lista dos elementos do mockup (gerada automaticamente a partir do editor). */
  sceneDescription?: string;
  /** Notas livres do decorador sobre tema, materiais e detalhes (ex.: xadrez, laços, bolo). */
  themeNotes?: string;
}

const MAX_NOTES_LENGTH = 1200;
const MAX_SCENE_LENGTH = 3000;

type Fidelity = NonNullable<RealisticPromptOptions['fidelity']>;
type Lighting = NonNullable<RealisticPromptOptions['lighting']>;
type Environment = NonNullable<RealisticPromptOptions['environment']>;

/**
 * Fidelidade = quanto a IA pode mudar a cena. Cada nível define também a política de adição
 * de objetos, que antes era fixa (feno, celeiro, plantas tropicais etc. em qualquer tema).
 */
const FIDELITY: Record<Fidelity, { directive: string; additions: string }> = {
  high: {
    directive:
      'Strict composition fidelity: Strictly replicate the exact arrangement, element placement, proportions and colors of the mockup. Do not remove, move or resize any item.',
    additions:
      'Do NOT add objects. Only items visible in the mockup, the element list or the decorator notes may appear. The only exception is what physically completes an existing item (e.g. sweets on a dessert table that already exists, the fabric of a cylinder cover).',
  },
  balanced: {
    directive:
      'Balanced fidelity: Preserve the composition and object layout while allowing natural organic flow in materials, floral volume and depth.',
    additions:
      'You may add only small, discreet fillers that complete existing items (sweets and trays on existing tables, a few extra balloons inside existing clusters, foliage inside existing arrangements). Do NOT add new large props or furniture.',
  },
  creative: {
    directive:
      'Creative refinement: Maintain the party setup arrangement while enhancing realism and ambiance with richer event styling.',
    additions:
      'You may add a few extra decorative props, but every addition MUST belong to this party\'s theme and color palette, deduced from the element names, backdrop prints and decorator notes. Never add props from an unrelated theme (e.g. no farm props in a space party, no cartoon props at a wedding). Keep all original items as the focus.',
  },
};

const LIGHTING: Record<Lighting, string> = {
  natural: 'Natural soft indoor daylight with gentle realistic shadows and subtle window highlights.',
  warm: 'Warm golden party lighting with a soft atmospheric glow and gentle warm reflections.',
  studio: 'High-end studio flash lighting with crisp, balanced key and fill lights and clear material detail.',
};

/** O piso agora acompanha o ambiente, em vez de ser sempre mármore polido. */
const ENVIRONMENT: Record<Environment, string> = {
  party_hall:
    'Inside a luxury indoor party hall with a clean, neutral floor (light porcelain or stone with soft, realistic reflections) and a neutral wall behind the backdrop.',
  studio:
    'In a minimalist professional photo studio with a seamless neutral background and a clean, softly reflective floor.',
  residence:
    'Inside a luxury contemporary residence salon with sophisticated residential architecture and a neutral floor that suits the room (wood or light porcelain).',
};

/**
 * Regras de material. Todas são condicionais ("se existir"), para não forçar objetos,
 * plantas ou estampas que não estão no mockup.
 */
const MATERIAL_RULES = `Render each existing item with real, high-end event materials:
- Tables: If there is a table, dress it in elegant real fabric using the mockup's colors and patterns. Use pleats, scalloped hems or bows only if the mockup or the notes indicate them.
- Cakes and sweets: Render a real cake or dessert stands only where the mockup, the element list or the notes include them, decorated to match the theme.
- Flowers: Any item labeled or depicted as flowers, bouquets, arrangements or vases must be fresh, real botanical arrangements, NEVER latex balloons.
- Plants: Render greenery only where the mockup includes plants, using species that suit the theme.
- Balloons: Realistic latex balloons with natural inflation, soft clustering and subtle specular highlights, in the exact colors of the mockup.
- Backdrop panels: Real event structures covered in crisp matte tension fabric or printed canvas, keeping their shape and print.
- Cylinders and pedestals: Real event pedestals with fitted fabric covers in the mockup's colors or patterns.
- Character cutouts and printed props: Printed MDF or foam board cutouts that keep the exact artwork, colors and proportions.
- Ribbons and bows: Satin or grosgrain fabric with natural draping, only where they appear.`;

/**
 * Bloco com o conteúdo real das peças. O mockup 2D usa formas simplificadas (ex.: um arranjo de flores
 * aparece como círculos), então o nome/descrição de cada peça é a fonte da verdade.
 */
function buildSceneContextBlock(options?: RealisticPromptOptions): string {
  const scene =
    typeof options?.sceneDescription === 'string'
      ? options.sceneDescription.trim().slice(0, MAX_SCENE_LENGTH)
      : '';
  const notes =
    typeof options?.themeNotes === 'string'
      ? options.themeNotes.trim().slice(0, MAX_NOTES_LENGTH)
      : '';
  if (!scene && !notes) return '';

  const blocks: string[] = [];
  if (scene) {
    blocks.push(
      `ELEMENT LIST (the mockup draws simplified placeholder shapes; interpret each item by its NAME, not by how the shape looks, and keep the same position, size and colors):\n${scene}`
    );
  }
  if (notes) {
    blocks.push(`DECORATOR NOTES (theme, materials and details that MUST appear in the photo):\n${notes}`);
  }
  blocks.push(
    'Every item in the element list and decorator notes must appear as a real, detailed object (real flowers, real cake, real fabric textures and patterns), even if the mockup shows it as a simple shape. The rules about adding objects apply only to items that are in none of these sources.'
  );
  return blocks.join('\n\n');
}

function resolveOptions(options?: RealisticPromptOptions) {
  return {
    fidelity: FIDELITY[options?.fidelity ?? 'high'] ?? FIDELITY.high,
    lighting: LIGHTING[options?.lighting ?? 'warm'] ?? LIGHTING.warm,
    environment: ENVIRONMENT[options?.environment ?? 'party_hall'] ?? ENVIRONMENT.party_hall,
  };
}

const COLOR_RULE =
  "Keep the mockup's color palette exactly. Do not introduce colors or patterns (e.g. gingham, pastels) that are not in the mockup or the decorator notes.";

const PHOTO_RULE =
  'It must look like a real photograph of an actual party setup taken with a professional full-frame camera: sharp focus on the main table and backdrop, soft natural shadows and physically plausible reflections. NOT an illustration, NOT a 3D render, NOT CGI, NOT cartoonish.';

/** Prompt enviado ao modelo de imagem junto com o mockup (images.edit / Replicate). */
export function buildRealisticPartyPrompt(options?: RealisticPromptOptions): string {
  const { fidelity, lighting, environment } = resolveOptions(options);
  const sceneContext = buildSceneContextBlock(options);

  return [
    'Use the uploaded image as the primary visual and composition reference.',
    'Transform this 2D party decoration mockup into a photorealistic professional photograph of the same party decoration, physically built with real event materials.',
    fidelity.directive,
    fidelity.additions,
    'Preserve the appearance, colors, proportions and visual identity of any user-provided decorative assets and character cutouts as closely as possible.',
    sceneContext,
    MATERIAL_RULES,
    `Lighting and environment:\n- ${lighting}\n- ${environment}`,
    COLOR_RULE,
    PHOTO_RULE,
  ]
    .filter(Boolean)
    .join('\n\n');
}

/** Prompt padrão, usado quando a requisição chega sem opções. */
export const REALISTIC_PARTY_PROMPT = buildRealisticPartyPrompt();

/** System prompt do modelo de visão, que escreve o prompt de texto no fallback sem images.edit. */
export function buildVisionAnalysisPrompt(options?: RealisticPromptOptions): string {
  const { fidelity, lighting, environment } = resolveOptions(options);
  const sceneContext = buildSceneContextBlock(options);

  return [
    'You are an expert party decorator and prompt writer for photographic image generation.',
    `Analyze this 2D party decoration mockup created by an event decorator:
1. Identify every item and its role: backdrop panels and their prints, balloon arches and clusters, tables, cylinders and pedestals, character cutouts, cakes and sweets, flowers, plants and any other prop.
2. Identify the party theme from the backdrop prints, element names and decorator notes.
3. Note the exact color palette, geometry and placement of every item.
4. Write one highly descriptive prompt in English for an image model to produce a photorealistic photograph of this EXACT party decoration.`,
    sceneContext,
    `Directives for the prompt you write:
- Composition: ${fidelity.directive}
- Additions: ${fidelity.additions}
- Lighting: ${lighting}
- Venue: ${environment}
- Colors: ${COLOR_RULE}
- Materials: ${MATERIAL_RULES.replace(/\n- /g, ' ').replace('Render each existing item with real, high-end event materials:', '')}
- Photo: ${PHOTO_RULE}`,
    'Describe only the items that are actually in the mockup, the element list or the notes, plus whatever the additions directive allows. Return ONLY the final prompt text for the image model, with no introduction, explanation or quotes.',
  ]
    .filter(Boolean)
    .join('\n\n');
}
