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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

// Particle - Needs a BufferGeometry and PointsMaterial, Each particle is a plane with 1 segment, i.e 2 triangles
// Points created a particle system of the geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 64, 64)
// const particlesMaterial = new THREE.PointsMaterial({
//     size: 0.02,
//     sizeAttenuation: true
// })

// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

// Custom Geometry
const particlesGeometry = new THREE.BufferGeometry()

const itemCount = 5000
const vertexPositions = new Float32Array(itemCount * 3)
const colors = new Float32Array(itemCount * 3)

// Populating positions and colors
for (let i = 0; i < itemCount * 3; i++){
    vertexPositions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Particles material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture
})
// Fixing the opaque particles bug

// Using alphaTest
// particlesMaterial.alphaTest = 0.001

// Using depthTest - Deactivating depth testing creates bugs because it takes away perception
// particlesMaterial.depthTest = false

// Using depthWrite - does not take away perception, but prevents writing to the depth buffer
particlesMaterial.depthWrite = false    

// Blending - WebGL draws pixels one on top of the other, but with this property we may allow blending
particlesMaterial.blending = THREE.AdditiveBlending

// Using vertexColors
particlesMaterial.vertexColors = true





// Particles
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


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

    // Updating the entire particle system
    // particles.rotation.y = elapsedTime * 0.2

    // Updating individual particles - CRASHED CHROME
    // for (let i = 0; i < itemCount; i = i * 3){
    //     particles.geometry.attributes.position.array[i + 1] = Math.sin(elapsedTime) * 0.3
    // }
    // particles.geometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()