import * as THREE from '../libs/three.js/r125/three.module.js'
import { GLTFLoader } from '../libs/three.js/r125/loaders/GLTFLoader.js'
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { FBXLoader } from '../libs/three.js/r125/loaders/FBXLoader.js';
import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

let renderer = null, scene = null, camera = null, root = null, group = null, orbitControls = null;

let objectList = [];

let currentTime = Date.now();

let spotLight = null, ambientLight = null;
let roadMapUrl = "../Assets/Scene_1/Road.jpg";
let canvasUrl = "../Assets/canvas_background.jpg"
let sunriseUrl = "../Assets/Scene_1/sunrise_background.jpg"
let grassUrl = { map: "../Assets/Scene_3/Grass/Vol_42_1_Base_Color.png", normalMap: "../Assets/Scene_3/Grass/Vol_42_1_Normal.png", roughness: "../Assets/Scene_3/Grass/Vol_42_1_Roughness.png" }
let pineTreeModelUrl = { obj: "../Assets/Scene_1/pineTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
let ballTreeModelUrl = { obj: "../Assets/Scene_1/ballTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
let bushTreeModelUrl = { obj: "../Assets/Scene_1/bush.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
let rock2ModelUrl = { obj: "../Assets/Scene_1/rock2.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
let carModelUrl = { obj: "../Assets/Scene_1/car/toon_car.obj", mtl: "../Assets/Scene_1/car/toon_car.mtl" };
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
let floor = -2;
let birdObjects = [];
let animatedObjects = [];
let birdUrls = ["../Assets/Scene_1/Flamingo.glb", "../Assets/Scene_1/Parrot.glb", "../Assets/Scene_1/Stork.glb"];
let sunUrl = "../Assets/Scene_1/sun.glb"
let pineTreeGroup = new THREE.Object3D, ballTreeGroup = new THREE.Object3D, rockGroup = new THREE.Object3D, carGroup = new THREE.Object3D, sunGroup = new THREE.Object3D;
let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;





function main() {
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    update();
}

function setVectorValue(vector, configuration, property, initialValues) {
    if (configuration !== undefined) {
        if (property in configuration) {
            console.log("setting:", property, "with", configuration[property]);
            vector.set(configuration[property].x, configuration[property].y, configuration[property].z);
            return;
        }
    }

    console.log("setting:", property, "with", initialValues);
    vector.set(initialValues.x, initialValues.y, initialValues.z);
}

function degrees_to_radians(degrees) {
    let pi = Math.PI;
    return degrees * (pi / 180);
}

function onError(err) { console.error(err); };

function onProgress(xhr) {

    if (xhr.lengthComputable) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(xhr.target.responseURL, Math.round(percentComplete, 2) + '% downloaded');
    }
}

function onDocumentPointerMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(animatedObjects, true);

    if (intersects.length > 0) {
        if (intersected != intersects[0].object) {
            if (intersected)
                intersected.material.emissive.set(intersected.currentHex);

            intersected = intersects[0].object;
            intersected.currentHex = intersected.material.emissive.getHex();
            intersected.material.emissive.set(0xff0000);
        }
    }
    else {
        if (intersected)
            intersected.material.emissive.set(intersected.currentHex);

        intersected = null;
    }
}

function onDocumentPointerDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(animatedObjects, true);


    if (intersects.length > 0) {
        clicked = intersects[0].object;
        clicked.animation = true;
    }
}

async function loadBirdsGLTF() {
    const gltfLoader = new GLTFLoader();

    const modelsPromises = birdUrls.map(url => {
        return gltfLoader.loadAsync(url);
    });

    try {
        const results = await Promise.all(modelsPromises);

        results.forEach((result, index) => {
            console.log(result);

            const object = result.scene.children[0];

            object.scale.set(0.02, 0.02, 0.02);
            object.rotation.y = 135;
            object.position.x = index > 0 ? - Math.random() * 10 : 1;
            object.position.y = index == 0 ? 6 : 4;
            object.position.z = 20;

            object.castShadow = true;
            object.receiveShadow = true;

            object.mixer = new THREE.AnimationMixer(scene);
            object.action = object.mixer.clipAction(result.animations[0], object).setDuration(1.0);

            object.action.play();

            birdObjects.push(object);

            scene.add(object);

        });
    }
    catch (err) {
        console.error(err);
    }
}


async function loadObjMtl(objModelUrl, objectList, position_x, position_z, scale, objectGroup) {
    try {
        const mtlLoader = new MTLLoader();

        const materials = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);

        materials.preload();

        const objLoader = new OBJLoader();

        objLoader.setMaterials(materials);
        const object = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });

        object.scale.set(scale, scale, scale);
        object.position.x = position_x;
        object.position.y = floor;
        object.position.z = position_z;
        object.rotation.y = 135;

        objectList.push(object);
        objectGroup.add(object)
        group.add(objectGroup);


    }
    catch (err) {
        onError(err);
    }
}

