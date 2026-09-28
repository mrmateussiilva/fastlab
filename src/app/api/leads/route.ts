import { NextResponse } from 'next/server';
import { getClientIp, getRedis } from '@/lib/rate-limit';
import { canonicalWhatsapp, isValidEmail, isValidWhatsapp } from '@/lib/lead-validation';

const LEAD_LIMIT_PER_HOUR = 5;
const WINDOW_SECONDS = 3600;

async function checkLeadRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true;

  try {
    const key = `festalab:lead:rl:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }
    return count <= LEAD_LIMIT_PER_HOUR;
  } catch (err) {
    console.error('[Leads] Falha no rate limit:', err);
    return true;
  }
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  try {
    const allowed = await checkLeadRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Muitas tentativas. Tente novamente mais tarde.' },
        { status: 429, headers: { 'Retry-After': String(WINDOW_SECONDS) } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
    }

    const { whatsapp, email, company, consent } = body as Record<string, unknown>;

    if (typeof company === 'string' && company.trim() !== '') {
      return NextResponse.json({ success: true });
    }

    if (typeof whatsapp !== 'string' || !isValidWhatsapp(whatsapp)) {
      return NextResponse.json(
        { error: 'Informe um WhatsApp válido com DDD, ex.: (11) 99999-9999.' },
        { status: 400 }
      );
    }

    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
    }

    if (consent !== true) {
      return NextResponse.json(
        { error: 'É necessário aceitar receber o contato.' },
        { status: 400 }
      );
    }

    const canonical = canonicalWhatsapp(whatsapp);
    const redis = getRedis();

    if (!redis) {
      console.warn('[Leads] Redis não configurado — lead não persistido:', canonical);
      return NextResponse.json({ success: true });
    }

    const id = `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const dedupeKey = `festalab:lead:wpp:${canonical}`;

    try {
      const isNew = await redis.set(dedupeKey, id, { nx: true });
      if (!isNew) {
        return NextResponse.json({ success: true, alreadyRegistered: true });
      }

      const fields: Record<string, string> = {
        whatsapp: canonical,
        createdAt: new Date().toISOString(),
      };
      if (trimmedEmail) {
        fields.email = trimmedEmail;
      }

      try {
        await redis.hset(`festalab:lead:${id}`, fields);
        await redis.zadd('festalab:leads:index', { score: Date.now(), member: id });
      } catch (storeErr) {
        await redis.del(dedupeKey).catch(() => null);
        throw storeErr;
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('[Leads] Erro ao persistir lead:', err);
      return NextResponse.json({ error: 'Erro ao salvar. Tente novamente.' }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('[Leads] Erro inesperado:', error);
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 });
  }
}
