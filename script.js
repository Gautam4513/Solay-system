import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
const spherProperties={
    radius:1,
    widthSegments:32,
    heightSegments:32,
    color:[0x00ff00,0x0000ff,0xff0000,0x00ffff]
}
const spheres=new THREE.Group();
for(let i=0;i<=4;i++){
    const geometry = new THREE.SphereGeometry(spherProperties.radius,spherProperties.widthSegments,spherProperties.heightSegments);
    const material = new THREE.MeshBasicMaterial({ color: spherProperties.color[i]});
    const sphere = new THREE.Mesh(geometry, material);
    spheres.add(sphere);
}
scene.add(spheres)
// Position camera
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
