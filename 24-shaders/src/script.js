/**
 * Shaders
 * 
 * It is a program written in GLSL (OpenGL Shading Language)
 * It is sent to the GPU
 * 
 * It will position each vertex of a geometry
 * It will also colorize each visible pixel of that geometry
 * 
 * "Pixel" isn't accurate because each point on the render might not match the device pixel
 * Instead we call it a Fragment
 * 
 * Data sent to a shader -
 * 1. Vertex co-ordinates
 * 2. Mesh transformations
 * 3. Camera information
 * 4. Colors
 * 5. Textures
 * 6. Lights
 * 7. Fog
 * Etc.
 * 
 * GPU processes the data based on the shader's instructions
 * 
 * Two types of shaders -
 * 1. Vertex Shader
 * 2. Fragment Shader
 * 
 * Vertex Shader
 * 
 * Positions each vertex of the geometry
 * Same shader is used for every vertex provided
 * Some data might differ from vexter to vertex - eg: vertex position; such data is called an attribute
 * Some data might be the same for every vertex - eg: Mesh position, Camera Info; such data is called a uniform
 * 
 * Once the vertices are placed by the vertex shader, GPU knows what fragments of the geometry are visible and can then proceed to the Fragment shader
 * 
 * Fragment Shader
 * 
 * Colors each visible fragment of the geometry
 * Same shader is used for every visible fragment of the geometry
 * 
 * uniforms are sent to the fragment shader
 * attributes are not sent to the fragment shader
 * Vertex shader can also send data called - Varying
 * Varying data is interpolated between each vertex - (Imagine a triangle with vertices having colors R, G and B. The central fragment will have an equal blend on all 3 colors)
 * 
 */

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'


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
const flagTexture = textureLoader.load(
    './textures/flag-french.jpg'
)

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material

// Custom shaders can be built using ShaderMaterial or RawShaderMaterial
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    transparent: true,
    wireframe: true,
    side: THREE.DoubleSide,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10.0, 5.0) },
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color('cyan') },
        uTexture: { value: flagTexture }
    },
})

gui.add(material, 'wireframe').name('Wireframe')
gui.add(material.uniforms.uFrequency.value, 'x').name('x-Frequency').min(1.0).max(10.0).step(0.001)
gui.add(material.uniforms.uFrequency.value, 'y').name('y-Frequency').min(1.0).max(10.0).step(0.001)

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y *= 2 / 3
scene.add(mesh)

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
camera.position.set(0.25, - 0.25, 1)
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
 * Loop break
 */
let breakCount = 20

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    // Time passed since clock instantiation
    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // const randoms = new Float32Array(count)

    // for (let i = 0; i < count; i++) {
    //     randoms[i] = Math.random()
    // }

    // geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * OpenGL Shading Language
 * 
 * Data Types - int, float, vec2, vec3, vec4, mat2, mat3, mat4
 * 
 * Swizzle eg -
 * vec3 foo = vec3(1.0, 2.0, 3.0);
 * vec2 bar = foo.xy
 * vec2 someVector = foo.zx
 * 
 * Classic functions - sin, cos, max, min, pow, exp, mod, clamp
 * Other functions - cross, dot, mix, step, smoothstep, length, distance, reflect, refract, normalize
 */