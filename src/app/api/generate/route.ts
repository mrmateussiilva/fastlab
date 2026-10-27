import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { toFile } from 'openai';
import {
  REALISTIC_PARTY_PROMPT,
  buildRealisticPartyPrompt,
  buildVisionAnalysisPrompt,
  RealisticPromptOptions,
} from '@/lib/prompts';
import { auth } from '@clerk/nextjs/server';
import {
  reserveGenerationSlot,
  rollbackGenerationSlot,
  recordSuccessfulGeneration,
} from '@/lib/rate-limit';

export const maxDuration = 60;

interface GenerateResult {
  imageUrl: string;
  modelUsed: string;
}

/**
 * Modelo de imagem padrão da OpenAI. O DALL-E 2/3 foi desligado em 12/05/2026;
 * os modelos atuais são gpt-image-2.5-sunburst (precisão de edição) e gpt-image-2.5-flare (rápido).
 */
const DEFAULT_OPENAI_IMAGE_MODEL = 'gpt-image-2.5-sunburst';

/**
 * Resolve o modelo de imagem para a OpenAI oficial / gateways compatíveis.
 * Valores legados 'dall-e-*' (ex.: ainda salvos nas variáveis de ambiente) são ignorados.
 */
function resolveOpenAIImageModel(): string {
  const configured = process.env.OPENAI_IMAGE_MODEL?.trim();
  if (!configured) return DEFAULT_OPENAI_IMAGE_MODEL;
  if (configured.toLowerCase().includes('dall-e')) {
    console.warn(
      `[Generate API] Modelo '${configured}' foi descontinuado pela OpenAI. Usando '${DEFAULT_OPENAI_IMAGE_MODEL}'. Atualize OPENAI_IMAGE_MODEL.`
    );
    return DEFAULT_OPENAI_IMAGE_MODEL;
  }
  return configured;
}

/** Tamanho da imagem gerada. Padrão paisagem (combina com o canvas 4:3). Configurável via OPENAI_IMAGE_SIZE. */
function getImageSize(): '1024x1024' | '1536x1024' | '1024x1536' | 'auto' {
  const configured = process.env.OPENAI_IMAGE_SIZE?.trim();
  if (configured && ['1024x1024', '1536x1024', '1024x1536', 'auto'].includes(configured)) {
    return configured as '1024x1024' | '1536x1024' | '1024x1536' | 'auto';
  }
  return '1536x1024';
}

/** Qualidade da imagem. Padrão 'high' (máxima precisão). Configurável via OPENAI_IMAGE_QUALITY. */
function getImageQuality(): 'low' | 'medium' | 'high' | 'auto' {
  const configured = process.env.OPENAI_IMAGE_QUALITY?.trim().toLowerCase();
  if (configured && ['low', 'medium', 'high', 'auto'].includes(configured)) {
    return configured as 'low' | 'medium' | 'high' | 'auto';
  }
  return 'high';
}

/**
 * Geração via GPT-4o Vision + modelo de imagem (gpt-image)
 * Como o DALL-E 3 não possui endpoint de image-to-image direto com imagem bruta,
 * o GPT-4o Vision analisa minuciosamente a maquete 2D (cores dos balões, painel temático,
 * pedestais cilíndricos, bandejas, displays de chão) e formula um prompt fotográfico
 * de altíssima fidelidade para o DALL-E 3 gerar a fotografia realista da festa.
 */
