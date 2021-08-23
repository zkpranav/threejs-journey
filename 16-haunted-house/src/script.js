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
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog(0x262837, 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Door textures
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')

// Brick textures
const brickColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const brickAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const brickNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const brickRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

// Grass textures
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

// Repeating the grass texture
const repeatTexture = (texture) => {
    texture.repeat.set(10, 10)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
}
repeatTexture(grassColorTexture)
repeatTexture(grassAmbientOcclusionTexture)
repeatTexture(grassNormalTexture)
repeatTexture(grassRoughnessTexture)

/**
 * House
 */

// Creating house group
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4, 1, 1, 1),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        aoMap: brickAmbientOcclusionTexture,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

walls.position.y += walls.geometry.parameters.height / 2

house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({
        color: 0xB35F45,
        wireframe: false
    })
)
roof.position.y += (roof.geometry.parameters.height / 2) + walls.geometry.parameters.height
roof.rotation.y += Math.PI / 4

house.add(roof)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI / 2
floor.position.y = 0
scene.add(floor)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 10, 10),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

door.position.y += door.geometry.parameters.height / 2 - 0.1
door.position.z += walls.geometry.parameters.width / 2 + 0.001

house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0x89C854,
    wireframe: false
})

const bushFactory = (scale, position) => {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial)
    bush.scale.set(scale[0], scale[1], scale[2])
    bush.position.set(position[0], position[1], position[2])
    return bush
}

const bush1 = bushFactory([0.5, 0.5, 0.5], [0.8, 0.2, 2.2])
const bush2 = bushFactory([0.25, 0.25, 0.25], [1.4, 0.1, 2.1])
const bush3 = bushFactory([0.4, 0.4, 0.4], [-0.8, 0.1, 2.2])
const bush4 = bushFactory([0.15, 0.15, 0.15], [-1, 0.05, 2.6])
house.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: 0xB1B6B2,
    wireframe: false
})

for (let i = 0; i < 25; i++){
    // Angle between 0 and 2 * Math.PI
    const angle = Math.random() * (2 * Math.PI)
    // radius between 3 (min) and 9 (max) - constraints of the scene
    const radius = 4 + Math.random() * 5

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.castShadow = true
    grave.position.y += grave.geometry.parameters.height / 2 - 0.1
    grave.position.x += Math.cos(angle) * radius
    grave.position.z += Math.sin(angle) * radius
    grave.rotation.y += (Math.random() - 0.5) * 0.4
    grave.rotation.z += (Math.random() - 0.5) * 0.4
    graves.add(grave)
}

// Debug
let wireframeFlag = false
debugObject['setWireframe'] = () => {
    if (wireframeFlag === false) {
        wireframeFlag = true
    } else {
        wireframeFlag = false
    }
    
    walls.material.wireframe = wireframeFlag
    roof.material.wireframe = wireframeFlag
    door.material.wireframe = wireframeFlag
    floor.material.wireframe = wireframeFlag
    bush1.material.wireframe = wireframeFlag
    bush2.material.wireframe = wireframeFlag
    bush3.material.wireframe = wireframeFlag
    bush4.material.wireframe = wireframeFlag
}
gui.add(debugObject, 'setWireframe')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xB9D5FF, 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('AL Intensity')
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight(0xB9D5FF, 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001).name('MoonLight')
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight(0xFF7D46, 2, 7, 2)
doorLight.position.y += walls.geometry.parameters.height - 0.2
doorLight.position.z += walls.geometry.parameters.width / 2 + 0.3

house.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight(0xFF00FF, 2, 5, 2)
const ghost2 = new THREE.PointLight(0x00FFFF, 2, 5, 2)
const ghost3 = new THREE.PointLight(0xFFFF00, 2, 5, 2)
scene.add(ghost1, ghost2, ghost3)

const animateGhost = (ghost, angle, radius, maxheight) => {
    ghost.position.x = Math.cos(angle) * radius
    ghost.position.z = Math.sin(angle) * radius
    ghost.position.y = Math.sin(angle * Math.PI) * maxheight
}

// Shadows
const activateLightShadows = (light, farPlane) => {
    light.castShadow = true
    light.shadow.mapSize.width = 256
    light.shadow.mapSize.height = 256
    light.shadow.camera.far = farPlane
}
activateLightShadows(moonLight, 15)
activateLightShadows(doorLight, 7)
activateLightShadows(ghost1, 7)
activateLightShadows(ghost2, 7)
activateLightShadows(ghost3, 7)

floor.receiveShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
// Setting clear color
renderer.setClearColor(0x262837)
renderer.setClearAlpha(1)

// Enabling shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Updating ghosts
    animateGhost(ghost1, elapsedTime * Math.PI / 3, Math.sin(elapsedTime) + 5, 2)
    animateGhost(ghost2, - elapsedTime * Math.PI / 2, Math.sin(elapsedTime) + 6, 3)
    animateGhost(ghost3, - elapsedTime * Math.PI, Math.sin(elapsedTime) + 5, 2)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
