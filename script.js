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

const loader = new RGBELoader();
loader.load("public/hdri/moonlit_golf_4k.hdr", function (hdri) {
    hdri.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdri;
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Create a big sphere with stars texture
const starTexture = new THREE.TextureLoader().load('public/stars-1728647241324-6905.jpg');
starTexture.colorSpace = THREE.SRGBColorSpace;

scene.background = starTexture;
scene.backgroundIntensity = 0.5;




const spherProperties = {
    radius: 1.2,
    widthSegments: 64,
    heightSegments: 32,
    color: [0x00ff00, 0x0000ff, 0xff0000, 0x00ffff],
    planetColor: ["public/mars/mars_1k_color.jpg", "public/ertha/color.jpg", "public/mercury/mercurymap.jpg", "public/venus/venusmap.jpg"]
}
const sphereMesh = [];
const oprbitRadius = 4.3;
const spheres = new THREE.Group();
for (let i = 0; i < 4; i++) {
    const texture = new THREE.TextureLoader().load(spherProperties.planetColor[i]);
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.SphereGeometry(spherProperties.radius, spherProperties.widthSegments, spherProperties.heightSegments);
    const material = new THREE.MeshPhysicalMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    sphereMesh.push(sphere);
    const angle = (i / 4) * (Math.PI * 2);
    sphere.position.x = oprbitRadius * Math.cos(angle);
    sphere.position.z = oprbitRadius * Math.sin(angle);
    spheres.add(sphere);
}
scene.add(spheres)
// Position camera
spheres.rotation.x = 0.13;
spheres.position.y = -0.5;
camera.position.z = 9;

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
let scrollCount = 0;
let touchStartX = 0;
let touchStartY = 0;

// Throttled scroll/swipe event handler
const handleScrollOrSwipe = throttle((direction) => {
    console.log(direction);
    

    const headings = document.querySelectorAll(".heading");
    let move;
    if (direction === "down" || direction === "left") {
        scrollCount = (scrollCount + 1) % 4;
        move = "-="
    } else {
        if (scrollCount === 0) {
            scrollCount = 4;
        } else {
            scrollCount--;
        }
        move = "+="
    }console.log(scrollCount);
    gsap.to(headings, {
        y: `${move}${100}%`,
        duration: 1,
        ease: "power2.inOut"
    });

    gsap.to(spheres.rotation, {
        y: `${move}${Math.PI / 2}`,
        duration: 1,
        ease: "power2.inOut"
    });

    if (scrollCount === 0) {
        gsap.to(headings, {
            duration: 1,
            y: `0`,
            ease: "power2.inOut"
        });
    }
    if (scrollCount === 4) {
        scrollCount=3;
        gsap.to(headings, {
            duration: 1,
            y: `-300%`,
            ease: "power2.inOut"
        });
    }
}, 1000);

// Wheel event handler
const handleWheel = (event) => {
    const delta = event.deltaY;
    handleScrollOrSwipe(delta > 0 ? 'down' : 'up');
};

// Touch event handlers
const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
};

const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > 50) { // Minimum swipe distance
            handleScrollOrSwipe(deltaX > 0 ? 'left' : 'right');
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            handleScrollOrSwipe(deltaY > 0 ? 'up' : 'down');
        }
    }
};

// Add event listeners
window.addEventListener('wheel', handleWheel);
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchend', handleTouchEnd);

const clock = new THREE.Clock();
// Animation loop
function animate() {
    requestAnimationFrame(animate);
    sphereMesh.forEach((sphere, index) => {
        // console.log(index);
        sphere.rotation.y = clock.getElapsedTime() * 0.05;
    })
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
