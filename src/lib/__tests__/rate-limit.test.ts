import { getClientIp, LIMIT_PER_HOUR } from '@/lib/rate-limit';

describe('rate-limit utils', () => {
  test('getClientIp extracts x-forwarded-for correctly', () => {
    const req = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '192.168.1.50, 10.0.0.1',
      },
    });
    expect(getClientIp(req)).toBe('192.168.1.50');
  });

  test('getClientIp falls back to 127.0.0.1 when no headers are present', () => {
    const req = new Request('http://localhost');
    expect(getClientIp(req)).toBe('127.0.0.1');
  });

  test('LIMIT_PER_HOUR is defined', () => {
    expect(typeof LIMIT_PER_HOUR).toBe('number');
    expect(LIMIT_PER_HOUR).toBeGreaterThan(0);
  });
});
