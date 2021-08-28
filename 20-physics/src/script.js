import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new dat.GUI({
    closed: false
})

const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Sound
 */
const hitSound = new Audio('/sounds/hit.mp3')
const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        // Reset sound
        hitSound.currentTime = 0
        // PLays the sound
        hitSound.play()
    }
    
}

/**
 * Physics
 */
// Creating the phsyics world
const world = new CANNON.World()

/**
 * Optimization
 */
// Broadphase tests for collisions between objects on every frame
// Approaches - Naive, Grid-based, Sweep and Prune (SAP)
world.broadphase = new CANNON.SAPBroadphase(world)

world.allowSleep = false

// Creating materials
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')
const defaultMaterial = new CANNON.Material('default')

// Creating contact materials
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         friction: 0.1,
//         restitution: 0.7
//     }
// )
// world.addContactMaterial(concretePlasticContactMaterial)

// Default contact material
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
// world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial


// Adding Gravity
world.gravity.set(0, -9.82, 0)
// console.log(world.gravity)
gui.add(world.gravity, 'y').name('Gravity').min(-9.82).max(1).step(0.0001)

// Creating the sphere
// const sphereShape = new CANNON.Sphere(0.5)
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape,
// })
// // sphereBody.material = plasticMaterial

// // Applying forces
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))

// world.addBody(sphereBody)

// Creating a plane - creates in infinite plane
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0 // Mass = 0 indicates a static body in CANNON.js
floorBody.addShape(floorShape)
// floorBody.material = concreteMaterial
floorBody.quaternion.setFromEuler(- (Math.PI * 1 / 2), 0, 0)
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), - (Math.PI * 1 / 2))
world.addBody(floorBody)




/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

// // Debug
// gui.add(sphere.material, 'metalness').name('Metalness').min(0).max(1).step(0.001)
// gui.add(sphere.material, 'roughness').name('Roughness').min(0).max(1).step(0.001)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Fog
 */
const fog = new THREE.Fog('#777777', 64, 100)
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
renderer.setClearColor('#777777')

/**
 * Alternative physics world
 */
const objectsToUpdate = []

// Object material
const material = new THREE.MeshStandardMaterial({
    metalness: 0.5,
    roughness: 0.2,
    envMap: environmentMapTexture
})

gui.add(material, 'metalness').name('Metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').name('Roughness').min(0).max(1).step(0.001)

// Sphere geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

const sphereFactory = (radius, position) => {
    // THREE.js sphere
    const mesh = new THREE.Mesh(
        sphereGeometry,
        material
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // CANNON.js sphere
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(),
        shape: new CANNON.Sphere(radius),
        material: defaultMaterial
    })
    body.position.copy(position)
    // body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Adding to objectsToUpdate
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

debugObject.spawnSphere = () => {
    sphereFactory(Math.random() / 2, {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}
gui.add(debugObject, 'spawnSphere')

// Box geomtery
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const boxFactory = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(
        boxGeometry,
        material
    )
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(),
        shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
        material: defaultMaterial
    })
    body.position.copy(position)
    // body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

debugObject.spawnBox = () => {
    boxFactory(Math.random(), Math.random(), Math.random(), {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3
    })
}
gui.add(debugObject, 'spawnBox')

/**
 * Removing objects
 */
debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }
}
gui.add(debugObject, 'reset').name('Reset')

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
let testFrames = 100
let frameSkip = 120

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    /**
     * Test sphere
     */
    // // Update physics world
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    // world.step(1 / 60, deltaTime, 3)

    // // Elaborate way
    // // sphere.position.x = sphereBody.position.x
    // // sphere.position.y = sphereBody.position.y
    // // sphere.position.z = sphereBody.position.z

    // // Concise way .copy() expects a THREE.Vector3 but works fine with CANNON.Vec3
    // sphere.position.copy(sphereBody.position)

    /**
     * Update physics world
     */

    for (const object of objectsToUpdate) {
        // Wind
        // object.body.applyForce(new CANNON.Vec3(-0.3, 0, 0), object.body.position)
        // if (frameSkip == 0) {
            
        //     frameSkip = 120
        //     object.body.applyForce(new CANNON.Vec3(64, 0, 0), object.body.position)
        // } else {
        //     frameSkip -= 1
        // }

        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }


    world.step(1 / 60, deltaTime, 3)

    /**
     * Console logging
     */
    // if (testFrames > 0) {
    //     console.log(sphereBody.velocity)
    //     testFrames -= 1
    // }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()