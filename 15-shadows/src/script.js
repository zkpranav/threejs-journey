import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    closed: true
})

// Textures
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('AL Intensity')
scene.add(ambientLight)

// Directional light
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
// directionalLight.position.set(2, 2, - 1)
// gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001).name('DL Intensity')
// gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)

// // Enable light shadow casting
// // Shadows are created by pre-rendering the scene with all objects as MeshDepthMaterial, and about the perspective of each camera. The result is a shadow map.

// directionalLight.castShadow = true
// // scene.add(directionalLight)

// // Optimizing the shadow

// // directionalLight.shadow.mapSize is a vector2 and determines the dimensions of the shadow map
// // Width, Height are analogous to x and y
// directionalLight.shadow.mapSize.width = 1024
// directionalLight.shadow.mapSize.height = 1024

// // Optimizing the light's pre-render camera's near, far planes and the amplitude
// // DirectionalLight has an OrthographicCamera
// directionalLight.shadow.camera.top = 2
// directionalLight.shadow.camera.right = 2
// directionalLight.shadow.camera.bottom = -2
// directionalLight.shadow.camera.left = -2
// directionalLight.shadow.camera.near = 1
// directionalLight.shadow.camera.far = 6

// // Controlling the blur - constant blur throughout (Works on PCFShadowMap)
// // directionalLight.shadow.radius = 10

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// directionalLightCameraHelper.visible = false
// scene.add(directionalLightCameraHelper)
// // console.log(directionalLight.shadow.camera)

// SpotLight
const spotLight = new THREE.SpotLight(0xFF9000, 3.0, 10, Math.PI * 0.3, 0.25, 2)
spotLight.castShadow = true
spotLight.position.x = -4
spotLight.position.y = 4
spotLight.position.z = 0


scene.add(spotLight)
scene.add(spotLight.target)

// Optimizing the shadow
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 10

// SpotLight camera helper - SpotLight camera is a PerspectiveCamera
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = true
scene.add(spotLightCameraHelper)
// console.log(spotLight.shadow.camera)

// Debug
gui.add(spotLight, 'intensity').name('SL Intensity').min(0.0).max(5).step(0.001)
gui.add(spotLight.position, 'x').name('x-axis').min(-7).max(7).step(0.001)
gui.add(spotLight.position, 'y').name('y-axis').min(-7).max(7).step(0.001)
gui.add(spotLight.position, 'z').name('z-axis').min(-7).max(7).step(0.001)

// PointLight
// const pointLight = new THREE.PointLight(0xFFFFFF, 0.3)
// pointLight.castShadow = true
// pointLight.position.set(-1, 1, 0)

// scene.add(pointLight)

// // Optimizing the shadow
// pointLight.shadow.mapSize.width = 1024
// pointLight.shadow.mapSize.height = 1024

// pointLight.shadow.camera.near = 0.1
// pointLight.shadow.camera.far = 10

// // PointLight camera helper
// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// pointLightCameraHelper.visible = false
// scene.add(pointLightCameraHelper)
// // console.log(pointLightCameraHelper)

/**
 * Materials
 */

// MeshStandardMaterial
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

// MeshBasicMaterial with bakedShadow.jpg
const bakedShadowMaterial = new THREE.MeshBasicMaterial()
bakedShadowMaterial.map = bakedShadow

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

// May cast or recieve shadows
sphere.castShadow = true

// set to bakedShadowMaterial instead of material to  view a static baked shadow
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true

scene.add(sphere, plane)

// Dynamic baked shadows technique
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)

sphereShadow.rotation.x = - (Math.PI / 2)
// If the sphereShadow and the plane are in the same position, we get the z-fighting glitch
sphereShadow.position.y = plane.position.y + 0.01

// scene.add(sphereShadow)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{``
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

// Enable shadow maps on the renderer
renderer.shadowMap.enabled = true

// Change shadow algorithm
// radius does not work on the PCFSoftShadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Updating the sphere
    sphere.position.x = Math.cos(elapsedTime * (2 * Math.PI)) * 1.5
    sphere.position.z = Math.sin(elapsedTime * (2 * Math.PI)) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Updating the sphereShadow
    // sphereShadow.position.x = sphere.position.x
    // sphereShadow.position.z = sphere.position.z
    // sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    spotLight.target.position.set(sphere.position.x, 0, sphere.position.z)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()