import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CubeTextureLoader } from 'three'

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new CubeTextureLoader()

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const debugObject = {}
debugObject.environmentMapIntensity = 1

gui.add(debugObject, 'environmentMapIntensity').name('EM Intensity').min(1).max(5).step(0.00001)
    .onChange(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.material.envMapIntensity = debugObject.environmentMapIntensity
                child.material.needsUpdate = true
            }
        })
    })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Updating all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.environmentMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Textures
 */
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])
environmentMap.encoding = THREE.sRGBEncoding
// scene.background = environmentMap

// To set the same environment map to every object
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
'/models/FlightHelmet/glTF/FlightHelmet.gltf',
(gltf) => {
    console.log(gltf)

    gltf.scene.scale.set(7, 7, 7)
    gltf.scene.position.set(0, -3, 0)
    gltf.scene.rotation.y = Math.PI / 2

    scene.add(gltf.scene)

    updateAllMaterials()

    gui.add(gltf.scene.rotation, 'y').name('Helmet-RY').min(0).max(2 * Math.PI).step(0.001)
}
)

/**
 * Light
 */
const directionalLight = new THREE.DirectionalLight('#FFFFFF', 2)
directionalLight.position.set(0.25, 3, -2.25)
directionalLight.castShadow = true

// Optimizing shadows
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)

/**
 * Shadow Acne
 */
// Occurs on both rounded and flat surfaces where the object casts a shadow onto itself
// Can be fixed using Bias and Normal Bias - Pushes the shadowMap within the object along the normals
// Bias - flat surfaces
// Normal Bias - rounded surfaces
directionalLight.shadow.normalBias = 0.02

scene.add(directionalLight)

gui.add(directionalLight, 'intensity').name('DL Intensity').min(0).max(10).step(0.001)
gui.add(directionalLight.position, 'x').name('DL-PX').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').name('DL-PY').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').name('DL-PZ').min(-5).max(5).step(0.001)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)



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
camera.position.set(4, 1, -5)
// camera.position.set(0, 0, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Physically Correct Lights
 */
renderer.physicallyCorrectLights = true

/**
 * Output Encoding
 */
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Tone Mapping
 */
// Tone mapping converts HDR textures to LDR
// Possible values -
// THREE.NoToneMapping
// THREE.LinearToneMapping
// THREE.ReinhardToneMapping
// THREE.CineonToneMapping
// THREE.ACESFilmicToneMapping
renderer.toneMapping = THREE.ReinhardToneMapping

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).name('Tone Mapping Algorithm').onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})

renderer.toneMappingExposure = 1

gui.add(renderer, 'toneMappingExposure').name('Tone Mapping Exposure').min(1).max(3).step(0.00001)

/**
 * Anti Aliasing
 */
// Aliasing - Stair-like effect on the edges of the geometry (created due to coloring of entire pixels and a portion of them)

// Super Sampling (SSAA) or Fullscreen Sampling (FSAA) - Increase render's resolution x2 (Easy but not performant)


// Multi Sampling (MSAA) - Doubles render resolution only on the edges of the geometry

/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()