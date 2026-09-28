'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

interface ARViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ARViewer({ imageUrl, onClose }: ARViewerProps) {
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
    let mockupMesh: THREE.Mesh | null = null;

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

      // Load Texture
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(imageUrl, (texture) => {
        const aspect = texture.image.width / texture.image.height;
        // Assume physical width is roughly 2.5 meters
        const planeWidth = 2.5; 
        const planeHeight = planeWidth / aspect;
        
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshBasicMaterial({ 
          map: texture, 
          transparent: true,
          side: THREE.DoubleSide
        });
        mockupMesh = new THREE.Mesh(geometry, material);
        // Translate to stand on the floor
        geometry.translate(0, planeHeight / 2, 0); 
        mockupMesh.visible = false;
        scene.add(mockupMesh);
        setIsReady(true);
      });

      // Controller
      const controller = renderer.xr.getController(0);
      controller.addEventListener('select', onSelect);
      scene.add(controller);

      function onSelect() {
        if (reticle.visible && mockupMesh && !mockupMesh.visible) {
          mockupMesh.position.setFromMatrixPosition(reticle.matrix);
          // Look at the camera on the Y axis
          const target = new THREE.Vector3(camera.position.x, mockupMesh.position.y, camera.position.z);
          mockupMesh.lookAt(target);
          mockupMesh.visible = true;
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
      if (frame && mockupMesh && !mockupMesh.visible) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (session && hitTestSourceRequested === false) {
          session.requestReferenceSpace('viewer').then((referenceSpace) => {
            if (session.requestHitTestSource) {
              session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                hitTestSource = source;
              });
            }
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
