import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

// Raycaster - Allows detecting potential or current object collisions by casting a ray
const raycaster = new THREE.Raycaster()

const rayOrigin = new THREE.Vector3(-3, 0, 0)
const rayDirection = new THREE.Vector3(10, 0, 0)
rayDirection.normalize()

raycaster.set(rayOrigin, rayDirection)

// Casting the ray
// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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

// Cursor
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (_event) => {
    // Values in the range of -1 to +1
    mouse.x = (_event.clientX / sizes.width) * 2 - 1
    mouse.y = -((_event.clientY / sizes.height) * 2 - 1)
    // console.log(mouse)
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

// Witness variable for mouseenter and mouseleave - saves the state, and an object pointer
let isIntersecting = false
let enteredObject = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5
    object2.position.y = Math.sin(elapsedTime * 1.4) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.8) * 1.5

    // Casting the ray
    const testingObjects = [object1, object2, object3]
    // for (const object of testingObjects) {
    //     object.material.color.set('#ff0000')
    // }

    // Stationary ray
    // const intersects = raycaster.intersectObjects(testingObjects)
    // for (const intersection of intersects) {
    //     intersection.object.material.color.set('#0000ff')
    // }

    // Ray oriented based on the mouse
    // raycaster.setFromCamera(mouse, camera)

    // const intersects = raycaster.intersectObjects(testingObjects)
    // for (const intersection of intersects) {
    //     intersection.object.material.color.set('#0000ff')
    // }

    // Recreating mouseenter and mouseleave events
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(testingObjects)

    if (intersects.length > 0) {
        // Something is being hit
        if (isIntersecting === false) {
            // mouseenter occurs
            enteredObject = intersects[0].object
            enteredObject.material.color.set('#0000ff')
            isIntersecting = true
        }
    } else {
        if (isIntersecting === true) {
            //mouseleave occurs
            enteredObject.material.color.set('#ff0000')
            enteredObject = null
            isIntersecting = false
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()