async function generateViaVisionAndDalle(
  buffer: Buffer,
  fileType: string,
  options?: RealisticPromptOptions,
  customPromptFallback?: string
): Promise<GenerateResult> {
  const isOpenRouter = process.env.OPENAI_BASE_URL?.includes('openrouter.ai');
  const visionModel = process.env.OPENAI_VISION_MODEL || (isOpenRouter ? 'openai/gpt-4o' : 'gpt-4o');
  const imageModel = isOpenRouter
    ? process.env.OPENAI_IMAGE_MODEL || `openai/${DEFAULT_OPENAI_IMAGE_MODEL}`
    : resolveOpenAIImageModel();
  const base64Image = buffer.toString('base64');
  const dataUrl = `data:${fileType};base64,${base64Image}`;

  console.log(`[Generate API] Analisando maquete com Vision (${visionModel})...`);

  let refinedPrompt = customPromptFallback || REALISTIC_PARTY_PROMPT;

  try {
    const visionSystemPrompt = buildVisionAnalysisPrompt(options);

    const visionResponse = await openai.chat.completions.create({
      model: visionModel,
      messages: [
        {
          role: 'system',
          content: visionSystemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Here is the 2D party decoration mockup created by the decorator. Analyze all elements and output the photorealistic DALL-E 3 prompt.',
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const visionContent = visionResponse.choices?.[0]?.message?.content?.trim();
    if (visionContent && visionContent.length > 20) {
      refinedPrompt = visionContent;
      console.log(`[Generate API] Prompt refinado via Vision com sucesso (${refinedPrompt.length} caracteres)`);
    }
  } catch (visionErr) {
    console.warn('[Generate API] Aviso: Análise via Vision falhou, prosseguindo com prompt estruturado padrão:', visionErr);
  }

  let b64Json: string | undefined;
  let url: string | undefined;

  if (isOpenRouter) {
    console.log(`[Generate API] Gerando imagem via OpenRouter Unified Image API (${imageModel})...`);
    const openRouterApiKey = process.env.OPENAI_API_KEY;
    const imgRes = await fetch('https://openrouter.ai/api/v1/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://festalab.app',
        'X-Title': 'FestaLab',
      },
      body: JSON.stringify({
        model: imageModel,
        prompt: refinedPrompt,
        aspect_ratio: '1:1',
      }),
    });

    if (!imgRes.ok) {
      const errText = await imgRes.text();
      throw new Error(`OpenRouter Image API Error (${imgRes.status}): ${errText}`);
    }

    const openRouterJson = await imgRes.json();
    b64Json = openRouterJson.data?.[0]?.b64_json;
    url = openRouterJson.data?.[0]?.url;
  } else {
    console.log(`[Generate API] Gerando imagem fotográfica realista com ${imageModel}...`);
    const imageQuality = getImageQuality();
    const dalleResponse = await openai.images.generate({
      model: imageModel,
      prompt: refinedPrompt,
      n: 1,
      size: getImageSize(),
      quality: imageQuality,
    });

    b64Json = dalleResponse.data?.[0]?.b64_json;
    url = dalleResponse.data?.[0]?.url;
  }

  if (!b64Json && !url) {
    throw new Error('Nenhuma imagem foi retornada pela API de imagem.');
  }

  const imageUrl = b64Json
    ? (b64Json.startsWith('data:') ? b64Json : `data:image/png;base64,${b64Json}`)
    : url!;

  return { imageUrl, modelUsed: `${visionModel} + ${imageModel}` };
}

/**
 * Geração via endpoint direto de edit (openai.images.edit)
 * Utilizado quando configurado explicitamente (OPENAI_IMAGE_MODE=edit)
 * ou quando apontando para um endpoint/gateway compatível com OpenAI.
 */
async function executeDirectImageEdit(
  buffer: Buffer,
  fileName: string,
  fileType: string,
  prompt: string
): Promise<GenerateResult> {
  const model = resolveOpenAIImageModel();
  console.log(`[Generate API] Tentando endpoint images.edit com modelo: ${model ?? '(padrão do servidor)'}`);

  const file = await toFile(buffer, fileName, { type: fileType });
  const modelParam = model as Parameters<typeof openai.images.edit>[0]['model'];

  // 1ª tentativa: máxima fidelidade (paisagem, qualidade alta, preservar detalhes da imagem de entrada)
  // 2ª tentativa: parâmetros mínimos, caso o modelo rejeite size/quality/input_fidelity (erro 400)
  let response;
  try {
    response = await openai.images.edit({
      image: file,
      prompt,
      n: 1,
      size: getImageSize(),
      quality: getImageQuality(),
      input_fidelity: 'high',
      model: modelParam,
    });
  } catch (err) {
    const status = (err as { status?: number })?.status;
    if (status !== 400) throw err;
    console.warn('[Generate API] images.edit rejeitou parâmetros avançados, repetindo com configuração mínima:', err);
    const retryFile = await toFile(buffer, fileName, { type: fileType });
    response = await openai.images.edit({
      image: retryFile,
      prompt,
      n: 1,
      size: '1024x1024',
      model: modelParam,
    });
  }

  const b64Json = response.data?.[0]?.b64_json;
  const url = response.data?.[0]?.url;

  if (!b64Json && !url) {
    throw new Error('Nenhuma imagem foi retornada pelo endpoint de edição.');
  }

  const imageUrl = b64Json
    ? (b64Json.startsWith('data:') ? b64Json : `data:image/png;base64,${b64Json}`)
    : url!;

  return { imageUrl, modelUsed: model || 'openai-images-edit' };
}

/**
 * Geração opcional via Replicate (ex: Flux / SDXL) caso configurado
 */
async function executeReplicateGeneration(
  buffer: Buffer,
  fileType: string,
  prompt: string
): Promise<GenerateResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('REPLICATE_API_TOKEN não está configurado.');
  }

  const modelVersion = process.env.REPLICATE_MODEL || 'black-forest-labs/flux-schnell';
  const dataUrl = `data:${fileType};base64,${buffer.toString('base64')}`;

  console.log(`[Generate API] Enviando requisição para Replicate (${modelVersion})...`);

  const startRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait',
    },
    body: JSON.stringify({
      version: process.env.REPLICATE_VERSION_ID || undefined,
      model: !process.env.REPLICATE_VERSION_ID ? modelVersion : undefined,
      input: {
        image: dataUrl,
        prompt,
        prompt_strength: 0.8,
      },
    }),
  });

  if (!startRes.ok) {
    const errText = await startRes.text();
    throw new Error(`Replicate API error (${startRes.status}): ${errText}`);
  }

  let prediction = await startRes.json();

  const maxAttempts = 30;
  let attempts = 0;
  while (
    prediction.status !== 'succeeded' &&
    prediction.status !== 'failed' &&
    prediction.status !== 'canceled' &&
    attempts < maxAttempts
  ) {
    await new Promise((r) => setTimeout(r, 2000));
    const checkRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    prediction = await checkRes.json();
    attempts++;
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Replicate generation failed with status: ${prediction.status}`);
  }

  const output = prediction.output;
  const imageUrl = Array.isArray(output) ? output[0] : output;
  if (!imageUrl) {
    throw new Error('Nenhuma imagem retornada pelo Replicate.');
  }

  return { imageUrl, modelUsed: `replicate/${modelVersion}` };
}

/**
 * Orquestrador principal de geração fotorrealista
 */
async function generateRealisticImage(
  buffer: Buffer,
  fileName: string,
  fileType: string,
  promptToUse: string,
  options?: RealisticPromptOptions
): Promise<GenerateResult> {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const imageMode = (process.env.OPENAI_IMAGE_MODE || 'auto').toLowerCase();

  // 1. Provedor Replicate
  if (provider === 'replicate' || (process.env.REPLICATE_API_TOKEN && provider !== 'openai')) {
    try {
      return await executeReplicateGeneration(buffer, fileType, promptToUse);
    } catch (replicateErr) {
      console.warn('[Generate API] Falha no Replicate, tentando fallback para OpenAI:', replicateErr);
      if (!process.env.OPENAI_API_KEY) throw replicateErr;
    }
  }

  // 2. Provedor OpenAI com modo explícito 'edit'
  if (imageMode === 'edit') {
    return await executeDirectImageEdit(buffer, fileName, fileType, promptToUse);
  }

  // 3. Provedor OpenAI com modo 'auto'
  if (imageMode === 'auto') {
    const isOpenRouter = Boolean(process.env.OPENAI_BASE_URL?.includes('openrouter.ai'));

    // Modelos gpt-image suportam images.edit: usa o mockup real como referência (maior fidelidade).
    // Em caso de falha, cai para Vision + geração por texto.
    if (!isOpenRouter) {
      try {
        return await executeDirectImageEdit(buffer, fileName, fileType, promptToUse);
      } catch (editErr) {
        console.warn('[Generate API] Erro no images.edit, tentando fallback vision_generate:', editErr);
      }
    }

    return await generateViaVisionAndDalle(buffer, fileType, options, promptToUse);
  }

  // 4. Modo padrão: Vision + DALL-E 3
  return await generateViaVisionAndDalle(buffer, fileType, options, promptToUse);
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Você precisa estar logado para gerar imagens.' }, { status: 401 });
  }

  const identifier = userId;
  let slotReserved = false;

  try {
    if (!process.env.OPENAI_API_KEY && !process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'A chave OPENAI_API_KEY (ou REPLICATE_API_TOKEN) não foi configurada no servidor. Adicione a variável de ambiente.' },
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
    let parsedOptions: RealisticPromptOptions | undefined;

    if (optionsRaw && typeof optionsRaw === 'string') {
      try {
        parsedOptions = JSON.parse(optionsRaw);
        if (parsedOptions) {
          promptToUse = buildRealisticPartyPrompt(parsedOptions);
        }
      } catch (err) {
        console.warn('Could not parse generation options, using default prompt', err);
      }
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = image.name || 'mockup.png';
    const fileType = image.type || 'image/png';

    const result = await generateRealisticImage(buffer, fileName, fileType, promptToUse, parsedOptions);

    // Sucesso: incrementa contador global de gerações realizadas com êxito
    await recordSuccessfulGeneration();

    return NextResponse.json({
      success: true,
      image: result.imageUrl,
      model: result.modelUsed,
      remaining: reservation.remaining,
    });

  } catch (error: unknown) {
    console.error('AI Generation Error:', error);

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
