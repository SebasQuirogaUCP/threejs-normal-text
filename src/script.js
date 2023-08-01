import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/** Environment Loaders */
const mapLoader = new THREE.TextureLoader();
const matcap1 = mapLoader.load("/textures/matcaps/1.png");

const envMaps = new THREE.CubeTextureLoader();
envMaps.load([
  "/envMaps/0/px.jpg",
  "/envMaps/0/nx.jpg",
  "/envMaps/0/py.jpg",
  "/envMaps/0/ny.jpg",
  "/envMaps/0/pz.jpg",
  "/envMaps/0/nz.jpg",
]);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Font Loader
 */

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Sebas & Aleja", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 10,
  });
  // const material = new THREE.MeshBasicMaterial();
  // material.wireframe = true

  const material = new THREE.MeshNormalMaterial();
  // material.wireframe = true
  textGeometry.center();

  // const material = new THREE.MeshMatcapMaterial({ map: matcap1 });

  // const material = new THREE.MeshStandardMaterial();
  // material.metalness = 0.7;
  // material.roughness = 0.2;
  // material.envMap = envMaps;

  const mesh = new THREE.Mesh(textGeometry, material);

  scene.add(mesh);
});

const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const torusMaterial = new THREE.MeshNormalMaterial();
// torusMaterial.wireframe = true

for (let i = 0; i < 100; i++) {
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  torus.position.x = (Math.random() - 0.5) * 15;
  torus.position.y = (Math.random() - 0.5) * 15;
  torus.position.z = (Math.random() - 0.5) * 15;

  // torus.rotation.x = Math.random() * Math.PI
  torus.rotation.z = Math.random() * Math.PI * 10;
  torus.rotation.x = Math.random() * Math.PI * 10;
  torus.rotation.y = Math.random() * Math.PI * 10;


  scene.add(torus);
}

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshNormalMaterial();
boxMaterial.wireframe = true;

for (let i = 0; i < 40; i++) {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;

  mesh.rotation.x = Math.random() * Math.PI;

  scene.add(mesh);
}

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
