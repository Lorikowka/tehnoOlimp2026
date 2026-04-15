import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConcreteClass, concretePhysics } from '../data/concreteData';
import { DestructibleMesh, FractureOptions } from '@dgreenheck/three-pinata';

interface ThreePinataSceneProps {
  selectedClass: ConcreteClass | null;
  testStatus: 'idle' | 'loading' | 'destroyed';
  currentLoadMPa: number;
  maxLoadMPa: number;
}

const ThreePinataScene: React.FC<ThreePinataSceneProps> = ({
  selectedClass,
  testStatus,
  currentLoadMPa,
  maxLoadMPa,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef(testStatus);
  const loadRef = useRef(currentLoadMPa);
  const brokenRef = useRef(false);

  useEffect(() => {
    statusRef.current = testStatus;
  }, [testStatus]);

  useEffect(() => {
    loadRef.current = currentLoadMPa;
  }, [currentLoadMPa]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const physics = concretePhysics[selectedClass?.id || 'b7.5'];
    if (!physics) {
      console.error('No physics data for class', selectedClass?.id);
      return;
    }

    console.log('Physics for', selectedClass?.id, physics);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(3.2, 2.2, 3.2);
    camera.lookAt(0, 0.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const initialWidth = container.clientWidth || 450;
    const initialHeight = container.clientHeight || 450;
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.domElement.style.display = 'block';
    renderer.setClearColor(0x0b1220, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.8;
    controls.maxDistance = 8;
    controls.target.set(0, 0.7, 0);
    controls.update();

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x111820, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(3, 5, 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-2.5, 2, 2);
    scene.add(pointLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x111b2e, roughness: 0.95, metalness: 0.05 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.75;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(10, 10, 0x22334b, 0x10202b);
    grid.position.y = -0.75;
    scene.add(grid);

    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5a5a,
      transparent: true,
      opacity: 0.75,
      roughness: 0.4,
      metalness: 0.1,
    });
    const pressPlate = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 1.8), plateMaterial);
    pressPlate.position.set(0, 3.5, 0);
    pressPlate.receiveShadow = true;
    scene.add(pressPlate);

    const outerMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b8b8b,
      roughness: 0.85,
      metalness: 0.08,
    });
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1a37d,
      roughness: 0.9,
      metalness: 0.05,
    });

    const densityKgM3 = physics.densityKgM3;
    const elasticityGPa = physics.elasticityGPa;
    const fragmentCount = physics.fragmentCount;
    const velocityFactor = physics.velocityFactor;
    const fractureSensitivity = physics.fractureSensitivity;
    const colorHex = physics.internalColor;

    outerMaterial.color.setHex(colorHex);
    innerMaterial.color.setHex(colorHex);

    const destructibleMesh = new DestructibleMesh(
      new THREE.BoxGeometry(1.4, 1.4, 1.4),
      outerMaterial,
      innerMaterial,
    );
    destructibleMesh.position.y = 0.7;
    destructibleMesh.castShadow = true;
    destructibleMesh.receiveShadow = true;
    scene.add(destructibleMesh);

    const fractureOptions = new FractureOptions({
      fractureMethod: 'voronoi',
      fragmentCount,
      seed: 12345,
      voronoiOptions: {
        mode: '3D',
      },
    });

    const fragments: THREE.Mesh[] = [];
    const fragmentVelocities: THREE.Vector3[] = [];
    const strengthTarget = selectedClass?.strengthMPa || 40;

    const animate = () => {
      const load = loadRef.current;
      const effectiveLoad = load * fractureSensitivity;
      const progress = maxLoadMPa > 0 ? Math.min(load / maxLoadMPa, 1) : 0;

      if (statusRef.current === 'loading' || statusRef.current === 'destroyed') {
        pressPlate.position.y = 3.4 - progress * 2.1;
        const stiffness = Math.max(0.7, Math.min(1.3, elasticityGPa / 30));
        const squash = 1 - progress * 0.08 / stiffness;
        destructibleMesh.scale.y = squash;
        destructibleMesh.position.y = 0.7 - (1 - squash) * 0.35;
      }

      if (!brokenRef.current && load >= strengthTarget && statusRef.current === 'loading') {
        console.log('Fracturing!', load, strengthTarget);
        brokenRef.current = true;
        pressPlate.material.color.setHex(0x8b0000);

        const newFragments = destructibleMesh.fracture(fractureOptions);
        newFragments.forEach((fragment, index) => {
          fragment.castShadow = true;
          fragment.receiveShadow = true;
          fragment.position.copy(destructibleMesh.position);
          fragment.rotation.copy(destructibleMesh.rotation);
          scene.add(fragment);
          fragments.push(fragment);
          fragmentVelocities.push(
            new THREE.Vector3(
              (Math.random() - 0.5) * 0.04,
              -0.03 - Math.random() * 0.015,
              (Math.random() - 0.5) * 0.04,
            ),
          );
        });

        destructibleMesh.visible = false;
        pressPlate.material.opacity = 0.4;
      }

      if (brokenRef.current) {
        fragments.forEach((fragment, index) => {
          const velocity = fragmentVelocities[index];
          if (!velocity) return;
          fragment.position.add(velocity);
          fragment.rotation.x += 0.025;
          fragment.rotation.y += 0.02;
          fragment.rotation.z += 0.015;
          velocity.y -= 0.0009;
        });
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth || 450;
      const height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedClass, maxLoadMPa]);

  return (
    <div className="rounded-3xl border border-slate-800/50 bg-slate-950/95 p-3 shadow-xl shadow-black/20">
      <div className="mb-3 text-sm font-semibold text-slate-100">3D-симуляция бетонного блока</div>
      <div ref={containerRef} className="h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900" />
      <div className="mt-3 text-xs text-slate-400">
        Сила сверху действует на блок в режиме испытания. При достижении прочности блок разрушается на фрагменты.
      </div>
    </div>
  );
};

export default ThreePinataScene;
