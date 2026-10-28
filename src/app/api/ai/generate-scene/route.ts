import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { CanvasElement, EnvironmentConfig, DEFAULT_ENVIRONMENT, ShapeType } from '@/lib/builder-elements';

export const maxDuration = 45;

interface GenerateSceneRequest {
  prompt: string;
}

const VALID_SHAPES: ShapeType[] = [
  'panel-arch',
  'panel-round',
  'panel-rect',
  'panel-wavy',
  'cylinder-high',
  'cylinder-mid',
  'cylinder-low',
  'acrylic-cylinder',
  'table-ruffle',
  'table-cloth',
  'table-rect',
  'table-round',
  'balloon-arch-l',
  'balloon-arch',
  'balloon-arch-half',
  'balloon-cascade',
  'balloon-cluster',
  'balloon-small',
  'balloon-mid',
  'balloon-single',
  'balloon-giant-bow',
  'cake-tiered',
  'flower-arrangement',
  'rug-oval',
  'rug-rect',
  'text',
];

// Temas que possuem pastas de artes sublimadas PNG em /public/templates-art/<tema>/
const KNOWN_TEMPLATE_THEMES = new Set([
  '3-palavrinhas',
  'a-bela-e-a-fera',
  'astronauta-espaco',
  'barbie',
  'bolofofos',
  'branca-de-neve',
  'cinderela',
  'circo-rosa',
  'circo-tradicional',
  'dino-baby',
  'enrolados-rapunzel',
  'fazendinha',
  'frozen',
  'fundo-do-mar',
  'herois-vingadores',
  'homem-aranha',
  'jardim-encantado',
  'mickey-disney',
  'patrulha-canina',
  'safari-baby',
  'sereia',
]);

