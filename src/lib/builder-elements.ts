export type ElementCategory = 
  | 'paineis' 
  | 'mesas' 
  | 'cilindros' 
  | 'acrilicos' 
  | 'baloes' 
  | 'tapetes' 
  | 'extras';

export type ShapeType = 
  | 'panel-rect'
  | 'panel-arch'
  | 'panel-wavy'
  | 'panel-round'
  | 'table-rect'
  | 'table-cloth'
  | 'table-round'
  | 'cylinder-low'
  | 'cylinder-mid'
  | 'cylinder-high'
  | 'acrylic-cylinder'
  | 'acrylic-table'
  | 'balloon-small'
  | 'balloon-mid'
  | 'balloon-arch'
  | 'rug-rect'
  | 'rug-oval'
  | 'box'
  | 'pedestal'
  | 'text'
  | 'custom-image';

export type CustomItemCategory = 
  | 'Painel' 
  | 'Mesa' 
  | 'Cilindro' 
  | 'Acrílico' 
  | 'Balão' 
  | 'Personagem' 
  | 'Extra';

export const CUSTOM_CATEGORIES: CustomItemCategory[] = [
  'Painel',
  'Mesa',
  'Cilindro',
  'Acrílico',
  'Balão',
  'Personagem',
  'Extra',
];

export interface CustomUploadItem {
  id: string;
  name: string;
  dataUrl: string;
  category?: CustomItemCategory;
  width?: number;
  height?: number;
  createdAt?: number;
}

export interface LibraryElement {
  id: string;
  name: string;
  category: ElementCategory;
  shapeType: ShapeType;
  defaultWidth: number;
  defaultHeight: number;
  defaultFill: string;
  defaultStroke?: string;
  defaultOpacity?: number;
  description?: string;
}

export interface CanvasElement {
  id: string;
  elementId: string;
  name: string;
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  fill: string;
  stroke?: string;
  opacity: number;
  locked?: boolean;
  imageUrl?: string;
  // Propriedades para elemento de Texto
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  align?: 'left' | 'center' | 'right';
}

export interface EnvironmentConfig {
  wallColor: string;
  floorColor: string;
  floorY: number; // default 560
  roomWidthCm: number; // default 500 cm
  roomHeightCm: number; // default 375 cm
  backgroundImage?: string | null;
}

export const DEFAULT_ENVIRONMENT: EnvironmentConfig = {
  wallColor: '#FAF9F6',
  floorColor: '#ECE7DE',
  floorY: 560,
  roomWidthCm: 500,
  roomHeightCm: 375,
  backgroundImage: null,
};

export const WALL_OPTIONS = [
  { id: 'white', name: 'Branco Neve', value: '#FAF9F6' },
  { id: 'beige', name: 'Bege Suave', value: '#F3EFE6' },
  { id: 'gray', name: 'Cinza Claro', value: '#ECECEC' },
];

export const FLOOR_OPTIONS = [
  { id: 'white-marble', name: 'Branco / Claro', value: '#ECE7DE' },
  { id: 'beige-stone', name: 'Bege / Arenito', value: '#DFD8CA' },
  { id: 'light-wood', name: 'Madeira Clara', value: '#D8C4AC' },
];

// Escala lógica: 1 cm = 2 px (Canvas 1000x750 = Ambiente 500x375 cm)
export const SCALE = {
  PX_PER_CM: 2,
  pxToCm: (px: number) => Math.round(px / 2),
  cmToPx: (cm: number) => Math.round(cm * 2),
};

export const CATEGORIES: { id: ElementCategory; name: string }[] = [
  { id: 'paineis', name: 'Painéis' },
  { id: 'mesas', name: 'Mesas' },
  { id: 'cilindros', name: 'Cilindros' },
  { id: 'acrilicos', name: 'Acrílicos' },
  { id: 'baloes', name: 'Balões' },
  { id: 'tapetes', name: 'Tapetes' },
  { id: 'extras', name: 'Extras' },
];

export const COLOR_PALETTE = [
  { name: 'Linho / Off-White', value: '#F5F3EF' },
  { name: 'Nude / Areia', value: '#E7DFD5' },
  { name: 'Terracota Suave', value: '#C97A63' },
  { name: 'Rose Gold / Blush', value: '#E2B1B6' },
  { name: 'Azul Serenity', value: '#A0B6C7' },
  { name: 'Verde Oliva Claro', value: '#8E987B' },
  { name: 'Dourado Suave', value: '#D4AF37' },
  { name: 'Acrílico Translúcido', value: '#E0E8F0' },
  { name: 'Grafite Moderno', value: '#363636' },
  { name: 'Laranja FestaLab', value: '#EA580C' },
];

