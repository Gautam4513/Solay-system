import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

// const loader = new THREE.TextureLoader();

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
    antialias: true
});

camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);

const loader = new RGBELoader();
loader.load("./hdri/moonlit_golf_4k.hdr", function (hdri) {
    hdri.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdri;
    
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const starTexture = new THREE.TextureLoader().load('./star.jpg');
starTexture.colorSpace = THREE.SRGBColorSpace;

scene.background = starTexture;
scene.backgroundIntensity = 0.5;


const earthCloudeGroup = new THREE.Group();


function createEarth() {
    const earthGeo = new THREE.SphereGeometry(2, 250, 250);
    const earthMat = new THREE.MeshPhysicalMaterial();
    const earth = new THREE.Mesh(earthGeo, earthMat);
    // scene.add(earth);
    earthCloudeGroup.add(earth);
    let earthtaxt = new THREE.TextureLoader().load('./earth/earthColor.jpg');
    earthtaxt.colorSpace = THREE.SRGBColorSpace;
    earthMat.map = earthtaxt;
}
createEarth();
function createEarthClouds() {
    const earthCloudGeo = new THREE.SphereGeometry(2.01, 250, 250);
    const earthCloudMat = new THREE.MeshPhysicalMaterial();
    const earthCloud = new THREE.Mesh(earthCloudGeo, earthCloudMat);
    // scene.add(earthCloud);
    earthCloudeGroup.add(earthCloud);
    let earthCloudtaxt = new THREE.TextureLoader().load('./earth/earthCloud.jpg');
    earthCloudMat.alphaMap = earthCloudtaxt;
    earthCloudMat.transparent = true;
}

function createMoon(){
    const moonGeo=new THREE.SphereGeometry(0.5,250,250);
    const moonMat=new THREE.MeshPhysicalMaterial();
    const moon=new THREE.Mesh(moonGeo,moonMat);
    // scene.add(moon);
    const moonTxt=new THREE.TextureLoader().load("./moon/2k_moon.jpg");
    moonTxt.colorSpace=THREE.SRGBColorSpace;
    moonMat.map=moonTxt;
    moon.position.x=5;
    return moon;
}
const moon=createMoon();
const moonGroup=new THREE.Group();
moonGroup.add(moon);

//function for rotating moon
function rotateMoon(){
    moon.rotation.y=clock.getElapsedTime()*0.1;
}


createEarthClouds();

//create earth clude moon group
const earthMaster=new THREE.Group();
earthMaster.add(earthCloudeGroup);
earthMaster.add(moonGroup);

scene.add(earthMaster);

//function for rotate earth nad cloud
function rotateEarth() {
    earthCloudeGroup.children.forEach((item, index) => {
        item.rotation.y = clock.getElapsedTime() * 0.05 * (index + 1);
    })
}


const clock = new THREE.Clock();
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    //rotate earth
    rotateEarth();
    //moon rotation
    rotateMoon();
    //rotate moon in orbit
    moonGroup.rotation.y=clock.getElapsedTime()*0.01;


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
