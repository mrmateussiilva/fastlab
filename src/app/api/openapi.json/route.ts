import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'FestaLab AI API',
      version: '1.0.0',
      description: 'API para geração e renderização fotorrealista de decorações e maquetes de festa com Inteligência Artificial.',
    },
    servers: [
      {
        url: '/',
        description: 'Servidor atual',
      },
    ],
    paths: {
      '/api/generate': {
        post: {
          summary: 'Transforma mockup 2D em foto realista de festa',
          description: 'Recebe uma imagem do mockup de festa e opções de iluminação/fidelidade e gera uma fotografia realista usando IA.',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['image'],
                  properties: {
                    image: {
                      type: 'string',
                      format: 'binary',
                      description: 'Arquivo de imagem do mockup (PNG, JPG, WEBP até 10MB)',
                    },
                    options: {
                      type: 'string',
                      description: 'JSON string com RealisticPromptOptions { fidelity, lighting, environment }',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Imagem gerada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      image: { type: 'string', description: 'URL ou Data URI base64 da imagem gerada' },
                      model: { type: 'string', description: 'Modelo ou pipeline de IA utilizado' },
                      remaining: { type: 'number', description: 'Gerações restantes na cota do usuário' },
                    },
                  },
                },
              },
            },
            '400': { description: 'Dados ou imagem inválida' },
            '401': { description: 'Não autenticado' },
            '429': { description: 'Limite de taxa de geração atingido' },
            '500': { description: 'Erro interno ou falha na API de IA' },
          },
        },
      },
      '/api/generation-limit': {
        get: {
          summary: 'Consulta o status e cota de geração de IA',
          responses: {
            '200': {
              description: 'Status do limite do usuário',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      limit: { type: 'number' },
                      used: { type: 'number' },
                      remaining: { type: 'number' },
                      resetAt: { type: 'string', nullable: true },
                      retryAfter: { type: 'number' },
                      globalLimitReached: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Não autenticado' },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
}
