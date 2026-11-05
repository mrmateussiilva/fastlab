import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/keep-alive — chamado pelo Vercel Cron (ver vercel.json).
 * Faz uma consulta mínima no Supabase para o projeto do plano grátis não ser pausado por inatividade.
 * Se CRON_SECRET estiver definido, a Vercel envia "Authorization: Bearer <CRON_SECRET>" e só ela passa.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await getSupabaseAdmin().from('projects').select('id').limit(1);
  if (error) {
    console.error('[cron keep-alive] Supabase error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
