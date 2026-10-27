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
    'Items in the element list and decorator notes override the rule "do not add objects": render them as real, detailed objects (real flowers, real cake, real fabric textures and patterns) while keeping the layout of the mockup.'
  );
  return blocks.join('\n\n');
}

export const REALISTIC_PARTY_PROMPT = `Use the uploaded image as the primary visual and composition reference.

Transform this 2D party decoration mockup into a breathtaking, photorealistic professional photograph of an actual luxury party decoration setup.

Preserve the original composition, layout, object positioning, dimensions, proportions, and color palette as closely as possible.

Transform flat placeholder representations into real, high-end event materials:
- Table & Cakes: The central cake table must feature an authentic, elegant celebration cake (tiered designer cake decorated to match the theme), flanked by elevated dessert stands with gourmet cupcakes, macarons, and party confections. The table must be dressed in tailored tablecloths with natural fabric drape, scalloped overlays, and pleated skirting.
- Floral Arrangements: Any element labeled or depicted as flowers, bouquets, or vases must be rendered as fresh, lush botanical arrangements with real flowers (roses, lavender, daisies, and delicate foliage), never as latex balloons.
- Organic Balloons: Where actual balloon garlands or clusters are placed, render premium latex balloons with natural inflation, rich specular reflections, and soft organic clustering.
- Backdrop Panels: Arched and themed backdrop panels must look like authentic event structures covered in crisp, matte tension fabric or printed canvas with soft edge definition.
- Pedestals & Cylinders: Display cylinders must look like real event pedestals wrapped in custom fabric covers (matching gingham, pastels, or patterns).
- Floor Rug & Setting: The custom floor rug must lie flat on a polished marble or reflective event floor, displaying clear printed motifs and decorative scalloped borders.
- Bows & Ribbons: Render decorative ribbons as luxurious satin or grosgrain fabric bows with delicate draping tails.

Lighting & Atmosphere:
- Professional indoor event venue photography with soft ambient diffusion, subtle specular reflections on the floor, and clean depth of field.
- Sharp focus on the central dessert table, cake, and backdrops.
- Absolutely NO cartoonish look, NO CGI render appearance, NO plastic balloon replacements for cakes or flowers.`;

export function buildRealisticPartyPrompt(options?: RealisticPromptOptions): string {
  const fidelity = options?.fidelity || 'high';
  const lighting = options?.lighting || 'natural';
  const environment = options?.environment || 'party_hall';

  const fidelityDirective = {
    high: 'Strict composition fidelity: Adhere strictly to the mockup geometry, element placement, proportions, and original colors. Keep every decorative item intact.',
    balanced: 'Balanced fidelity: Preserve the core composition and object layout while allowing natural organic flow in materials and depth.',
    creative: 'Creative refinement: Maintain the party setup arrangement, while enhancing realism and ambiance with refined event styling.',
  }[fidelity];

  const lightingDirective = {
    natural: 'Natural soft indoor daylight with gentle ambient occlusion and realistic subtle window highlights.',
    warm: 'Warm golden party lighting, cozy candlelit accent tones, elegant warm reflections, and atmospheric depth.',
    studio: 'High-end photography studio lighting, perfectly balanced key and fill lights, sharp crisp highlights, and clear material details.',
  }[lighting];

  const environmentDirective = {
    party_hall: 'Inside a luxury indoor event venue / modern party hall with refined flooring, polished backdrop wall, and professional event venue ambiance.',
    studio: 'In a professional minimalist commercial photo studio with an impeccably clean floor and architectural wall.',
    residence: 'Inside a luxury contemporary residence salon with sophisticated residential interior architecture and clean finishes.',
  }[environment];

  return `Use the uploaded image as the primary visual and composition reference.

Transform this 2D party decoration mockup into a breathtaking, photorealistic professional photograph of an actual luxury party decoration setup.

${fidelityDirective}

Preserve the appearance, colors, proportions and visual identity of any user-provided decorative assets and character cutouts as closely as possible.

${buildSceneContextBlock(options)}

Transform flat placeholder representations into real, high-end event materials:
- Table & Cakes: The main party table must feature an authentic, elegant celebration cake (tiered designer cake decorated to match the theme), flanked by elevated dessert stands with gourmet cupcakes, macarons, and party confections. The table must be dressed in tailored tablecloths with natural fabric drape, scalloped overlays, and pleated skirting.
- Floral Arrangements: Any element labeled or depicted as flowers, bouquets, or vases must be rendered as fresh, lush botanical arrangements with real flowers (roses, lavender, daisies, and delicate foliage), NEVER as latex balloons.
- Organic Balloons: Where actual balloon garlands or clusters are placed, render premium latex balloons with natural inflation, rich specular reflections, and soft organic clustering.
- Backdrop Panels: Arched and themed backdrop panels must look like authentic event structures covered in crisp, matte tension fabric or printed canvas with soft edge definition.
- Pedestals & Cylinders: Display cylinders must look like real event pedestals wrapped in custom fabric covers (matching gingham, pastels, or patterns).
- Floor Rug & Setting: The custom floor rug must lie flat on a polished marble or reflective event floor, displaying clear printed motifs and decorative scalloped borders.
- Bows & Ribbons: Render decorative ribbons as luxurious satin or grosgrain fabric bows with delicate draping tails.

Lighting & Environment:
- ${lightingDirective}
- ${environmentDirective}
- Add soft natural shadows, ambient occlusion, realistic depth and physically plausible reflections on the polished floor and backdrop wall.

Maintain the original color palette.
High-end event photography. Professional camera. Sharp focus. Photorealistic. Elegant, clean and ready for a luxury party client presentation.
Do not turn it into an illustration. Do not make it look like CGI.`;
}

