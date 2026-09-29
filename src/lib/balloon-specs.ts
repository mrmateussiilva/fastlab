/**
 * Especificações Geométricas de Balões Orgânicos (2D e 3D)
 * Reproduz o padrão de montagem de decoradoras profissionais:
 * - Balões gigantes (18"-24") nos pontos focais (base e curvas)
 * - Balões médios (9"-12") formando o corpo e volume
 * - Mini balões (5" apliques) preenchendo os vãos da frente
 * - Volume tridimensional (profundidade Z) com apoio traseiro e projeção frontal
 */

export interface BalloonSpec {
  /** Posição horizontal normalizada (0 a 1) */
  nx: number;
  /** Posição vertical normalizada (0 = topo, 1 = base) */
  ny: number;
  /** Raio relativo ao menor lado (min(w, h)) */
  nr: number;
  /** Slot de cor na paleta (1 = primária, 2 = secundária, 3 = destaque/terciária) */
  slot: 1 | 2 | 3;
  /** Camada de oclusão 2D / profundidade (1 = fundo, 5 = mini frontal) */
  z: number;
  /** Offset relativo de profundidade 3D (Z em metros) */
  zOffset?: number;
  /** Fator de escala extra para volume 3D */
  isHero?: boolean;
}

// 1. Arco em L Desconstruído (Emoldura painéis com base farta, curva suave no ombro e topo elegante)
export const L_ARCH_SPECS: BalloonSpec[] = [
  // --- BASE NO CHÃO (Volume ancorado com balão gigante) ---
  { nx: 0.13, ny: 0.94, nr: 0.16, slot: 1, z: 1, isHero: true, zOffset: 0.02 },
  { nx: 0.24, ny: 0.92, nr: 0.13, slot: 2, z: 2, zOffset: 0.06 },
  { nx: 0.07, ny: 0.90, nr: 0.12, slot: 3, z: 2, zOffset: -0.04 },
  { nx: 0.18, ny: 0.88, nr: 0.065, slot: 1, z: 5, zOffset: 0.14 },
  { nx: 0.26, ny: 0.86, nr: 0.055, slot: 2, z: 5, zOffset: 0.15 },

  // --- TRONCO INFERIOR (Transição orgânica) ---
  { nx: 0.16, ny: 0.81, nr: 0.14, slot: 1, z: 1, zOffset: 0.01 },
  { nx: 0.08, ny: 0.77, nr: 0.11, slot: 2, z: 3, zOffset: -0.03 },
  { nx: 0.25, ny: 0.75, nr: 0.12, slot: 3, z: 2, zOffset: 0.07 },
  { nx: 0.17, ny: 0.73, nr: 0.06, slot: 2, z: 5, zOffset: 0.14 },

  // --- CINTURA / MEIO DA COLUNA (Ondeamento) ---
  { nx: 0.16, ny: 0.65, nr: 0.14, slot: 1, z: 1, zOffset: 0.02 },
  { nx: 0.06, ny: 0.61, nr: 0.11, slot: 3, z: 2, zOffset: -0.05 },
  { nx: 0.24, ny: 0.58, nr: 0.13, slot: 2, z: 3, zOffset: 0.08 },
  { nx: 0.15, ny: 0.54, nr: 0.06, slot: 1, z: 5, zOffset: 0.15 },

  // --- SUBIDA PARA O OMBRO ---
  { nx: 0.14, ny: 0.47, nr: 0.14, slot: 1, z: 1, zOffset: 0.01 },
  { nx: 0.24, ny: 0.43, nr: 0.12, slot: 3, z: 2, zOffset: 0.07 },
  { nx: 0.07, ny: 0.39, nr: 0.11, slot: 2, z: 3, zOffset: -0.04 },
  { nx: 0.16, ny: 0.37, nr: 0.065, slot: 3, z: 5, zOffset: 0.15 },
  { nx: 0.23, ny: 0.35, nr: 0.055, slot: 1, z: 5, zOffset: 0.14 },

  // --- TRANSIÇÃO DA CURVA (Ombro arredondado, NUNCA 90 graus retos) ---
  { nx: 0.18, ny: 0.30, nr: 0.14, slot: 1, z: 2, zOffset: 0.03 },
  { nx: 0.08, ny: 0.26, nr: 0.11, slot: 2, z: 1, zOffset: -0.03 },
  { nx: 0.26, ny: 0.24, nr: 0.13, slot: 3, z: 3, zOffset: 0.08 },
  { nx: 0.17, ny: 0.22, nr: 0.07, slot: 2, z: 5, zOffset: 0.15 },

  // --- APEX / COTOVELO (Balão Gigante de destaque na curvatura) ---
  { nx: 0.19, ny: 0.15, nr: 0.16, slot: 1, z: 1, isHero: true, zOffset: 0.04 },
  { nx: 0.11, ny: 0.12, nr: 0.11, slot: 3, z: 2, zOffset: -0.05 },
  { nx: 0.28, ny: 0.13, nr: 0.13, slot: 2, z: 3, zOffset: 0.09 },
  { nx: 0.22, ny: 0.08, nr: 0.07, slot: 1, z: 5, zOffset: 0.16 },
  { nx: 0.29, ny: 0.07, nr: 0.06, slot: 3, z: 5, zOffset: 0.15 },

  // --- BRAÇO SUPERIOR (Horizontal ondulado que abraça o painel) ---
  { nx: 0.37, ny: 0.12, nr: 0.14, slot: 1, z: 1, zOffset: 0.02 },
  { nx: 0.44, ny: 0.09, nr: 0.12, slot: 2, z: 2, zOffset: -0.02 },
  { nx: 0.51, ny: 0.14, nr: 0.13, slot: 3, z: 3, zOffset: 0.08 },
  { nx: 0.43, ny: 0.16, nr: 0.065, slot: 3, z: 5, zOffset: 0.15 },

  // --- BOJO CENTRAL SUPERIOR ---
  { nx: 0.59, ny: 0.11, nr: 0.14, slot: 1, z: 1, isHero: true, zOffset: 0.03 },
  { nx: 0.66, ny: 0.14, nr: 0.12, slot: 2, z: 2, zOffset: -0.03 },
  { nx: 0.73, ny: 0.10, nr: 0.13, slot: 3, z: 3, zOffset: 0.07 },
  { nx: 0.65, ny: 0.07, nr: 0.065, slot: 2, z: 5, zOffset: 0.15 },

  // --- PONTA / AFILAMENTO FINAL (Tapering delicado) ---
  { nx: 0.80, ny: 0.12, nr: 0.12, slot: 1, z: 2, zOffset: 0.02 },
  { nx: 0.87, ny: 0.10, nr: 0.10, slot: 2, z: 1, zOffset: -0.02 },
  { nx: 0.93, ny: 0.13, nr: 0.09, slot: 3, z: 3, zOffset: 0.06 },
  { nx: 0.85, ny: 0.16, nr: 0.055, slot: 1, z: 5, zOffset: 0.14 },
  { nx: 0.98, ny: 0.11, nr: 0.07, slot: 2, z: 2, zOffset: 0.01 },
];

