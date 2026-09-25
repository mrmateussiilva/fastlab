import { Redis } from '@upstash/redis';

export function getClientIp(req: Request): string {
  // 1. Vercel standard header
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ip = xForwardedFor.split(',')[0].trim();
    if (ip) return ip;
  }

  // 2. Secondary proxy headers
  const xRealIp = req.headers.get('x-real-ip');
  if (xRealIp?.trim()) return xRealIp.trim();

  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp?.trim()) return cfConnectingIp.trim();

  // Local fallback
  return '127.0.0.1';
}

export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

export const LIMIT_PER_HOUR = Number(process.env.AI_GENERATION_LIMIT_PER_HOUR || 2);
export const GLOBAL_LIMIT = Number(process.env.AI_GLOBAL_GENERATION_LIMIT || 25);
const WINDOW_SECONDS = 3600; // 1 hour

export interface LimitStatus {
  limit: number;
  used: number;
  remaining: number;
  resetAt: string | null;
  retryAfter: number;
  globalLimitReached: boolean;
}

export type ReservationResult =
  | {
      allowed: true;
      limit: number;
      remaining: number;
      resetAt: string | null;
      retryAfter: number;
    }
  | {
      allowed: false;
      error: 'RATE_LIMIT';
      message: string;
      limit: number;
      remaining: 0;
      resetAt: string;
      retryAfter: number;
    }
  | {
      allowed: false;
      error: 'GLOBAL_LIMIT';
      message: string;
    };

/**
 * Consulta o status atual de gerações para um IP
 */
export async function getGenerationStatus(ip: string): Promise<LimitStatus> {
  const redis = getRedis();

  if (!redis) {
    return {
      limit: LIMIT_PER_HOUR,
      used: 0,
      remaining: LIMIT_PER_HOUR,
      resetAt: null,
      retryAfter: 0,
      globalLimitReached: false,
    };
  }

  try {
    const globalCount = (await redis.get<number>('festalab:generation:global:total')) || 0;
    const globalLimitReached = Number(globalCount) >= GLOBAL_LIMIT;

    const ipKey = `festalab:generation:ip:${ip}`;
    const [usedRaw, ttlRaw] = await Promise.all([
      redis.get<number>(ipKey),
      redis.ttl(ipKey),
    ]);

    const used = Number(usedRaw) || 0;
    const ttl = Number(ttlRaw);

    const remaining = globalLimitReached ? 0 : Math.max(0, LIMIT_PER_HOUR - used);
    const retryAfter = ttl > 0 ? ttl : 0;
    const resetAt = ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : null;

    return {
      limit: LIMIT_PER_HOUR,
      used,
      remaining,
      resetAt,
      retryAfter,
      globalLimitReached,
    };
  } catch (err) {
    console.error('[RateLimit] Error getting status:', err);
    // Em caso de falha transitória do Redis, retornar status permissivo para não quebrar a aplicação
    return {
      limit: LIMIT_PER_HOUR,
      used: 0,
      remaining: LIMIT_PER_HOUR,
      resetAt: null,
      retryAfter: 0,
      globalLimitReached: false,
    };
  }
}

/**
 * Tenta reservar atomicamente um slot de geração para o IP.
 * Utiliza script Lua para garantir atomicidade sem condição de corrida.
 */
export async function reserveGenerationSlot(ip: string): Promise<ReservationResult> {
  const redis = getRedis();

  if (!redis) {
    return {
      allowed: true,
      limit: LIMIT_PER_HOUR,
      remaining: LIMIT_PER_HOUR - 1,
      resetAt: null,
      retryAfter: 0,
    };
  }

  // 1. Verificar Limite Global primeiro
  try {
    const globalCount = (await redis.get<number>('festalab:generation:global:total')) || 0;
    if (Number(globalCount) >= GLOBAL_LIMIT) {
      return {
        allowed: false,
        error: 'GLOBAL_LIMIT',
        message: 'As gerações gratuitas deste período chegaram ao limite.',
      };
    }
  } catch (err) {
    console.error('[RateLimit] Failed to check global limit:', err);
  }

  // 2. Verificar e Incrementar IP atomicamente usando Lua Script
  const ipKey = `festalab:generation:ip:${ip}`;
  const luaScript = `
    local current = redis.call('GET', KEYS[1])
    if current and tonumber(current) >= tonumber(ARGV[1]) then
        local ttl = redis.call('TTL', KEYS[1])
        return {0, tonumber(current), ttl}
    else
        local count = redis.call('INCR', KEYS[1])
        if count == 1 then
            redis.call('EXPIRE', KEYS[1], ARGV[2])
        end
        local ttl = redis.call('TTL', KEYS[1])
        return {1, count, ttl}
    end
  `;

  try {
    const rawRes = await redis.eval(
      luaScript,
      [ipKey],
      [LIMIT_PER_HOUR, WINDOW_SECONDS]
    );

    const [allowedFlag, count, ttl] = rawRes as [number, number, number];
    const retryAfter = ttl > 0 ? ttl : WINDOW_SECONDS;
    const resetAt = new Date(Date.now() + retryAfter * 1000).toISOString();

    if (allowedFlag === 0) {
      return {
        allowed: false,
        error: 'RATE_LIMIT',
        message: 'Limite temporário de gerações atingido.',
        limit: LIMIT_PER_HOUR,
        remaining: 0,
        resetAt,
        retryAfter,
      };
    }

    const remaining = Math.max(0, LIMIT_PER_HOUR - count);
    return {
      allowed: true,
      limit: LIMIT_PER_HOUR,
      remaining,
      resetAt,
      retryAfter,
    };
  } catch (err) {
    console.error('[RateLimit] Failed atomic check with Lua:', err);
    // Fallback permissivo se Redis falhar para não bloquear o usuário completamente
    return {
      allowed: true,
      limit: LIMIT_PER_HOUR,
      remaining: 0,
      resetAt: null,
      retryAfter: 0,
    };
  }
}

/**
 * Reverte o slot do IP caso a chamada à OpenAI falhe.
 */
export async function rollbackIpGeneration(ip: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const ipKey = `festalab:generation:ip:${ip}`;
    const val = await redis.decr(ipKey);
    if (val <= 0) {
      await redis.del(ipKey);
    }
  } catch (err) {
    console.error('[RateLimit] Failed to rollback IP generation slot:', err);
  }
}

/**
 * Registra uma geração bem-sucedida no contador global.
 */
export async function recordSuccessfulGeneration(): Promise<number> {
  const redis = getRedis();
  if (!redis) return 0;

  try {
    return await redis.incr('festalab:generation:global:total');
  } catch (err) {
    console.error('[RateLimit] Failed to increment global counter:', err);
    return 0;
  }
}
