export function normalizeWhatsapp(input: string): string {
  return (input || '').replace(/\D+/g, '');
}

export function canonicalWhatsapp(input: string): string {
  const digits = normalizeWhatsapp(input);
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) {
    return digits.slice(2);
  }
  return digits;
}

export function isValidWhatsapp(input: string): boolean {
  const d = canonicalWhatsapp(input);
  if (d.length !== 10 && d.length !== 11) return false;

  const ddd = Number(d.slice(0, 2));
  if (!Number.isInteger(ddd) || ddd < 11 || ddd > 99) return false;

  if (d.length === 11 && d[2] !== '9') return false;

  return true;
}

export function isValidEmail(input: string): boolean {
  const value = (input || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function formatWhatsapp(input: string): string {
  const d = normalizeWhatsapp(input).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
