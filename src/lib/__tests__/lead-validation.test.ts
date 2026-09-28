import {
  normalizeWhatsapp,
  canonicalWhatsapp,
  isValidWhatsapp,
  isValidEmail,
  formatWhatsapp,
} from '@/lib/lead-validation';

describe('lead validation', () => {
  test('normalizeWhatsapp extrai apenas dígitos', () => {
    expect(normalizeWhatsapp('(11) 99999-9999')).toBe('11999999999');
    expect(normalizeWhatsapp('+55 21 98765-4321')).toBe('5521987654321');
    expect(normalizeWhatsapp('abc')).toBe('');
  });

  test('canonicalWhatsapp remove prefixo +55 quando presente', () => {
    expect(canonicalWhatsapp('+5511999999999')).toBe('11999999999');
    expect(canonicalWhatsapp('5511987654321')).toBe('11987654321');
    expect(canonicalWhatsapp('(11) 99999-9999')).toBe('11999999999');
  });

  test('isValidWhatsapp aceita celulares válidos', () => {
    expect(isValidWhatsapp('(11) 99999-9999')).toBe(true);
    expect(isValidWhatsapp('21 98765 4321')).toBe(true);
    expect(isValidWhatsapp('+55 31 99876 5432')).toBe(true);
  });

  test('isValidWhatsapp aceita fixo de 10 dígitos', () => {
    expect(isValidWhatsapp('(11) 3333-4444')).toBe(true);
  });

  test('isValidWhatsapp rejeita números inválidos', () => {
    expect(isValidWhatsapp('999999999')).toBe(false);
    expect(isValidWhatsapp('(01) 99999-9999')).toBe(false);
    expect(isValidWhatsapp('(11) 89999-9999')).toBe(false);
    expect(isValidWhatsapp('')).toBe(false);
    expect(isValidWhatsapp('12345678901234')).toBe(false);
  });

  test('formatWhatsapp aplica máscara progressiva', () => {
    expect(formatWhatsapp('11')).toBe('(11');
    expect(formatWhatsapp('119999')).toBe('(11) 9999');
    expect(formatWhatsapp('1199999999')).toBe('(11) 9999-9999');
    expect(formatWhatsapp('11999999999')).toBe('(11) 99999-9999');
    expect(formatWhatsapp('')).toBe('');
  });

  test('isValidEmail valida e-mails', () => {
    expect(isValidEmail('decoradora@festa.com')).toBe(true);
    expect(isValidEmail('a@b.co')).toBe(true);
    expect(isValidEmail('invalido')).toBe(false);
    expect(isValidEmail('a@b')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
