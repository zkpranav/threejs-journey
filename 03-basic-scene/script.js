// Creating a scene
const scene = new THREE.Scene();

// Creating a geometry
// parameters - width, height, depth
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// Creating a material
const redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// Creating a mesh
const redCubeMesh = new THREE.Mesh(cubeGeometry, redMaterial);
// Adding mesh to the scene
scene.add(redCubeMesh);

// Render size object
const renderSize = {
    width: 800,
    height: 600
}

// Creating a camera
// parameters - Vertical Field Of View (fov) in degrees, Aspect Ratio
const camera = new THREE.PerspectiveCamera(75, renderSize.width / renderSize.height);
camera.position.z = 3;
// camera.position.y = 1.005;
scene.add(camera);

// Creating a renderer
const canvas = document.querySelector('.WebGl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(renderSize.width, renderSize.height);

// rendering the scene
renderer.render(scene, camera);

// Camera and the mesh both, are at the center of the scene, hence nothing is visible
// model transformations - position, rotation, scale
// position is itself an object - x, y, z
// repositioning camera before adding it to scene
