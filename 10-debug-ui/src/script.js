import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

// Debug UI
const gui = new dat.GUI({closed: true})


// Need to create an object because .add() or .addColor() require target to be typeof 'object'
const debugObject = {
    color: 0xff0000,

    // Adding 2 * PI to rotation.y because the rotation value is SET everytime, omiting + rotation.y would only create 1 spin
    spin() {
        gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + (2 * Math.PI)})
    }
}

// dat.gui can't know if the property mesh.material.color is a color, with specific string values hence we can't use .add()
gui.addColor(debugObject, 'color')
    .onChange(() => {
        // Material.color is an instance of Color, so it must be .set()
        material.color.set(debugObject.color)
    })

gui.add(debugObject, 'spin').name('Spin')


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
const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3)
const material = new THREE.MeshBasicMaterial({
    color: debugObject.color,
    wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Debug
// gui.add(mesh.position, 'x', -2, 2, 0.001)
gui.add(mesh.position, 'x')
    .min(-2).max(2).step(0.001)
gui.add(mesh.position, 'y')
    .min(-2).max(2).step(0.001).name('Elevation')
gui.add(mesh.position, 'z')
    .min(-2).max(2).step(0.001)

gui.add(mesh, 'visible')
    .name('Visible')
gui.add(material, 'wireframe')
    .name('Wireframe')



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
// controls.target = mesh.position

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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