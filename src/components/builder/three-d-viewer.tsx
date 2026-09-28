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
  X, 
  Sparkles,
  Maximize2,
  Minimize2,
  Ruler,
  Cake,
  Sun,
  Moon,
  Sparkle,
  Copy,
  Trash2,
  Sliders,
  Check,
  Focus,
  Palette,
  Layers
} from 'lucide-react';

interface ThreeDViewerProps {
  elements: CanvasElement[];
  environment?: EnvironmentConfig;
  selectedId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onUpdateElement?: (id: string, updated: Partial<CanvasElement>) => void;
  onDuplicateElement?: () => void;
  onDeleteElement?: () => void;
  onClose?: () => void;
  className?: string;
}

// Escala do canvas 2D (1000x750) para o mundo 3D (metros):
// 200px = 1.0 metro (1px = 5mm = 0.5cm)
const PX_TO_M = 0.005;
const CANVAS_CENTER_X = 500;
const FLOOR_Y_2D = 560; // Linha do chão no canvas 2D

// Tipos de Piso
type FloorType = 'wood' | 'tile' | 'grass' | 'neutral';

// Tipos de Iluminação
type LightingPreset = 'natural' | 'golden' | 'neon' | 'catalog';

// Cores rápidas para o seletor 3D
const PARTY_PALETTE = [
  '#FFFFFF', '#F5EBE0', '#D5C7B7', '#E8C5C8', '#D8B4E2',
  '#A8DADC', '#F4A261', '#E76F51', '#2A9D8F', '#264653',
  '#D4AF37', '#B76E79', '#1E1E24', '#F8F9FA'
];

