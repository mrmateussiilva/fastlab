export interface RealisticPromptOptions {
  fidelity?: 'high' | 'balanced' | 'creative';
  lighting?: 'natural' | 'warm' | 'studio';
  environment?: 'party_hall' | 'studio' | 'residence';
}

export const REALISTIC_PARTY_PROMPT = `Use the uploaded image as the primary visual and composition reference.

Transform this flat party decoration mockup into a photorealistic professional indoor event photograph.

Preserve the original composition, layout, object positioning, dimensions, proportions, colors, decorative elements, backdrop panels, balloons, pedestals, furniture and ornaments as closely as possible.

Preserve the appearance, colors, proportions and visual identity of any user-provided decorative assets and character cutouts as closely as possible. Do not replace or substantially redesign imported objects.

Do not redesign the decoration.
Do not add unnecessary objects.

The objective is not to create a different party setup. The objective is to make the existing project look real.

Transform artificial materials into realistic physical materials.
Balloons should look naturally inflated, glossy and dimensional, with realistic highlights and reflections.
Transparent acrylic objects should have realistic transparency, refraction and subtle reflections.
Printed backdrop panels should look like real printed fabric, canvas or rigid event panels.
Pedestals and furniture should have realistic material textures.

Add believable indoor lighting, soft natural shadows, ambient occlusion, realistic depth and physically plausible reflections.
The floor, walls and environment should look photographic and real.

Maintain the original color palette.
The final image should look like a professionally photographed real-world party decoration installed inside an event venue.

High-end event photography.
Natural realistic lighting.
Professional camera.
Sharp focus.
Realistic materials.
Photorealistic.
Elegant and clean.

Do not turn it into an illustration.
Do not make it look like CGI.
Do not substantially alter the original composition.`;

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

Transform this flat party decoration mockup into a photorealistic professional indoor event photograph.

${fidelityDirective}

Preserve the appearance, colors, proportions and visual identity of any user-provided decorative assets and character cutouts as closely as possible. Do not replace or substantially redesign imported objects.

Do not redesign the decoration. Do not add unnecessary objects.
The objective is not to create a different party setup. The objective is to make the existing project look real.

Transform artificial materials into realistic physical materials:
- Balloons must look naturally inflated, glossy and dimensional, with realistic highlights and reflections.
- Transparent acrylic objects must have realistic optical transparency, refraction and subtle reflections.
- Printed backdrop panels should look like real printed fabric, canvas or rigid event panels.
- Pedestals and furniture should have believable textures (glossy, matte, wood, or acrylic).

Lighting & Environment:
- ${lightingDirective}
- ${environmentDirective}
- Add soft natural shadows, ambient occlusion, realistic depth and physically plausible reflections on the floor and wall.

Maintain the original color palette.
The final image should look like a professionally photographed real-world party decoration installed inside an event venue.

High-end event photography. Professional camera. Sharp focus. Photorealistic. Elegant and clean.
Do not turn it into an illustration. Do not make it look like CGI.`;
}
