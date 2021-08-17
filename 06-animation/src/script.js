import './style.css'
import * as THREE from 'three'
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


// requestAnimationFrame calls a function once, on the next frame
// We may use this to create a stop animation - grouping multiple images together with minimal change
// Ideal Frame rate - 60 FPS

// deltaTime solution
const previousTime = Date.now();


// Built in Clock solution
const clock = new THREE.Clock();


const tick = () => {
    //  Updating objects

    // Higher the framerate, faster the rendering (tick is called more often)
    
    // To create a uniform animation regardless of the framerate, we use change in time between subsequent tick calls
    // deltaTime (time between subseqent tick calls) will be smaller, the higher your framerate is
    // const currentTime = Date.now();
    // const deltaTime = currentTime - previousTime;
    // mesh.rotation.y += 0.000001 * deltaTime;

    // Clock solution
    // getElapsedTime returns seconds
    // const elapsedTime = clock.getElapsedTime();
    // mesh.rotation.y = 1.0 * elapsedTime;
    
    // One revolution per second
    // mesh.rotation.y = (2 * Math.PI) * elapsedTime;

    // Unit circle revolution - Hypothenuse = 0, sine(angle) = y, cosine(angle) = x
    // mesh.position.x = Math.cos(1.0 * elapsedTime);
    // mesh.position.y = Math.sin(1.0 * elapsedTime);

    // Moving the camera
    // Imagine drawing a unit circle from the top in  standard axes
    // camera.position.z = 3.0 * Math.cos(1.0 * elapsedTime);
    // camera.position.x = 3.0 * Math.sin(1.0 * elapsedTime);
    // camera.lookAt(mesh.position);

    // Frame render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick);
}
tick();

// gsap animation library
// creates a Tween, runs own tick like function but we still need to render using THREE
gsap.to(mesh.position, {
    duration: 1,
    delay: 1,
    x: 2
});
gsap.to(mesh.position, {
    duration: 1,
    delay: 2,
    x: 0
});
