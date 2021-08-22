import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'


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
 * Lights
 */

// Ambient Light - Lights up the whole scene, does not cast shadows as it has no direction.
// Could be thought of as omnidirectional lighting.
// It may also be used to simulate light bouncing.
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xFFFFFF)
ambientLight.intensity = 0.0
scene.add(ambientLight)

// DirectionalLight - A light that gets emitted in a specific direction. Behaves as though it is infinitely far away, and the rays produced are paralled.
// Can be used to simulate the Sun's rays. Rays always illuminate the center (Default).
// It can cast shadows.
const directionalLight = new THREE.DirectionalLight(0x00FFFC, 0.0)
scene.add(directionalLight)

// HemisphereLight - Light positioned above the scene, with color fading from sky color to ground color.
// Cannot cast shadows. No direction.
const hemisphereLight = new THREE.HemisphereLight(0x0000FF, 0x00FF00, 0.0)
scene.add(hemisphereLight)

// PointLight - Light gets emitted from single point in all directions. Can cast shadows.
// Used to replicate a light bulb. Distance affects the radius of the light and decay affects the dimming.
const pointLight = new THREE.PointLight(0xFF9000, 0.0)
pointLight.position.set(1, 1, 1)
pointLight.distance = 10
pointLight.decay = 2
scene.add(pointLight)

// RectAreaLight - Emits light uniformly across the face of a rectangular plane. No shadow support.
// Can be used to simulate light sources such as a bright window, or strip lighting.
// Mix between directionalLight and DiffuseLight
const rectAreaLight = new THREE.RectAreaLight(0x4E00FF, 0.0, 1, 1)
rectAreaLight.position.set(-1, 1, 1)
rectAreaLight.rotation.y = - (2 * Math.PI / 8)
scene.add(rectAreaLight)

// SpotLight  - Light gets emitted from a single source point in one direction, along a cone that increases in size the further from the light it gets.
// Like a Spotlight or a Flashlight
// Parameters - color, intensity, distance, angle (Angle at the mouth, influences the circumference of the cone), penumbra (Fade at the edges), decay
// Orienting the SpotLight requires adding spotLight.target (a theoretical Object3D) to the scene and orienting it.
const spotLight = new THREE.SpotLight(0x78FF00, 0.0, 6, Math.PI * 0.1, 0.25, 2)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

spotLight.target.position.x = -0.75
scene.add(spotLight.target)


// Light Helpers

// DirectionalLightHelper
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)

// // HemisphereLightHelper
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)

// // PointLightHelper
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
// scene.add(pointLightHelper)

// SpotLightHelper - Needs to be updated in the next frame if spotLight.target moves.
// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// window.requestAnimationFrame(() => {
//     spotLightHelper.update()
// })

// RectAreaLightHelper - Not a part of THREE therefore, needs to be imported separately.
// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaLightHelper)




// Debug Lights
gui.add(ambientLight, 'intensity').name('AL Intensity').min(0).max(1).step(0.001)
gui.add(directionalLight, 'intensity').name('DL Intensity').min(0).max(1).step(0.001)
gui.add(hemisphereLight, 'intensity').name('HL Intensity').min(0).max(1).step(0.001)
gui.add(pointLight, 'intensity').name('PL Intensity').min(0).max(1).step(0.001)
gui.add(rectAreaLight, 'intensity').name('RAL Intensity').min(0).max(10).step(0.01)
gui.add(spotLight, 'intensity').name('SL Intensity').min(0).max(2).step(0.001)





/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()