const SYSTEM_PROMPT = `Você é o Arquiteto e Decorador Chefe de Festas do FestaLab, especialista em transformar desejos de clientes em projetos cenográficos de festas prontos para edição.

Seu trabalho é receber uma descrição de festa em linguagem natural e retornar um JSON contendo uma composição harmônica, moderna e perfeitamente equilibrada de elementos decorativos para o canvas 2D/3D.

SISTEMA DE COORDENADAS E REGRAS ESPACIAIS:
- Largura total do canvas: 1000px. Altura total: 700px.
- Linha do chão / piso de apoio dos móveis: Y = 560 (a base dos cilindros e mesas deve encostar ou terminar próximo a Y=560 a 600).
- Parede / Fundo: de Y = 0 até Y = 560.
- Tapete oval (opcional, para preencher o chão):
  { "shapeType": "rug-oval", "x": 170, "y": 520, "width": 660, "height": 130, "zIndex": 1 }

PAINÉIS DE FUNDO (Z-Index 2 a 3):
- Trio de painéis (tendência número 1):
  * Painel Romano Arqueado à esquerda: { "shapeType": "panel-arch", "x": 230, "y": 170, "width": 180, "height": 360, "zIndex": 2 }
  * Painel Redondo ao centro: { "shapeType": "panel-round", "x": 410, "y": 150, "width": 320, "height": 320, "zIndex": 3 }
  * Painel Romano à direita (ou retangular): { "shapeType": "panel-arch", "x": 630, "y": 220, "width": 170, "height": 340, "zIndex": 2 }

MÓVEIS (Z-Index 4 a 7):
- Mesa Central:
  * Mesa de Babado plissada (moderna): { "shapeType": "table-ruffle", "x": 375, "y": 440, "width": 250, "height": 145, "zIndex": 6 }
  * OU Mesa com toalha clássica: { "shapeType": "table-cloth", "x": 375, "y": 420, "width": 250, "height": 145, "zIndex": 6 }
- Trio de Cilindros:
  * Cilindro Alto G: { "shapeType": "cylinder-high", "x": 220, "y": 410, "width": 105, "height": 190, "zIndex": 4 }
  * Cilindro Médio M: { "shapeType": "cylinder-mid", "x": 650, "y": 440, "width": 100, "height": 165, "zIndex": 5 }
  * Cilindro Baixo P: { "shapeType": "cylinder-low", "x": 740, "y": 465, "width": 95, "height": 140, "zIndex": 7 }

ELEMENTOS DE DECORAÇÃO (Z-Index 5 a 10):
- Bolo Cenográfico: SEMPRE posicionado sobre a mesa central!
  { "shapeType": "cake-tiered", "x": 435, "y": 340, "width": 130, "height": 110, "zIndex": 8 }
- Balões Orgânicos:
  * Arco Desconstruído em L emoldurando os painéis:
    { "shapeType": "balloon-arch-l", "x": 220, "y": 120, "width": 260, "height": 340, "zIndex": 5 }
- Arranjos de Flores Naturais:
  * Sobre os cilindros: { "shapeType": "flower-arrangement", "x": 215, "y": 290, "width": 115, "height": 125, "zIndex": 6 }
  * No chão nas laterais: { "shapeType": "flower-arrangement", "x": 640, "y": 450, "width": 130, "height": 120, "zIndex": 9 }
- Balões Gigantes com laço de cetim nas extremidades (opcional):
  { "shapeType": "balloon-giant-bow", "x": 130, "y": 320, "width": 110, "height": 240, "zIndex": 9 }

REGRA FUNDAMENTAL E OBRIGATÓRIA: CORES VIVAS E PROIBIÇÃO DE BRANCO VAZIO:
1. NUNCA DEIXE OS PAINÉIS, CILINDROS OU MESAS EM BRANCO (#FFFFFF, #FFF ou similar)!
2. CADA ELEMENTO DEVE TER UMA COR TEMÁTICA RICA E VIBRANTE DO TEMA:
   - Para Toy Story: use azul royal (#1D4ED8) no painel redondo, amarelo (#FACC15) no painel esquerdo e verde (#22C55E) no painel direito.
   - Para os cilindros laterais: cada um com uma cor temática contrastante (ex: Cilindro G amarelo, Cilindro M verde, Cilindro P vermelho ou azul).
   - Para a mesa: toalha ou saia com cor marcante ou tom elegante da paleta.
   - Para os balões: preencha 'fill', 'balloonSecondaryFill' e 'balloonTertiaryFill' com as cores vibrantes do tema.
   - Para o bolo: decore com as cores do tema.

REGRA ESTRITA SOBRE IMAGENS SUBLIMADAS (fillImageSrc):
A pasta de artes no servidor CONTÉM EXCLUSIVAMENTE OS SEGUINTES 21 TEMAS:
'3-palavrinhas', 'a-bela-e-a-fera', 'astronauta-espaco', 'barbie', 'bolofofos', 'branca-de-neve', 'cinderela', 'circo-rosa', 'circo-tradicional', 'dino-baby', 'enrolados-rapunzel', 'fazendinha', 'frozen', 'fundo-do-mar', 'herois-vingadores', 'homem-aranha', 'jardim-encantado', 'mickey-disney', 'patrulha-canina', 'safari-baby', 'sereia'.

SE E SOMENTE SE a solicitação for de um desses 21 temas oficiais exatos, você pode preencher:
  painel redondo: fillImageSrc: "/templates-art/{tema}/redondo.png", fillMode: "cover"
  painel romano: fillImageSrc: "/templates-art/{tema}/lateral.png", fillMode: "cover"
  cilindro G: fillImageSrc: "/templates-art/{tema}/cilindro_g.png", fillMode: "cover"
  cilindro M: fillImageSrc: "/templates-art/{tema}/cilindro_m.png", fillMode: "cover"
  cilindro P: fillImageSrc: "/templates-art/{tema}/cilindro_p.png", fillMode: "cover"

SE FOR QUALQUER OUTRO TEMA (exemplo: Toy Story, Sonic, Wandinha, Bob Esponja, Pokémon, Carros, Moana, Casamento, etc.):
É TERMINANTEMENTE PROIBIDO inventar caminhos em /templates-art/! 'fillImageSrc' DEVE SER OMITIDO (ou null)!
E VOCÊ DEVE COLORIR todos os painéis, cilindros e mesas com as cores características, vibrantes e marcantes desse tema no campo 'fill'!

FORMATO DA RESPOSTA:
Responda EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
{
  "name": "Nome descritivo e cativante da festa",
  "themeDescription": "Breve parágrafo de 1 a 2 frases explicando a proposta cenográfica e a paleta criada.",
  "environment": {
    "wallColor": "#F6F5F2",
    "floorColor": "#E2DDD5"
  },
  "elements": [
    // Array de CanvasElement com IDs únicos (ex: "el-panel-1", "el-table-1", etc.)
  ]
}`;

