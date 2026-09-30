import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

function checkAuth(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    console.error('ADMIN_PASSWORD not set in environment variables');
    return false;
  }

  if (authHeader === `Bearer ${expectedPassword}`) {
    return true;
  }
  return false;
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const tagsStr = formData.get('tags') as string;
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];
    const description = formData.get('description') as string;
    const is_published = formData.get('is_published') === 'true';
    
    // File upload handling
    const coverFile = formData.get('cover_image') as File | null;
    let cover_image_url = formData.get('cover_image_url') as string || '';

    const supabase = getSupabaseAdmin();

    if (coverFile && coverFile.size > 0) {
      const ext = coverFile.name.split('.').pop();
      const filename = `${uuidv4()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('themes')
        .upload(filename, coverFile);

      if (uploadError) throw new Error(`Cover upload failed: ${uploadError.message}`);
      
      const { data: publicUrlData } = supabase.storage.from('themes').getPublicUrl(filename);
      cover_image_url = publicUrlData.publicUrl;
    }

    if (!cover_image_url) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 });
    }

    // Gallery images
    const gallery_images: string[] = [];
    // Currently, only handling cover image in this basic POST to avoid too much complexity. 
    // We can expand this later.

    const { data, error } = await supabase
      .from('themes')
      .insert({
        name,
        category,
        tags,
        description,
        cover_image_url,
        gallery_images,
        is_published,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
