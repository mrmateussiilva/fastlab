import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getTemplates, upsertTemplate, resetTemplates } from '@/lib/templates-store';
import { FestaTemplate } from '@/lib/templates';
import { DEFAULT_ENVIRONMENT } from '@/lib/builder-elements';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const templates = await getTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    console.error('[AdminTemplates GET Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao carregar templates' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Ação especial: resetar para os padrões
    if (body.action === 'reset') {
      const resetList = await resetTemplates();
      return NextResponse.json(resetList);
    }

    const {
      name,
      description = '',
      category = 'Infantil',
      tags = [],
      previewColor = 'from-sky-200 via-pink-100 to-yellow-100',
      icon = '🎈',
      elements = [],
      environment = DEFAULT_ENVIRONMENT,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'O nome do template é obrigatório.' }, { status: 400 });
    }

    const id = body.id || `tpl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newTemplate: FestaTemplate = {
      id,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      previewColor,
      icon: icon || '🎈',
      elements: Array.isArray(elements) ? elements : [],
      environment: environment || DEFAULT_ENVIRONMENT,
    };

    const saved = await upsertTemplate(newTemplate);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('[AdminTemplates POST Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao salvar template' },
      { status: 500 }
    );
  }
}
