import * as THREE from 'three';
const playerConfig = await fetch(new URL('../data/player.json', import.meta.url)).then((response) => {
  if (!response.ok) throw new Error('Não foi possível carregar a configuração do personagem.');
  return response.json();
});

const mount = document.querySelector('#scene');
const notice = document.querySelector('#notice');
const staminaBar = document.querySelector('#stamina');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#94a89a');
scene.fog = new THREE.FogExp2('#879989', 0.018);

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 220);
camera.position.set(0, 5.2, 9);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight('#dbe8ce', '#3a463d', 2.0));
const sun = new THREE.DirectionalLight('#ffe6bd', 3.2);
sun.position.set(-9, 16, 8);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const ground = new THREE.Mesh(new THREE.CircleGeometry(90, 80), new THREE.MeshStandardMaterial({ color: '#667957', roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.04;
ground.receiveShadow = true;
scene.add(ground);
const clearing = new THREE.Mesh(new THREE.CircleGeometry(15, 48), new THREE.MeshStandardMaterial({ color: '#89906b', roughness: 1 }));
clearing.rotation.x = -Math.PI / 2;
clearing.position.y = 0.005;
clearing.receiveShadow = true;
scene.add(clearing);

function makeTree(x, z, scale = 1) {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  const bark = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.58, 4.8, 7), new THREE.MeshStandardMaterial({ color: '#514337', roughness: 1 }));
  bark.position.y = 2.4;
  bark.castShadow = true;
  bark.receiveShadow = true;
  tree.add(bark);
  const crownMat = new THREE.MeshStandardMaterial({ color: ['#405845', '#4b6249', '#596b4a'][Math.floor(Math.random() * 3)], roughness: 0.95, flatShading: true });
  for (const [cx, cy, cz, size] of [[0, 5, 0, 2.4], [-1.15, 4.6, 0.3, 1.7], [1.1, 4.7, -0.25, 1.8], [0.2, 6, 0.1, 1.6]]) {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(size, 1), crownMat);
    crown.position.set(cx, cy, cz);
    crown.castShadow = true;
    tree.add(crown);
  }
  scene.add(tree);
}

for (let i = 0; i < 115; i += 1) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 17 + Math.random() * 48;
  makeTree(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.72 + Math.random() * 1.15);
}
// Distant canopy silhouettes make the edge feel enclosed without a hard wall.
const farMat = new THREE.MeshBasicMaterial({ color: '#35483a', fog: true });
for (let i = 0; i < 55; i += 1) {
  const angle = (i / 55) * Math.PI * 2;
  const crown = new THREE.Mesh(new THREE.ConeGeometry(8 + Math.random() * 4, 24, 7), farMat);
  crown.position.set(Math.cos(angle) * 75, 10, Math.sin(angle) * 75);
  scene.add(crown);
}

const player = new THREE.Group();
const bodyMat = new THREE.MeshStandardMaterial({ color: playerConfig.appearance.bodyColor, roughness: 0.78, flatShading: true });
const scarfMat = new THREE.MeshStandardMaterial({ color: playerConfig.appearance.scarfColor, roughness: 0.72, flatShading: true });
const skinMat = new THREE.MeshStandardMaterial({ color: '#c99a75', roughness: 0.9, flatShading: true });
const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.72, 4, 8), bodyMat);
torso.position.y = 1.12;
torso.castShadow = true;
player.add(torso);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 10), skinMat);
head.position.y = 1.93;
head.castShadow = true;
player.add(head);
const headband = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.12), scarfMat);
headband.position.set(0, 2.11, 0.03);
player.add(headband);
const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.18, 0.65), scarfMat);
scarf.position.set(0, 1.53, -0.02);
player.add(scarf);
const legs = [];
for (const side of [-1, 1]) {
  const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.48, 3, 6), bodyMat);
  leg.position.set(side * 0.2, 0.43, 0);
  leg.castShadow = true;
  player.add(leg);
  legs.push(leg);
}
const arms = [];
for (const side of [-1, 1]) {
  const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.4, 3, 6), bodyMat);
  arm.position.set(side * 0.48, 1.15, 0);
  arm.rotation.z = side * -0.14;
  arm.castShadow = true;
  player.add(arm);
  arms.push(arm);
}
player.traverse((child) => { if (child.isMesh) child.castShadow = true; });
scene.add(player);

