import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';


// const loader = new THREE.TextureLoader();

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas'),
    antialias: true
});

camera.position.z = 5;
// const controls = new OrbitControls(camera, renderer.domElement);

const loader = new RGBELoader();
loader.load("./hdri/hdri.hdr", function (hdri) {
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
    const earthGeo = new THREE.SphereGeometry(1, 250, 250);
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
    const earthCloudGeo = new THREE.SphereGeometry(1.01, 250, 250);
    const earthCloudMat = new THREE.MeshPhysicalMaterial();
    const earthCloud = new THREE.Mesh(earthCloudGeo, earthCloudMat);
    // scene.add(earthCloud);
    earthCloudeGroup.add(earthCloud);
    let earthCloudtaxt = new THREE.TextureLoader().load('./earth/earthCloud.jpg');
    earthCloudMat.alphaMap = earthCloudtaxt;
    earthCloudMat.transparent = true;
}

function createMoon(){
    const moonGeo=new THREE.SphereGeometry(0.3,250,250);
    const moonMat=new THREE.MeshPhysicalMaterial();
    const moon=new THREE.Mesh(moonGeo,moonMat);
    // scene.add(moon);
    const moonTxt=new THREE.TextureLoader().load("./moon/2k_moon.jpg");
    moonTxt.colorSpace=THREE.SRGBColorSpace;
    moonMat.map=moonTxt;
    moon.position.x=2;
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

//add earth master to scene
// scene.add(earthMaster);


//create mars
function createMars(){
    const marhGeo=new THREE.SphereGeometry(1,250,250);
    const marsMat = new THREE.MeshPhysicalMaterial();
    const mars=new THREE.Mesh(marhGeo,marsMat);
    marsMat.map=new THREE.TextureLoader().load("./mars/marsh.jpg");
    
    return mars;
}
const mars=createMars();
// scene.add(mars);

//create mercury
function createMercury(){
    const mercuryGeo=new THREE.SphereGeometry(1,250,250);
    const mercuryMat = new THREE.MeshPhysicalMaterial();
    const mercury=new THREE.Mesh(mercuryGeo,mercuryMat);
    mercuryMat.map=new THREE.TextureLoader().load("./mercury/2k_mercury.jpg");
    
    return mercury;
}
const mercury=createMercury();
// scene.add(mercury);


//create venus
function createVenus(){
    const venusGeo = new THREE.SphereGeometry(1,250,250);
    const venusMat= new THREE.MeshPhysicalMaterial();
    const venus = new THREE.Mesh(venusGeo,venusMat);
    venusMat.map = new THREE.TextureLoader().load("./venus/color.jpg");
    return venus;
}
const venus=createVenus();
// scene.add(venus);

// create venus atmosphere
function createVenusAtmosphere(){
    const venusAtmosphereGeo=new THREE.SphereGeometry(1.01,250,250);
    const venusAtmosphereMat= new THREE.MeshPhysicalMaterial();
    const venusAtmosphere = new THREE.Mesh(venusAtmosphereGeo,venusAtmosphereMat);
    venusAtmosphereMat.alphaMap=new THREE.TextureLoader().load("./venus/2k_venus_atmosphere.jpg");
    venusAtmosphereMat.transparent=true;
    return venusAtmosphere;
}
const venusAtmosphere=createVenusAtmosphere();
// scene.add(venusAtmosphere);

//create venus group
const venusGroup=new THREE.Group();
venusGroup.add(venus);
venusGroup.add(venusAtmosphere);
// scene.add(venusGroup);

//create main group
const mainGroup=new THREE.Group();
mainGroup.add(earthMaster);
mainGroup.add(venusGroup);
mainGroup.add(mars);
mainGroup.add(mercury);
mainGroup.rotation.y=-Math.PI/2;
mainGroup.rotation.x=0.3;
scene.add(mainGroup);

//set potion to all planets

mainGroup.children.forEach((item,index)=>{
    let angle=index*Math.PI/2;
    item.position.x=Math.cos(angle)*3;
    item.position.z=Math.sin(angle)*3;
})

//main functnality
// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}



// Throttled scroll event handler
const handleScroll = throttle(function(e) {
    const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
    if(scrollDirection=='down'){
        gsap.to(mainGroup.rotation,{
            y:`-=${Math.PI/2}`,
            duration:1,
            ease:'power1.inOut'
        })
    }
    else{
        gsap.to(mainGroup.rotation,{
            y:`+=${Math.PI/2}`,
            duration:1,
            ease:'power1.inOut'
        })
    }
}, 1000);

// Add event listener for scroll
window.addEventListener('wheel', (e)=>{
    handleScroll(e);
});




//function for rotate earth nad cloud
function rotateEarth() {
    earthCloudeGroup.children.forEach((item, index) => {
        item.rotation.y = clock.getElapsedTime() * 0.05 * (index + 1);
    })
}

//function for mars rotation
function marshRotation(){
    mars.rotation.y=clock.getElapsedTime()*0.1;
}

//function for mercury rotation
function mercuryRotation(){
    mercury.rotation.y=clock.getElapsedTime()*0.1;
}

//venus rotation
function venusRotation(){
    venus.rotation.y=clock.getElapsedTime()*0.01;
}

//venus atmosphear rotaion
function venusAtmosphereRotation(){
    venusAtmosphere.rotation.y=clock.getElapsedTime()*0.05;
}

const clock = new THREE.Clock();
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    // controls.update();
    //rotate earth
    rotateEarth();
    //moon rotation
    rotateMoon();
    //rotate moon in orbit
    moonGroup.rotation.y=clock.getElapsedTime()*0.01;

    //marsh rotation
    marshRotation();

    //mercury rotation
    mercuryRotation();

    //venus rotation
    venusRotation();

    //venus atmosphear rotaion
    venusAtmosphereRotation();


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