// 2. Meio Arco / Guirlanda Curva (Contorna o topo de painéis redondos ou romanos)
export const HALF_ARCH_SPECS: BalloonSpec[] = [
  { nx: 0.06, ny: 0.72, nr: 0.14, slot: 1, z: 1, isHero: true, zOffset: 0.02 },
  { nx: 0.12, ny: 0.57, nr: 0.14, slot: 2, z: 2, zOffset: 0.06 },
  { nx: 0.07, ny: 0.44, nr: 0.12, slot: 3, z: 1, zOffset: -0.04 },
  { nx: 0.14, ny: 0.47, nr: 0.07, slot: 1, z: 5, zOffset: 0.15 },
  { nx: 0.20, ny: 0.35, nr: 0.15, slot: 1, z: 2, zOffset: 0.04 },
  { nx: 0.27, ny: 0.25, nr: 0.13, slot: 2, z: 1, zOffset: -0.02 },
  { nx: 0.33, ny: 0.30, nr: 0.12, slot: 3, z: 3, zOffset: 0.08 },
  { nx: 0.25, ny: 0.20, nr: 0.065, slot: 2, z: 5, zOffset: 0.15 },
  { nx: 0.40, ny: 0.18, nr: 0.16, slot: 1, z: 2, isHero: true, zOffset: 0.04 },
  { nx: 0.49, ny: 0.14, nr: 0.16, slot: 2, z: 1, isHero: true, zOffset: -0.02 },
  { nx: 0.56, ny: 0.16, nr: 0.14, slot: 3, z: 3, zOffset: 0.08 },
  { nx: 0.48, ny: 0.23, nr: 0.07, slot: 1, z: 5, zOffset: 0.16 },
  { nx: 0.64, ny: 0.20, nr: 0.15, slot: 1, z: 2, zOffset: 0.03 },
  { nx: 0.71, ny: 0.26, nr: 0.13, slot: 2, z: 1, zOffset: -0.03 },
  { nx: 0.76, ny: 0.33, nr: 0.13, slot: 3, z: 3, zOffset: 0.07 },
  { nx: 0.69, ny: 0.23, nr: 0.065, slot: 3, z: 5, zOffset: 0.15 },
  { nx: 0.83, ny: 0.41, nr: 0.14, slot: 1, z: 2, zOffset: 0.02 },
  { nx: 0.89, ny: 0.53, nr: 0.13, slot: 2, z: 1, zOffset: -0.02 },
  { nx: 0.95, ny: 0.66, nr: 0.12, slot: 3, z: 2, zOffset: 0.05 },
  { nx: 0.87, ny: 0.49, nr: 0.07, slot: 2, z: 5, zOffset: 0.14 },
];

