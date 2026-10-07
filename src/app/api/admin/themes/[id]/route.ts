import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(req: Request, context: RouteContext) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = getSupabaseAdmin();

  try {
    const contentType = req.headers.get('content-type') || '';
    const updatePayload: Record<string, unknown> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      
      const name = formData.get('name');
      if (name !== null) updatePayload.name = name as string;

      const category = formData.get('category');
      if (category !== null) updatePayload.category = category as string;

      const tagsStr = formData.get('tags');
      if (tagsStr !== null) {
        updatePayload.tags = (tagsStr as string)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }

      const description = formData.get('description');
      if (description !== null) updatePayload.description = description as string;

      const isPublished = formData.get('is_published');
      if (isPublished !== null) updatePayload.is_published = isPublished === 'true';

      const elementsRaw = formData.get('elements');
      if (elementsRaw !== null) {
        try { updatePayload.elements = JSON.parse(elementsRaw as string); } catch { /* ignore */ }
      }

      const envRaw = formData.get('environment');
      if (envRaw !== null) {
        try { updatePayload.environment = JSON.parse(envRaw as string); } catch { /* ignore */ }
      }

      const coverFile = formData.get('cover_image') as File | null;
      if (coverFile && coverFile.size > 0) {
        const ext = coverFile.name.split('.').pop() || 'png';
        const filename = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('themes')
          .upload(filename, coverFile);

        if (uploadError) throw new Error(`Falha no upload da capa: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage.from('themes').getPublicUrl(filename);
        updatePayload.cover_image_url = publicUrlData.publicUrl;
      }
    } else {
      // JSON body
      const body = await req.json();

      if (body.name !== undefined) updatePayload.name = body.name;
      if (body.category !== undefined) updatePayload.category = body.category;
      if (body.tags !== undefined) {
        updatePayload.tags = Array.isArray(body.tags)
          ? body.tags
          : typeof body.tags === 'string'
          ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [];
      }
      if (body.description !== undefined) updatePayload.description = body.description;
      if (body.is_published !== undefined) updatePayload.is_published = body.is_published;
      if (body.elements !== undefined) updatePayload.elements = body.elements;
      if (body.environment !== undefined) updatePayload.environment = body.environment;
      if (body.cover_image_url !== undefined && body.cover_image_url) {
        updatePayload.cover_image_url = body.cover_image_url;
      }

      // Suporte a upload de base64 vindo do canvas
      if (body.cover_image_base64 && typeof body.cover_image_base64 === 'string') {
        const matches = body.cover_image_base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches) {
          const mime = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const ext = mime.split('/')[1] || 'png';
          const filename = `${crypto.randomUUID()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('themes')
            .upload(filename, buffer, { contentType: mime });

          if (uploadError) throw new Error(`Falha no upload da capa em base64: ${uploadError.message}`);

          const { data: publicUrlData } = supabase.storage.from('themes').getPublicUrl(filename);
          updatePayload.cover_image_url = publicUrlData.publicUrl;
        }
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'Nenhum dado fornecido para atualização.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('themes')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[AdminThemes PUT Error ${id}]:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao atualizar tema' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = getSupabaseAdmin();

  try {
    const { error } = await supabase
      .from('themes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, message: 'Modelo excluído com sucesso.' });
  } catch (error) {
    console.error(`[AdminThemes DELETE Error ${id}]:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao excluir modelo' },
      { status: 500 }
    );
  }
}
