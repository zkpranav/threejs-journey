import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TetrahedronBufferGeometry } from 'three'
import * as dat from 'dat.gui'

// Debug UI
const debugUI = new dat.GUI({ closed: true })



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Loading textures from the static folder


// // Using Native Javascript
// // Instantiating Image and THREE.Texture
// const image = new Image()
// const texture = new THREE.Texture(image)
// // Updating the texture when the image loads
// image.addEventListener('load', () => {
//     texture.needsUpdate = true
// })
// // Adding image path
// image.src = '/textures/door/color.jpg'

// Using TextureLoader

// Using a LoadingManager
const loadingManager = new THREE.LoadingManager()
// Listeing to load events
// loadingManager.onStart = () => {
//     console.log('Started Loading')
// }
// loadingManager.onProgress = () => {
//     console.log('Loading Progressing')
// }
// loadingManager.onLoad = () => {
//     console.log('Loading Completed')
// }
// loadingManager.onError = () => {
//     console.log('Error occurred during Loading')
// }

// Creating TextureLoader
const textureLoader = new THREE.TextureLoader(loadingManager)
// Loading textures
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png') // Creates a Moire pattern
// const colorTexture = textureLoader.load('textures/checkerboard-8x8.png')
const colorTexture = textureLoader.load('textures/minecraft.png')

// const colorTexture = textureLoader.load('/textures/door/color.jpg')
// const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// const heightTexture = textureLoader.load('/textures/door/height.jpg')
// const normalTexture = textureLoader.load('/textures/door/normal.jpg')
// const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
// const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')


// load method with 3 optional callback functions, internally uses ImageLoader
// const texture = textureLoader.load('/textures/door/color.jpg',
//     () => {
//         console.log('Callback after LOAD')
//     },
//     () => {
//         console.log('Callback during PROGRESS')
//     },
//     () => {
//         console.log('Callback incase of an ERROR')
//     }
// )

// Texture Transformations

// repeat is a Vector2
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// Simply repeated
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
// Mirrored and repeated
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// Offsetting the texture - Begins at the offset
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0   

// Rotating the texture in radians
// Rotation occurs about the left corner (0, 0) in UV co-ordinates
// colorTexture.rotation = 2 * Math.PI
// colorTexture.rotation = (1 / 2) * Math.PI

// Moving the center
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
// colorTexture.rotation = (1/ 4) * Math.PI

// Mipmapping and Filtering
// Mipmapping - Creating smaller and smaller versions of the texture by repeatedly halving it each time until we reach a 1x1 pixel texture
// Filtering algorithms - 

// NearestFilter does not need mipmapping
colorTexture.generateMipmaps = false


// Minification Filter (Occurs when the texture is larger than the surface it covers)
// colorTexture.minFilter = THREE.LinearMipmapLinearFilter // Default
// colorTexture.minFilter = THREE.LinearFilter
colorTexture.minFilter = THREE.NearestFilter // Doesn't need Mipmapping

// Magnification Filter (Occurs when the texture is smaller than the surface it covers)
// colorTexture.magFilter = THREE.LinearFilter // Default
colorTexture.magFilter = THREE.NearestFilter // Creates a Minecraft style result as opposed to the blur


// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3)
// const geometry = new THREE.SphereGeometry(1, 32, 32)
// console.log(geometry.attributes.uv)

// Material using color
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

// Material using a texture
const material = new THREE.MeshBasicMaterial({map: colorTexture, wireframe: false})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


debugUI.add(material, 'wireframe').name('Wireframe')

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
// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.target = mesh.position

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