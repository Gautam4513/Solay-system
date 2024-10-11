import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const spherProperties={
    radius:1.2,
    widthSegments:64,
    heightSegments:32,
    color:[0x00ff00,0x0000ff,0xff0000,0x00ffff]
}
const oprbitRadius=4.3;
const spheres=new THREE.Group();
for(let i=0;i<4;i++){
    const geometry = new THREE.SphereGeometry(spherProperties.radius,spherProperties.widthSegments,spherProperties.heightSegments);
    const material = new THREE.MeshBasicMaterial({ color: spherProperties.color[i]});
    const sphere = new THREE.Mesh(geometry, material);
    const angle=(i/4)*(Math.PI*2);
    sphere.position.x=oprbitRadius*Math.cos(angle);
    sphere.position.z=oprbitRadius*Math.sin(angle);
    spheres.add(sphere);
}
scene.add(spheres)
// Position camera
spheres.rotation.x=0.13;
spheres.position.y=-0.5;
camera.position.z = 9;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
// setInterval(()=>{
//     gsap.to(spheres.rotation,{
//         y:`+=${Math.PI/2}`,
//         duration:2,
//         ease:"expo.easeInOut",
//     })
// },3000)

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