// 3. Cascata Vertical (Coluna desconstruída com volume na base)
export const CASCADE_SPECS: BalloonSpec[] = [
  { nx: 0.50, ny: 0.06, nr: 0.12, slot: 1, z: 1, zOffset: 0.01 },
  { nx: 0.59, ny: 0.11, nr: 0.11, slot: 2, z: 2, zOffset: 0.05 },
  { nx: 0.41, ny: 0.14, nr: 0.11, slot: 3, z: 1, zOffset: -0.04 },
  { nx: 0.52, ny: 0.16, nr: 0.06, slot: 1, z: 5, zOffset: 0.14 },
  { nx: 0.48, ny: 0.23, nr: 0.14, slot: 1, z: 2, zOffset: 0.02 },
  { nx: 0.61, ny: 0.28, nr: 0.12, slot: 2, z: 1, zOffset: -0.03 },
  { nx: 0.37, ny: 0.32, nr: 0.13, slot: 3, z: 3, zOffset: 0.08 },
  { nx: 0.53, ny: 0.34, nr: 0.07, slot: 2, z: 5, zOffset: 0.15 },
  { nx: 0.50, ny: 0.42, nr: 0.16, slot: 1, z: 1, isHero: true, zOffset: 0.03 },
  { nx: 0.35, ny: 0.48, nr: 0.13, slot: 2, z: 2, zOffset: -0.03 },
  { nx: 0.63, ny: 0.50, nr: 0.14, slot: 3, z: 3, zOffset: 0.07 },
  { nx: 0.46, ny: 0.53, nr: 0.07, slot: 1, z: 5, zOffset: 0.15 },
  { nx: 0.52, ny: 0.61, nr: 0.15, slot: 1, z: 2, zOffset: 0.02 },
  { nx: 0.37, ny: 0.66, nr: 0.13, slot: 3, z: 1, zOffset: -0.04 },
  { nx: 0.65, ny: 0.68, nr: 0.13, slot: 2, z: 3, zOffset: 0.07 },
  { nx: 0.51, ny: 0.70, nr: 0.07, slot: 3, z: 5, zOffset: 0.15 },
  { nx: 0.44, ny: 0.78, nr: 0.17, slot: 1, z: 1, isHero: true, zOffset: 0.04 },
  { nx: 0.63, ny: 0.82, nr: 0.15, slot: 2, z: 2, zOffset: 0.06 },
  { nx: 0.31, ny: 0.85, nr: 0.14, slot: 3, z: 3, zOffset: -0.04 },
  { nx: 0.48, ny: 0.87, nr: 0.08, slot: 2, z: 5, zOffset: 0.15 },
  { nx: 0.50, ny: 0.94, nr: 0.19, slot: 1, z: 1, isHero: true, zOffset: 0.03 },
  { nx: 0.33, ny: 0.95, nr: 0.15, slot: 2, z: 2, zOffset: -0.02 },
  { nx: 0.67, ny: 0.95, nr: 0.16, slot: 3, z: 2, zOffset: 0.08 },
  { nx: 0.55, ny: 0.96, nr: 0.09, slot: 1, z: 5, zOffset: 0.16 },
];