const keys = new Set();
const keyMap = { ArrowUp: 'w', ArrowDown: 's', ArrowLeft: 'a', ArrowRight: 'd' };
addEventListener('keydown', (event) => {
  const key = keyMap[event.key] ?? event.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'shift', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault();
  keys.add(key);
});
addEventListener('keyup', (event) => keys.delete(keyMap[event.key] ?? event.key.toLowerCase()));
addEventListener('blur', () => keys.clear());

let engine = null;
let stamina = 100;
let position = { x: 0, z: 0, facing: 0, speed: 0 };
let mode = 'javascript';
try {
  const { default: createEngine } = await import(new URL('../wasm/game.js', import.meta.url).href);
  const wasm = await createEngine();
  engine = new wasm.Engine();
  mode = 'wasm';
} catch (error) {
  notice.hidden = false;
  notice.textContent = 'Núcleo WebAssembly indisponível. Movimento executado em modo de demonstração JavaScript. Compile com emcmake para ativar o núcleo C++.';
  console.info('Usando simulação de movimento de demonstração.', error);
}

const clock = new THREE.Clock();
let elapsed = 0;
function animate() {
  requestAnimationFrame(animate);
  const frame = Math.min(clock.getDelta(), 0.05);
  elapsed += frame;
  const inputX = Number(keys.has('d')) - Number(keys.has('a'));
  const inputZ = Number(keys.has('s')) - Number(keys.has('w'));
  const sprint = keys.has('shift');

  if (engine) {
    engine.setInput(inputX, inputZ, sprint);
    engine.advance(frame);
    position = { x: engine.x(), z: engine.z(), facing: engine.facing(), speed: engine.speed() };
    stamina = engine.stamina();
  } else {
    const length = Math.hypot(inputX, inputZ) || 1;
    const nx = inputX / length;
    const nz = inputZ / length;
    const moving = inputX !== 0 || inputZ !== 0;
    const fast = moving && sprint && stamina > 0;
    const speed = fast ? 8 : 4.5;
    if (fast) stamina = Math.max(0, stamina - 24 * frame);
    else stamina = Math.min(100, stamina + (moving ? 5 : 16) * frame);
    if (moving) {
      position.x += nx * speed * frame;
      position.z += nz * speed * frame;
      position.facing = Math.atan2(nx, nz);
    }
    position.speed = moving ? speed : 0;
  }

  player.position.set(position.x, 0, position.z);
  player.rotation.y = position.facing;
  const gait = position.speed > 0 ? Math.sin(elapsed * (sprint ? 14 : 9)) * (sprint ? 0.72 : 0.48) : Math.sin(elapsed * 2) * 0.035;
  legs[0].rotation.x = gait;
  legs[1].rotation.x = -gait;
  arms[0].rotation.x = -gait * 0.7;
  arms[1].rotation.x = gait * 0.7;
  torso.position.y = 1.12 + (position.speed > 0 ? Math.abs(Math.sin(elapsed * 18)) * 0.055 : 0);
  staminaBar.style.width = `${Math.max(0, stamina)}%`;

  const target = new THREE.Vector3(position.x, 1.1, position.z);
  const cameraOffset = new THREE.Vector3(0, 5.4, 8.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), position.facing);
  camera.position.lerp(target.clone().add(cameraOffset), 1 - Math.exp(-5.5 * frame));
  camera.lookAt(target);
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

document.documentElement.dataset.engine = mode;