export default function ThreeDViewer({
  elements,
  environment = DEFAULT_ENVIRONMENT,
  selectedId: externalSelectedId = null,
  onSelectElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onClose,
  className = '',
}: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Referências de luzes para troca dinâmica de iluminação
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const floorMeshRef = useRef<THREE.Mesh | null>(null);
  const wallMeshRef = useRef<THREE.Mesh | null>(null);

  // Grupos decorativos dinâmicos
  const fairyLightsGroupRef = useRef<THREE.Group | null>(null);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const dimensionsGroupRef = useRef<THREE.Group | null>(null);
  const selectionRingRef = useRef<THREE.Mesh | null>(null);
  const elementsGroupRef = useRef<THREE.Group | null>(null);

  // Animação de câmera suave (Lerp)
  const cameraTargetPosRef = useRef<THREE.Vector3 | null>(null);
  const cameraTargetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Estados locais
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(externalSelectedId);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [currentView, setCurrentView] = useState<'perspective' | 'front' | 'top'>('perspective');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modos de estúdio
  const [floorType, setFloorType] = useState<FloorType>('wood');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('natural');
  const [showDimensions, setShowDimensions] = useState(false);
  const [showCake, setShowCake] = useState(true);
  const [showFairyLights, setShowFairyLights] = useState(false);

  // Sincroniza seleção externa
  useEffect(() => {
    setInternalSelectedId(externalSelectedId);
  }, [externalSelectedId]);

  const activeSelectedId = internalSelectedId;
  const selectedElement = elements.find((el) => el.id === activeSelectedId);

  // -------------------------------------------------------------
  // 1. Texturas Procedurais (Sem dependência de assets externos)
  // -------------------------------------------------------------
  const getFloorTexture = useCallback((type: FloorType): { texture: THREE.Texture | null; color: number; roughness: number; metalness: number } => {
    if (typeof window === 'undefined') return { texture: null, color: 0xECE7DE, roughness: 0.6, metalness: 0.05 };

    if (type === 'wood') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#C49E72';
      ctx.fillRect(0, 0, 512, 512);

      const plankH = 64;
      for (let y = 0; y < 512; y += plankH) {
        const shade = Math.floor(Math.sin(y * 14.3) * 16);
        ctx.fillStyle = `rgba(${shade > 0 ? 255 : 0}, ${shade > 0 ? 230 : 0}, 0, ${Math.abs(shade) / 255 * 0.12})`;
        ctx.fillRect(0, y, 512, plankH);

        ctx.strokeStyle = 'rgba(75, 45, 18, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(95, 55, 20, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(0, y + i * 12 + 6);
          ctx.bezierCurveTo(160, y + i * 12 + 4, 340, y + i * 12 + 8, 512, y + i * 12 + 6);
          ctx.stroke();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(5, 5);
      tex.colorSpace = THREE.SRGBColorSpace;
      return { texture: tex, color: 0xffffff, roughness: 0.45, metalness: 0.08 };
    }

    if (type === 'tile') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#F5F3ED';
      ctx.fillRect(0, 0, 512, 512);

      // Veios suaves de mármore
      ctx.strokeStyle = 'rgba(195, 185, 175, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.bezierCurveTo(140, 180, 360, 240, 470, 512);
      ctx.stroke();

      // Grade de porcelanato 60x60
      ctx.strokeStyle = 'rgba(175, 170, 160, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 512, 512);
      ctx.strokeRect(0, 0, 256, 256);
      ctx.strokeRect(256, 0, 256, 256);
      ctx.strokeRect(0, 256, 256, 256);
      ctx.strokeRect(256, 256, 256, 256);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(5, 5);
      tex.colorSpace = THREE.SRGBColorSpace;
      return { texture: tex, color: 0xffffff, roughness: 0.18, metalness: 0.12 };
    }

    if (type === 'grass') {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#4D8B31';
      ctx.fillRect(0, 0, 256, 256);

      for (let i = 0; i < 2000; i++) {
        const gx = Math.random() * 256;
        const gy = Math.random() * 256;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(95, 170, 60, 0.35)' : 'rgba(55, 100, 35, 0.35)';
        ctx.fillRect(gx, gy, 2, 4);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(10, 10);
      tex.colorSpace = THREE.SRGBColorSpace;
      return { texture: tex, color: 0xffffff, roughness: 0.9, metalness: 0.02 };
    }

    // Neutral
    const floorHex = environment.floorColor ? parseInt(environment.floorColor.replace('#', '0x'), 16) : 0xEAE7E1;
    return { texture: null, color: floorHex, roughness: 0.6, metalness: 0.05 };
  }, [environment.floorColor]);

  // -------------------------------------------------------------
  // 2. Inicialização da Cena Three.js
  // -------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    const canvasMount = canvasMountRef.current;
    if (!container || !canvasMount) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Cena
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#F0EFEB');
    scene.fog = new THREE.FogExp2('#F0EFEB', 0.035);

    // Câmera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    cameraRef.current = camera;
    camera.position.set(0, 1.8, 5.0);

    // Renderer
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
    renderer.toneMappingExposure = 1.15;

    canvasMount.replaceChildren(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0.9, 0);
    controls.minDistance = 1.2;
    controls.maxDistance = 10.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.01;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.2;

    // Iluminação Inicial
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbf5, 1.6);
    keyLight.position.set(3.5, 5.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.camera.left = -4.0;
    keyLight.shadow.camera.right = 4.0;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -1.0;
    keyLight.shadow.bias = -0.0005;
    keyLightRef.current = keyLight;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0fe, 0.7);
    fillLight.position.set(-4.0, 3.5, 2.0);
    fillLightRef.current = fillLight;
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 4.0, -3.0);
    rimLightRef.current = rimLight;
    scene.add(rimLight);

    // Piso 3D
    const floorInfo = getFloorTexture(floorType);
    const floorGeo = new THREE.PlaneGeometry(18, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: floorInfo.color,
      map: floorInfo.texture,
      roughness: floorInfo.roughness,
      metalness: floorInfo.metalness,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    floorMeshRef.current = floorMesh;
    scene.add(floorMesh);

    // Parede de Fundo 3D
    const wallColor = environment.wallColor ? parseInt(environment.wallColor.replace('#', '0x'), 16) : 0xFAF9F6;
    const wallGeo = new THREE.PlaneGeometry(18, 9);
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.9,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 4.5, -2.0);
    wallMesh.receiveShadow = true;
    wallMeshRef.current = wallMesh;
    scene.add(wallMesh);

    // Rodapé
    const baseboardGeo = new THREE.BoxGeometry(18, 0.12, 0.04);
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0xE2DFD8, roughness: 0.5 });
    const baseboardMesh = new THREE.Mesh(baseboardGeo, baseboardMat);
    baseboardMesh.position.set(0, 0.06, -1.98);
    scene.add(baseboardMesh);

    // Anel de Seleção no Chão
    const ringGeo = new THREE.RingGeometry(0.2, 0.28, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0xEA580C, 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const selectionRing = new THREE.Mesh(ringGeo, ringMat);
    selectionRing.position.y = 0.005;
    selectionRing.visible = false;
    selectionRingRef.current = selectionRing;
    scene.add(selectionRing);

    // Grupo de Elementos
    const elementsGroup = new THREE.Group();
    elementsGroupRef.current = elementsGroup;
    scene.add(elementsGroup);

    // Grupo de Doces & Bolo
    const cakeGroup = new THREE.Group();
    cakeGroupRef.current = cakeGroup;
    scene.add(cakeGroup);

    // Grupo de Luzinhas (Fairy Lights)
    const fairyLightsGroup = new THREE.Group();
    fairyLightsGroupRef.current = fairyLightsGroup;
    scene.add(fairyLightsGroup);

    // Grupo de Cotas / Medidas
    const dimensionsGroup = new THREE.Group();
    dimensionsGroupRef.current = dimensionsGroup;
    scene.add(dimensionsGroup);

    setIsLoaded(true);

    // Loop de Animação e Renderização
    let lastTime = 0;
    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Animação de câmera suave (Lerp)
      if (cameraTargetPosRef.current && cameraTargetLookAtRef.current) {
        camera.position.lerp(cameraTargetPosRef.current, 0.08);
        controls.target.lerp(cameraTargetLookAtRef.current, 0.08);
        if (camera.position.distanceTo(cameraTargetPosRef.current) < 0.01) {
          cameraTargetPosRef.current = null;
          cameraTargetLookAtRef.current = null;
        }
      }

      // Animação suave das luzinhas mágicas
      if (fairyLightsGroupRef.current && fairyLightsGroupRef.current.visible) {
        fairyLightsGroupRef.current.children.forEach((light, i) => {
          light.position.y += Math.sin(time * 0.002 + i) * 0.0006;
        });
      }

      // Pulsação sutil do anel de seleção
      if (selectionRingRef.current && selectionRingRef.current.visible) {
        const s = 1 + Math.sin(time * 0.005) * 0.04;
        selectionRingRef.current.scale.set(s, s, s);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate(0);

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
      if (canvasMount && canvasMount.contains(renderer.domElement)) {
        canvasMount.removeChild(renderer.domElement);
      }
    };
  }, []); // Monta uma vez só

  // -------------------------------------------------------------
  // 3. Atualização dos Elementos na Cena 3D
  // -------------------------------------------------------------
  useEffect(() => {
    const elementsGroup = elementsGroupRef.current;
    if (!elementsGroup) return;

    // Limpa malhas anteriores do grupo de elementos
    while (elementsGroup.children.length > 0) {
      const child = elementsGroup.children[0];
      elementsGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    const textureLoader = new THREE.TextureLoader();
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    sorted.forEach((el) => {
      const meshGroup = build3DElement(el, textureLoader);
      if (meshGroup) {
        meshGroup.userData = { elementId: el.id };
        elementsGroup.add(meshGroup);
      }
    });

    // Atualiza bolo cenográfico nos apoios
    updateCakeAndSweets();

    // Atualiza cotas e medidas
    updateDimensions();

  }, [elements]);

  // -------------------------------------------------------------
  // 4. Seleção e Destaque 3D (Raycasting no clique)
  // -------------------------------------------------------------
  useEffect(() => {
    const ring = selectionRingRef.current;
    if (!ring) return;

    if (!activeSelectedId) {
      ring.visible = false;
      return;
    }

    const sel = elements.find((el) => el.id === activeSelectedId);
    if (!sel) {
      ring.visible = false;
      return;
    }

    const w = sel.width * PX_TO_M;
    const x = (sel.x + sel.width / 2 - CANVAS_CENTER_X) * PX_TO_M;
    let baseZ = 0;
    if (sel.shapeType.includes('panel')) baseZ = -0.55;
    else if (sel.shapeType.includes('rug')) baseZ = 0.45;
    else if (sel.shapeType.includes('table') || sel.shapeType.includes('cylinder')) baseZ = 0.15;
    else if (sel.shapeType.includes('balloon')) baseZ = -0.2;
    else baseZ = 0.35;
    const z = baseZ + (sel.zIndex || 0) * 0.025;

    const ringRadius = Math.max(0.25, (w / 2) * 1.15);
    ring.scale.set(ringRadius / 0.25, ringRadius / 0.25, ringRadius / 0.25);
    ring.position.set(x, 0.005, z);
    ring.visible = true;
  }, [activeSelectedId, elements]);

  // Click Raycaster Handler
  const handlePointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    handlePointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - handlePointerDownPos.current.x);
    const dy = Math.abs(e.clientY - handlePointerDownPos.current.y);
    if (dx > 5 || dy > 5) return; // Arrastou câmera, não foi clique

    if (!canvasMountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasMountRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    if (elementsGroupRef.current) {
      const intersects = raycaster.intersectObjects(elementsGroupRef.current.children, true);
      if (intersects.length > 0) {
        // Encontra o grupo do elemento
        let obj: THREE.Object3D | null = intersects[0].object;
        let foundId: string | null = null;
        while (obj && obj !== elementsGroupRef.current) {
          if (obj.userData && obj.userData.elementId) {
            foundId = obj.userData.elementId;
            break;
          }
          obj = obj.parent;
        }

        if (foundId) {
          setInternalSelectedId(foundId);
          onSelectElement?.(foundId);
          return;
        }
      }
    }

    // Clique fora: desseleciona se não clicou na HUD
    setInternalSelectedId(null);
    onSelectElement?.(null);
  };

  // -------------------------------------------------------------
  // 5. Atualização de Bolo Cenográfico e Doces
  // -------------------------------------------------------------
  const updateCakeAndSweets = useCallback(() => {
    const group = cakeGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (!showCake) return;

    // Encontra a mesa ou cilindro central
    const candidateTables = elements.filter(
      (el) => el.shapeType.includes('cylinder') || el.shapeType.includes('table')
    );
    if (candidateTables.length === 0) return;

    // Pega o item mais próximo do centro X
    const centerTable = candidateTables.reduce((prev, curr) => {
      const prevDist = Math.abs(prev.x + prev.width / 2 - CANVAS_CENTER_X);
      const currDist = Math.abs(curr.x + curr.width / 2 - CANVAS_CENTER_X);
      return currDist < prevDist ? curr : prev;
    });

    const tableX = (centerTable.x + centerTable.width / 2 - CANVAS_CENTER_X) * PX_TO_M;
    const tableH = centerTable.height * PX_TO_M;
    const yBottom = Math.max(0, (FLOOR_Y_2D - (centerTable.y + centerTable.height)) * PX_TO_M);
    const tableTopY = yBottom + tableH;
    let baseZ = centerTable.shapeType.includes('table') || centerTable.shapeType.includes('cylinder') ? 0.15 : 0;
    const tableZ = baseZ + (centerTable.zIndex || 0) * 0.025;

    // 1. Bolo Cenográfico de 2 Andares
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(tableX, tableTopY, tableZ);

    // Prato dourado do bolo
    const plateGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.015, 32);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.85, roughness: 0.2 });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = 0.008;
    plateMesh.castShadow = true;
    cakeGroup.add(plateMesh);

    // Andar 1 (Base branca perolada)
    const tier1Geo = new THREE.CylinderGeometry(0.14, 0.14, 0.10, 32);
    const tierMat = new THREE.MeshStandardMaterial({ color: 0xFDFBF7, roughness: 0.4 });
    const tier1 = new THREE.Mesh(tier1Geo, tierMat);
    tier1.position.y = 0.015 + 0.05;
    tier1.castShadow = true;
    cakeGroup.add(tier1);

    // Andar 2 (Pastel suave)
    const tier2Geo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 32);
    const tier2Mat = new THREE.MeshStandardMaterial({ color: 0xFCEADE, roughness: 0.4 });
    const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
    tier2.position.y = 0.015 + 0.10 + 0.04;
    tier2.castShadow = true;
    cakeGroup.add(tier2);

    // Velinha / Topo decorativo dourado
    const candleGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.05, 16);
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8 });
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.y = 0.015 + 0.18 + 0.025;
    cakeGroup.add(candle);

    // Chama suave da vela
    const flameGeo = new THREE.ConeGeometry(0.008, 0.02, 12);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.015 + 0.18 + 0.055;
    cakeGroup.add(flame);

    group.add(cakeGroup);

    // 2. Bandejas de doces em cilindros adjacentes
    const sideTables = candidateTables.filter((el) => el.id !== centerTable.id);
    sideTables.slice(0, 2).forEach((side) => {
      const sx = (side.x + side.width / 2 - CANVAS_CENTER_X) * PX_TO_M;
      const sh = side.height * PX_TO_M;
      const syBottom = Math.max(0, (FLOOR_Y_2D - (side.y + side.height)) * PX_TO_M);
      const sTopY = syBottom + sh;
      const sz = baseZ + (side.zIndex || 0) * 0.025;

      const standGroup = new THREE.Group();
      standGroup.position.set(sx, sTopY, sz);

      // Pé do suporte
      const stemGeo = new THREE.CylinderGeometry(0.01, 0.03, 0.05, 16);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.85, roughness: 0.25 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.025;
      standGroup.add(stem);

      // Prato de docinhos
      const dishGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.01, 24);
      const dish = new THREE.Mesh(dishGeo, stemMat);
      dish.position.y = 0.055;
      dish.castShadow = true;
      standGroup.add(dish);

      // Docinhos coloridos (brigadeiros/macarons)
      const sweetMat1 = new THREE.MeshStandardMaterial({ color: 0x4A2810, roughness: 0.8 }); // Chocolate
      const sweetMat2 = new THREE.MeshStandardMaterial({ color: 0xF472B6, roughness: 0.5 }); // Rosa
      for (let i = 0; i < 5; i++) {
        const sweetGeo = new THREE.SphereGeometry(0.015, 12, 12);
        const sweet = new THREE.Mesh(sweetGeo, i % 2 === 0 ? sweetMat1 : sweetMat2);
        const angle = (i / 5) * Math.PI * 2;
        sweet.position.set(Math.cos(angle) * 0.05, 0.065, Math.sin(angle) * 0.05);
        standGroup.add(sweet);
      }

      group.add(standGroup);
    });
  }, [elements, showCake]);

  useEffect(() => {
    updateCakeAndSweets();
  }, [updateCakeAndSweets]);

  // -------------------------------------------------------------
  // 6. Atualização das Luzinhas Mágicas (Fairy Lights)
  // -------------------------------------------------------------
  useEffect(() => {
    const group = fairyLightsGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    group.visible = showFairyLights;
    if (!showFairyLights) return;

    // 40 esferas brilhantes suspensas no ar
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xFFE89E });
    for (let i = 0; i < 40; i++) {
      const lightGeo = new THREE.SphereGeometry(0.02, 12, 12);
      const lightMesh = new THREE.Mesh(lightGeo, lightMat);
      const lx = THREE.MathUtils.randFloat(-2.8, 2.8);
      const ly = THREE.MathUtils.randFloat(1.6, 3.2);
      const lz = THREE.MathUtils.randFloat(-0.8, 1.2);
      lightMesh.position.set(lx, ly, lz);
      group.add(lightMesh);
    }
  }, [showFairyLights]);

  // -------------------------------------------------------------
  // 7. Cotas e Medidas em Tempo Real (Ruler Mode)
  // -------------------------------------------------------------
  const updateDimensions = useCallback(() => {
    const group = dimensionsGroupRef.current;
    if (!group) return;

    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    group.visible = showDimensions;
    if (!showDimensions || elements.length === 0) return;

    // 1. Régua de Largura Total no Chão
    let minX = Infinity;
    let maxX = -Infinity;
    elements.forEach((el) => {
      const left = (el.x - CANVAS_CENTER_X) * PX_TO_M;
      const right = (el.x + el.width - CANVAS_CENTER_X) * PX_TO_M;
      if (left < minX) minX = left;
      if (right > maxX) maxX = right;
    });

    const totalWidthMeters = Math.max(0.4, maxX - minX);
    const centerFloorX = (minX + maxX) / 2;

    // Linha da cota no chão
    const rulerGeo = new THREE.BoxGeometry(totalWidthMeters, 0.01, 0.02);
    const rulerMat = new THREE.MeshBasicMaterial({ color: 0xEA580C });
    const rulerLine = new THREE.Mesh(rulerGeo, rulerMat);
    rulerLine.position.set(centerFloorX, 0.015, 0.9);
    group.add(rulerLine);

    // Marcadores laterais da régua
    const tickGeo = new THREE.BoxGeometry(0.015, 0.015, 0.12);
    const tickLeft = new THREE.Mesh(tickGeo, rulerMat);
    tickLeft.position.set(minX, 0.015, 0.9);
    const tickRight = new THREE.Mesh(tickGeo, rulerMat);
    tickRight.position.set(maxX, 0.015, 0.9);
    group.add(tickLeft, tickRight);

    // Badge com texto da cota total
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 80;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#18181B';
    ctx.roundRect(0, 0, 320, 80, 20);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`↔ Largura: ${totalWidthMeters.toFixed(2)}m`, 160, 42);

    const badgeTex = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: badgeTex });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.7, 0.18, 1);
    sprite.position.set(centerFloorX, 0.20, 0.9);
    group.add(sprite);

  }, [elements, showDimensions]);

  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  // -------------------------------------------------------------
  // 8. Troca Dinâmica de Atmosfera de Luz & Piso
  // -------------------------------------------------------------
  const handleLightingChange = (preset: LightingPreset) => {
    setLightingPreset(preset);
    if (!sceneRef.current || !keyLightRef.current || !fillLightRef.current || !rimLightRef.current || !ambientLightRef.current) return;

    const scene = sceneRef.current;
    const key = keyLightRef.current;
    const fill = fillLightRef.current;
    const rim = rimLightRef.current;
    const amb = ambientLightRef.current;

    switch (preset) {
      case 'golden': // Golden Hour aconchegante
        scene.background = new THREE.Color('#FAF1E6');
        scene.fog = new THREE.FogExp2('#FAF1E6', 0.035);
        key.color.setHex(0xFFD699);
        key.intensity = 2.0;
        key.position.set(4.5, 4.5, 3.5);
        fill.color.setHex(0xFFC285);
        fill.intensity = 0.9;
        rim.color.setHex(0xFFE6C2);
        rim.intensity = 0.7;
        amb.color.setHex(0xFFEBD4);
        amb.intensity = 0.95;
        break;

      case 'neon': // Balada Noturna
        scene.background = new THREE.Color('#0D0A18');
        scene.fog = new THREE.FogExp2('#0D0A18', 0.04);
        key.color.setHex(0xFFFFFF);
        key.intensity = 1.3;
        key.position.set(0, 5.0, 3.0);
        fill.color.setHex(0x9333EA); // Roxo neon
        fill.intensity = 1.8;
        rim.color.setHex(0x06B6D4); // Ciano neon
        rim.intensity = 1.8;
        amb.color.setHex(0x1F1A35);
        amb.intensity = 0.6;
        break;

      case 'catalog': // Catálogo Clean High-Key
        scene.background = new THREE.Color('#FFFFFF');
        scene.fog = new THREE.FogExp2('#FFFFFF', 0.03);
        key.color.setHex(0xFFFFFF);
        key.intensity = 1.5;
        key.position.set(3.0, 5.5, 4.0);
        fill.color.setHex(0xF5F5F5);
        fill.intensity = 1.0;
        rim.color.setHex(0xFFFFFF);
        rim.intensity = 0.6;
        amb.color.setHex(0xFFFFFF);
        amb.intensity = 1.1;
        break;

      case 'natural':
      default: // Estúdio Natural de Dia
        scene.background = new THREE.Color('#F0EFEB');
        scene.fog = new THREE.FogExp2('#F0EFEB', 0.035);
        key.color.setHex(0xFFFBF5);
        key.intensity = 1.6;
        key.position.set(3.5, 5.5, 4.0);
        fill.color.setHex(0xE8F0FE);
        fill.intensity = 0.7;
        rim.color.setHex(0xFFFFFF);
        rim.intensity = 0.4;
        amb.color.setHex(0xFFFFFF);
        amb.intensity = 0.85;
        break;
    }
  };

  const handleFloorChange = (type: FloorType) => {
    setFloorType(type);
    if (!floorMeshRef.current) return;
    const floorInfo = getFloorTexture(type);
    const mat = floorMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.color.setHex(floorInfo.color);
    mat.map = floorInfo.texture;
    mat.roughness = floorInfo.roughness;
    mat.metalness = floorInfo.metalness;
    mat.needsUpdate = true;
  };

  // -------------------------------------------------------------
  // 9. Câmera Presets & Animação Suave (Lerp)
  // -------------------------------------------------------------
  const setCameraView = (view: 'perspective' | 'front' | 'top') => {
    setCurrentView(view);

    switch (view) {
      case 'front':
        cameraTargetPosRef.current = new THREE.Vector3(0, 1.25, 4.6);
        cameraTargetLookAtRef.current = new THREE.Vector3(0, 1.0, 0);
        break;
      case 'top':
        cameraTargetPosRef.current = new THREE.Vector3(0, 5.5, 0.8);
        cameraTargetLookAtRef.current = new THREE.Vector3(0, 0.2, 0);
        break;
      case 'perspective':
      default:
        cameraTargetPosRef.current = new THREE.Vector3(1.8, 1.9, 4.2);
        cameraTargetLookAtRef.current = new THREE.Vector3(0, 0.9, 0);
        break;
    }
  };

  // Focar câmera no elemento selecionado
  const handleFocusSelected = () => {
    if (!selectedElement) return;
    const w = selectedElement.width * PX_TO_M;
    const h = selectedElement.height * PX_TO_M;
    const x = (selectedElement.x + selectedElement.width / 2 - CANVAS_CENTER_X) * PX_TO_M;
    const yBottom = Math.max(0, (FLOOR_Y_2D - (selectedElement.y + selectedElement.height)) * PX_TO_M);
    const yCenter = yBottom + h / 2;

    cameraTargetLookAtRef.current = new THREE.Vector3(x, yCenter, 0.1);
    cameraTargetPosRef.current = new THREE.Vector3(x, yCenter + 0.3, 2.5);
  };

  // Auto-rotação
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  // Captura de Foto 3D
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `festalab-cenario-3d-${Date.now()}.png`;
    a.click();
  };

  // Tela Cheia
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Medidas em centímetros do item selecionado
  const selWidthCm = selectedElement ? Math.round(selectedElement.width * 0.5) : 0;
  const selHeightCm = selectedElement ? Math.round(selectedElement.height * 0.5) : 0;

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden select-none ${className}`}
    >
      {/* Viewport isolado exclusivamente para o canvas Three.js (sem nós filhos do React) */}
      <div
        ref={canvasMountRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#F0EFEB] flex flex-col items-center justify-center gap-2 z-50 pointer-events-none">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium text-zinc-600 font-sans">Renderizando Estúdio 3D...</span>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* HEADER SUPERIOR HUD */}
      {/* ------------------------------------------------------- */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
        
        {/* Badge do Estúdio 3D */}
        <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-zinc-200 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-900 font-sans leading-none">Estúdio 3D Pro</span>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
              {elements.length} {elements.length === 1 ? 'item' : 'itens'} no cenário
            </span>
          </div>
        </div>

        {/* Controles de Topo: Tela Cheia & Fechar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Sair da tela cheia' : 'Apresentação em Tela Cheia'}
            className="w-9 h-9 flex items-center justify-center bg-white/95 hover:bg-zinc-100 text-zinc-700 rounded-xl shadow-md border border-zinc-200 transition-transform active:scale-95 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Voltar ao Editor 2D"
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-4 h-9 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <span>Voltar ao 2D</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------- */}
      {/* SELETOR SUPERIOR DE ATMOSFERA & PISO */}
      {/* ------------------------------------------------------- */}
      <div className="absolute top-16 left-3 flex flex-wrap items-center gap-2 pointer-events-auto z-20">
        
        {/* Luzes */}
        <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-zinc-200 text-xs">
          <span className="text-[10px] font-semibold text-zinc-400 px-2 uppercase tracking-wider">Luz</span>
          <button
            type="button"
            onClick={() => handleLightingChange('natural')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              lightingPreset === 'natural' ? 'bg-orange-500 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            ☀️ Dia
          </button>
          <button
            type="button"
            onClick={() => handleLightingChange('golden')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              lightingPreset === 'golden' ? 'bg-orange-500 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            ✨ Âmbar
          </button>
          <button
            type="button"
            onClick={() => handleLightingChange('neon')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              lightingPreset === 'neon' ? 'bg-purple-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🌙 Noite
          </button>
          <button
            type="button"
            onClick={() => handleLightingChange('catalog')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              lightingPreset === 'catalog' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🤍 Clean
          </button>
        </div>

        {/* Pisos */}
        <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-zinc-200 text-xs">
          <span className="text-[10px] font-semibold text-zinc-400 px-2 uppercase tracking-wider">Piso</span>
          <button
            type="button"
            onClick={() => handleFloorChange('wood')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              floorType === 'wood' ? 'bg-amber-700 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🪵 Madeira
          </button>
          <button
            type="button"
            onClick={() => handleFloorChange('tile')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              floorType === 'tile' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🏛️ Porcelanato
          </button>
          <button
            type="button"
            onClick={() => handleFloorChange('grass')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              floorType === 'grass' ? 'bg-emerald-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🌿 Grama
          </button>
          <button
            type="button"
            onClick={() => handleFloorChange('neutral')}
            className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              floorType === 'neutral' ? 'bg-zinc-700 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            ⚪ Neutro
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------- */}
      {/* CARD DO ELEMENTO SELECIONADO (3D INSPECTOR) */}
      {/* ------------------------------------------------------- */}
      {selectedElement && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-32 right-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200 p-3.5 z-30 animate-in slide-in-from-right-3 duration-200"
        >
          {/* Cabeçalho do Card */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div>
              <h4 className="text-xs font-bold text-zinc-900 font-sans truncate max-w-[170px]">
                {selectedElement.name}
              </h4>
              <span className="text-[10px] text-zinc-400 font-mono">
                {selWidthCm}cm × {selHeightCm}cm
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleFocusSelected}
                title="Focar câmera neste item"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"
              >
                <Focus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalSelectedId(null);
                  onSelectElement?.(null);
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Medidas em Destaque */}
          <div className="grid grid-cols-2 gap-2 my-2.5">
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-2 text-center">
              <span className="text-[9px] text-zinc-400 block font-mono">LARGURA</span>
              <span className="text-xs font-bold text-zinc-800 font-mono">{selWidthCm} cm</span>
            </div>
            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-2 text-center">
              <span className="text-[9px] text-zinc-400 block font-mono">ALTURA</span>
              <span className="text-xs font-bold text-zinc-800 font-mono">{selHeightCm} cm</span>
            </div>
          </div>

          {/* Cores Rápidas */}
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-zinc-500 mb-1.5 flex items-center gap-1">
              <Palette className="w-3 h-3 text-zinc-400" /> Cor no 3D
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
              {PARTY_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => onUpdateElement?.(selectedElement.id, { fill: color })}
                  style={{ backgroundColor: color }}
                  className={`w-5 h-5 rounded-full border border-zinc-200 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center ${
                    selectedElement.fill === color ? 'ring-2 ring-orange-500 ring-offset-1' : ''
                  }`}
                >
                  {selectedElement.fill === color && (
                    <Check className="w-2.5 h-2.5 text-zinc-800" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ajuste de Camada / Profundidade Z */}
          <div className="mb-3 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-zinc-400" /> Profundidade Z
              </span>
              <span className="font-mono">Camada {selectedElement.zIndex}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateElement?.(selectedElement.id, { zIndex: Math.max(0, selectedElement.zIndex - 1) })}
                className="flex-1 h-7 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-medium rounded-lg transition-colors cursor-pointer"
              >
                Recuar
              </button>
              <button
                type="button"
                onClick={() => onUpdateElement?.(selectedElement.id, { zIndex: selectedElement.zIndex + 1 })}
                className="flex-1 h-7 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-medium rounded-lg transition-colors cursor-pointer"
              >
                Avançar
              </button>
            </div>
          </div>

          {/* Ações Rápidas: Duplicar / Excluir */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-100">
            {onDuplicateElement && (
              <button
                type="button"
                onClick={onDuplicateElement}
                className="flex-1 flex items-center justify-center gap-1 h-7 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Duplicar</span>
              </button>
            )}
            {onDeleteElement && (
              <button
                type="button"
                onClick={onDeleteElement}
                className="flex-1 flex items-center justify-center gap-1 h-7 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Excluir</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- */}
      {/* TOOLBAR INFERIOR FLUTUANTE (CÂMERA, EXTRAS, SNAPSHOT) */}
      {/* ------------------------------------------------------- */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-2xl border border-zinc-200 pointer-events-auto max-w-[96vw] overflow-x-auto z-20"
      >
        
        {/* Presets de Câmera */}
        <div className="flex items-center gap-0.5 bg-zinc-100 p-0.5 rounded-xl">
          <button
            type="button"
            onClick={() => setCameraView('perspective')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'perspective' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Perspectiva
          </button>
          <button
            type="button"
            onClick={() => setCameraView('front')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'front' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Frente
          </button>
          <button
            type="button"
            onClick={() => setCameraView('top')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              currentView === 'top' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Topo
          </button>
        </div>

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {/* Giro 360 Automático */}
        <button
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pausar rotação' : 'Girar automaticamente 360°'}
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            isAutoRotating ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">360°</span>
        </button>

        {/* Régua / Medidas Cotas */}
        <button
          type="button"
          onClick={() => setShowDimensions(!showDimensions)}
          title="Exibir cotas e medidas reais no chão e nos itens"
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            showDimensions ? 'bg-orange-600 text-white shadow-xs' : 'text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Medidas</span>
        </button>

        {/* Bolo & Doces */}
        <button
          type="button"
          onClick={() => setShowCake(!showCake)}
          title="Colocar bolo cenográfico e bandejas de doces"
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            showCake ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          <Cake className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bolo</span>
        </button>

        {/* Luzinhas Mágicas */}
        <button
          type="button"
          onClick={() => setShowFairyLights(!showFairyLights)}
          title="Adicionar varal de luzinhas e partículas festivas"
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
            showFairyLights ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Luzinhas</span>
        </button>

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {/* Captura de Foto 3D */}
        <button
          type="button"
          onClick={handleCaptureSnapshot}
          title="Baixar foto nítida deste ângulo 3D"
          className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-orange-400" />
          <span>Foto 3D</span>
        </button>
      </div>

      {/* Dica de Interação sutil */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="text-[10px] text-zinc-500/80 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-zinc-200/40 shadow-2xs font-sans">
          💡 Clique em qualquer item para inspecionar • Arraste para girar 360°
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
  const yBottom = Math.max(0, (FLOOR_Y_2D - (el.y + el.height)) * PX_TO_M);
  const yCenter = yBottom + h / 2;

  // Posição Z (Profundidade)
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
        roughness: 0.55,
        metalness: 0.05,
      });

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
    cylMesh.userData = { elementId: el.id };
    group.add(cylMesh);

    // Borda superior sutil
    const rimGeo = new THREE.TorusGeometry(radius, 0.006, 16, 48);
    rimGeo.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({ color: isAcrylic ? 0x90C0F0 : 0xE0DDD5, roughness: 0.3 });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.y = h / 2;
    rimMesh.userData = { elementId: el.id };
    group.add(rimMesh);
  }

  // 2. PAINEL ARQUEADO (Arch Panel)
  else if (el.shapeType === 'panel-arch') {
    const depth = 0.04;
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
    archMesh.userData = { elementId: el.id };
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
    discMesh.userData = { elementId: el.id };
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
    boxMesh.userData = { elementId: el.id };
    group.add(boxMesh);
  }

  // 5. MESAS (Retangular, Redonda, Acrílica)
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
      const topGeo = new THREE.CylinderGeometry(w / 2, w / 2, topThickness, 48);
      const topMesh = new THREE.Mesh(topGeo, tableMat);
      topMesh.position.y = h / 2 - topThickness / 2;
      topMesh.castShadow = true;
      topMesh.userData = { elementId: el.id };
      group.add(topMesh);

      const legGeo = new THREE.CylinderGeometry(0.04, 0.06, h - topThickness, 24);
      const legMesh = new THREE.Mesh(legGeo, tableMat);
      legMesh.position.y = 0;
      legMesh.castShadow = true;
      legMesh.userData = { elementId: el.id };
      group.add(legMesh);

      const baseGeo = new THREE.CylinderGeometry(w * 0.28, w * 0.32, 0.02, 32);
      const baseMesh = new THREE.Mesh(baseGeo, tableMat);
      baseMesh.position.y = -h / 2 + 0.01;
      baseMesh.userData = { elementId: el.id };
      group.add(baseMesh);
    } else {
      const topGeo = new THREE.BoxGeometry(w, topThickness, depth);
      const topMesh = new THREE.Mesh(topGeo, tableMat);
      topMesh.position.y = h / 2 - topThickness / 2;
      topMesh.castShadow = true;
      topMesh.userData = { elementId: el.id };
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
        legMesh.userData = { elementId: el.id };
        group.add(legMesh);
      });
    }
  }

  // 6. BALÕES ORGÂNICOS (Arco & Cacho Realistas com Brilho Cromado)
  else if (el.shapeType.includes('balloon')) {
    const isArch = el.shapeType === 'balloon-arch';
    const balloonCount = isArch ? 32 : 14;

    const balloonMat = new THREE.MeshStandardMaterial({
      color: threeColor,
      roughness: 0.18, // Brilho de bexiga de festa luxo
      metalness: 0.30,
    });

    for (let i = 0; i < balloonCount; i++) {
      // Tamanhos variados (orgânicos: mini, médio e grande)
      const radius = THREE.MathUtils.randFloat(0.06, 0.14);
      const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
      const sphereMesh = new THREE.Mesh(sphereGeo, balloonMat);

      if (isArch) {
        const t = (i / (balloonCount - 1)) * Math.PI;
        const archR = w / 2;
        const bx = -Math.cos(t) * archR + THREE.MathUtils.randFloat(-0.07, 0.07);
        const by = Math.sin(t) * (h * 0.85) - h / 2 + THREE.MathUtils.randFloat(-0.07, 0.07);
        const bz = THREE.MathUtils.randFloat(-0.10, 0.10);
        sphereMesh.position.set(bx, by, bz);
      } else {
        const bx = THREE.MathUtils.randFloat(-w / 3, w / 3);
        const by = THREE.MathUtils.randFloat(-h / 3, h / 3);
        const bz = THREE.MathUtils.randFloat(-0.10, 0.10);
        sphereMesh.position.set(bx, by, bz);
      }

      sphereMesh.castShadow = true;
      sphereMesh.userData = { elementId: el.id };
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
    rugMesh.userData = { elementId: el.id };
    group.add(rugMesh);
  }

  // 8. IMAGENS PERSONALIZADAS / PERSONAGENS
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
    planeMesh.userData = { elementId: el.id };
    group.add(planeMesh);

    // Suporte traseiro se for apoiado no chão
    if (yBottom < 0.1) {
      const standGeo = new THREE.BoxGeometry(0.04, 0.02, 0.18);
      const standMat = new THREE.MeshStandardMaterial({ color: 0xD4C29A });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.set(0, -h / 2 + 0.01, -0.06);
      stand.userData = { elementId: el.id };
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
    mesh.userData = { elementId: el.id };
    group.add(mesh);
  }

  // Posição e rotação final do grupo
  group.position.set(x, yCenter, z);
  if (el.rotation) {
    group.rotation.y = -el.rotation * (Math.PI / 180);
  }

  return group;
}
