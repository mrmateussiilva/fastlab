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
  // 1. Festa Infantil Classica
  {
    id: 'festa-infantil-classica',
    name: 'Festa Infantil',
    description: 'Composição alegre com balões coloridos e painel vibrante',
    category: 'Infantil',
    tags: ['infantil', 'colorido', 'balões'],
    icon: '🎈',
    previewColor: 'from-sky-200 via-pink-100 to-yellow-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FAFAFA', floorColor: '#F0F0F0' },
    elements: [
      {
        id: 'fi-arch-1', elementId: 'panel-arch', name: 'Painel Arqueado', shapeType: 'panel-arch',
        x: 340, y: 180, width: 190, height: 360, rotation: 0, zIndex: 1,
        fill: '#80C4E9', stroke: '#5AAAD4', opacity: 1,
      },
      {
        id: 'fi-round-1', elementId: 'panel-round', name: 'Painel Redondo', shapeType: 'panel-round',
        x: 500, y: 210, width: 240, height: 300, rotation: 0, zIndex: 2,
        fill: '#F4978E', stroke: '#D97F76', opacity: 1,
      },
      {
        id: 'fi-cyl-1', elementId: 'cylinder-mid', name: 'Cilindro Médio', shapeType: 'cylinder-mid',
        x: 370, y: 430, width: 100, height: 160, rotation: 0, zIndex: 3,
        fill: '#F8AD9D', stroke: '#D69688', opacity: 1,
      },
      {
        id: 'fi-cyl-2', elementId: 'cylinder-low', name: 'Cilindro Baixo', shapeType: 'cylinder-low',
        x: 480, y: 470, width: 100, height: 110, rotation: 0, zIndex: 4,
        fill: '#FEE08B', stroke: '#DFC47A', opacity: 1,
      },
      {
        id: 'fi-balloon-1', elementId: 'balloon-arch', name: 'Arco de Balões', shapeType: 'balloon-arch',
        x: 270, y: 120, width: 320, height: 260, rotation: -8, zIndex: 5,
        fill: '#FFDAB9', stroke: '#E5C4A5', opacity: 1,
        balloonSecondaryFill: '#A8D8EA', balloonTertiaryFill: '#AA96DA',
      },
      {
        id: 'fi-table-1', elementId: 'table-cloth', name: 'Mesa com Toalha', shapeType: 'table-cloth',
        x: 310, y: 530, width: 350, height: 130, rotation: 0, zIndex: 6,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
      },
    ],
  },

  // 2. Casamento Elegante
  {
    id: 'casamento-elegante',
    name: 'Casamento',
    description: 'Elegante em branco e dourado com tapete nupcial',
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
      {
        id: 'cas-cyl-1', elementId: 'cylinder-high', name: 'Pedestal Esq.', shapeType: 'cylinder-high',
        x: 300, y: 370, width: 80, height: 190, rotation: 0, zIndex: 3,
        fill: '#D4AF37', stroke: '#B89A2E', opacity: 1,
      },
      {
        id: 'cas-cyl-2', elementId: 'cylinder-high', name: 'Pedestal Dir.', shapeType: 'cylinder-high',
        x: 620, y: 370, width: 80, height: 190, rotation: 0, zIndex: 3,
        fill: '#D4AF37', stroke: '#B89A2E', opacity: 1,
      },
    ],
  },

  // 3. Cha de Bebe Rosa
  {
    id: 'cha-bebe-rosa',
    name: 'Chá de Bebê',
    description: 'Delicado em tons pastel de rosa e branco',
    category: 'Chá de Bebê',
    tags: ['chá de bebê', 'rosa', 'pastel', 'menina'],
    icon: '🍼',
    previewColor: 'from-pink-100 via-rose-50 to-pink-200',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FFF5F8', floorColor: '#FDEEF3' },
    elements: [
      {
        id: 'cb-round-1', elementId: 'panel-round', name: 'Painel Redondo', shapeType: 'panel-round',
        x: 390, y: 170, width: 280, height: 360, rotation: 0, zIndex: 1,
        fill: '#FFD1DC', stroke: '#E5BAC4', opacity: 1,
      },
      {
        id: 'cb-wavy-1', elementId: 'panel-wavy', name: 'Painel Ondulado', shapeType: 'panel-wavy',
        x: 250, y: 240, width: 150, height: 300, rotation: 0, zIndex: 1,
        fill: '#FFB6C1', stroke: '#E5A3AD', opacity: 1,
      },
      {
        id: 'cb-cyl-1', elementId: 'cylinder-mid', name: 'Cilindro Médio', shapeType: 'cylinder-mid',
        x: 370, y: 420, width: 100, height: 160, rotation: 0, zIndex: 3,
        fill: '#FFFFFF', stroke: '#E5E5E5', opacity: 1,
      },
      {
        id: 'cb-cyl-2', elementId: 'cylinder-low', name: 'Cilindro Baixo', shapeType: 'cylinder-low',
        x: 480, y: 460, width: 90, height: 110, rotation: 0, zIndex: 4,
        fill: '#FFB6C1', stroke: '#E5A3AD', opacity: 1,
      },
      {
        id: 'cb-balloon-1', elementId: 'balloon-cluster', name: 'Cacho Rosa', shapeType: 'balloon-cluster',
        x: 560, y: 270, width: 170, height: 170, rotation: 0, zIndex: 5,
        fill: '#FFD1DC', stroke: '#E5BAC4', opacity: 1,
        balloonSecondaryFill: '#FFFFFF', balloonFinish: 'pearl',
      },
      {
        id: 'cb-table-1', elementId: 'table-cloth', name: 'Mesa com Toalha', shapeType: 'table-cloth',
        x: 300, y: 530, width: 370, height: 120, rotation: 0, zIndex: 2,
        fill: '#FFF0F5', stroke: '#E5D0DA', opacity: 1,
      },
    ],
  },

  // 4. Festa Junina
  {
    id: 'festa-junina',
    name: 'Festa Junina',
    description: 'Cores vibrantes de bandeirinhas, vermelho, amarelo e verde',
    category: 'Temática',
    tags: ['junina', 'arraial', 'bandeirinhas', 'colorido'],
    icon: '🌽',
    previewColor: 'from-yellow-200 via-red-100 to-green-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FFFAEB', floorColor: '#F5EDD4' },
    elements: [
      {
        id: 'fj-rect-1', elementId: 'panel-rect', name: 'Painel Vermelho', shapeType: 'panel-rect',
        x: 220, y: 200, width: 200, height: 370, rotation: 0, zIndex: 1,
        fill: '#D32F2F', stroke: '#B71C1C', opacity: 1,
      },
      {
        id: 'fj-rect-2', elementId: 'panel-rect', name: 'Painel Amarelo', shapeType: 'panel-rect',
        x: 420, y: 200, width: 200, height: 370, rotation: 0, zIndex: 1,
        fill: '#F9A825', stroke: '#D4891E', opacity: 1,
      },
      {
        id: 'fj-rect-3', elementId: 'panel-rect', name: 'Painel Verde', shapeType: 'panel-rect',
        x: 620, y: 200, width: 180, height: 370, rotation: 0, zIndex: 1,
        fill: '#2E7D32', stroke: '#1B5E20', opacity: 1,
      },
      {
        id: 'fj-arch-1', elementId: 'balloon-arch-half', name: 'Guirlanda Superior', shapeType: 'balloon-arch-half',
        x: 190, y: 120, width: 640, height: 180, rotation: 0, zIndex: 5,
        fill: '#D32F2F', stroke: '#B71C1C', opacity: 1,
        balloonSecondaryFill: '#F9A825', balloonTertiaryFill: '#2E7D32',
      },
      {
        id: 'fj-table-1', elementId: 'table-cloth', name: 'Mesa de Barracão', shapeType: 'table-cloth',
        x: 250, y: 540, width: 500, height: 120, rotation: 0, zIndex: 2,
        fill: '#D32F2F', stroke: '#B71C1C', opacity: 1,
      },
      {
        id: 'fj-cyl-1', elementId: 'cylinder-mid', name: 'Tonel Decorativo', shapeType: 'cylinder-mid',
        x: 320, y: 420, width: 90, height: 150, rotation: 0, zIndex: 3,
        fill: '#795548', stroke: '#5D4037', opacity: 1,
      },
      {
        id: 'fj-cyl-2', elementId: 'cylinder-mid', name: 'Tonel 2', shapeType: 'cylinder-mid',
        x: 580, y: 420, width: 90, height: 150, rotation: 0, zIndex: 3,
        fill: '#795548', stroke: '#5D4037', opacity: 1,
      },
    ],
  },

  // 5. Safari / Selva
  {
    id: 'safari-selva',
    name: 'Safari & Selva',
    description: 'Verde selva, areia e tons terrosos com folhagens',
    category: 'Infantil',
    tags: ['safari', 'selva', 'verde', 'natureza', 'animais'],
    icon: '🦁',
    previewColor: 'from-green-200 via-lime-100 to-amber-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#F5F0E8', floorColor: '#E8DFC8' },
    elements: [
      {
        id: 'sf-arch-1', elementId: 'panel-arch', name: 'Painel Folhagem', shapeType: 'panel-arch',
        x: 340, y: 160, width: 200, height: 380, rotation: 0, zIndex: 1,
        fill: '#4CAF50', stroke: '#388E3C', opacity: 1,
      },
      {
        id: 'sf-round-1', elementId: 'panel-round', name: 'Painel Safari', shapeType: 'panel-round',
        x: 510, y: 200, width: 260, height: 320, rotation: 0, zIndex: 2,
        fill: '#C8A96E', stroke: '#A88C56', opacity: 1,
      },
      {
        id: 'sf-cyl-1', elementId: 'cylinder-high', name: 'Tronco Decorativo', shapeType: 'cylinder-high',
        x: 280, y: 360, width: 80, height: 200, rotation: 0, zIndex: 3,
        fill: '#795548', stroke: '#5D4037', opacity: 1,
      },
      {
        id: 'sf-cyl-2', elementId: 'cylinder-mid', name: 'Cilindro Palha', shapeType: 'cylinder-mid',
        x: 640, y: 400, width: 100, height: 160, rotation: 0, zIndex: 3,
        fill: '#D4A84B', stroke: '#B58E3A', opacity: 1,
      },
      {
        id: 'sf-cascade', elementId: 'balloon-cascade', name: 'Cascata Verde', shapeType: 'balloon-cascade',
        x: 220, y: 150, width: 140, height: 380, rotation: 5, zIndex: 4,
        fill: '#81C784', stroke: '#66BB6A', opacity: 1,
        balloonSecondaryFill: '#FFF176', balloonTertiaryFill: '#FFCC02',
      },
      {
        id: 'sf-table-1', elementId: 'table-cloth', name: 'Mesa da Selva', shapeType: 'table-cloth',
        x: 290, y: 530, width: 400, height: 130, rotation: 0, zIndex: 2,
        fill: '#C8A96E', stroke: '#A88C56', opacity: 1,
      },
      {
        id: 'sf-rug-1', elementId: 'rug-rect', name: 'Tapete Natural', shapeType: 'rug-rect',
        x: 260, y: 600, width: 460, height: 80, rotation: 0, zIndex: 0,
        fill: '#D7C9A7', stroke: '#C0AF8C', opacity: 1,
      },
    ],
  },

  // 6. Princesa / Debutante
  {
    id: 'princesa-debutante',
    name: 'Princesa & Debutante',
    description: 'Rosa e lilás com toque de dourado e elegância real',
    category: 'Debutante',
    tags: ['princesa', 'debutante', 'rosa', 'dourado', '15 anos'],
    icon: '👑',
    previewColor: 'from-purple-100 via-pink-100 to-amber-50',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FDF5FF', floorColor: '#F5EDF8' },
    elements: [
      {
        id: 'pr-arch-1', elementId: 'panel-arch', name: 'Painel Trono', shapeType: 'panel-arch',
        x: 380, y: 150, width: 210, height: 400, rotation: 0, zIndex: 1,
        fill: '#CE93D8', stroke: '#BA68C8', opacity: 1,
      },
      {
        id: 'pr-wavy-1', elementId: 'panel-wavy', name: 'Painel Rosa', shapeType: 'panel-wavy',
        x: 230, y: 250, width: 160, height: 310, rotation: 0, zIndex: 1,
        fill: '#F8BBD9', stroke: '#E497BF', opacity: 1,
      },
      {
        id: 'pr-wavy-2', elementId: 'panel-wavy', name: 'Painel Lilás', shapeType: 'panel-wavy',
        x: 600, y: 250, width: 160, height: 310, rotation: 0, zIndex: 1,
        fill: '#E1BEE7', stroke: '#CE93D8', opacity: 1,
      },
      {
        id: 'pr-arch-balloon', elementId: 'balloon-arch-l', name: 'Arco em L', shapeType: 'balloon-arch-l',
        x: 190, y: 130, width: 280, height: 370, rotation: 0, zIndex: 5,
        fill: '#F8BBD9', stroke: '#E497BF', opacity: 1,
        balloonSecondaryFill: '#CE93D8', balloonTertiaryFill: '#D4AF37', balloonFinish: 'pearl',
      },
      {
        id: 'pr-cyl-1', elementId: 'cylinder-high', name: 'Pedestal Dourado L', shapeType: 'cylinder-high',
        x: 320, y: 380, width: 75, height: 190, rotation: 0, zIndex: 3,
        fill: '#D4AF37', stroke: '#B89A2E', opacity: 1,
      },
      {
        id: 'pr-cyl-2', elementId: 'cylinder-high', name: 'Pedestal Dourado R', shapeType: 'cylinder-high',
        x: 610, y: 380, width: 75, height: 190, rotation: 0, zIndex: 3,
        fill: '#D4AF37', stroke: '#B89A2E', opacity: 1,
      },
      {
        id: 'pr-table-1', elementId: 'table-cloth', name: 'Mesa Real', shapeType: 'table-cloth',
        x: 285, y: 530, width: 420, height: 120, rotation: 0, zIndex: 2,
        fill: '#F8BBD9', stroke: '#E497BF', opacity: 1,
      },
    ],
  },

  // 7. Tropical / Havaiano
  {
    id: 'tropical-havaiano',
    name: 'Tropical & Havaiano',
    description: 'Cores vibrantes de verão com folhagens e flamingos',
    category: 'Adulto',
    tags: ['tropical', 'havaiano', 'verão', 'colorido'],
    icon: '🌺',
    previewColor: 'from-pink-200 via-orange-100 to-teal-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#FFFBF0', floorColor: '#F0F9F0' },
    elements: [
      {
        id: 'tr-arch-1', elementId: 'panel-arch', name: 'Painel Tropical', shapeType: 'panel-arch',
        x: 360, y: 170, width: 200, height: 380, rotation: 0, zIndex: 1,
        fill: '#26A69A', stroke: '#1E8880', opacity: 1,
      },
      {
        id: 'tr-round-1', elementId: 'panel-round', name: 'Painel Flamingo', shapeType: 'panel-round',
        x: 530, y: 210, width: 250, height: 310, rotation: 0, zIndex: 2,
        fill: '#FF8A65', stroke: '#E07554', opacity: 1,
      },
      {
        id: 'tr-wavy-1', elementId: 'panel-wavy', name: 'Painel Rosa Choque', shapeType: 'panel-wavy',
        x: 220, y: 250, width: 155, height: 310, rotation: 0, zIndex: 1,
        fill: '#EC407A', stroke: '#D0296A', opacity: 1,
      },
      {
        id: 'tr-cascade', elementId: 'balloon-cascade', name: 'Cascata Tropical', shapeType: 'balloon-cascade',
        x: 170, y: 150, width: 150, height: 390, rotation: 6, zIndex: 4,
        fill: '#FF8A65', stroke: '#E07554', opacity: 1,
        balloonSecondaryFill: '#FFEB3B', balloonTertiaryFill: '#26A69A',
      },
      {
        id: 'tr-cyl-1', elementId: 'cylinder-mid', name: 'Cilindro Verde', shapeType: 'cylinder-mid',
        x: 360, y: 440, width: 100, height: 155, rotation: 0, zIndex: 3,
        fill: '#66BB6A', stroke: '#4CAF50', opacity: 1,
      },
      {
        id: 'tr-cyl-2', elementId: 'cylinder-low', name: 'Cilindro Laranja', shapeType: 'cylinder-low',
        x: 480, y: 480, width: 95, height: 110, rotation: 0, zIndex: 3,
        fill: '#FF8A65', stroke: '#E07554', opacity: 1,
      },
      {
        id: 'tr-table-1', elementId: 'table-cloth', name: 'Mesa Tropical', shapeType: 'table-cloth',
        x: 290, y: 545, width: 400, height: 120, rotation: 0, zIndex: 2,
        fill: '#26A69A', stroke: '#1E8880', opacity: 1,
      },
    ],
  },

  // 8. Boteco / Adulto Descontraido
  {
    id: 'boteco-adulto',
    name: 'Boteco & Churras',
    description: 'Descontraído em vermelho e verde com clima de boteco',
    category: 'Adulto',
    tags: ['boteco', 'churrasco', 'adulto', 'vermelho'],
    icon: '🍺',
    previewColor: 'from-red-200 via-green-100 to-amber-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#F5F0E8', floorColor: '#DFD5C0' },
    elements: [
      {
        id: 'bt-rect-1', elementId: 'panel-rect', name: 'Painel Vermelho', shapeType: 'panel-rect',
        x: 240, y: 200, width: 200, height: 370, rotation: 0, zIndex: 1,
        fill: '#C62828', stroke: '#A81E1E', opacity: 1,
      },
      {
        id: 'bt-rect-2', elementId: 'panel-rect', name: 'Painel Verde', shapeType: 'panel-rect',
        x: 560, y: 200, width: 200, height: 370, rotation: 0, zIndex: 1,
        fill: '#2E7D32', stroke: '#1B5E20', opacity: 1,
      },
      {
        id: 'bt-arch-1', elementId: 'panel-arch', name: 'Painel Central', shapeType: 'panel-arch',
        x: 390, y: 180, width: 210, height: 400, rotation: 0, zIndex: 2,
        fill: '#F9A825', stroke: '#D4891E', opacity: 1,
      },
      {
        id: 'bt-table-1', elementId: 'table-rect', name: 'Mesa do Boteco', shapeType: 'table-rect',
        x: 250, y: 540, width: 480, height: 120, rotation: 0, zIndex: 2,
        fill: '#795548', stroke: '#5D4037', opacity: 1,
      },
      {
        id: 'bt-cyl-1', elementId: 'cylinder-mid', name: 'Barril L', shapeType: 'cylinder-mid',
        x: 340, y: 410, width: 90, height: 150, rotation: 0, zIndex: 3,
        fill: '#795548', stroke: '#5D4037', opacity: 1,
      },
      {
        id: 'bt-cyl-2', elementId: 'cylinder-mid', name: 'Barril R', shapeType: 'cylinder-mid',
        x: 580, y: 410, width: 90, height: 150, rotation: 0, zIndex: 3,
        fill: '#795548', stroke: '#5D4037', opacity: 1,
      },
      {
        id: 'bt-balloon-1', elementId: 'balloon-cluster', name: 'Balões Festivos', shapeType: 'balloon-cluster',
        x: 200, y: 200, width: 160, height: 160, rotation: -12, zIndex: 5,
        fill: '#C62828', stroke: '#A81E1E', opacity: 1,
        balloonSecondaryFill: '#F9A825', balloonTertiaryFill: '#2E7D32',
      },
    ],
  },

  // 9. Bodas / Aniversario de Casamento
  {
    id: 'bodas-prata',
    name: 'Bodas & Aniversário',
    description: 'Prata, branco e azul serenity para celebrações especiais',
    category: 'Casamento',
    tags: ['bodas', 'aniversário', 'prata', 'azul', 'elegante'],
    icon: '🥂',
    previewColor: 'from-slate-100 via-blue-50 to-zinc-100',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#F8F9FB', floorColor: '#ECEEF2' },
    elements: [
      {
        id: 'bd-arch-1', elementId: 'panel-arch', name: 'Painel Prata', shapeType: 'panel-arch',
        x: 380, y: 160, width: 220, height: 410, rotation: 0, zIndex: 1,
        fill: '#ECEFF1', stroke: '#B0BEC5', opacity: 1,
      },
      {
        id: 'bd-rect-1', elementId: 'panel-rect', name: 'Painel Azul L', shapeType: 'panel-rect',
        x: 240, y: 250, width: 155, height: 310, rotation: 0, zIndex: 1,
        fill: '#90CAF9', stroke: '#64B5F6', opacity: 1,
      },
      {
        id: 'bd-rect-2', elementId: 'panel-rect', name: 'Painel Azul R', shapeType: 'panel-rect',
        x: 605, y: 250, width: 155, height: 310, rotation: 0, zIndex: 1,
        fill: '#90CAF9', stroke: '#64B5F6', opacity: 1,
      },
      {
        id: 'bd-arch-balloon', elementId: 'balloon-arch-half', name: 'Guirlanda Topo', shapeType: 'balloon-arch-half',
        x: 220, y: 100, width: 570, height: 170, rotation: 0, zIndex: 5,
        fill: '#B0BEC5', stroke: '#90A4AE', opacity: 1,
        balloonSecondaryFill: '#90CAF9', balloonTertiaryFill: '#FFFFFF', balloonFinish: 'chrome',
      },
      {
        id: 'bd-cyl-1', elementId: 'acrylic-cylinder', name: 'Acrílico L', shapeType: 'acrylic-cylinder',
        x: 320, y: 370, width: 90, height: 200, rotation: 0, zIndex: 3,
        fill: '#DCE8F5', stroke: '#B8D0EB', opacity: 0.55,
      },
      {
        id: 'bd-cyl-2', elementId: 'acrylic-cylinder', name: 'Acrílico R', shapeType: 'acrylic-cylinder',
        x: 600, y: 370, width: 90, height: 200, rotation: 0, zIndex: 3,
        fill: '#DCE8F5', stroke: '#B8D0EB', opacity: 0.55,
      },
      {
        id: 'bd-table-1', elementId: 'acrylic-table', name: 'Mesa Acrílica', shapeType: 'acrylic-table',
        x: 280, y: 530, width: 440, height: 120, rotation: 0, zIndex: 2,
        fill: '#DCE8F5', stroke: '#B8D0EB', opacity: 0.6,
      },
    ],
  },

  // 10. Cha de Bebe Azul / Menino
  {
    id: 'cha-bebe-azul',
    name: 'Chá de Bebê Menino',
    description: 'Azul céu, branco e estrelinhas para o principezinho',
    category: 'Chá de Bebê',
    tags: ['chá de bebê', 'azul', 'menino', 'pastel'],
    icon: '👶',
    previewColor: 'from-sky-100 via-blue-50 to-indigo-50',
    environment: { ...DEFAULT_ENVIRONMENT, wallColor: '#F0F7FF', floorColor: '#E8F4FF' },
    elements: [
      {
        id: 'ca-arch-1', elementId: 'panel-arch', name: 'Painel Azul', shapeType: 'panel-arch',
        x: 370, y: 170, width: 210, height: 380, rotation: 0, zIndex: 1,
        fill: '#64B5F6', stroke: '#42A5F5', opacity: 1,
      },
      {
        id: 'ca-round-1', elementId: 'panel-round', name: 'Painel Celeste', shapeType: 'panel-round',
        x: 540, y: 210, width: 240, height: 310, rotation: 0, zIndex: 2,
        fill: '#BBDEFB', stroke: '#90CAF9', opacity: 1,
      },
      {
        id: 'ca-cyl-1', elementId: 'cylinder-mid', name: 'Cilindro Azul', shapeType: 'cylinder-mid',
        x: 360, y: 430, width: 100, height: 155, rotation: 0, zIndex: 3,
        fill: '#FFFFFF', stroke: '#E0E0E0', opacity: 1,
      },
      {
        id: 'ca-cyl-2', elementId: 'cylinder-low', name: 'Cilindro Celeste', shapeType: 'cylinder-low',
        x: 470, y: 470, width: 90, height: 110, rotation: 0, zIndex: 4,
        fill: '#BBDEFB', stroke: '#90CAF9', opacity: 1,
      },
      {
        id: 'ca-balloon-1', elementId: 'balloon-arch', name: 'Arco Azul', shapeType: 'balloon-arch',
        x: 250, y: 120, width: 330, height: 260, rotation: -6, zIndex: 5,
        fill: '#90CAF9', stroke: '#64B5F6', opacity: 1,
        balloonSecondaryFill: '#FFFFFF', balloonTertiaryFill: '#BBDEFB', balloonFinish: 'pearl',
      },
      {
        id: 'ca-table-1', elementId: 'table-cloth', name: 'Mesa Principezinho', shapeType: 'table-cloth',
        x: 295, y: 535, width: 390, height: 120, rotation: 0, zIndex: 2,
        fill: '#E3F2FD', stroke: '#BBDEFB', opacity: 1,
      },
    ],
  },
];
