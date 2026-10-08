import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getTemplateById, upsertTemplate, deleteTemplate } from '@/lib/templates-store';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const template = await getTemplateById(id);

  if (!template) {
    return NextResponse.json({ error: 'Template não encontrado.' }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function PUT(req: Request, context: RouteContext) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getTemplateById(id);

  if (!existing) {
    return NextResponse.json({ error: 'Template não encontrado.' }, { status: 404 });
  }

  try {
    const body = await req.json();

    const updated = {
      ...existing,
      name: body.name !== undefined ? body.name : existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      category: body.category !== undefined ? body.category : existing.category,
      tags: body.tags !== undefined 
        ? (Array.isArray(body.tags) ? body.tags : body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)) 
        : existing.tags,
      previewColor: body.previewColor !== undefined ? body.previewColor : existing.previewColor,
      icon: body.icon !== undefined ? body.icon : existing.icon,
      elements: body.elements !== undefined ? body.elements : existing.elements,
      environment: body.environment !== undefined ? body.environment : existing.environment,
    };

    const saved = await upsertTemplate(updated);
    return NextResponse.json(saved);
  } catch (error) {
    console.error(`[AdminTemplates PUT Error ${id}]:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao atualizar template' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteTemplate(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Template não encontrado para exclusão.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Template excluído com sucesso.' });
}
