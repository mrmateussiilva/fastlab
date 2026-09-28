import { CanvasElement, EnvironmentConfig, DEFAULT_ENVIRONMENT } from './builder-elements';

export interface FestaTemplate {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  elements: CanvasElement[];
  environment: EnvironmentConfig;
}

export const FESTA_TEMPLATES: FestaTemplate[] = [
  {
    id: 'festa-infantil-classica',
    name: 'Festa Infantil',
    description: 'Composição alegre com balões coloridos',
    previewColor: 'from-blue-200 to-red-200',
    environment: { ...DEFAULT_ENVIRONMENT, floorColor: '#FFFFFF' },
    elements: [
      {
        id: 'arch-1', elementId: 'panel-arch', name: 'Painel', shapeType: 'panel-arch',
        x: 350, y: 220, width: 200, height: 350, rotation: 0, zIndex: 1, fill: '#80c4e9', stroke: '#619ec1', opacity: 1,
      },
      {
        id: 'round-1', elementId: 'panel-round', name: 'Painel 2', shapeType: 'panel-round',
        x: 480, y: 240, width: 250, height: 320, rotation: 0, zIndex: 2, fill: '#f4978e', stroke: '#cc7f77', opacity: 1,
      },
      {
        id: 'cyl-1', elementId: 'cylinder-mid', name: 'Cilindro', shapeType: 'cylinder-mid',
        x: 380, y: 410, width: 100, height: 160, rotation: 0, zIndex: 3, fill: '#f8ad9d', stroke: '#d69688', opacity: 1,
      },
      {
        id: 'balloon-1', elementId: 'balloon-arch', name: 'Arco de Balões', shapeType: 'balloon-arch',
        x: 300, y: 150, width: 300, height: 250, rotation: -10, zIndex: 5, fill: '#ffdab9', stroke: '#ccae94', opacity: 1,
      }
    ]
  },
  {
    id: 'casamento-minimalista',
    name: 'Casamento',
    description: 'Elegante, focado no branco e dourado',
    previewColor: 'from-amber-100 to-zinc-100',
    environment: { ...DEFAULT_ENVIRONMENT, floorColor: '#F5F5F5' },
    elements: [
      {
        id: 'arch-1', elementId: 'panel-arch', name: 'Painel Central', shapeType: 'panel-arch',
        x: 400, y: 200, width: 220, height: 400, rotation: 0, zIndex: 1, fill: '#FAF9F6', stroke: '#E5E4E2', opacity: 1,
      },
      {
        id: 'table-1', elementId: 'table-rect', name: 'Mesa', shapeType: 'table-rect',
        x: 300, y: 400, width: 350, height: 120, rotation: 0, zIndex: 2, fill: '#FAF9F6', stroke: '#E5E4E2', opacity: 1,
      },
      {
        id: 'rug-1', elementId: 'rug-rect', name: 'Tapete', shapeType: 'rug-rect',
        x: 250, y: 500, width: 450, height: 80, rotation: 0, zIndex: 0, fill: '#E8E8E8', stroke: '#CCCCCC', opacity: 1,
      }
    ]
  },
  {
    id: 'chadebebe-rosa',
    name: 'Chá de Bebê',
    description: 'Delicado em tons pastel de rosa',
    previewColor: 'from-pink-100 to-rose-100',
    environment: { ...DEFAULT_ENVIRONMENT, floorColor: '#FFF0F5' },
    elements: [
      {
        id: 'round-1', elementId: 'panel-round', name: 'Painel', shapeType: 'panel-round',
        x: 400, y: 200, width: 300, height: 350, rotation: 0, zIndex: 1, fill: '#FFD1DC', stroke: '#E5BAC4', opacity: 1,
      },
      {
        id: 'cyl-1', elementId: 'cylinder-mid', name: 'Cilindro Médio', shapeType: 'cylinder-mid',
        x: 380, y: 410, width: 100, height: 160, rotation: 0, zIndex: 3, fill: '#FFFFFF', stroke: '#E5E5E5', opacity: 1,
      },
      {
        id: 'cyl-2', elementId: 'cylinder-low', name: 'Cilindro Baixo', shapeType: 'cylinder-low',
        x: 490, y: 450, width: 90, height: 120, rotation: 0, zIndex: 4, fill: '#FFB6C1', stroke: '#E5A3AD', opacity: 1,
      }
    ]
  }
];
