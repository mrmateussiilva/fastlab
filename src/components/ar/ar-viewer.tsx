'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { CanvasElement } from '@/lib/builder-elements';

interface ARViewerProps {
  imageUrl: string;
  elements: CanvasElement[];
  onClose: () => void;
}

function createMeshForElement(el: CanvasElement, textureLoader: THREE.TextureLoader): THREE.Object3D {
  const pxToM = 0.005; // 1px = 5mm. 200px = 1m
  const w = el.width * pxToM;
  const h = el.height * pxToM;
  const depth = 0.05; // 5cm
  
  const x3d = (el.x + el.width / 2 - 500) * pxToM;
  const y3d = (560 - (el.y + el.height) + el.height / 2) * pxToM;
  const z3d = ((el.zIndex || 0) * 0.02); // 2cm depth between layers

  let geometry: THREE.BufferGeometry;
  let material: THREE.Material;

  const color = new THREE.Color(el.fill !== 'transparent' ? el.fill : '#ffffff');

  if (el.shapeType.includes('cylinder') || el.shapeType.includes('round')) {
    if (el.shapeType.includes('cylinder')) {
      geometry = new THREE.CylinderGeometry(w/2, w/2, h, 32);
    } else {
      geometry = new THREE.CylinderGeometry(w/2, w/2, depth, 32);
      geometry.rotateX(Math.PI / 2);
    }
    
    material = new THREE.MeshStandardMaterial({ 
      color,
      transparent: el.opacity < 1,
      opacity: el.opacity,
      roughness: 0.7,
      metalness: 0.1
    });
  } else if (el.shapeType.includes('rect') || el.shapeType.includes('box') || el.shapeType.includes('table') || el.shapeType.includes('arch') || el.shapeType.includes('wavy')) {
    const d = el.shapeType.includes('table') ? w/1.5 : depth; // mesas são mais fundas
    geometry = new THREE.BoxGeometry(w, h, d);
    
    // Se for um arch (Painel Arqueado) tentar simular se der, mas um box já ajuda com a textura
    material = new THREE.MeshStandardMaterial({ 
      color,
      transparent: el.opacity < 1,
      opacity: el.opacity,
      roughness: 0.9
    });
  } else {
    // baloes, texto, imagens -> Plano
    geometry = new THREE.PlaneGeometry(w, h);
    if (el.imageUrl) {
      const tex = textureLoader.load(el.imageUrl);
      material = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
    } else {
      material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: el.opacity, side: THREE.DoubleSide });
    }
  }

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x3d, y3d, z3d);
  mesh.rotation.z = -el.rotation * (Math.PI / 180); 
  return mesh;
}

export default function ARViewer({ imageUrl, elements, onClose }: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let reticle: THREE.Mesh;
    let hitTestSource: XRHitTestSource | null = null;
    let hitTestSourceRequested = false;
    let sceneGroup: THREE.Group | null = null;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

      const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      containerRef.current?.appendChild(renderer.domElement);

      const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
      containerRef.current?.appendChild(arButton);
      // Auto-click the AR button to start session immediately
      setTimeout(() => arButton.click(), 100);

      // Create Reticle
      const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
      const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      // Load Elements
      const textureLoader = new THREE.TextureLoader();
      sceneGroup = new THREE.Group();
      
      elements.forEach(el => {
        const mesh = createMeshForElement(el, textureLoader);
        sceneGroup!.add(mesh);
      });
      
      sceneGroup.visible = false;
      scene.add(sceneGroup);
      setIsReady(true);

      // Controller
      const controller = renderer.xr.getController(0);
      controller.addEventListener('select', onSelect);
      scene.add(controller);

      function onSelect() {
        if (reticle.visible && sceneGroup && !sceneGroup.visible) {
          sceneGroup.position.setFromMatrixPosition(reticle.matrix);
          // Fazer o grupo olhar para a câmera no eixo Y
          const target = new THREE.Vector3(camera.position.x, sceneGroup.position.y, camera.position.z);
          sceneGroup.lookAt(target);
          sceneGroup.visible = true;
          reticle.visible = false;
          setIsPlaced(true);
        }
      }

      renderer.setAnimationLoop(render);

      window.addEventListener('resize', onWindowResize);
      
      // End session handler
      renderer.xr.addEventListener('sessionend', () => {
        onClose();
      });
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const render = (timestamp: number, frame?: XRFrame) => {
      if (frame && sceneGroup && !sceneGroup.visible) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (session && hitTestSourceRequested === false) {
          session.requestReferenceSpace('viewer').then((referenceSpace) => {
            session?.requestHitTestSource?.({ space: referenceSpace })?.then((source) => {
              if (source) {
                hitTestSource = source;
              }
            });
          });
          session.addEventListener('end', () => {
            hitTestSourceRequested = false;
            hitTestSource = null;
          });
          hitTestSourceRequested = true;
        }

        if (hitTestSource && referenceSpace) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
            }
          } else {
            reticle.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    };

    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      renderer.setAnimationLoop(null);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [imageUrl, onClose]);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      {/* Hide the default AR button because we auto-click it, but it might flash. 
          The auto-click happens fast. We can hide it using global css if needed, 
          but ARButton styles itself inline. */}
      <style>{`#ARButton { display: none !important; }`}</style>
      
      {!isPlaced && isReady && (
        <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none z-[120]">
          <div className="inline-block bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-sans">
            Aponte para o chão e toque para posicionar
          </div>
        </div>
      )}
    </div>
  );
}