export const ELEMENT_LIBRARY: LibraryElement[] = [
  // Painéis
  {
    id: 'panel-arch',
    name: 'Painel Arqueado',
    category: 'paineis',
    shapeType: 'panel-arch',
    defaultWidth: 160,
    defaultHeight: 340,
    defaultFill: '#E7DFD5',
    defaultStroke: '#D1C6BA',
  },
  {
    id: 'panel-rect',
    name: 'Painel Retangular',
    category: 'paineis',
    shapeType: 'panel-rect',
    defaultWidth: 180,
    defaultHeight: 340,
    defaultFill: '#F5F3EF',
    defaultStroke: '#DDD7CE',
  },
  {
    id: 'panel-round',
    name: 'Painel Redondo',
    category: 'paineis',
    shapeType: 'panel-round',
    defaultWidth: 260,
    defaultHeight: 320,
    defaultFill: '#C97A63',
    defaultStroke: '#B56852',
  },
  {
    id: 'panel-wavy',
    name: 'Painel Ondulado',
    category: 'paineis',
    shapeType: 'panel-wavy',
    defaultWidth: 160,
    defaultHeight: 340,
    defaultFill: '#E2B1B6',
    defaultStroke: '#CCA0A5',
  },

  // Mesas
  {
    id: 'table-rect',
    name: 'Mesa Retangular',
    category: 'mesas',
    shapeType: 'table-rect',
    defaultWidth: 280,
    defaultHeight: 140,
    defaultFill: '#F5F3EF',
    defaultStroke: '#D1C6BA',
  },
  {
    id: 'table-cloth',
    name: 'Mesa com Toalha',
    category: 'mesas',
    shapeType: 'table-cloth',
    defaultWidth: 260,
    defaultHeight: 150,
    defaultFill: '#E7DFD5',
    defaultStroke: '#CBBFA9',
  },
  {
    id: 'table-round',
    name: 'Mesa Redonda',
    category: 'mesas',
    shapeType: 'table-round',
    defaultWidth: 180,
    defaultHeight: 140,
    defaultFill: '#D5C7B7',
    defaultStroke: '#BFAFA0',
  },

  // Cilindros
  {
    id: 'cylinder-high',
    name: 'Cilindro Alto',
    category: 'cilindros',
    shapeType: 'cylinder-high',
    defaultWidth: 100,
    defaultHeight: 200,
    defaultFill: '#F5F3EF',
    defaultStroke: '#DDD7CE',
  },
  {
    id: 'cylinder-mid',
    name: 'Cilindro Médio',
    category: 'cilindros',
    shapeType: 'cylinder-mid',
    defaultWidth: 110,
    defaultHeight: 160,
    defaultFill: '#E7DFD5',
    defaultStroke: '#D1C6BA',
  },
  {
    id: 'cylinder-low',
    name: 'Cilindro Baixo',
    category: 'cilindros',
    shapeType: 'cylinder-low',
    defaultWidth: 120,
    defaultHeight: 120,
    defaultFill: '#C97A63',
    defaultStroke: '#B56852',
  },

  // Acrílicos
  {
    id: 'acrylic-cylinder',
    name: 'Cilindro Acrílico',
    category: 'acrilicos',
    shapeType: 'acrylic-cylinder',
    defaultWidth: 100,
    defaultHeight: 180,
    defaultFill: '#DCE8F5',
    defaultStroke: '#B8D0EB',
    defaultOpacity: 0.55,
  },
  {
    id: 'acrylic-table',
    name: 'Mesa Acrílica',
    category: 'acrilicos',
    shapeType: 'acrylic-table',
    defaultWidth: 240,
    defaultHeight: 130,
    defaultFill: '#DCE8F5',
    defaultStroke: '#B8D0EB',
    defaultOpacity: 0.55,
  },

  // Balões
  {
    id: 'balloon-small',
    name: 'Cacho Pequeno',
    category: 'baloes',
    shapeType: 'balloon-small',
    defaultWidth: 140,
    defaultHeight: 140,
    defaultFill: '#E2B1B6',
    defaultStroke: '#CCA0A5',
  },
  {
    id: 'balloon-mid',
    name: 'Cacho Médio',
    category: 'baloes',
    shapeType: 'balloon-mid',
    defaultWidth: 200,
    defaultHeight: 220,
    defaultFill: '#C97A63',
    defaultStroke: '#B56852',
  },
  {
    id: 'balloon-arch',
    name: 'Arco Desconstruído',
    category: 'baloes',
    shapeType: 'balloon-arch',
    defaultWidth: 320,
    defaultHeight: 280,
    defaultFill: '#E7DFD5',
    defaultStroke: '#D1C6BA',
  },

  // Tapetes
  {
    id: 'rug-oval',
    name: 'Tapete Oval',
    category: 'tapetes',
    shapeType: 'rug-oval',
    defaultWidth: 380,
    defaultHeight: 90,
    defaultFill: '#E2DDD4',
    defaultStroke: '#C7C0B4',
  },
  {
    id: 'rug-rect',
    name: 'Tapete Retangular',
    category: 'tapetes',
    shapeType: 'rug-rect',
    defaultWidth: 400,
    defaultHeight: 100,
    defaultFill: '#E8E5DF',
    defaultStroke: '#D0CBC3',
  },

  // Extras
  {
    id: 'box',
    name: 'Caixa Decorativa',
    category: 'extras',
    shapeType: 'box',
    defaultWidth: 80,
    defaultHeight: 80,
    defaultFill: '#F5F3EF',
    defaultStroke: '#DDD7CE',
  },
  {
    id: 'pedestal',
    name: 'Suporte / Pedestal',
    category: 'extras',
    shapeType: 'pedestal',
    defaultWidth: 90,
    defaultHeight: 160,
    defaultFill: '#363636',
    defaultStroke: '#222222',
  },
  {
    id: 'element-text',
    name: 'Texto',
    category: 'extras',
    shapeType: 'text',
    defaultWidth: 260,
    defaultHeight: 60,
    defaultFill: '#363636',
  },
];