export function buildVisionAnalysisPrompt(options?: RealisticPromptOptions): string {
  const fidelity = options?.fidelity || 'high';
  const lighting = options?.lighting || 'natural';
  const environment = options?.environment || 'party_hall';

  const lightingText = {
    natural: 'Natural soft indoor daylight with gentle realistic shadows and delicate highlights',
    warm: 'Warm golden party lighting with atmospheric ambient glow and elegant reflections',
    studio: 'High-end studio flash lighting with crisp contrast and balanced fill',
  }[lighting];

  const environmentText = {
    party_hall: 'Inside a luxury indoor party hall or modern event venue with polished floor',
    studio: 'In a minimalist photography studio setting with clean architectural background',
    residence: 'Inside a luxury contemporary residence salon with upscale architectural finishes',
  }[environment];

  const fidelityText = {
    high: 'Strictly replicate the exact arrangement, colors, balloon arches, cylinder tables, backdrop graphics, and prop positions without inventing or adding extra furniture.',
    balanced: 'Faithfully preserve the composition and objects while rendering them with organic, lifelike event depth.',
    creative: 'Preserve the main theme and decorative arrangement while elevating styling details to look like an award-winning event photograph.',
  }[fidelity];

  return `You are a world-class party decorator and expert AI prompt engineer for photographic image generation.

Analyze this 2D party decoration mockup created by an event decorator:
1. Examine all visual components: backdrop panel themes/prints, balloon arches (exact colors and placement), pedestals/cylinder tables, character cutouts, cake stands, and floor props.
2. Note the precise color palette, geometry, and placement.
3. Formulate a single, highly descriptive prompt in English for an image model to produce a photorealistic indoor photograph of this EXACT party decoration setup.

${buildSceneContextBlock(options)}

Key Directives:
- Composition Fidelity: ${fidelityText}
- Lighting: ${lightingText}.
- Venue: ${environmentText}.
- Materials: Balloons must look realistically inflated with specular glossy highlights; fabric backdrops must look like printed tension fabric or canvas; acrylic/pedestals must have real physical textures and soft floor reflections.
- Absolute Rule: It must look like a high-end, real-world photograph taken with a professional full-frame camera. NOT a 3D render, NOT an illustration, NOT CGI.

Return ONLY the final prompt text for the image model. Do not include introductory notes, explanations, or quotes.`;
}

