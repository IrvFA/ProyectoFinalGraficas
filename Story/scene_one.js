import * as THREE from '../libs/three.js/three.module.js';

class Scene1 {
    objectList = [];
    currentTime = Date.now();
    spotLight = null;
    ambientLight = null;
    roadMapUrl = "../Assets/Scene_1/Road.jpg";
    canvasUrl = "../Assets/canvas_background.jpg"
    sunriseUrl = "../Assets/Scene_1/sunrise_background.jpg"
    grassUrl = { map: "../Assets/Scene_3/Grass/Vol_42_1_Base_Color.png", normalMap: "../Assets/Scene_3/Grass/Vol_42_1_Normal.png", roughness: "../Assets/Scene_3/Grass/Vol_42_1_Roughness.png" }
    pineTreeModelUrl = { obj: "../Assets/Scene_1/pineTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
    ballTreeModelUrl = { obj: "../Assets/Scene_1/ballTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
    bushTreeModelUrl = { obj: "../Assets/Scene_1/bush.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
    rock2ModelUrl = { obj: "../Assets/Scene_1/rock2.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl" };
    carModelUrl = { obj: "../Assets/Scene_1/car/toon_car.obj", mtl: "../Assets/Scene_1/car/toon_car.mtl" };
    SHADOW_MAP_WIDTH = 2048; SHADOW_MAP_HEIGHT = 2048;
    floor = -2;
    birdObjects = [];
    animatedObjects = [];
    birdUrls = ["../Assets/Scene_1/Flamingo.glb", "../Assets/Scene_1/Parrot.glb", "../Assets/Scene_1/Stork.glb"];
    sunUrl = "../Assets/Scene_1/sun.glb"
    pineTreeGroup = new THREE.Object3D; ballTreeGroup = new THREE.Object3D; rockGroup = new THREE.Object3D; carGroup = new THREE.Object3D; sunGroup = new THREE.Object3D
    raycaster = null; mouse = new THREE.Vector2(); intersected; clicked;
    uiUrl = "../Assets/ui-objects/model.gltf"
    uiObjects = [];
    sceneTransition = false; currentScene = 0;

    constructor(scene) {
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

        group_one = new THREE.Object3D;
        root.add(group_one);
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
        group_one.position.x += 10;
        scene.add(root);

    }


}