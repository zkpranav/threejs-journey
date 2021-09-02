import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
let mixer = null
let animations = []

const dracoLoader = new DRACOLoader()
// Optimizing by using Web Assembly and Workers
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        // console.log(gltf)
        
        // Adding it to our scene

        // Adds everything in the scene - including other cameras
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)

        // Creating an AnimationMixer from AnimationClip
        mixer = new THREE.AnimationMixer(gltf.scene)

        // Creating an AnimationAction
        // const action = mixer.clipAction(gltf.animations[0])
        // action.play()

        // Alternatively adding animations to an array
        for (const animation of gltf.animations) {
            animations.push(animation)
        }

        /**
         * FlightHelmet - Multiple meshes
         */
        // If you are feeling brave enough to use a while
        // while (gltf.scene.children.length) {
        //     scene.add(gltf.scene.children[0])
        // }

        // Using a temporary array of the children array, uses the spread (...) operator
        // const children = [...gltf.scene.children]
        // for (const child of children) {
        //     scene.add(child)
        // }
        // console.log(children)

    }
)

/**
 * Setting animations
 */
// console.log(animations)
let lookAction = null
let walkAction = null
let runAction = null

const look = () => {
    if (lookAction === null) {
        lookAction = mixer.clipAction(animations[0])
        lookAction.enabled = false
    }

    if (lookAction.enabled === true) {
        lookAction.enabled = false
    } else {
        lookAction.enabled = true
        lookAction.play()
    }
}

const walk = () => {
    if (walkAction === null) {
        walkAction = mixer.clipAction(animations[1])
        walkAction.enabled = false
    }

    if (walkAction.enabled === true) {
        walkAction.enabled = false
    } else {
        walkAction.enabled = true
        walkAction.play()
    }
}

const run = () => {
    if (runAction === null) {
        runAction = mixer.clipAction(animations[2])
        runAction.enabled = false
    }

    if (runAction.enabled === true) {
        runAction.enabled = false
    } else {
        runAction.enabled = true
        runAction.play()
    }
}

// Debug UI
debugObject.foxLook = () => {
    look()
}
gui.add(debugObject, 'foxLook').name('Look')

debugObject.foxWalk = () => {
    walk()
}
gui.add(debugObject, 'foxWalk').name('Walk')

debugObject.foxRun = () => {
    run()
}
gui.add(debugObject, 'foxRun').name('Run')

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(128, 128),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI / 2
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// Fog
const fog = new THREE.Fog('#444444', 64, 128)
scene.fog = fog

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#444444')

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer !== null) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()