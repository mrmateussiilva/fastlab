import { getRedis, LIMIT_PER_HOUR, GLOBAL_LIMIT } from '@/lib/rate-limit';

describe('rate-limit configuration and connection', () => {
  test('LIMIT_PER_HOUR and GLOBAL_LIMIT have positive values', () => {
    expect(LIMIT_PER_HOUR).toBeGreaterThan(0);
    expect(GLOBAL_LIMIT).toBeGreaterThan(0);
  });

  test('getRedis returns null or Redis instance based on env', () => {
    const originalUrl = process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_URL;
    
    const redis = getRedis();
    expect(redis).toBeNull();

    if (originalUrl) {
      process.env.UPSTASH_REDIS_REST_URL = originalUrl;
    }
  });
});
