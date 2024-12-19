import * as React from 'react';
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader} from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import { GUI} from "three/examples/jsm/libs/lil-gui.module.min"

export function ThreeViewer () {

let scene: THREE.Scene | null
let mesh: THREE.Object3D | null
let renderer: THREE.WebGLRenderer | null
let cameraControls: OrbitControls | null
let camera: THREE.PerspectiveCamera | null
let axes: THREE.AxesHelper | null
let grid: THREE.GridHelper | null
let directionalLight: THREE.DirectionalLight | null
let ambientLight: THREE.AmbientLight | null
let mtlLoader: MTLLoader | null
let objLoader: OBJLoader | null

const setViewer = () => {
    // ThreeJS simple viewer
    const scene = new THREE.Scene();

    const viewerContainer = document.getElementById("viewer-container") as HTMLElement;

    const containerDimensions = viewerContainer.getBoundingClientRect();
    const aspectRatio = containerDimensions.width / containerDimensions.height;
    camera = new THREE.PerspectiveCamera(75, aspectRatio);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    viewerContainer.appendChild(renderer.domElement);

    function resizeViewer() {
        const containerDimensions = viewerContainer.getBoundingClientRect();
        if (!renderer) return
        renderer.setSize(containerDimensions.width, containerDimensions.height);
        const aspectRatio = containerDimensions.width / containerDimensions.height;
        if (!camera) return
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resizeViewer);

    resizeViewer();

    directionalLight = new THREE.DirectionalLight();
    // directionalLight.intensity = 10;
    ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.4;

    scene.add(directionalLight, ambientLight);

    cameraControls = new OrbitControls(camera, viewerContainer);

    function renderScene() {
        if (!renderer || !scene || !camera) return
        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
    }

    renderScene();

    // World helpers
    axes = new THREE.AxesHelper();
    grid = new THREE.GridHelper();
    grid.material.transparent = true;
    grid.material.opacity = 0.4;
    grid.material.color = new THREE.Color("#808080");

    scene.add(axes, grid);

    objLoader = new OBJLoader();
    mtlLoader = new MTLLoader();

    mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
        materials.preload();
        if(!objLoader) return
        objLoader.setMaterials(materials);
        objLoader.load("../assets/Gear/Gear1.obj", (object) => {
            if(!scene) return
            scene.add(object);
            mesh = object
        });
    });
}

React.useEffect(() => {

    setViewer()

    return () => {
        mesh?.removeFromParent()
        mesh?.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                child.material.dispose()
            }
        })
        mesh = null
    }
}, [])


    return(
        <div
            id="viewer-container"
            className="dashboard-card"
            style={{ minWidth: 0 }}
        />
    )
}