import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const contentType = req.headers.get('content-type') || '';

    let name = '';
    let category = 'Infantil Unissex';
    let tags: string[] = [];
    let description = '';
    let is_published = true;
    let cover_image_url = '';
    let elements: unknown = null;
    let environment: unknown = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = (formData.get('name') as string) || '';
      category = (formData.get('category') as string) || 'Infantil Unissex';
      const tagsStr = (formData.get('tags') as string) || '';
      tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [];
      description = (formData.get('description') as string) || '';
      is_published = formData.get('is_published') === 'true';

      const elementsRaw = formData.get('elements');
      if (elementsRaw && typeof elementsRaw === 'string') {
        try { elements = JSON.parse(elementsRaw); } catch { /* ignore */ }
      }

      const envRaw = formData.get('environment');
      if (envRaw && typeof envRaw === 'string') {
        try { environment = JSON.parse(envRaw); } catch { /* ignore */ }
      }

      const coverFile = formData.get('cover_image') as File | null;
      cover_image_url = (formData.get('cover_image_url') as string) || '';

      if (coverFile && coverFile.size > 0) {
        const ext = coverFile.name.split('.').pop() || 'png';
        const filename = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('themes')
          .upload(filename, coverFile);

        if (uploadError) throw new Error(`Falha no upload da capa: ${uploadError.message}`);

        const { data: publicUrlData } = supabase.storage.from('themes').getPublicUrl(filename);
        cover_image_url = publicUrlData.publicUrl;
      }
    } else {
      // JSON payload
      const body = await req.json();
      name = body.name || '';
      category = body.category || 'Infantil Unissex';
      tags = Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []);
      description = body.description || '';
      is_published = body.is_published ?? true;
      cover_image_url = body.cover_image_url || '';
      elements = body.elements || null;
      environment = body.environment || null;

      // Suporte para upload de imagem em base64 vinda do canvas
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
          cover_image_url = publicUrlData.publicUrl;
        }
      }
    }

    if (!name.trim()) {
      return NextResponse.json({ error: 'O nome do modelo é obrigatório.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('themes')
      .insert({
        name,
        category,
        tags,
        description,
        cover_image_url: cover_image_url || '/logo-icon.png',
        gallery_images: [],
        elements,
        environment,
        is_published,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[AdminThemes POST Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
