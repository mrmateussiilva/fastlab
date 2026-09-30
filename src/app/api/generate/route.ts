import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { toFile } from 'openai';
import { REALISTIC_PARTY_PROMPT, buildRealisticPartyPrompt } from '@/lib/prompts';
import { auth } from '@clerk/nextjs/server';
import {
  reserveGenerationSlot,
  rollbackGenerationSlot,
  recordSuccessfulGeneration,
} from '@/lib/rate-limit';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Você precisa estar logado para gerar imagens.' }, { status: 401 });
  }

  const identifier = userId;
  let slotReserved = false;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'A chave OPENAI_API_KEY não foi configurada no servidor. Adicione a variável de ambiente na Vercel.' },
        { status: 500 }
      );
    }

    // 1. Identificar Usuário e reservar atomicamente o slot de geração
    const reservation = await reserveGenerationSlot(identifier);

    if (!reservation.allowed) {
      if (reservation.error === 'GLOBAL_LIMIT') {
        return NextResponse.json(
          {
            error: 'GLOBAL_LIMIT',
            message: reservation.message,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: 'RATE_LIMIT',
          message: reservation.message,
          limit: reservation.limit,
          remaining: reservation.remaining,
          resetAt: reservation.resetAt,
          retryAfter: reservation.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(reservation.retryAfter),
          },
        }
      );
    }

    slotReserved = true;

    const formData = await req.formData();
    const image = formData.get('image');

    if (!image || !(image instanceof File)) {
      if (slotReserved) await rollbackGenerationSlot(identifier);
      return NextResponse.json({ error: 'Arquivo de imagem é obrigatório.' }, { status: 400 });
    }

    // Validate size (10MB limit)
    if (image.size > 10 * 1024 * 1024) {
      if (slotReserved) await rollbackGenerationSlot(identifier);
      return NextResponse.json({ error: 'O arquivo deve ter no máximo 10MB.' }, { status: 400 });
    }

    // Validate MIME type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(image.type)) {
      if (slotReserved) await rollbackGenerationSlot(identifier);
      return NextResponse.json(
        { error: 'Formato inválido. Apenas PNG, JPG e WEBP são permitidos.' },
        { status: 400 }
      );
    }

    // Parse optional generation options or custom prompt
    const optionsRaw = formData.get('options');
    let promptToUse = REALISTIC_PARTY_PROMPT;

    if (optionsRaw && typeof optionsRaw === 'string') {
      try {
        const parsed = JSON.parse(optionsRaw);
        promptToUse = buildRealisticPartyPrompt(parsed);
      } catch (err) {
        console.warn('Could not parse generation options, using default prompt', err);
      }
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const file = await toFile(buffer, image.name || 'mockup.png', { type: image.type || 'image/png' });

    const response = await openai.images.edit({
      image: file,
      prompt: promptToUse,
      model: 'gpt-image-1',
      n: 1,
      size: '1024x1024',
    });

    const b64Json = response.data?.[0]?.b64_json;
    const url = response.data?.[0]?.url;

    if (!b64Json && !url) {
      throw new Error('Nenhuma imagem foi retornada pela API da OpenAI.');
    }

    // Sucesso: incrementa contador global de gerações realizadas com êxito
    await recordSuccessfulGeneration();

    return NextResponse.json({
      success: true,
      image: b64Json ? `data:image/png;base64,${b64Json}` : url,
      remaining: reservation.remaining,
    });

  } catch (error: unknown) {
    console.error('OpenAI / Generation Error:', error);

    // Se houve erro antes de produzir uma imagem válida, devolve a tentativa ao usuário
    if (slotReserved) {
      try {
        await rollbackGenerationSlot(identifier);
      } catch (rollbackErr) {
        console.error('Failed to rollback rate limit slot:', rollbackErr);
      }
    }

    let status = 500;
    let errorMessage = 'Erro ao gerar imagem com a Inteligência Artificial.';

    if (error && typeof error === 'object') {
      // Tratamento refinado para erros do SDK da OpenAI ou erros de rede/timeout
      const errObj = error as Record<string, unknown>;
      if ('status' in errObj && typeof errObj.status === 'number') {
        status = errObj.status;
      }
      if ('message' in errObj && typeof errObj.message === 'string') {
        errorMessage = errObj.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: 'AI_GENERATION_ERROR',
        message: errorMessage,
      },
      { status }
    );
  }
}

