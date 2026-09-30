import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id] — carrega um projeto completo
export async function GET(_req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });

  return NextResponse.json(data);
}

// PUT /api/projects/[id] — atualiza um projeto existente
export async function PUT(req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, elements, environment, thumbnail_url } = body;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...(name && { name }),
      ...(elements && { elements }),
      ...(environment !== undefined && { environment }),
      ...(thumbnail_url !== undefined && { thumbnail_url }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// DELETE /api/projects/[id] — deleta um projeto
export async function DELETE(_req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
