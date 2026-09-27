import { buildRealisticPartyPrompt, REALISTIC_PARTY_PROMPT } from '@/lib/prompts';

describe('prompts generator', () => {
  test('REALISTIC_PARTY_PROMPT is a non-empty string', () => {
    expect(typeof REALISTIC_PARTY_PROMPT).toBe('string');
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
});
