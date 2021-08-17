import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    // We prefer the cursor (x, y) values to be between 0 and 1, AND we prefer (0, 0) to be at the center of the render as opposed to top left corner default
    cursor.x = (event.clientX / sizes.width) - 0.5;
    cursor.y = - ((event.clientY / sizes.height) - 0.5);
    // console.log(cursor.x, cursor.y);
});

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera

// PerspectiveCamera parameters - (Vertical FOV, Aspect Ratio, Near plane, Far plane)
// Near and Far plane define the visiblility range, objects with parts of them outside the range will only be partly visible
// Defining extreme values for near and far leads to --> Z - Fighting
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

// OrthographicCamera - no perspective, replicates orthographic projection
// Parameters - left, right, top, bottom, near, far
// Unlike the perspetive camera, its not a cone (no angle), since theres no perspective.. instead think of it as a rectangle
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
// Square camera on a rectangular render creates unexpected results which could be fixed using the aspect ratio as it accounts for both width and height, and if they're the same then its 1


// camera.position.set(2, 2, 2)
camera.position.set(0, 0, 3);
camera.lookAt(mesh.position)
scene.add(camera)

// Built-in camera controls
const orbitControls = new OrbitControls(camera, canvas);
// Defaults the camera to be looking at the scene center
orbitControls.target = mesh.position;
// Damping the controls would smoothen them by adding accelaration and friction
orbitControls.enableDamping = true;



// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // mesh.rotation.y = 1.0 * elapsedTime;

    // Updating the camera

    // cursor values are multiplied by a scale up factor
    // camera.position.x = 10.0 * cursor.x;
    // camera.position.y = 10.0 * cursor.y;

    // Horizontal revolution around the cube
    // camera.position.x = Math.sin(cursor.x * (2 * Math.PI)) * 3;
    // camera.position.z = Math.cos(cursor.x * (2 * Math.PI)) * 3;
    // camera.position.y = cursor.y * 3;
    // camera.lookAt(mesh.position);

    orbitControls.update();


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()