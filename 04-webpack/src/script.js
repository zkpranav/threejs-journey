import './style.css';
import * as THREE from 'three';
import { Mesh, PerspectiveCamera, WebGLRenderer } from 'three';

const scene = new THREE.Scene();

const cuboidGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000
});
const cuboidMesh = new Mesh(cuboidGeometry, material);
scene.add(cuboidMesh);

const renderSize = {
    width: 800,
    height: 600
}

const camera = new PerspectiveCamera(75, renderSize.width / renderSize.height);
camera.position.z = 3;
scene.add(camera);

const canvas = document.querySelector('.WebGL');
const renderer = new WebGLRenderer({
    canvas: canvas
});
renderer.setSize(renderSize.width, renderSize.height);
renderer.render(scene, camera);
