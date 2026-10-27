import { CanvasElement, EnvironmentConfig, DEFAULT_ENVIRONMENT } from './builder-elements';

export interface FestaTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  /** Gradient for the preview card (Tailwind gradient classes) */
  previewColor: string;
  /** Emoji icon shown in the preview card */
  icon: string;
  elements: CanvasElement[];
  environment: EnvironmentConfig;
}

export const FESTA_TEMPLATES: FestaTemplate[] = [
  // Mickey Mouse & Amigos
  {
    id: 'mickey-disney',
    name: 'Mickey Mouse & Amigos',
    description: 'Cenário clássico da Disney com painéis e trio de cilindros',
    category: 'Infantil',
    tags: ["mickey", "disney", "infantil"],
    icon: '🐭',
    previewColor: 'from-red-300 via-amber-200 to-zinc-900',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'mck-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Mickey Mouse & Amigos)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#E53935', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/mickey-disney/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'mck-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Mickey Mouse & Amigos)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#FFD600', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/mickey-disney/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'mck-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Mickey Mouse & Amigos)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/mickey-disney/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'mck-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Mickey Mouse & Amigos)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#FFFFFF', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'mck-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Mickey Mouse & Amigos)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/mickey-disney/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'mck-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Mickey Mouse & Amigos)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/mickey-disney/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'mck-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Mickey Mouse & Amigos)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#E53935', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#FFD600',
        balloonTertiaryFill: '#212121',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'mck-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Mickey Mouse & Amigos)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#E53935', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // 3 Palavrinhas (Deus é Amor)
  {
    id: '3-palavrinhas',
    name: '3 Palavrinhas (Deus é Amor)',
    description: 'Decoração gospel infantil alegre com mensagens bíblicas',
    category: 'Infantil',
    tags: ["3 palavrinhas", "gospel", "infantil"],
    icon: '🕊️',
    previewColor: 'from-sky-200 via-amber-100 to-rose-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'tpv-lat-1', elementId: 'panel-arch', name: 'Painel Romano (3 Palavrinhas (Deus é Amor))', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#03A9F4', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/3-palavrinhas/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'tpv-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (3 Palavrinhas (Deus é Amor))', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#FFEB3B', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/3-palavrinhas/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'tpv-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (3 Palavrinhas (Deus é Amor))', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/3-palavrinhas/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'tpv-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (3 Palavrinhas (Deus é Amor))', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#FFFFFF', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'tpv-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (3 Palavrinhas (Deus é Amor))', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/3-palavrinhas/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'tpv-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (3 Palavrinhas (Deus é Amor))', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/3-palavrinhas/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'tpv-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (3 Palavrinhas (Deus é Amor))', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#03A9F4', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#FFEB3B',
        balloonTertiaryFill: '#F44336',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'tpv-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (3 Palavrinhas (Deus é Amor))', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#03A9F4', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Astronauta & Galáxia
  {
    id: 'astronauta-espaco',
    name: 'Astronauta & Galáxia',
    description: 'Viagem espacial com estrelas, planetas e foguetes',
    category: 'Infantil',
    tags: ["astronauta", "gal\u00e1xia", "espa\u00e7o"],
    icon: '🚀',
    previewColor: 'from-indigo-300 via-blue-200 to-slate-900',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'ast-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Astronauta & Galáxia)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#0D47A1', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/astronauta-espaco/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'ast-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Astronauta & Galáxia)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#FF6F00', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/astronauta-espaco/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'ast-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Astronauta & Galáxia)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/astronauta-espaco/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'ast-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Astronauta & Galáxia)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#1A237E', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'ast-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Astronauta & Galáxia)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/astronauta-espaco/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'ast-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Astronauta & Galáxia)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/astronauta-espaco/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'ast-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Astronauta & Galáxia)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#0D47A1', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#FF6F00',
        balloonTertiaryFill: '#B0BEC5',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'ast-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Astronauta & Galáxia)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#0D47A1', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Fundo do Mar
  {
    id: 'fundo-do-mar',
    name: 'Fundo do Mar',
    description: 'Aventura submarina com peixinhos, corais e águas límpidas',
    category: 'Infantil',
    tags: ["fundo do mar", "mar", "peixes"],
    icon: '🐠',
    previewColor: 'from-teal-200 via-cyan-100 to-sky-300',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'fdm-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Fundo do Mar)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#00ACC1', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fundo-do-mar/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'fdm-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Fundo do Mar)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#4DD0E1', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fundo-do-mar/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'fdm-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Fundo do Mar)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fundo-do-mar/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'fdm-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Fundo do Mar)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#26C6DA', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'fdm-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Fundo do Mar)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fundo-do-mar/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'fdm-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Fundo do Mar)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fundo-do-mar/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'fdm-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Fundo do Mar)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#00ACC1', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#4DD0E1',
        balloonTertiaryFill: '#80CBC4',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'fdm-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Fundo do Mar)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#00ACC1', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Sereia Encantada
  {
    id: 'sereia',
    name: 'Sereia Encantada',
    description: 'Reino encantado das sereias em tons lilás e holográficos',
    category: 'Infantil',
    tags: ["sereia", "mar", "menina"],
    icon: '🧜‍♀️',
    previewColor: 'from-purple-200 via-teal-100 to-pink-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'ser-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Sereia Encantada)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#9C27B0', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/sereia/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'ser-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Sereia Encantada)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#00BCD4', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/sereia/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'ser-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Sereia Encantada)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/sereia/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'ser-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Sereia Encantada)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#BA68C8', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'ser-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Sereia Encantada)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/sereia/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'ser-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Sereia Encantada)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/sereia/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'ser-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Sereia Encantada)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#9C27B0', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#00BCD4',
        balloonTertiaryFill: '#E1BEE7',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'ser-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Sereia Encantada)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#9C27B0', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // A Bela e a Fera
  {
    id: 'a-bela-e-a-fera',
    name: 'A Bela e a Fera',
    description: 'Conto de fadas clássico em dourado nobre e azul real',
    category: 'Princesas',
    tags: ["princesas", "bela e a fera", "disney"],
    icon: '🌹',
    previewColor: 'from-amber-200 via-yellow-100 to-blue-900',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'bef-lat-1', elementId: 'panel-arch', name: 'Painel Romano (A Bela e a Fera)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#FBC02D', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/a-bela-e-a-fera/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'bef-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (A Bela e a Fera)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#1565C0', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/a-bela-e-a-fera/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'bef-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (A Bela e a Fera)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/a-bela-e-a-fera/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'bef-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (A Bela e a Fera)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#FBC02D', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'bef-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (A Bela e a Fera)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/a-bela-e-a-fera/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'bef-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (A Bela e a Fera)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/a-bela-e-a-fera/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'bef-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (A Bela e a Fera)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#FBC02D', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#1565C0',
        balloonTertiaryFill: '#C62828',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'bef-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (A Bela e a Fera)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#FBC02D', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Branca de Neve
  {
    id: 'branca-de-neve',
    name: 'Branca de Neve',
    description: 'Floresta mágica com maçã e cores primárias encantadoras',
    category: 'Princesas',
    tags: ["branca de neve", "princesas"],
    icon: '🍎',
    previewColor: 'from-blue-200 via-yellow-100 to-red-300',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'bdn-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Branca de Neve)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#1976D2', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/branca-de-neve/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'bdn-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Branca de Neve)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#FDD835', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/branca-de-neve/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'bdn-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Branca de Neve)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/branca-de-neve/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'bdn-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Branca de Neve)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#1976D2', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'bdn-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Branca de Neve)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/branca-de-neve/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'bdn-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Branca de Neve)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/branca-de-neve/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'bdn-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Branca de Neve)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#1976D2', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#FDD835',
        balloonTertiaryFill: '#D32F2F',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'bdn-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Branca de Neve)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#1976D2', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Cinderela Real
  {
    id: 'cinderela',
    name: 'Cinderela Real',
    description: 'Baile real encantado em azul celeste e detalhes dourados',
    category: 'Princesas',
    tags: ["cinderela", "princesas"],
    icon: '👑',
    previewColor: 'from-sky-200 via-blue-100 to-amber-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'cin-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Cinderela Real)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#42A5F5', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/cinderela/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'cin-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Cinderela Real)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#BBDEFB', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/cinderela/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'cin-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Cinderela Real)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/cinderela/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'cin-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Cinderela Real)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#64B5F6', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'cin-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Cinderela Real)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/cinderela/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'cin-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Cinderela Real)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/cinderela/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'cin-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Cinderela Real)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#42A5F5', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#BBDEFB',
        balloonTertiaryFill: '#FFD54F',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'cin-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Cinderela Real)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#42A5F5', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Enrolados (Rapunzel)
  {
    id: 'enrolados-rapunzel',
    name: 'Enrolados (Rapunzel)',
    description: 'Festival de lanternas flutuantes com flores e torre',
    category: 'Princesas',
    tags: ["enrolados", "rapunzel", "princesas"],
    icon: '☀️',
    previewColor: 'from-purple-200 via-amber-100 to-pink-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'enr-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Enrolados (Rapunzel))', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#8E24AA', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/enrolados-rapunzel/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'enr-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Enrolados (Rapunzel))', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#FDD835', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/enrolados-rapunzel/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'enr-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Enrolados (Rapunzel))', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/enrolados-rapunzel/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'enr-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Enrolados (Rapunzel))', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#AB47BC', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'enr-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Enrolados (Rapunzel))', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/enrolados-rapunzel/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'enr-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Enrolados (Rapunzel))', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/enrolados-rapunzel/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'enr-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Enrolados (Rapunzel))', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#8E24AA', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#FDD835',
        balloonTertiaryFill: '#CE93D8',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'enr-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Enrolados (Rapunzel))', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#8E24AA', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Safari Baby
  {
    id: 'safari-baby',
    name: 'Safari Baby',
    description: 'Bichinhos da selva fofos em tons terrosos e verde sálvia',
    category: 'Infantil',
    tags: ["safari", "animais", "baby"],
    icon: '🦁',
    previewColor: 'from-amber-100 via-emerald-100 to-orange-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'sfb-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Safari Baby)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#8D6E63', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/safari-baby/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'sfb-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Safari Baby)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#81C784', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/safari-baby/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'sfb-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Safari Baby)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/safari-baby/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'sfb-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Safari Baby)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#FFFFFF', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'sfb-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Safari Baby)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/safari-baby/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'sfb-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Safari Baby)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/safari-baby/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'sfb-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Safari Baby)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#8D6E63', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#81C784',
        balloonTertiaryFill: '#FFB74D',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'sfb-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Safari Baby)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#8D6E63', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Fazendinha Feliz
  {
    id: 'fazendinha',
    name: 'Fazendinha Feliz',
    description: 'Vaquinha, celeiro e animais da fazenda cheios de alegria',
    category: 'Infantil',
    tags: ["fazendinha", "animais", "campo"],
    icon: '🐮',
    previewColor: 'from-amber-200 via-red-100 to-emerald-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'fzd-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Fazendinha Feliz)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#E65100', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fazendinha/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'fzd-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Fazendinha Feliz)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#43A047', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fazendinha/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'fzd-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Fazendinha Feliz)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fazendinha/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'fzd-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Fazendinha Feliz)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#E65100', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'fzd-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Fazendinha Feliz)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fazendinha/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'fzd-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Fazendinha Feliz)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/fazendinha/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'fzd-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Fazendinha Feliz)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#E65100', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#43A047',
        balloonTertiaryFill: '#FFE082',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'fzd-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Fazendinha Feliz)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#E65100', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Dino Baby
  {
    id: 'dino-baby',
    name: 'Dino Baby',
    description: 'Dinossauros bebês simpáticos em verde e tons naturais',
    category: 'Infantil',
    tags: ["dino", "dinossauro", "baby"],
    icon: '🦕',
    previewColor: 'from-emerald-200 via-teal-100 to-amber-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'dnb-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Dino Baby)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#388E3C', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/dino-baby/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'dnb-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Dino Baby)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#81C784', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/dino-baby/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'dnb-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Dino Baby)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/dino-baby/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'dnb-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Dino Baby)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#4CAF50', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'dnb-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Dino Baby)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/dino-baby/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'dnb-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Dino Baby)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/dino-baby/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'dnb-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Dino Baby)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#388E3C', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#81C784',
        balloonTertiaryFill: '#FFCC80',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'dnb-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Dino Baby)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#388E3C', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Circo Rosa
  {
    id: 'circo-rosa',
    name: 'Circo Rosa',
    description: 'Espetáculo circense delicado em tons pastel rosa e menta',
    category: 'Infantil',
    tags: ["circo", "rosa", "menina"],
    icon: '🎪',
    previewColor: 'from-pink-200 via-rose-100 to-teal-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'ccr-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Circo Rosa)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#EC407A', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-rosa/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'ccr-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Circo Rosa)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#80CBC4', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-rosa/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'ccr-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Circo Rosa)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-rosa/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'ccr-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Circo Rosa)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#F48FB1', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'ccr-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Circo Rosa)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-rosa/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'ccr-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Circo Rosa)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-rosa/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'ccr-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Circo Rosa)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#EC407A', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#80CBC4',
        balloonTertiaryFill: '#FFF59D',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'ccr-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Circo Rosa)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#EC407A', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Circo Tradicional
  {
    id: 'circo-tradicional',
    name: 'Circo Tradicional',
    description: 'Grande picadeiro com cores clássicas vibrantes e palhaços',
    category: 'Infantil',
    tags: ["circo", "palha\u00e7o", "festa"],
    icon: '🎪',
    previewColor: 'from-red-200 via-yellow-100 to-blue-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'crc-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Circo Tradicional)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#E53935', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-tradicional/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'crc-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Circo Tradicional)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#1E88E5', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-tradicional/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'crc-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Circo Tradicional)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-tradicional/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'crc-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Circo Tradicional)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#E53935', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'crc-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Circo Tradicional)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-tradicional/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'crc-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Circo Tradicional)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/circo-tradicional/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'crc-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Circo Tradicional)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#E53935', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#1E88E5',
        balloonTertiaryFill: '#FDD835',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'crc-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Circo Tradicional)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#E53935', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Bolofofos
  {
    id: 'bolofofos',
    name: 'Bolofofos',
    description: 'Turma do Funk do Pão de Queijo em festa super animada',
    category: 'Infantil',
    tags: ["bolofofos", "m\u00fasica", "infantil"],
    icon: '🎶',
    previewColor: 'from-purple-200 via-cyan-100 to-pink-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'blf-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Bolofofos)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#7E57C2', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/bolofofos/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'blf-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Bolofofos)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#26C6DA', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/bolofofos/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'blf-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Bolofofos)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/bolofofos/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'blf-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Bolofofos)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#7E57C2', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'blf-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Bolofofos)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/bolofofos/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'blf-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Bolofofos)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/bolofofos/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'blf-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Bolofofos)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#7E57C2', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#26C6DA',
        balloonTertiaryFill: '#FF4081',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'blf-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Bolofofos)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#7E57C2', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Patrulha Canina
  {
    id: 'patrulha-canina',
    name: 'Patrulha Canina',
    description: 'Prontos para o resgate com Chase, Marshall e Skye',
    category: 'Infantil',
    tags: ["patrulha canina", "cachorrinhos"],
    icon: '🐶',
    previewColor: 'from-blue-200 via-red-100 to-yellow-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'ptc-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Patrulha Canina)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#1976D2', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/patrulha-canina/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'ptc-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Patrulha Canina)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#D32F2F', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/patrulha-canina/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'ptc-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Patrulha Canina)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/patrulha-canina/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'ptc-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Patrulha Canina)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#1E88E5', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'ptc-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Patrulha Canina)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/patrulha-canina/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'ptc-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Patrulha Canina)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/patrulha-canina/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'ptc-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Patrulha Canina)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#1976D2', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#D32F2F',
        balloonTertiaryFill: '#FBC02D',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'ptc-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Patrulha Canina)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#1976D2', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Homem Aranha
  {
    id: 'homem-aranha',
    name: 'Homem Aranha',
    description: 'Ação pelos arranha-céus com teias e cores do herói',
    category: 'Heróis',
    tags: ["homem aranha", "spider-man", "her\u00f3is"],
    icon: '🕷️',
    previewColor: 'from-red-300 via-blue-200 to-zinc-900',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'hma-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Homem Aranha)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#C62828', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/homem-aranha/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'hma-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Homem Aranha)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#1565C0', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/homem-aranha/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'hma-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Homem Aranha)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/homem-aranha/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'hma-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Homem Aranha)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#C62828', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'hma-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Homem Aranha)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/homem-aranha/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'hma-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Homem Aranha)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/homem-aranha/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'hma-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Homem Aranha)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#C62828', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#1565C0',
        balloonTertiaryFill: '#212121',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'hma-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Homem Aranha)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#C62828', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Vingadores & Heróis
  {
    id: 'herois-vingadores',
    name: 'Vingadores & Heróis',
    description: 'Super-heróis reunidos em cenário épico e triunfante',
    category: 'Heróis',
    tags: ["vingadores", "her\u00f3is", "marvel"],
    icon: '⚡',
    previewColor: 'from-blue-300 via-red-200 to-amber-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'vng-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Vingadores & Heróis)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#1565C0', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/herois-vingadores/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'vng-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Vingadores & Heróis)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#B71C1C', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/herois-vingadores/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'vng-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Vingadores & Heróis)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/herois-vingadores/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'vng-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Vingadores & Heróis)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#1565C0', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'vng-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Vingadores & Heróis)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/herois-vingadores/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'vng-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Vingadores & Heróis)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/herois-vingadores/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'vng-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Vingadores & Heróis)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#1565C0', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#B71C1C',
        balloonTertiaryFill: '#FFD600',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'vng-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Vingadores & Heróis)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#1565C0', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Barbie Fashion
  {
    id: 'barbie',
    name: 'Barbie Fashion',
    description: 'O universo fashionista cor-de-rosa mais famoso do mundo',
    category: 'Infantil',
    tags: ["barbie", "fashion", "rosa"],
    icon: '💖',
    previewColor: 'from-pink-300 via-rose-200 to-fuchsia-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'brb-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Barbie Fashion)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#D81B60', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/barbie/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'brb-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Barbie Fashion)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#F48FB1', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/barbie/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'brb-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Barbie Fashion)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/barbie/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'brb-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Barbie Fashion)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#E91E63', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'brb-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Barbie Fashion)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/barbie/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'brb-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Barbie Fashion)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/barbie/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'brb-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Barbie Fashion)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#D81B60', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#F48FB1',
        balloonTertiaryFill: '#FFFFFF',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'brb-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Barbie Fashion)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#D81B60', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Frozen Aventuras Congelantes
  {
    id: 'frozen',
    name: 'Frozen Aventuras Congelantes',
    description: 'Castelo de gelo de Elsa e Anna com flocos cristalinos',
    category: 'Princesas',
    tags: ["frozen", "elsa", "princesas"],
    icon: '❄️',
    previewColor: 'from-cyan-200 via-sky-100 to-blue-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'frz-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Frozen Aventuras Congelantes)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#0288D1', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/frozen/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'frz-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Frozen Aventuras Congelantes)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#B3E5FC', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/frozen/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'frz-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Frozen Aventuras Congelantes)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/frozen/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'frz-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Frozen Aventuras Congelantes)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#4FC3F7', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'frz-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Frozen Aventuras Congelantes)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/frozen/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'frz-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Frozen Aventuras Congelantes)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/frozen/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'frz-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Frozen Aventuras Congelantes)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#0288D1', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#B3E5FC',
        balloonTertiaryFill: '#EDE7F6',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'frz-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Frozen Aventuras Congelantes)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#0288D1', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },
  // Jardim Encantado
  {
    id: 'jardim-encantado',
    name: 'Jardim Encantado',
    description: 'Arranjos florais, borboletas e natureza com elegância',
    category: 'Infantil',
    tags: ["jardim", "flores", "borboletas"],
    icon: '🌸',
    previewColor: 'from-pink-100 via-emerald-100 to-purple-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#EDE8E1' },
    elements: [
      // 1. Painel Lateral Romano (Esquerda)
      {
        id: 'jrd-lat-1', elementId: 'panel-arch', name: 'Painel Romano (Jardim Encantado)', shapeType: 'panel-arch',
        x: 270, y: 170, width: 175, height: 350, rotation: 0, zIndex: 1,
        fill: '#BA68C8', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/jardim-encantado/lateral.png', fillMode: 'cover',
      },
      // 2. Painel Redondo Sublimado (Centro)
      {
        id: 'jrd-round-1', elementId: 'panel-round', name: 'Painel Redondo Sublimado (Jardim Encantado)', shapeType: 'panel-round',
        x: 410, y: 150, width: 320, height: 320, rotation: 0, zIndex: 2,
        fill: '#81C784', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/jardim-encantado/redondo.png', fillMode: 'cover',
      },
      // 3. Cilindro Alto G (Esquerda)
      {
        id: 'jrd-cyl-g', elementId: 'cylinder-high', name: 'Cilindro Alto G (Jardim Encantado)', shapeType: 'cylinder-high',
        x: 235, y: 420, width: 105, height: 190, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/jardim-encantado/cilindro_g.png', fillMode: 'cover',
      },
      // 4. Mesa de Babado Central
      {
        id: 'jrd-table-1', elementId: 'table-ruffle', name: 'Mesa de Babado (Jardim Encantado)', shapeType: 'table-ruffle',
        x: 375, y: 450, width: 250, height: 140, rotation: 0, zIndex: 6,
        fill: '#CE93D8', stroke: '#D1C6BA', opacity: 1,
      },
      // 5. Cilindro Médio M (Direita)
      {
        id: 'jrd-cyl-m', elementId: 'cylinder-mid', name: 'Cilindro Médio M (Jardim Encantado)', shapeType: 'cylinder-mid',
        x: 645, y: 445, width: 100, height: 165, rotation: 0, zIndex: 4,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/jardim-encantado/cilindro_m.png', fillMode: 'cover',
      },
      // 6. Cilindro Baixo P (Direita Frontal)
      {
        id: 'jrd-cyl-p', elementId: 'cylinder-low', name: 'Cilindro Baixo P (Jardim Encantado)', shapeType: 'cylinder-low',
        x: 735, y: 485, width: 95, height: 125, rotation: 0, zIndex: 5,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
        fillImageSrc: '/templates-art/jardim-encantado/cilindro_p.png', fillMode: 'cover',
      },
      // 7. Arco de Balões Orgânicos
      {
        id: 'jrd-balloon-1', elementId: 'balloon-arch-l', name: 'Arco de Balões Orgânicos (Jardim Encantado)', shapeType: 'balloon-arch-l',
        x: 210, y: 110, width: 370, height: 310, rotation: -4, zIndex: 8,
        fill: '#BA68C8', stroke: '#E0E0E0', opacity: 1,
        balloonSecondaryFill: '#81C784',
        balloonTertiaryFill: '#F48FB1',
        balloonFinish: 'pearl',
      },
      // 8. Bolo Cenográfico
      {
        id: 'jrd-cake-1', elementId: 'cake-tiered', name: 'Bolo Cenográfico (Jardim Encantado)', shapeType: 'cake-tiered',
        x: 460, y: 385, width: 80, height: 95, rotation: 0, zIndex: 7,
        fill: '#BA68C8', stroke: '#D1C6BA', opacity: 1,
      },
    ],
  },

  // Templates Adicionais Neutros / Casamento / Adulto
  {
    id: 'casamento-elegante',
    name: 'Casamento Elegante',
    description: 'Elegante em branco e dourado com tapete nupcial e arranjo floral',
    category: 'Casamento',
    tags: ['casamento', 'branco', 'dourado', 'elegante'],
    icon: '💍',
    previewColor: 'from-amber-50 via-yellow-50 to-zinc-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAF9F6', floorColor: '#F5F5F5' },
    elements: [
      {
        id: 'cas-arch-1', elementId: 'panel-arch', name: 'Painel Central', shapeType: 'panel-arch',
        x: 390, y: 160, width: 220, height: 410, rotation: 0, zIndex: 1,
        fill: '#FAF9F6', stroke: '#E5E4E2', opacity: 1,
      },
      {
        id: 'cas-rect-1', elementId: 'panel-rect', name: 'Painel Lateral Esq.', shapeType: 'panel-rect',
        x: 240, y: 230, width: 160, height: 320, rotation: 0, zIndex: 1,
        fill: '#FAF9F6', stroke: '#E5E4E2', opacity: 1,
      },
      {
        id: 'cas-rect-2', elementId: 'panel-rect', name: 'Painel Lateral Dir.', shapeType: 'panel-rect',
        x: 600, y: 230, width: 160, height: 320, rotation: 0, zIndex: 1,
        fill: '#FAF9F6', stroke: '#E5E4E2', opacity: 1,
      },
      {
        id: 'cas-table-1', elementId: 'table-rect', name: 'Mesa Principal', shapeType: 'table-rect',
        x: 290, y: 490, width: 420, height: 110, rotation: 0, zIndex: 2,
        fill: '#FAF9F6', stroke: '#E5E4E2', opacity: 1,
      },
      {
        id: 'cas-rug-1', elementId: 'rug-oval', name: 'Tapete Nupcial', shapeType: 'rug-oval',
        x: 260, y: 560, width: 480, height: 80, rotation: 0, zIndex: 0,
        fill: '#F5E6D3', stroke: '#D4C0A8', opacity: 1,
      },
    ],
  },
];