async function loadGLTF(gltfModelUrl, configuration, objectGroup, animationFlag) {
    try {
        const gltfLoader = new GLTFLoader();

        const result = await gltfLoader.loadAsync(gltfModelUrl);

        const object = result.scene.children[0];

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0, 0, 0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0, 0, 0));

        objectGroup.add(object);
        group.add(objectGroup);

        object.animation = false;
        object.name = "sun";
        console.log(object);
        if (animationFlag) animatedObjects.push(object);
    }
    catch (err) {
        console.error(err);
    }
}



function createScene(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvasTexture = new THREE.TextureLoader().load(canvasUrl);
    scene = new THREE.Scene();
    scene.background = canvasTexture;

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.set(0, 6, 20);
    scene.add(camera);

    orbitControls = new OrbitControls(camera, renderer.domElement);

    root = new THREE.Object3D;

    spotLight = new THREE.SpotLight(0xfc6c49);
    spotLight.position.set(-6, 0, 25);
    spotLight.target.position.set(-6, 0, 20);
    root.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight(0x888888);
    root.add(ambientLight);
    raycaster = new THREE.Raycaster();

    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerdown', onDocumentPointerDown);

    group = new THREE.Object3D;
    root.add(group);
    createFloor(roadMapUrl);
    createBackgroundImage(sunriseUrl);
    createGrassFloor(grassUrl);

    let positionZ = 10;
    let ballTreeScale = 0.5;
    let pineTreeScale = 0.5;
    let rockTreeScale = 3.0;
    for (let i = 0; i < 5; i++) {
        loadObjMtl(ballTreeModelUrl, objectList, 0, positionZ, ballTreeScale, ballTreeGroup);
        loadObjMtl(ballTreeModelUrl, objectList, -27, positionZ, ballTreeScale, ballTreeGroup);
        loadObjMtl(pineTreeModelUrl, objectList, -22, positionZ + 5, pineTreeScale, pineTreeGroup);
        loadObjMtl(pineTreeModelUrl, objectList, 5, positionZ + 5, pineTreeScale, pineTreeGroup);
        loadObjMtl(rock2ModelUrl, objectList, -15, positionZ + 7, rockTreeScale, rockGroup);
        loadObjMtl(rock2ModelUrl, objectList, -45, positionZ + 7, rockTreeScale, rockGroup);

        positionZ -= 10;
    }

    loadObjMtl(carModelUrl, objectList, -15.5, 10, 0.025, carGroup);
    loadBirdsGLTF();
    loadGLTF(sunUrl, { position: new THREE.Vector3(-10, -2, -42), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup, true);
    console.log(animatedObjects);
    group.position.x += 10;
    scene.add(root);
}

function update() {
    requestAnimationFrame(function () { update(); });

    renderer.render(scene, camera);

    animate();

    orbitControls.update();
}

async function animate() {
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    for (const object of birdObjects) {
        object.position.z -= 0.01 * deltat;

        if (object.position.z < -50)
            object.position.z = 20;

        if (object.mixer)
            object.mixer.update(deltat * 0.001);
    }
    carGroup.position.z -= 0.07;

    if (carGroup.position.z < -30)
        camera.position.z -= 1;
        if (camera.position.z< -40) 
            camera.near = -50;

    for (const object of animatedObjects) {
        if (object.animation) {
            sunGroup.position.y += 0.04;
            sunGroup.position.z += 0.05;
            if (sunGroup.position.y > 10) object.animation = false;
            if (spotLight.position.y > 5) {
                spotLight.position.y +=0.1
                
            };
            spotLight.position.y +=1;
        }
    }
}



function createFloor(floorMapUrl) {
    const map = new THREE.TextureLoader().load(floorMapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 1);

    const planeGeometry = new THREE.PlaneGeometry(25, 75, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide }));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.position.x = -12
    floor.position.z = -5

    group.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;

}

function createGrassFloor(grassUrl) {
    const map = new THREE.TextureLoader().load(grassUrl["map"]);
    const normalMap = new THREE.TextureLoader().load(grassUrl["normalMap"]);
    const roughnessMap = new THREE.TextureLoader().load(grassUrl["roughnessMap"])
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 1);

    const planeGeometry = new THREE.PlaneGeometry(115, 85, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide, normalMap: normalMap, roughness: roughnessMap }));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.01;
    floor.position.x = 0;
    floor.position.z = -5;

    group.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;
}

function createBackgroundImage(textureUrl) {
    const map = new THREE.TextureLoader().load(textureUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    const planeGeometry = new THREE.PlaneGeometry(115, 25, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide }));

    floor.rotation.x = degrees_to_radians(360);
    floor.rotation.y = degrees_to_radians(0);
    floor.position.y = 10;
    floor.position.x = 0;
    floor.position.z = -42.5;

    group.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;
}

function resize() {
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main()
    resize();
    
};

window.addEventListener('resize', resize, false);