import { NextResponse } from 'next/server';
import { getTemplates } from '@/lib/templates-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const templates = await getTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('[API /templates GET Error]:', error);
    return NextResponse.json({ error: 'Erro ao carregar templates' }, { status: 500 });
  }
}