// 4. Cacho Orgânico / Buquê (Cluster compacto e volumoso para pontos específicos)
export const CLUSTER_SPECS: BalloonSpec[] = [
  { nx: 0.40, ny: 0.35, nr: 0.24, slot: 1, z: 1, isHero: true, zOffset: 0.02 },
  { nx: 0.62, ny: 0.38, nr: 0.22, slot: 2, z: 2, zOffset: -0.03 },
  { nx: 0.35, ny: 0.60, nr: 0.25, slot: 3, z: 1, isHero: true, zOffset: 0.03 },
  { nx: 0.65, ny: 0.62, nr: 0.23, slot: 1, z: 3, zOffset: 0.07 },
  { nx: 0.50, ny: 0.50, nr: 0.18, slot: 2, z: 4, zOffset: 0.10 },
  { nx: 0.24, ny: 0.45, nr: 0.16, slot: 2, z: 2, zOffset: -0.05 },
  { nx: 0.76, ny: 0.48, nr: 0.15, slot: 3, z: 1, zOffset: -0.04 },
  { nx: 0.48, ny: 0.24, nr: 0.17, slot: 1, z: 3, zOffset: 0.05 },
  { nx: 0.52, ny: 0.76, nr: 0.19, slot: 2, z: 2, zOffset: 0.04 },
  { nx: 0.38, ny: 0.46, nr: 0.09, slot: 3, z: 5, zOffset: 0.16 },
  { nx: 0.60, ny: 0.52, nr: 0.08, slot: 1, z: 5, zOffset: 0.16 },
  { nx: 0.46, ny: 0.62, nr: 0.09, slot: 2, z: 5, zOffset: 0.17 },
  { nx: 0.56, ny: 0.34, nr: 0.08, slot: 3, z: 5, zOffset: 0.16 },
];

/**
 * Retorna os specs base de acordo com o shapeType
 */
export function getBalloonSpecsForShape(shapeType: string): BalloonSpec[] {
  if (shapeType === 'balloon-arch-l' || shapeType === 'balloon-arch') {
    return L_ARCH_SPECS;
  }
  if (shapeType === 'balloon-arch-half') {
    return HALF_ARCH_SPECS;
  }
  if (shapeType === 'balloon-cascade') {
    return CASCADE_SPECS;
  }
  return CLUSTER_SPECS;
}

/**
 * Gera a malha volumétrica 3D completa com:
 * 1. Todos os balões principais e apliques definidos no layout
 * 2. Balões de apoio traseiro (companion) para dar volume 360° em vista lateral
 */
export interface ThreeDBalloonInstance {
  x: number;
  y: number;
  z: number;
  radius: number;
  slot: 1 | 2 | 3;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
}

export function generate3DBalloonInstances(
  specs: BalloonSpec[],
  w: number,
  h: number,
  invert: boolean
): ThreeDBalloonInstance[] {
  const baseDim = Math.min(w, h);
  const instances: ThreeDBalloonInstance[] = [];

  specs.forEach((b, idx) => {
    // Posição no plano X/Y com inversão horizontal
    const nx = invert ? (1 - b.nx) : b.nx;
    const bx = (nx - 0.5) * w;
    const by = (0.5 - b.ny) * h;

    // Raio com hero boost
    const baseR = b.nr * baseDim;
    const finalRadius = b.isHero ? baseR * 1.15 : baseR;

    // Profundidade Z calibrada
    const zBase = b.zOffset !== undefined 
      ? b.zOffset 
      : ((b.z === 5 ? 0.15 : (b.z - 2) * 0.05));

    // Leve inclinação orgânica (para o formato de gota não ficar estático)
    const angleBase = (idx * 0.77);
    const tiltX = Math.sin(angleBase) * 0.15;
    const tiltY = Math.cos(angleBase * 1.3) * 0.15;
    const tiltZ = Math.sin(angleBase * 0.5) * 0.2;

    instances.push({
      x: bx,
      y: by,
      z: zBase,
      radius: finalRadius,
      slot: b.slot,
      tiltX,
      tiltY,
      tiltZ,
    });

    // Para balões do corpo (não mini apliques), cria um balão de volume traseiro
    // que garante que ao girar a câmera 3D o arco tenha espessura real de 40-50cm
    if (b.z < 5 && idx % 2 === 0) {
      const backOffsetAngle = angleBase + Math.PI * 0.8;
      const backDist = finalRadius * 0.65;
      const backX = bx + Math.cos(backOffsetAngle) * (backDist * 0.6);
      const backY = by + Math.sin(backOffsetAngle) * (backDist * 0.6);
      const backZ = -0.06 - (Math.abs(Math.sin(angleBase)) * 0.05);

      // Alterna o slot de cor para misturar harmoniosamente no fundo
      const backSlot: 1 | 2 | 3 = b.slot === 1 ? 2 : (b.slot === 2 ? 3 : 1);

      instances.push({
        x: backX,
        y: backY,
        z: backZ,
        radius: finalRadius * 0.9,
        slot: backSlot,
        tiltX: -tiltX,
        tiltY: -tiltY,
        tiltZ: -tiltZ,
      });
    }
  });

  return instances;
}