export async function POST(req: Request) {
  try {
    const body: GenerateSceneRequest = await req.json();
    const userPrompt = body.prompt?.trim();

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'Por favor, descreva a festa que você deseja criar.' },
        { status: 400 }
      );
    }

    // Modelo de texto/raciocínio estruturado rápido
    const model = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Crie um projeto cenográfico de festa completo para esta solicitação: "${userPrompt}"`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('A IA não retornou uma resposta válida.');
    }

    const parsed = JSON.parse(content);

    // Validação e higienização dos elementos
    const rawElements: CanvasElement[] = Array.isArray(parsed.elements) ? parsed.elements : [];

    // Coleta as cores escolhidas pela IA (ex: balões e elementos) para garantir paleta rica
    const balloonElement = rawElements.find((e) => e.shapeType?.includes('balloon'));
    const detectedColors: string[] = [
      balloonElement?.fill,
      balloonElement?.balloonSecondaryFill,
      balloonElement?.balloonTertiaryFill,
      ...rawElements.map((e) => e.fill),
    ].filter((c): c is string => Boolean(c && typeof c === 'string' && !['#ffffff', '#fff', '#FFFFFF', '#FFF'].includes(c.trim())));

    const fallbackPalette = detectedColors.length >= 3
      ? detectedColors
      : ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

    let paletteIndex = 0;

    const sanitizedElements: CanvasElement[] = rawElements.map((el, index) => {
      const shapeType = VALID_SHAPES.includes(el.shapeType) ? el.shapeType : 'panel-arch';
      const finish: 'matte' | 'chrome' | 'pearl' = ['matte', 'chrome', 'pearl'].includes(el.balloonFinish as string)
        ? (el.balloonFinish as 'matte' | 'chrome' | 'pearl')
        : 'pearl';

      // Validação estrita de fillImageSrc contra a lista real de temas
      let safeFillImageSrc: string | undefined = undefined;
      if (el.fillImageSrc && typeof el.fillImageSrc === 'string') {
        const match = el.fillImageSrc.match(/^\/templates-art\/([a-z0-9-]+)\//);
        if (match && KNOWN_TEMPLATE_THEMES.has(match[1])) {
          safeFillImageSrc = el.fillImageSrc;
        }
      }

      // Se não há estampa válida e o elemento é uma peça grande de destaque, NÃO permitir que fique branco vazio
      let finalFill = el.fill && el.fill.trim() ? el.fill : '#FFFFFF';
      const isPlainWhite = ['#ffffff', '#fff', '#FFFFFF', '#FFF'].includes(finalFill.trim());

      const isLargeDecorativeShape =
        shapeType.startsWith('panel-') ||
        shapeType.startsWith('cylinder-') ||
        shapeType.startsWith('table-');

      if (!safeFillImageSrc && isPlainWhite && isLargeDecorativeShape) {
        finalFill = fallbackPalette[paletteIndex % fallbackPalette.length];
        paletteIndex++;
      }

      return {
        id: el.id || `ai-${shapeType}-${Date.now()}-${index}`,
        elementId: el.elementId || shapeType,
        name: el.name || `Elemento ${index + 1}`,
        shapeType,
        x: typeof el.x === 'number' ? Math.round(el.x) : 200 + index * 40,
        y: typeof el.y === 'number' ? Math.round(el.y) : 200,
        width: typeof el.width === 'number' ? Math.max(20, Math.round(el.width)) : 140,
        height: typeof el.height === 'number' ? Math.max(20, Math.round(el.height)) : 140,
        rotation: typeof el.rotation === 'number' ? el.rotation : 0,
        zIndex: typeof el.zIndex === 'number' ? el.zIndex : index + 1,
        fill: finalFill,
        stroke: el.stroke || '#D4D4D8',
        opacity: typeof el.opacity === 'number' ? el.opacity : 1,
        fillImageSrc: safeFillImageSrc,
        fillMode: el.fillMode || 'cover',
        balloonSecondaryFill: el.balloonSecondaryFill || undefined,
        balloonTertiaryFill: el.balloonTertiaryFill || undefined,
        balloonFinish: finish,
        topFill: el.topFill || (shapeType.startsWith('cylinder-') ? finalFill : undefined),
        text: el.text || undefined,
        fontSize: el.fontSize || undefined,
      };
    });

    // Sanitizar ambiente
    const env: EnvironmentConfig = {
      wallColor: parsed.environment?.wallColor || DEFAULT_ENVIRONMENT.wallColor,
      floorColor: parsed.environment?.floorColor || DEFAULT_ENVIRONMENT.floorColor,
      floorY: DEFAULT_ENVIRONMENT.floorY,
      roomWidthCm: DEFAULT_ENVIRONMENT.roomWidthCm,
      roomHeightCm: DEFAULT_ENVIRONMENT.roomHeightCm,
      backgroundImage: DEFAULT_ENVIRONMENT.backgroundImage,
    };

    return NextResponse.json({
      name: parsed.name || 'Festa Criada por IA',
      themeDescription: parsed.themeDescription || 'Cenário montado sob medida com base na sua descrição.',
      environment: env,
      elements: sanitizedElements,
    });
  } catch (error) {
    console.error('[GenerateScene API Error]:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erro ao gerar cenário com IA.',
      },
      { status: 500 }
    );
  }
}
