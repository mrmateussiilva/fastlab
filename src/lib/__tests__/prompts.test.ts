import { buildRealisticPartyPrompt, buildVisionAnalysisPrompt, REALISTIC_PARTY_PROMPT } from '@/lib/prompts';

const THEME_LOCKED_PROPS = /hay bale|barn|windmill|milk can|wagon wheel|monstera|banana/i;

describe('prompts generator', () => {
  test('REALISTIC_PARTY_PROMPT is the default built prompt', () => {
    expect(REALISTIC_PARTY_PROMPT).toBe(buildRealisticPartyPrompt());
    expect(REALISTIC_PARTY_PROMPT.length).toBeGreaterThan(50);
  });

  test('buildRealisticPartyPrompt generates custom prompts based on options', () => {
    const defaultPrompt = buildRealisticPartyPrompt();
    expect(defaultPrompt).toContain('Strict composition fidelity');

    const creativePrompt = buildRealisticPartyPrompt({
      fidelity: 'creative',
      lighting: 'warm',
      environment: 'residence',
    });

    expect(creativePrompt).toContain('Creative refinement');
    expect(creativePrompt).toContain('Warm golden party lighting');
    expect(creativePrompt).toContain('Inside a luxury contemporary residence salon');
  });

  test('does not force props, plants, floors or patterns from a fixed theme', () => {
    for (const fidelity of ['high', 'balanced', 'creative'] as const) {
      const prompt = buildRealisticPartyPrompt({ fidelity });
      expect(prompt).not.toMatch(THEME_LOCKED_PROPS);
      expect(prompt).not.toMatch(/marble/i);
    }
    expect(buildVisionAnalysisPrompt()).not.toMatch(THEME_LOCKED_PROPS);
  });

  test('high fidelity forbids additions; creative only allows theme-matching ones', () => {
    expect(buildRealisticPartyPrompt({ fidelity: 'high' })).toContain('Do NOT add objects');
    expect(buildRealisticPartyPrompt({ fidelity: 'creative' })).toContain("MUST belong to this party's theme");
  });

  test('scene context references rules that exist in the prompt', () => {
    const prompt = buildRealisticPartyPrompt({
      sceneDescription: '- "Bolo" (cake, center)',
      themeNotes: 'tema astronauta',
    });
    expect(prompt).toContain('tema astronauta');
    expect(prompt).toContain('"Bolo"');
    expect(prompt).not.toContain('do not add objects"');
  });

  test('buildVisionAnalysisPrompt produces structured vision directives', () => {
    const visionPrompt = buildVisionAnalysisPrompt({
      fidelity: 'high',
      lighting: 'studio',
      environment: 'party_hall',
    });

    expect(visionPrompt).toContain('High-end studio flash lighting');
    expect(visionPrompt).toContain('Inside a luxury indoor party hall');
    expect(visionPrompt).toContain('Strictly replicate the exact arrangement');
  });
});
