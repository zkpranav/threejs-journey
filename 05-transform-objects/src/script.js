import './style.css'
import * as THREE from 'three'
import { AxesHelper } from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

// // Positioning
// // mesh.position.x = -0.7;
// // mesh.position.y = 0.6;
// // mesh.position.z = -1;
// mesh.position.set(-0.7, 0.6, -1);
// scene.add(mesh)

// // position is Vector3
// console.log(mesh.position);
// // distance from the center of the scene to the mesh vector
// console.log(mesh.position.length());

// let magnitude = Math.sqrt((mesh.position.x * mesh.position.x) + (mesh.position.y * mesh.position.y) + (mesh.position.z * mesh.position.z));
// console.log(magnitude === mesh.position.length());

// // normalizing vector length
// mesh.position.normalize();
// console.log(mesh.position.length());

// // Scalling
// // scale is a Vector3
// // mesh.scale.x = 2;
// // mesh.scale.y = 0.5;
// // mesh.scale.z = 0.5;
// mesh.scale.set(2, 0.5, 0.5);

// // Rotating - using rotate or quaternion
// // rotation is an Euler
// // Values of rotation properties are in radians

// // For a 90 degree rotation
// mesh.rotation.y = Math.PI / 2;

// // For a 180 degree rotation
// mesh.rotation.y = Math.PI;

// // Axes are relative, and they change after every rotation
// mesh.rotation.x = Math.PI * 0.25;
// // Y-axis no longer points straight upwards
// mesh.rotation.y = Math.PI * 0.25;

// // Multiple non-proper rotations might result in a Gimbal Lock
// // Avoiding a gimbal lock
// mesh.rotation.reorder('YXZ');
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// Group - a collection of Object3D instances, it also inherts fom Object3D
const group = new THREE.Group();
scene.add(group);

const cuboidFactoy = (color) => {
    return new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: color })
    );
}
const cuboid1 = cuboidFactoy(0xff0000);
cuboid1.position.set(-1.5, 0, 0);
const cuboid2 = cuboidFactoy(0x00ff00);
cuboid2.position.set(0, 1.5, 0);
const cuboid3 = cuboidFactoy(0x0000ff);
cuboid3.position.set(0, -2, -1);
group.add(cuboid1);
group.add(cuboid2);
group.add(cuboid3);


/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3);
scene.add(camera)

// distance between mesh and camera
// console.log(mesh.position.distanceTo(camera.position));


// // Creating an AxesHelper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);


// Object3D look at - (-1)*z axis of the object faces the target vector
// camera.lookAt(mesh.position);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)