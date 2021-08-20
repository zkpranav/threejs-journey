import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */

// Setting the size of the viewport
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Handling dynamic resizing
window.addEventListener('resize', (event) => {
    // Updating the sizes object
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Updating the camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Updating the render sizes
    renderer.setSize(sizes.width, sizes.height)

    // Placed here because peope might be using multiple screens
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

// Handling Fullscreen
window.addEventListener('dblclick', (event) => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target = mesh.position;
controls.autoRotate = true;
controls.autoRotateSpeed *= 2 * Math.PI;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()