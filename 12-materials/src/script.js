import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { MaterialLoader, MeshToonMaterial } from 'three'


// Debug
const gui = new dat.GUI({
    closed: true
})


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const cubeTextureLoader = new THREE.CubeTextureLoader()

// Door textures
const albedoTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// Gradients
const gradient_3 = textureLoader.load('/textures/gradients/3.jpg')

// Matcaps
const matcap_1 = textureLoader.load('/textures/matcaps/1.png')

// Enviornment maps
// Need to pass 6 images, one for each face of a cube.
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

// Materials

// 1. MeshBasicMaterial - spreads color uniformly. Not affected by lights.
// const material = new THREE.MeshBasicMaterial()
// gui.add(material, 'wireframe')

// // We may combine map with color to add a "tint" effect.
// material.map = albedoTexture

// // Tweaking Opacity
// material.transparent = true
// // material.opacity = 0.5
// material.alphaMap = alphaTexture

// // Face visibility
// // Legal values are THREE.FrontSide, THREE.BackSide, THREE.DoubleSide
// material.side = THREE.DoubleSide

// 2. MeshNormalMaterial - Maps normal vectors to RGB colors.
// const material = new THREE.MeshNormalMaterial()

// // flatShading - flattens the faces of the geometry so that normals won't be interpolated between vertices
// material.flatShading = true

// 3. MeshMatcapMaterial - defined by a lit sphere texture, does not respond to lights as the matcap file encodes baked light. Does cast shadow on a object that receives shadows.
// Picks colors from a reference image (matcap) and along with normals on the geometry (relative to the camera, i.e if camera moves, the "lit up" part moves), it will color it to represent a lit up sphere.
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcap_1

// 4. MeshDepthMaterial - Creates a depth perception. Depth is based on camera near and far planes.
// White if closer to Near plane, Black if closer to the far.
// const material = new THREE.MeshDepthMaterial()

// 5. MeshLambertMaterial - for non-shiny surfaces, without specular highlights. Reacts to light.
// Calculates reflectance based on Lambertian (Matte) model - Brightness of the surface is the same when viewed from any angle.
// const material = new THREE.MeshLambertMaterial()

// 6. MeshPhongMaterial - for shiny surfaces with specualar highlights. Shows light reflections.
// // Calculates refelectance based on Blinn-Phong model.
// const material = new THREE.MeshPhongMaterial()

// // Adjusting shininess and specular (Reflection)
// material.shininess = 100
// material.specular = new THREE.Color('#1188FF')

// 7. MeshToonMaterial - implements toon shading.
// const material = new MeshToonMaterial()

// Adjusting the gradient
// Need to set minFilter and magFilter to Nearest Filter because otherwise mip mapping blends the gradient
// gradient_3.generateMipmaps = false
// gradient_3.magFilter = THREE.NearestFilter
// gradient_3.minFilter = THREE.NearestFilter
// material.gradientMap = gradient_3

// 8. MeshStandardMaterial - standard physically based material, using Metallic-Roughness workflow
// Uses Physically Based Rendering (PBR) principles
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.25
material.side = THREE.DoubleSide

// // Adding maps
// material.map = albedoTexture
// // AmbientOcclusion map requires a second set of UV co-ordinates, aoMapIntensity can be used to tweak the intensity
// // Replicating the same co-ordinates as the albedo texture
// material.aoMap = ambientOcclusionTexture
// material.aoMapIntensity = 1

// // Displacement/Height map - Needs enough subdivisions (triangles)
// material.displacementMap = heightTexture
// material.displacementScale = 0.05

// // Metalness and Roughness maps
// material.metalnessMap = metalnessTexture
// material.roughnessMap = roughnessTexture

// // Normal map
// material.normalMap = normalTexture
// material.normalScale.set(1, 1) // Vector2

// // Alpha map
// material.transparent = true
// material.alphaMap = alphaTexture

// Enviornment maps - Used in reflection and refraction. Three.js supports cubic enviornment maps only.
material.envMap = environmentMapTexture



// Adding a debug UI
gui.add(material, 'wireframe').name('Wireframe')
gui.add(material, 'metalness').name('Metalness')
    .min(0)
    .max(1)
    .step(0.0001)
gui.add(material, 'roughness').name('Roughness')
    .min(0)
    .max(1)
    .step(0.0001)
gui.add(material, 'displacementScale').name('Displacement')
    .min(0)
    .max(1)
    .step(0.001)

// 9. MeshPhysicalMaterial - An extension of MeshStandardMaterial with advanced PBR.
// Clearcoat effect, Physically-based transparency, Advanced reflectivity
// const material = new THREE.MeshPhysicalMaterial()

// 10. PointsMaterial - Default material used by points.
// Used when creating particles

// 11. ShaderMaterial & RawShaderMaterial - Used to create custom materials




// Objects with proper subdivisions for a displacement map
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.position.x = 1.5

// Adding uv2 by replication for Ambient Occlusion
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2',new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)
// scene.add(plane)

// Adding lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xFFFFFF, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.y = 4
scene.add(pointLight)



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
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()