import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    closed: true,
    width: 300
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Galaxy

// Tweakable parameters
const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 4
parameters.branches = 6
parameters.curve = 1
parameters.randomness = 0.2
parameters.randomnessExponent = Math.E
parameters.insideColor = 0xFF6030
parameters.outsideColor = 0x1B3984

// Generating galaxies
let geometry = null
let material = null
let points = null

// Galaxy generation factory function
const generateGalaxy = () => {
    // Destroying old galaxies
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
        // Geometry
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++){
        // Position
        // indexOffset + 0 == x, indexOffset + 1 == y, indexOffset + 2 == z
        const indexOffset = i * 3

        // Has to be a value between 0 and radius
        const distanceFromCenter = Math.random() * parameters.radius
        // The farther the particle from the center, the more curved it must be
        const curveOffset = parameters.curve * distanceFromCenter
        // i % parameters.branch gives proportions, when divided by parameters.branch gives proportion values b/w 0 - 1
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        // Adding randomness
        const randomX = Math.pow(Math.random(), parameters.randomnessExponent) * (Math.random() < 0.5 ? -1: 1) * parameters.randomness * distanceFromCenter
        const randomY = Math.pow(Math.random(), parameters.randomnessExponent) * (Math.random() < 0.5 ? -1: 1) * parameters.randomness * distanceFromCenter
        const randomZ = Math.pow(Math.random(), parameters.randomnessExponent) * (Math.random() < 0.5 ? -1: 1) * parameters.randomness * distanceFromCenter
 * distanceFromCenter
        positions[indexOffset + 0] = Math.cos(branchAngle + curveOffset) * distanceFromCenter + randomX
        positions[indexOffset + 1] = 0 + randomY
        positions[indexOffset + 2] = Math.sin(branchAngle + curveOffset) * distanceFromCenter + randomZ

        // Color

        // Mixing two base colors in proportions based on the distanceFromCenter of the particle
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, distanceFromCenter / parameters.radius)

        colors[indexOffset + 0] = mixedColor.r
        colors[indexOffset + 1] = mixedColor.g
        colors[indexOffset + 2] = mixedColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    // Points
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
generateGalaxy()

// Adding tweaks
gui.add(parameters, 'count').name('# Of Stars').min(1000).max(1000000).step(1000).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').name('Star Size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').name('Galaxy Radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').name('# Of Branches').min(3).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'curve').name('Curve').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').name('Rnd Scale').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessExponent').name('Rnd Exponent').min(1).max(10).step(0.0001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').name('Inside Color').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').name('Outside Color').onFinishChange(generateGalaxy)


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
camera.position.x = 3
camera.position.y = 5
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update points
    points.rotation.y = elapsedTime * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()