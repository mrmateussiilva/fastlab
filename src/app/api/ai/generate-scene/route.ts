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

const SYSTEM_PROMPT = `Você é o Arquiteto e Decorador Chefe de Festas do FestaLab, especialista em transformar desejos de clientes em projetos cenográficos de festas prontos para edição.

Seu trabalho é receber uma descrição de festa em linguagem natural e retornar um JSON contendo uma composição harmônica, moderna e perfeitamente equilibrada de elementos decorativos para o canvas 2D/3D.

SISTEMA DE COORDENADAS E REGRAS ESPACIAIS:
- Largura total do canvas: 1000px. Altura total: 700px.
- Linha do chão / piso de apoio dos móveis: Y = 560 (a base dos cilindros e mesas deve encostar ou terminar próximo a Y=560 a 600).
- Parede / Fundo: de Y = 0 até Y = 560.
- Tapete oval (opcional, mas recomendado para preencher o chão):
  { "shapeType": "rug-oval", "x": 170, "y": 520, "width": 660, "height": 130, "zIndex": 1 }

PAINÉIS DE FUNDO (Z-Index 2 a 3):
- Trio de painéis (tendência número 1):
  * Painel Romano Arqueado à esquerda: { "shapeType": "panel-arch", "x": 230, "y": 170, "width": 180, "height": 360, "zIndex": 2 }
  * Painel Redondo ao centro: { "shapeType": "panel-round", "x": 410, "y": 150, "width": 320, "height": 320, "zIndex": 3 }
  * Painel Romano à direita (ou painel retangular): { "shapeType": "panel-arch", "x": 630, "y": 220, "width": 170, "height": 340, "zIndex": 2 }

MÓVEIS (Z-Index 4 a 7):
- Mesa Central:
  * Mesa de Babado plissada (moderna): { "shapeType": "table-ruffle", "x": 375, "y": 440, "width": 250, "height": 145, "zIndex": 6 }
  * OU Mesa com toalha clássica: { "shapeType": "table-cloth", "x": 375, "y": 420, "width": 250, "height": 145, "zIndex": 6 }
- Trio de Cilindros (Capas sublimadas ou lisas):
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

CORES E HARMONIZAÇÃO:
- Use sempre cores hexadecimais ricas e sofisticadas (ex: terracota #C86D51, verde oliva #586949, rosa blush #E8B4B8, azul petróleo #1E3F52, dourado suave #D4AF37, areia #EFEBE0).
- Para balões, preencha 'fill' (cor principal), 'balloonSecondaryFill' (segunda cor do arco) e 'balloonTertiaryFill' (terceira cor/destaque metálico ou perolizado).
- Acabamento dos balões ('balloonFinish'): 'pearl', 'chrome' ou 'matte'.

ARTES OFICIAIS EXISTENTES:
Se a festa solicitada corresponder a um dos seguintes temas oficiais conhecidos, você pode reutilizar os caminhos das artes sublimadas reais:
- Temas: 'mickey-disney', '3-palavrinhas', 'astronauta-espaco', 'fundo-do-mar', 'sereia', 'a-bela-e-a-fera', 'branca-de-neve', 'cinderela', 'enrolados-rapunzel', 'safari-baby', 'fazendinha', 'dino-baby', 'circo-rosa', 'circo-tradicional', 'bolofofos', 'patrulha-canina', 'homem-aranha', 'herois-vingadores', 'barbie', 'frozen', 'jardim-encantado'.
Para esses temas, você pode colocar:
  painel redondo: fillImageSrc: "/templates-art/{tema}/redondo.png", fillMode: "cover"
  painel romano: fillImageSrc: "/templates-art/{tema}/lateral.png", fillMode: "cover"
  cilindro G: fillImageSrc: "/templates-art/{tema}/cilindro_g.png", fillMode: "cover"
  cilindro M: fillImageSrc: "/templates-art/{tema}/cilindro_m.png", fillMode: "cover"
  cilindro P: fillImageSrc: "/templates-art/{tema}/cilindro_p.png", fillMode: "cover"

Para qualquer outro tema novo ou personalizado (ex: anos 80, ovelhinha, casamento rústico, boteco, borboletas), use cores lisas e paletas sofisticadas em 'fill' e 'stroke' sem fillImageSrc.

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
    const sanitizedElements: CanvasElement[] = rawElements.map((el, index) => {
      const shapeType = VALID_SHAPES.includes(el.shapeType) ? el.shapeType : 'panel-arch';
      const finish: 'matte' | 'chrome' | 'pearl' = ['matte', 'chrome', 'pearl'].includes(el.balloonFinish as string)
        ? (el.balloonFinish as 'matte' | 'chrome' | 'pearl')
        : 'pearl';

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
        fill: el.fill || '#FFFFFF',
        stroke: el.stroke || '#D4D4D8',
        opacity: typeof el.opacity === 'number' ? el.opacity : 1,
        fillImageSrc: el.fillImageSrc || undefined,
        fillMode: el.fillMode || 'cover',
        balloonSecondaryFill: el.balloonSecondaryFill || undefined,
        balloonTertiaryFill: el.balloonTertiaryFill || undefined,
        balloonFinish: finish,
        topFill: el.topFill || undefined,
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
