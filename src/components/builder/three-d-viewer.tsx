'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  CanvasElement, 
  EnvironmentConfig, 
  DEFAULT_ENVIRONMENT 
} from '@/lib/builder-elements';
import { 
  RotateCcw, 
  Camera, 
  Play, 
  Pause, 
  Eye, 
  Layers, 
  X, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThreeDViewerProps {
  elements: CanvasElement[];
  environment?: EnvironmentConfig;
  onClose?: () => void;
  className?: string;
}

// Escala do canvas 2D (1000x750) para o mundo 3D (metros):
// 200px = 1.0 metro (1px = 5mm)
const PX_TO_M = 0.005;
const CANVAS_CENTER_X = 500;
const FLOOR_Y_2D = 560; // Linha do chão no canvas 2D

export default function ThreeDViewer({
  elements,
  environment = DEFAULT_ENVIRONMENT,
  onClose,
  className = '',
}: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [currentView, setCurrentView] = useState<'perspective' | 'front' | 'top'>('perspective');
  const [isLoaded, setIsLoaded] = useState(false);

  // Inicialização da Cena Three.js
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#F0EFEB');
    scene.fog = new THREE.FogExp2('#F0EFEB', 0.04);

    // 2. Câmera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    cameraRef.current = camera;
    camera.position.set(0, 1.8, 4.8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.replaceChildren(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0.9, 0);
    controls.minDistance = 1.2;
    controls.maxDistance = 9.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.01; // Não deixa ir abaixo do chão
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.2;

    // 5. Iluminação de Estúdio Profissional
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Luz principal com sombra suave (Key Light)
    const keyLight = new THREE.DirectionalLight(0xfffbf5, 1.6);
    keyLight.position.set(3.5, 5.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -3.5;
    keyLight.shadow.camera.right = 3.5;
    keyLight.shadow.camera.top = 4.0;
    keyLight.shadow.camera.bottom = -1.0;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Luz de preenchimento (Fill Light)
    const fillLight = new THREE.DirectionalLight(0xe8f0fe, 0.7);
    fillLight.position.set(-4.0, 3.5, 2.0);
    scene.add(fillLight);

    // Luz de recorte (Rim Light)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 4.0, -3.0);
    scene.add(rimLight);

    // 6. Chão e Parede 3D
    const floorColor = environment.floorColor || '#ECE7DE';
    const wallColor = environment.wallColor || '#FAF9F6';

    // Piso
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(floorColor),
      roughness: 0.55,
      metalness: 0.05,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Parede de Fundo
    const wallGeo = new THREE.PlaneGeometry(16, 8);
    const wallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(wallColor),
      roughness: 0.9,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 4.0, -1.8);
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // Rodapé de acabamento
    const baseboardGeo = new THREE.BoxGeometry(16, 0.12, 0.04);
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xE2DFD8, roughness: 0.5 });
    const baseboardMesh = new THREE.Mesh(baseboardGeo, baseboardMat);
    baseboardMesh.position.set(0, 0.06, -1.78);
    scene.add(baseboardMesh);

    // 7. Construção dos Elementos 3D da Festa
    const textureLoader = new THREE.TextureLoader();

    // Ordena por zIndex para calcular a profundidade Z adequada
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    sorted.forEach((el) => {
      const meshGroup = build3DElement(el, textureLoader);
      if (meshGroup) {
        scene.add(meshGroup);
      }
    });

    setIsLoaded(true);

    // Loop de Animação / Render
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, [elements, environment]);

  // Atualiza auto-rotação
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Câmera Presets
  const setCameraView = (view: 'perspective' | 'front' | 'top') => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    setCurrentView(view);

    switch (view) {
      case 'front':
        camera.position.set(0, 1.2, 4.6);
        controls.target.set(0, 1.0, 0);
        break;
      case 'top':
        camera.position.set(0, 5.2, 0.8);
        controls.target.set(0, 0.2, 0);
        break;
      case 'perspective':
      default:
        camera.position.set(1.8, 2.0, 4.2);
        controls.target.set(0, 0.9, 0);
        break;
    }
    controls.update();
  };

  // Captura foto 3D em alta resolução
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `festalab-cenario-3d-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className={`w-full h-full relative overflow-hidden select-none ${className}`}>
      
      {/* Container Three.js Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading overlay suave */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#F0EFEB] flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-zinc-600 font-sans">Carregando ambiente 3D...</span>
        </div>
      )}

      {/* Floating Header HUD / Controles da Câmera */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        
        {/* Badge do Modo 3D */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-zinc-200 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-900 font-sans">Modo 3D Interativo</span>
          <span className="text-[10px] text-zinc-400 border-l border-zinc-200 pl-2 font-mono">
            {elements.length} {elements.length === 1 ? 'item' : 'itens'}
          </span>
        </div>

        {/* Botão de Fechar / Voltar ao 2D */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            title="Voltar ao Editor 2D"
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer pointer-events-auto"
          >
            <span>Voltar ao 2D</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Toolbar Inferior: Ângulos de Câmera, Rotação e Foto */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-zinc-200 pointer-events-auto max-w-[95vw] overflow-x-auto">
        
        {/* Presets de Ângulo */}
        <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-xl">
          <button
            type="button"
            onClick={() => setCameraView('perspective')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'perspective' 
                ? 'bg-white text-zinc-900 shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Perspectiva
          </button>
          <button
            type="button"
            onClick={() => setCameraView('front')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'front' 
                ? 'bg-white text-zinc-900 shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Frente
          </button>
          <button
            type="button"
            onClick={() => setCameraView('top')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'top' 
                ? 'bg-white text-zinc-900 shadow-xs' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Topo
          </button>
        </div>

        <div className="w-px h-5 bg-zinc-200 mx-1" />

        {/* Auto Rotação 360 */}
        <button
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pausar rotação' : 'Girar automaticamente 360°'}
          className={`flex items-center gap-1.5 h-7 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            isAutoRotating 
              ? 'bg-orange-100 text-orange-700 border border-orange-200' 
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span className="hidden sm:inline">360°</span>
        </button>

        {/* Capturar Foto do 3D */}
        <button
          type="button"
          onClick={handleCaptureSnapshot}
          title="Baixar foto deste ângulo 3D"
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-xl text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5 text-zinc-600" />
          <span className="hidden sm:inline">Foto 3D</span>
        </button>
      </div>

      {/* Dica de Interação no rodapé */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="text-[11px] text-zinc-500/80 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-zinc-200/50 shadow-2xs font-sans">
          💡 Clique e arraste para girar • Role para aproximar
        </span>
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// Função Construtora de Malhas 3D para cada Tipo de Elemento
// -------------------------------------------------------------
function build3DElement(el: CanvasElement, textureLoader: THREE.TextureLoader): THREE.Group {
  const group = new THREE.Group();

  const w = el.width * PX_TO_M;
  const h = el.height * PX_TO_M;

  // Posição X: centralizada em 0
  const x = (el.x + el.width / 2 - CANVAS_CENTER_X) * PX_TO_M;

  // Posição Y: calculada a partir do piso (floorY = 560)
  // Elementos apoiados no chão têm y + height = 560 -> yBottom = 0
  const yBottom = Math.max(0, (FLOOR_Y_2D - (el.y + el.height)) * PX_TO_M);
  const yCenter = yBottom + h / 2;

  // Posição Z (Profundidade):
  // Painéis ficam no fundo (Z negativo), mesas e cilindros ficam à frente
  let baseZ = 0;
  if (el.shapeType.includes('panel')) {
    baseZ = -0.55;
  } else if (el.shapeType.includes('rug')) {
    baseZ = 0.45;
  } else if (el.shapeType.includes('table') || el.shapeType.includes('cylinder')) {
    baseZ = 0.15;
  } else if (el.shapeType.includes('balloon')) {
    baseZ = -0.2;
  } else {
    baseZ = 0.35;
  }
  // Camadas relativas por zIndex
  const z = baseZ + (el.zIndex || 0) * 0.025;

  const hexColor = el.fill && el.fill !== 'transparent' ? el.fill : '#FFFFFF';
  const threeColor = new THREE.Color(hexColor);

  // 1. CILINDROS (Mesas cilindro de festa)
  if (el.shapeType.includes('cylinder')) {
    const radius = w / 2;
    const isAcrylic = el.shapeType === 'acrylic-cylinder';

    const cylGeo = new THREE.CylinderGeometry(radius, radius, h, 48);

    let cylMat: THREE.Material;
    if (isAcrylic) {
      cylMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x70A5E0),
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.75,
      });
    } else {
      cylMat = new THREE.MeshStandardMaterial({
        color: threeColor,
        roughness: 0.65,
        metalness: 0.05,
      });

      // Aplica arte/tecido sublimado se houver
      if (el.fillImageSrc) {
        textureLoader.load(el.fillImageSrc, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          (cylMat as THREE.MeshStandardMaterial).map = tex;
          cylMat.needsUpdate = true;
        });
      }
    }

    const cylMesh = new THREE.Mesh(cylGeo, cylMat);
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    group.add(cylMesh);

    // Borda superior sutil
    const rimGeo = new THREE.TorusGeometry(radius, 0.006, 16, 48);
    rimGeo.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: isAcrylic ? 0x90C0F0 : 0xE0DDD5, roughness: 0.3 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = h / 2;
    group.add(rimMesh);
  }

  // 2. PAINEL ARQUEADO (Arch Panel)
  else if (el.shapeType === 'panel-arch') {
    const depth = 0.04;
    // Constrói o perfil do arco 2D e faz extrusão
    const shape = new THREE.Shape();
    const halfW = w / 2;
    const halfH = h / 2;
    const archRadius = halfW;
    const straightH = h - archRadius;

    shape.moveTo(-halfW, -halfH);
    shape.lineTo(halfW, -halfH);
    shape.lineTo(halfW, -halfH + straightH);
    shape.absarc(0, -halfH + straightH, archRadius, 0, Math.PI, false);
    shape.lineTo(-halfW, -halfH);

    const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
    });
    extrudeGeo.center();

    const archMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      roughness: 0.7,
      metalness: 0.05,
    });

    if (el.fillImageSrc) {
      textureLoader.load(el.fillImageSrc, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        archMat.map = tex;
        archMat.needsUpdate = true;
      });
    }

    const archMesh = new THREE.Mesh(extrudeGeo, archMat);
    archMesh.castShadow = true;
    archMesh.receiveShadow = true;
    group.add(archMesh);

    // Pés de suporte metálicos atrás
    const footGeo = new THREE.BoxGeometry(0.02, 0.02, 0.3);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
    const foot1 = new THREE.Mesh(footGeo, footMat);
    foot1.position.set(-halfW * 0.6, -halfH + 0.01, -0.12);
    const foot2 = new THREE.Mesh(footGeo, footMat);
    foot2.position.set(halfW * 0.6, -halfH + 0.01, -0.12);
    group.add(foot1, foot2);
  }

  // 3. PAINEL REDONDO (Round Panel com pedestal)
  else if (el.shapeType === 'panel-round') {
    const radius = Math.min(w, h) / 2;
    const discGeo = new THREE.CylinderGeometry(radius, radius, 0.03, 64);
    discGeo.rotateX(Math.PI / 2);

    const discMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      roughness: 0.7,
      metalness: 0.05,
    });

    if (el.fillImageSrc) {
      textureLoader.load(el.fillImageSrc, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        discMat.map = tex;
        discMat.needsUpdate = true;
      });
    }

    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.castShadow = true;
    discMesh.receiveShadow = true;
    group.add(discMesh);

    // Suporte / Tripé de metal
    const standH = yCenter;
    const standGeo = new THREE.CylinderGeometry(0.015, 0.015, standH, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
    const standMesh = new THREE.Mesh(standGeo, standMat);
    standMesh.position.set(0, -yCenter / 2, -0.04);
    group.add(standMesh);

    const baseFeetGeo = new THREE.BoxGeometry(radius * 1.1, 0.015, 0.35);
    const baseFeetMesh = new THREE.Mesh(baseFeetGeo, standMat);
    baseFeetMesh.position.set(0, -yCenter + 0.008, -0.04);
    group.add(baseFeetMesh);
  }

  // 4. PAINEL RETANGULAR / ONDULADO
  else if (el.shapeType.includes('panel')) {
    const depth = 0.035;
    const boxGeo = new THREE.BoxGeometry(w, h, depth);
    const boxMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      roughness: 0.7,
      metalness: 0.05,
    });

    if (el.fillImageSrc) {
      textureLoader.load(el.fillImageSrc, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        boxMat.map = tex;
        boxMat.needsUpdate = true;
      });
    }

    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    group.add(boxMesh);
  }

  // 5. MESAS (Retangular, Redonda, Toalha, Acrílica)
  else if (el.shapeType.includes('table')) {
    const depth = w * 0.55;
    const topThickness = 0.035;
    const isAcrylic = el.shapeType === 'acrylic-table';

    let tableMat: THREE.Material;
    if (isAcrylic) {
      tableMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x70A5E0),
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        transmission: 0.8,
      });
    } else {
      tableMat = new THREE.MeshStandardMaterial({
        color: threeColor,
        roughness: 0.6,
      });
    }

    if (el.shapeType === 'table-round') {
      // Mesa redonda com pé central ou 4 pés
      const topGeo = new THREE.CylinderGeometry(w / 2, w / 2, topThickness, 48);
      const topMesh = new THREE.Mesh(topGeo, tableMat);
      topMesh.position.y = h / 2 - topThickness / 2;
      topMesh.castShadow = true;
      group.add(topMesh);

      // Perna central elegante
      const legGeo = new THREE.CylinderGeometry(0.04, 0.06, h - topThickness, 24);
      const legMesh = new THREE.Mesh(legGeo, tableMat);
      legMesh.position.y = 0;
      legMesh.castShadow = true;
      group.add(legMesh);

      // Base no chão
      const baseGeo = new THREE.CylinderGeometry(w * 0.28, w * 0.32, 0.02, 32);
      const baseMesh = new THREE.Mesh(baseGeo, tableMat);
      baseMesh.position.y = -h / 2 + 0.01;
      group.add(baseMesh);
    } else {
      // Mesa retangular com tampo e 4 pernas
      const topGeo = new THREE.BoxGeometry(w, topThickness, depth);
      const topMesh = new THREE.Mesh(topGeo, tableMat);
      topMesh.position.y = h / 2 - topThickness / 2;
      topMesh.castShadow = true;
      group.add(topMesh);

      const legH = h - topThickness;
      const legRadius = 0.02;
      const legGeo = new THREE.CylinderGeometry(legRadius, legRadius, legH, 16);
      const legX = w / 2 - 0.05;
      const legZ = depth / 2 - 0.05;

      const legPositions = [
        [-legX, -topThickness / 2, -legZ],
        [legX, -topThickness / 2, -legZ],
        [-legX, -topThickness / 2, legZ],
        [legX, -topThickness / 2, legZ],
      ];

      legPositions.forEach(([lx, ly, lz]) => {
        const legMesh = new THREE.Mesh(legGeo, tableMat);
        legMesh.position.set(lx, ly, lz);
        legMesh.castShadow = true;
        group.add(legMesh);
      });
    }
  }

  // 6. BALÕES (Clusters e Arcos volumétricos brilhantes)
  else if (el.shapeType.includes('balloon')) {
    const isArch = el.shapeType === 'balloon-arch';
    const balloonCount = isArch ? 24 : 8;

    const balloonMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      roughness: 0.25, // Brilho de bexiga de festa
      metalness: 0.15,
    });

    for (let i = 0; i < balloonCount; i++) {
      const radius = THREE.MathUtils.randFloat(0.07, 0.13);
      const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
      const sphereMesh = new THREE.Mesh(sphereGeo, balloonMat);

      if (isArch) {
        // Distribui ao longo de um semicírculo orgânico
        const t = (i / (balloonCount - 1)) * Math.PI;
        const archR = w / 2;
        const bx = -Math.cos(t) * archR + THREE.MathUtils.randFloat(-0.06, 0.06);
        const by = Math.sin(t) * (h * 0.85) - h / 2 + THREE.MathUtils.randFloat(-0.06, 0.06);
        const bz = THREE.MathUtils.randFloat(-0.08, 0.08);
        sphereMesh.position.set(bx, by, bz);
      } else {
        // Cacho agrupado
        const bx = THREE.MathUtils.randFloat(-w / 3, w / 3);
        const by = THREE.MathUtils.randFloat(-h / 3, h / 3);
        const bz = THREE.MathUtils.randFloat(-0.08, 0.08);
        sphereMesh.position.set(bx, by, bz);
      }

      sphereMesh.castShadow = true;
      group.add(sphereMesh);
    }
  }

  // 7. TAPETES (Rugs no piso)
  else if (el.shapeType.includes('rug')) {
    const depth = w * 0.55;
    let rugGeo: THREE.BufferGeometry;
    if (el.shapeType === 'rug-oval') {
      rugGeo = new THREE.CylinderGeometry(w / 2, w / 2, 0.005, 48);
      rugGeo.scale(1, 1, 0.6);
    } else {
      rugGeo = new THREE.BoxGeometry(w, 0.005, depth);
    }

    const rugMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      roughness: 0.95,
    });
    const rugMesh = new THREE.Mesh(rugGeo, rugMat);
    rugMesh.position.y = -yCenter + 0.003;
    rugMesh.receiveShadow = true;
    group.add(rugMesh);
  }

  // 8. IMAGENS PERSONALIZADAS / PERSONAGENS / DISPLAY
  else if (el.shapeType === 'custom-image' && el.imageUrl) {
    const planeGeo = new THREE.PlaneGeometry(w, h);
    const planeMat = new THREE.MeshStandardMaterial({
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });

    textureLoader.load(el.imageUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      planeMat.map = tex;
      planeMat.needsUpdate = true;
    });

    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.castShadow = true;
    planeMesh.receiveShadow = true;
    group.add(planeMesh);

    // Suporte traseiro de display MDF se for apoiado no chão
    if (yBottom < 0.1) {
      const standGeo = new THREE.BoxGeometry(0.04, 0.02, 0.18);
      const standMat = new THREE.MeshStandardMaterial({ color: 0xD4C29A });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.set(0, -h / 2 + 0.01, -0.06);
      group.add(stand);
    }
  }

  // 9. ELEMENTO GENÉRICO / TEXTO / OUTROS
  else {
    const planeGeo = new THREE.PlaneGeometry(w, h);
    const planeMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      transparent: el.opacity < 1,
      opacity: el.opacity,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.castShadow = true;
    group.add(mesh);
  }

  // Aplica rotação e posição no grupo
  group.position.set(x, yCenter, z);
  if (el.rotation) {
    group.rotation.y = -el.rotation * (Math.PI / 180);
  }

  return group;
}
