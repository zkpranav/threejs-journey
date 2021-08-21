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

// Axes Helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

// Fonts
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextGeometry(
            'Aryaa',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelOffset: 0,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 4
            }
        )

        // Bounding - A Box or Sphere Bounding is calculated for each object.
        // Used in frustum culling (Determining whether or not to render an object relative to the camera)
        textGeometry.computeBoundingBox()

        // The geometry deviates from the center because of the bevel (eg: check (0,0) and boundingBox.min)
        // console.log(textGeometry.boundingBox)
        // Moving the entire Geometry not just the mesh using translate()
        // Translating back half the width, height and depth of the geometry and subtract bevelSize on x, y and bevelThickness on z
        // textGeometry.translate(
        //     - ((textGeometry.boundingBox.max.x - textGeometry.parameters.options.bevelSize) / 2),
        //     - ((textGeometry.boundingBox.max.y - textGeometry.parameters.options.bevelSize) / 2),
        //     - ((textGeometry.boundingBox.max.z - textGeometry.parameters.options.bevelThickness) / 2)
        // )

        // Easier way of centering
        textGeometry.center()




        const normalMaterial = new THREE.MeshNormalMaterial({
            wireframe: true
        })
        // textMaterial.matcap = matcapTexture
        const text = new THREE.Mesh(textGeometry, new THREE.MeshNormalMaterial())
        scene.add(text)

        // debug UI
        gui.add(normalMaterial, 'wireframe').name('Surrounding WF')
        gui.add(text.material, 'wireframe').name('Text WF')

        // Controls
        // controls.target = text.position

        // Adding surrounding objects to the scene
        const donutGeometry = new THREE.TorusGeometry(0.09, 0.05, 9, 9)
        const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2, 1, 1, 1)
        const sphereGeometry = new THREE.SphereGeometry(0.09, 9, 9)


        for (let i = 0; i < 50; i++){
            const donut = new THREE.Mesh(donutGeometry, normalMaterial)
            const cube = new THREE.Mesh(cubeGeometry, normalMaterial)
            // const sphere = new THREE.Mesh(
            //     new THREE.SphereGeometry(0.09, Math.floor(Math.random() * 11 + 1), Math.floor(Math.random() * 11 + 1)),
            //     normalMaterial)
            const sphere = new THREE.Mesh(sphereGeometry, normalMaterial)

            donut.position.set(
                (Math.random() - 0.5) * 7,
                (Math.random() - 0.5) * 7,
                (Math.random() - 0.5) * 7
            )
            cube.position.set(
                (Math.random() - 0.5) * 7,
                (Math.random() - 0.5) * 7,
                (Math.random() - 0.5) * 7
            )
            sphere.position.set(
                (Math.random() - 0.5) * 7,
                (Math.random() - 0.5) * 7,
                (Math.random() - 0.5) * 7
            )

            donut.rotation.set(
                (Math.random() * 2 * Math.PI),
                (Math.random() * 2 * Math.PI),
                donut.rotation.z
            )
            cube.rotation.set(
                (Math.random() * 2 * Math.PI),
                (Math.random() * 2 * Math.PI),
                cube.rotation.z
            )

            scene.add(donut, cube, sphere)

        }
    }
)

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
controls.enableZoom = false

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