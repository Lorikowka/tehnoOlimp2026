import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConcreteClass, concretePhysics } from '../data/concreteData';

interface Concrete3DSceneProps {
  sceneKey: number;
  selectedClass: ConcreteClass | null;
  testStatus: 'idle' | 'loading' | 'destroyed';
  currentLoadMPa: number;
  maxLoadMPa: number;
}

// Минимальный Y блока (нижняя грань на уровне пола)
const GROUND_LEVEL = -0.75;
const BLOCK_SIZE = 1.4;
const BLOCK_OFFSET_X = 0;

const MAX_FRAGMENTS = 82; // больше кусков для постепенного разрушения без визуального "взрыва"

const Concrete3DScene: React.FC<Concrete3DSceneProps> = ({
  sceneKey,
  selectedClass,
  testStatus,
  currentLoadMPa,
  maxLoadMPa,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef(testStatus);
  const loadRef = useRef(currentLoadMPa);
  const brokenRef = useRef(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const blockRef = useRef<THREE.Mesh | null>(null);
  const cracksRef = useRef<THREE.LineSegments[]>([]);
  const fragmentsRef = useRef<THREE.Mesh[]>([]);
  const fragmentVelocitiesRef = useRef<THREE.Vector3[]>([]);
  const fragmentAngularVelocitiesRef = useRef<THREE.Vector3[]>([]);
  const fragmentMassRef = useRef<number[]>([]);
  const fragmentInvMassRef = useRef<number[]>([]);
  const fragmentRadiusRef = useRef<number[]>([]);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => { statusRef.current = testStatus; }, [testStatus]);
  useEffect(() => { loadRef.current = currentLoadMPa; }, [currentLoadMPa]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const physicsId = selectedClass?.id || 'b7.5';
    const physics = concretePhysics[physicsId];
    if (!physics) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;
    if (width === 0 || height === 0) return;

    brokenRef.current = false;
    fragmentsRef.current = [];
    fragmentVelocitiesRef.current = [];
    fragmentAngularVelocitiesRef.current = [];
    fragmentMassRef.current = [];
    fragmentInvMassRef.current = [];
    fragmentRadiusRef.current = [];
    cracksRef.current = [];

    // === СЦЕНА ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    sceneRef.current = scene;

    // Нижняя грань блока на уровне пола: позиция = GROUND_LEVEL + BLOCK_SIZE/2
    const blockY = GROUND_LEVEL + BLOCK_SIZE / 2;

    // Камера
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    const isMobile = width < 640;
    const cameraTarget = new THREE.Vector3(BLOCK_OFFSET_X, blockY, 0);
    camera.position.set(
      BLOCK_OFFSET_X + (isMobile ? 2.05 : 2.35),
      blockY + (isMobile ? 1.35 : 1.45),
      isMobile ? 3.1 : 3.05,
    );
    camera.lookAt(cameraTarget);
    cameraRef.current = camera;

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x0b1220, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Управление
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = isMobile ? 2.4 : 1.8;
    controls.maxDistance = isMobile ? 10 : 8;
    controls.target.copy(cameraTarget);
    controls.update();
    controlsRef.current = controls;

    // Свет
    scene.add(new THREE.HemisphereLight(0xffffff, 0x111820, 0.8));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 5, 3);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-2.5, 2, 2);
    scene.add(pointLight);

    // Пол
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x111b2e, roughness: 0.95, metalness: 0.05 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_LEVEL;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(10, 10, 0x22334b, 0x10202b);
    grid.position.y = GROUND_LEVEL;
    scene.add(grid);

    // === БЛОК (заменим на немного более шероховатый материал) ===
    const blockColor = physics.internalColor;
    const blockMat = new THREE.MeshStandardMaterial({
      color: blockColor,
      roughness: 0.88,
      metalness: 0.06,
      transparent: true,
      opacity: 1,
    });
    const block = new THREE.Mesh(new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE), blockMat);
    block.position.set(BLOCK_OFFSET_X, blockY, 0);
    block.castShadow = true;
    block.receiveShadow = true;
    blockRef.current = block;
    scene.add(block);

    // === ТРЕЩИНЫ (скрыты изначально) ===
    const crackMaterial = new THREE.LineBasicMaterial({
      color: 0x1a1a1a,
      linewidth: 2,
      transparent: true,
      opacity: 0,
    });

    function createCracks(): THREE.LineSegments[] {
      const lines: THREE.LineSegments[] = [];
      const half = BLOCK_SIZE / 2;

      const clampToFace = (value: number, padding = 0.04) => Math.max(-half + padding, Math.min(half - padding, value));

      const addCrack = (points: THREE.Vector3[]) => {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        lines.push(new THREE.LineSegments(geo, crackMaterial.clone()));
      };

      const buildFaceCrack = (
        face: 'front' | 'right' | 'top',
        edge: 'left' | 'right' | 'top' | 'bottom',
        length: number,
      ) => {
        const points: THREE.Vector3[] = [];
        const segmentCount = 4 + Math.floor(Math.random() * 3);
        const lateral = (Math.random() - 0.5) * 0.55;
        const direction = edge === 'left' || edge === 'bottom' ? 1 : -1;

        for (let i = 0; i <= segmentCount; i++) {
          const t = i / segmentCount;
          const main = -half + t * length;
          const wander = Math.sin(t * Math.PI * (1.1 + Math.random() * 0.4)) * 0.08 + (Math.random() - 0.5) * 0.045;
          let x = BLOCK_OFFSET_X;
          let y = blockY;
          let z = 0;

          if (face === 'front') {
            z = half + 0.007;
            x = edge === 'left' || edge === 'right'
              ? BLOCK_OFFSET_X + direction * half + direction * t * length
              : BLOCK_OFFSET_X + clampToFace(lateral + wander);
            y = edge === 'top' || edge === 'bottom'
              ? blockY + direction * half + direction * t * length
              : blockY + clampToFace(lateral + wander);
            x = BLOCK_OFFSET_X + clampToFace(x - BLOCK_OFFSET_X);
            y = blockY + clampToFace(y - blockY);
          } else if (face === 'right') {
            x = BLOCK_OFFSET_X + half + 0.007;
            z = edge === 'left' || edge === 'right'
              ? direction * half + direction * t * length
              : clampToFace(lateral + wander);
            y = edge === 'top' || edge === 'bottom'
              ? blockY + direction * half + direction * t * length
              : blockY + clampToFace(lateral + wander);
            z = clampToFace(z);
            y = blockY + clampToFace(y - blockY);
          } else {
            y = blockY + half + 0.007;
            x = edge === 'left' || edge === 'right'
              ? BLOCK_OFFSET_X + direction * half + direction * t * length
              : BLOCK_OFFSET_X + clampToFace(lateral + wander);
            z = edge === 'top' || edge === 'bottom'
              ? direction * half + direction * t * length
              : clampToFace(lateral + wander);
            x = BLOCK_OFFSET_X + clampToFace(x - BLOCK_OFFSET_X);
            z = clampToFace(z);
          }

          points.push(new THREE.Vector3(x, y, z));
        }

        addCrack(points);
      };

      const faces: Array<'front' | 'right' | 'top'> = ['front', 'right', 'top'];
      const edges: Array<'left' | 'right' | 'top' | 'bottom'> = ['left', 'right', 'top', 'bottom'];
      for (let i = 0; i < 22; i++) {
        buildFaceCrack(
          faces[i % faces.length],
          edges[Math.floor(Math.random() * edges.length)],
          0.28 + Math.random() * 0.46,
        );
      }

      return lines;
    }

    const crackLines = createCracks();
    crackLines.forEach((c) => scene.add(c));
    cracksRef.current = crackLines;

    const strengthTarget = selectedClass?.strengthMPa || 40;

    // Создаём приземистые каменные фрагменты без острых "шипов".
    const createIrregularFragmentGeometry = (sizeMultiplier = 1): THREE.BufferGeometry => {
      const kind = Math.random();
      if (kind < 0.5) {
        const radius = (0.1 + Math.random() * 0.16) * sizeMultiplier;
        const detail = 1;
        const geo = new THREE.IcosahedronGeometry(radius, detail);
        const pos = geo.getAttribute('position') as THREE.BufferAttribute;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i);
          const noise = 0.82 + Math.random() * 0.32;
          v.multiplyScalar(noise);
          v.x *= 0.85 + Math.random() * 0.28;
          v.y *= 0.75 + Math.random() * 0.22;
          v.z *= 0.85 + Math.random() * 0.28;
          pos.setXYZ(i, v.x, v.y, v.z);
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
        return geo;
      }

      if (kind < 0.82) {
        const sx = (0.12 + Math.random() * 0.22) * sizeMultiplier;
        const sy = (0.08 + Math.random() * 0.16) * sizeMultiplier;
        const sz = (0.12 + Math.random() * 0.22) * sizeMultiplier;
        const geo = new THREE.BoxGeometry(sx, sy, sz, 3, 2, 3);
        const pos = geo.getAttribute('position') as THREE.BufferAttribute;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i);
          v.x += (Math.random() - 0.5) * 0.035;
          v.y += (Math.random() - 0.5) * 0.025;
          v.z += (Math.random() - 0.5) * 0.035;
          pos.setXYZ(i, v.x, v.y, v.z);
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
        geo.computeBoundingSphere();
        return geo;
      }

      const radius = (0.08 + Math.random() * 0.12) * sizeMultiplier;
      const geo = new THREE.DodecahedronGeometry(radius, 0);
      const pos = geo.getAttribute('position') as THREE.BufferAttribute;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.x *= 0.95 + Math.random() * 0.22;
        v.y *= 0.72 + Math.random() * 0.2;
        v.z *= 0.95 + Math.random() * 0.22;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
      return geo;
    };

    const createConcreteFragment = (
      position: THREE.Vector3,
      velocity: THREE.Vector3,
      sizeMultiplier = 1,
      angularSpeed = 0.02,
    ) => {
      const currentScene = sceneRef.current;
      if (!currentScene || fragmentsRef.current.length >= MAX_FRAGMENTS) return;

      const geo = createIrregularFragmentGeometry(sizeMultiplier);
      const baseColor = new THREE.Color(blockColor).lerp(new THREE.Color(0x8a8780), 0.55);
      const colorVariation = (Math.random() - 0.5) * 0.07;
      const fragMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          Math.max(0, Math.min(1, baseColor.r + colorVariation)),
          Math.max(0, Math.min(1, baseColor.g + colorVariation * 0.6)),
          Math.max(0, Math.min(1, baseColor.b + colorVariation * 0.4)),
        ),
        flatShading: true,
        roughness: 0.96,
        metalness: 0,
      });

      const frag = new THREE.Mesh(geo, fragMat);
      frag.castShadow = true;
      frag.receiveShadow = true;
      frag.position.copy(position);
      frag.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      frag.geometry.computeBoundingSphere();

      currentScene.add(frag);
      fragmentsRef.current.push(frag);

      const radius = frag.geometry.boundingSphere ? frag.geometry.boundingSphere.radius : 0.15;
      fragmentRadiusRef.current.push(radius);
      const mass = Math.max(0.08, Math.pow(radius, 3) * 4);
      fragmentMassRef.current.push(mass);
      fragmentInvMassRef.current.push(1 / mass);
      fragmentVelocitiesRef.current.push(velocity);
      fragmentAngularVelocitiesRef.current.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * angularSpeed,
          (Math.random() - 0.5) * angularSpeed,
          (Math.random() - 0.5) * angularSpeed,
        ),
      );
    };

    // Функция для выставления теней
    const enableShadowsOnNode = (node: THREE.Object3D) => {
      node.traverse((ch: any) => {
        if ((ch as THREE.Mesh).isMesh) {
          const m = ch as THREE.Mesh;
          m.castShadow = true;
          m.receiveShadow = true;
        }
      });
    };

    // === ФИЗИКА ===
    // простая физика: интеграция скоростей, шаровые столкновения между фрагментами, сонаправленная реакция, коррекция проницаемости
    const gravity = -0.0036; // настраиваемая гравитация
    const globalRestitution = 0.12; // бетонные куски почти не подпрыгивают
    const globalFriction = 0.55; // быстро гасим скольжение по полу

    // АНИМАЦИЯ
    const animate = () => {
      const load = loadRef.current;
      const progress = maxLoadMPa > 0 ? Math.min(load / maxLoadMPa, 1) : 0;

      // Блок сохраняет форму: под нагрузкой растут только трещины на гранях.
      if (statusRef.current !== 'idle' && !brokenRef.current) {
        block.scale.set(1, 1, 1);
        block.position.y = blockY;

        if (progress > 0.28) {
          const crackIntensity = Math.min(1, (progress - 0.28) / 0.71);
          crackLines.forEach((c) => {
            const mat = c.material as THREE.LineBasicMaterial;
            mat.opacity = Math.min(0.92, crackIntensity * 1.4);
          });
          const tremor = crackIntensity > 0.65 ? (Math.random() - 0.5) * 0.004 : 0;
          block.rotation.x = tremor;
          block.rotation.z = -tremor;
        }

        if (progress > 0.99) {
          const damageFactor = (progress - 0.99) / 0.01;
          const bc = new THREE.Color(blockColor);
          (block.material as THREE.MeshStandardMaterial).color.setRGB(
            Math.min(1, bc.r + damageFactor * 0.12),
            Math.max(0, bc.g - damageFactor * 0.06),
            Math.max(0, bc.b - damageFactor * 0.08),
          );
        }
      }

      // Разрушение: создаём фрагменты и задаём им физику
      const fractureThreshold = strengthTarget;
      if (!brokenRef.current && load >= fractureThreshold && statusRef.current !== 'idle') {
        brokenRef.current = true;
        block.visible = false;
        crackLines.forEach((c) => scene.remove(c));

        const fragmentCount = Math.max(physics.fragmentCount + 34, 54);
        const currentScene = sceneRef.current;
        if (!currentScene) return;

        const count = Math.min(fragmentCount, MAX_FRAGMENTS - fragmentsRef.current.length);
        for (let i = 0; i < count; i++) {
          const position = new THREE.Vector3(
            BLOCK_OFFSET_X + (Math.random() - 0.5) * BLOCK_SIZE * 0.8,
            GROUND_LEVEL + BLOCK_SIZE * 0.2 + Math.random() * BLOCK_SIZE * 0.6,
            (Math.random() - 0.5) * BLOCK_SIZE * 0.8,
          );
          const speed = 0.012 + Math.random() * 0.028;
          createConcreteFragment(
            position,
            new THREE.Vector3((Math.random() - 0.5) * speed, 0.012 + Math.random() * 0.026, (Math.random() - 0.5) * speed),
            0.62 + Math.random() * 0.55,
            0.024,
          );
        }

        // при старте разгружаем перекрытия: легкая коррекция позиций
        for (let a = 0; a < fragmentsRef.current.length; a++) {
          for (let b = a + 1; b < fragmentsRef.current.length; b++) {
            const fa = fragmentsRef.current[a];
            const fb = fragmentsRef.current[b];
            const ra = fragmentRadiusRef.current[a];
            const rb = fragmentRadiusRef.current[b];
            const dir = new THREE.Vector3().subVectors(fb.position, fa.position);
            const dist = dir.length();
            const minDist = ra + rb;
            if (dist < 1e-5) dir.set(Math.random(), 0.01, Math.random()).normalize();
            if (dist < minDist) {
              const overlap = (minDist - dist) * 0.5;
              dir.normalize();
              fa.position.addScaledVector(dir, -overlap);
              fb.position.addScaledVector(dir, overlap);
            }
          }
        }
      }

      // Физика осколков + коллизия с полом и между фрагментами
      if (brokenRef.current) {
        const frags = fragmentsRef.current;
        const vels = fragmentVelocitiesRef.current;
        const angs = fragmentAngularVelocitiesRef.current;
        const invMass = fragmentInvMassRef.current;
        const radii = fragmentRadiusRef.current;
        const n = frags.length;

        // интеграция и пол
        for (let i = 0; i < n; i++) {
          const frag = frags[i];
          const vel = vels[i];
          const ang = angs[i];
          if (!vel) continue;

          // интеграция позиций и вращения
          frag.position.add(vel);
          frag.rotation.x += ang.x;
          frag.rotation.y += ang.y;
          frag.rotation.z += ang.z;

          // гравитация
          vel.y += gravity;

          // демпфинг
          vel.x *= 0.985;
          vel.z *= 0.985;
          ang.multiplyScalar(0.94);

          // коллизия с полом
          const r = radii[i] || 0.12;
          if (frag.position.y - r < GROUND_LEVEL) {
            frag.position.y = GROUND_LEVEL + r;
            // отражение по Y
            vel.y *= -globalRestitution;
            // трение: уменьшаем горизонтальную скорость
            vel.x *= globalFriction;
            vel.z *= globalFriction;
            // небольшая ротация от удара
            ang.multiplyScalar(0.45);
          }
        }

        // pairwise sphere collisions (простая импульсная модель)
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const A = frags[i];
            const B = frags[j];
            const ra = radii[i] || 0.12;
            const rb = radii[j] || 0.12;
            const invMa = invMass[i] || 1;
            const invMb = invMass[j] || 1;
            const rel = new THREE.Vector3().subVectors(B.position, A.position);
            const dist = rel.length();
            const minDist = ra + rb;
            if (dist <= 0) continue;
            if (dist < minDist) {
              // нормализуем
              const nrm = rel.clone().divideScalar(dist);
              // относительная скорость
              const rv = new THREE.Vector3().subVectors(fragmentVelocitiesRef.current[j], fragmentVelocitiesRef.current[i]);
              const velAlongNormal = rv.dot(nrm);
              // пропускаем если уже расходятся
              if (velAlongNormal > 0) {
                // коррекция позиции
                const penetration = minDist - dist;
                const corr = nrm.clone().multiplyScalar(penetration * 0.5);
                A.position.addScaledVector(corr, -1);
                B.position.add(corr);
                continue;
              }

              const e = Math.min(globalRestitution, globalRestitution);
              const jImpulse = -(1 + e) * velAlongNormal / (invMa + invMb);
              const impulse = nrm.clone().multiplyScalar(jImpulse);

              // применяем импульс
              fragmentVelocitiesRef.current[i].addScaledVector(impulse, -invMa);
              fragmentVelocitiesRef.current[j].addScaledVector(impulse, invMb);

              // positional correction для устранения проникновения
              const percent = 0.2; // корр. фактор
              const slop = 0.01;
              const penetration = Math.max(minDist - dist, 0);
              const correction = nrm.clone().multiplyScalar((Math.max(penetration - slop, 0) / (invMa + invMb)) * percent);
              A.position.addScaledVector(correction, -invMa);
              B.position.addScaledVector(correction, invMb);

              // небольшая обменная ротация
              const rnd = (Math.random() - 0.5) * 0.12;
              fragmentAngularVelocitiesRef.current[i].x += rnd * invMa;
              fragmentAngularVelocitiesRef.current[j].x -= rnd * invMb;
            }
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Ресайз
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 450;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Очистка
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
      controlsRef.current?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedClass?.id, maxLoadMPa, sceneKey]);

  return (
    <div className="rounded-3xl border border-slate-800/50 bg-slate-950/95 p-3 shadow-xl shadow-black/20">
      <div className="mb-3 text-sm font-semibold text-slate-100">
        3D-симуляция бетонного блока
        {selectedClass && <span className="text-slate-500 ml-2">({selectedClass.label})</span>}
      </div>
      <div ref={containerRef} className="h-[280px] sm:h-[360px] lg:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900" />
      <div className="mt-3 text-xs text-slate-400">
        Постепенное давление. Трещины появляются при высокой нагрузке. При достижении прочности — разрушение.
      </div>
    </div>
  );
};

export default Concrete3DScene;
