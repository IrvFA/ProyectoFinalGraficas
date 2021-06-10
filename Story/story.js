import * as THREE from '../libs/three.js/r125/three.module.js'
import { GLTFLoader } from '../libs/three.js/r125/loaders/GLTFLoader.js'
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { FBXLoader } from '../libs/three.js/r125/loaders/FBXLoader.js';
import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';


/**
 Complete Story Assets
 */
 const canvas = document.getElementById("webglcanvas");


let renderer = null, scene = null, camera = null, orbitControls = null;
let scene_root_1 = null, group_one = null, scene_root_2 = null, group_two = null;
let scene_root_3 = null, group_three

let objectList = [];

let currentTime = Date.now();

let spotLight = null, ambientLight = null, spotLight1 = null, spotLight2 = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;
let nextSceneTransition = false, currentScene= 0, lastSceneTransition = false;

let beeGroup = new THREE.Object3D;

/**
 * AUDIO ASSETS
 */
 const audioListener = new THREE.AudioListener();
 const music_sound = new THREE.Audio(audioListener);
 const scene_1_sound = new THREE.Audio(audioListener);
 const scene_2_sound = new THREE.Audio(audioListener);
 const scene_3_sound = new THREE.Audio(audioListener);
 const scene_4_sound = new THREE.Audio(audioListener);
 const scene_5_sound = new THREE.Audio(audioListener);
 const scene_6_sound = new THREE.Audio(audioListener);
 const audioLoader = new THREE.AudioLoader();

/*
SCENE 1 ASSETS
*/
let roadMapUrl = "../Assets/Scene_1/Road.jpg";
let canvasUrl = "../Assets/canvas_background.jpg"
let sunriseUrl = "../Assets/Scene_1/sunrise_background.jpg"
let grassUrl = { map: "../Assets/Scene_3/Grass/Vol_42_1_Base_Color.png", normalMap: "../Assets/Scene_3/Grass/Vol_42_1_Normal.png"}
let dirtUrl = { map: "../Assets/Scene_3/DirtPath/Vol_16_2_Base_Color.png", normalMap: "../Assets/Scene_3/DirtPath/Vol_16_2_Normal.png" }
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
let pineTreeGroup = new THREE.Object3D, ballTreeGroup = new THREE.Object3D, rockGroup = new THREE.Object3D, carGroup = new THREE.Object3D, sunGroup = new THREE.Object3D
let beeUrl = "../Assets/BEE.fbx"
const text_scene_1 = `It was bright and early, and they had a long road ahead. This didn't bother James and his dad since they would sing and laugh all the way.
The sunrise painted a beautiful picture, with the brightest of colors and birds singing in celebration of what would be an amazing day.
To the sound of the classics, father and son sang along, filling the car with joyful melodies.`;

/* 
SCENE 2 ASSETS
*/
let treeGroup = new THREE.Object3D;
let mountainGroup = new THREE.Object3D;
let sunGroup2 = new THREE.Object3D;
let carGroup2 = new THREE.Object3D;
let animatedObjects2 = [];
let mountainUrl = {obj: "../Assets/Scene_2/mountain_asset/lowpolymountains.obj", mtl: "../Assets/Scene_2/mountain_asset/lowpolymountains.mtl"}
let characterUrl = "../Assets/Scene_2/characterLooking.fbx"
const BIRD_SOUND_URI = '../Assets/audio/birds-singing-01.ogg';
let charGroup = new THREE.Object3D;
let charLoaded = false;
const text_scene_2 = `After a short three hour drive they arrived to the forest. You could really see the excitement in James' face as 
he jumped out of the car and stared in awe at the pines and trees seeming to touch the sky.`;


/*
SCENE 3 ASSETS
*/

// master/root groups/objects
let animatedObjects3 = []
let waterUrl = "../Assets/Scene_3/waterTexture.png";
let rockGroup3= new THREE.Object3D;
let treeGroup3 = new THREE.Object3D;
let sunGroup3 = new THREE.Object3D;
let charGroup3 = new THREE.Object3D;
let mountainGroup2 = new THREE.Object3D;
let lake = null;
let lakeAnimator = null;
let animateLake = false;
let characterThrowingUrl = "../Assets/Scene_3/Throwing.fbx"
const LAKE_SOUND_URI = '../Assets/audio/lake-shore-01.ogg';
const text_scene_3 = `They soon reached a peaceful lake. They were the only ones there.
Time flew. The lake and the forest blended as one.
It was just them and the lake.`;


/**
 * Scene 4 Assets
 */

// master/root groups/objects
let animatedObjects4 = []
const TRAIL_FOOTSTEPS_SOUND_URI = '../Assets/audio/trail-footsteps-01.ogg';
let scene_root_4 = null;
// floor group will contain the floor groups, which are going to be rotated
let floor_group_four = null;
let group_four = null;
let sunGroup4 = new THREE.Object3D;
let charGroup4 = new THREE.Object3D;
let treeGroup4 = new THREE.Object3D;
let wolfGroup4 = new THREE.Object3D;
let characterWalkingUrl = "../Assets/Scene_4/Walking.fbx";
let wolfUrl = "../Assets/Scene_4/Wolf.glb"
const text_scene_4 = `Father and son walked through the woods up a mountain where they would camp out for the night.`;

/**
 * Scene 5 Assets
 */

// master/root groups/objects
let scene_root_5 = null;
// floor group will contain the floor groups, which are going to be rotated
let floor_group_five = null;
let group_five = null;
let objectList5 = [];
let animatedObjects5 = [];

const FOREST_SOUND_URI = '../Assets/audio/forest-wind-ambient-01.ogg'
const text_scene_5 = `They reached the top just in time to watch the sunset. All the trees suddenly felt small and just 
a part of the whole landscape picture.
As the sun painted its final brush strokes of light in the sky, they started a fire to keep themselves warm and cozy.`;
let cliffUrl = "../Assets/Scene_5/mountainLandscape/model.gltf";
let sunGroup5 = new THREE.Object3D;
let cliffGroup = new THREE.Object3D;
let rockGroup5 = new THREE.Object3D;
/**
 * Scene 6 Assets
 */
const CAMPFIRE_SOUND_URI = '../Assets/audio/campfire-01.ogg'
const text_scene_6 = `As they stared into the night sky, it felt as if each star became alive while watching them. 
All of a sudden, a light show just for them had begun. 
James knew that whenever he looked up to the sky, he would see a reminder of the wonderful day he shared with his dad, 
one that time could never wash away.`;

// master/root groups/objects
let scene_root_6 = null;
// floor group will contain the floor groups, which are going to be rotated
let floor_group_six = null;
let group_six = null;
let campUrl = "../Assets/Scene_6/campingTent/model.gltf";
let moonUrl = {obj: "../Assets/Scene_6/moon.obj", mtl: "../Assets/Scene_6/moon.mtl"};
let cliffGroup6 = new THREE.Object3D;
let moonGroup = new THREE.Object3D;

// object lists



function main() {

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
    mouse.x = ((event.clientX - canvas.offsetLeft) / window.innerWidth) * 2 - 1;
    mouse.y = - ((event.clientY - canvas.offsetTop) / window.innerHeight) * 2 + 1;

    console.log(event.movementY)

    let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    let dir = vector.sub( camera.position ).normalize();
    let distance = - camera.position.z / dir.z;
    let pos = camera.position.clone().add( dir.multiplyScalar(distance));
    beeGroup.position.copy(pos);

    if (beeGroup.position.y < floor)
        beeGroup.position.y = floor + 0.5;

    if (event.movementX > 0) {
        //beeGroup.children[0].rotation.y = 90;
        if(event.movementY > 1) beeGroup.children[0].rotation.set(90, 45, 0);
        else if(event.movementY < 1) beeGroup.children[0].rotation.set(-90, 45, 0);
    }else if (event.movementX < 0){ 
        //beeGroup.children[0].rotation.y = -90 
        if(event.movementY > 1) beeGroup.children[0].rotation.set(90, -45, 0);
        else if(event.movementY < 1) beeGroup.children[0].rotation.set(-90, -45, 0);
    }
    

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

            const object = result.scene.children[0];

            object.scale.set(0.02, 0.02, 0.02);
            object.rotation.y = 135;
            object.position.x = Math.random() * -20
            object.position.y = index == 0 ? 6 : 4;
            object.position.z = 20;

            object.castShadow = true;
            object.receiveShadow = true;

            object.mixer = new THREE.AnimationMixer(scene);
            object.action = object.mixer.clipAction(result.animations[0], object).setDuration(1.0);

            object.action.play();

            birdObjects.push(object);

            group_one.add(object)

        });
    }
    catch (err) {
        console.error(err);
    }
}

async function loadWolfGLTF(configuration,sceneGroup) {
    try {
        const gltfLoader = new GLTFLoader();
        const result = await gltfLoader.loadAsync(wolfUrl);

        const object = result.scene.children[0];

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0, 0, 0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0, 0, 0));

        object.castShadow = true;
        object.receiveShadow = true;

        object.mixer = new THREE.AnimationMixer(scene);
        object.action = object.mixer.clipAction(result.animations[1], object).setDuration(1.0);

        object.action.play();

        wolfGroup4.add(object);
        animatedObjects4.push(object);
        sceneGroup.add(wolfGroup4);
        

        }
    catch (err) {
        console.error(err);
    }
}

async function loadFBX(fbxModelUrl, configuration, objectGroup)
{
    try{
        let object = await new FBXLoader().loadAsync(fbxModelUrl);

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0,0,0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0,0,0));

        objectGroup.add(object);
        scene.add( objectGroup );
    }
    catch(err)
    {
        console.error( err );
    }
}

async function loadCharFBX(fbxModelUrl, configuration, animationArray, objGroup,sceneGroup)
{
    try{
        let object = await new FBXLoader().loadAsync(fbxModelUrl);

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0,0,0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0,0,0));
        
        object.mixer = new THREE.AnimationMixer(scene);
        object.action = object.mixer.clipAction(object.animations[0], object).setDuration(3.0);

        object.action.play();
        animationArray.push(object);
        objGroup.add(object);
        //sceneGroup.add(objGroup);
    }
    catch(err)
    {
        console.error( err );
    }
}

async function loadObjMtl(objModelUrl, objectList, configuration, objGroup, sceneGroup)
{
    try
    {
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
        
        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0, 0, 0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0, 0, 0));
        
        //object.scale.set(0.05, 0.05, 0.05);

        objectList.push(object);
        objGroup.add(object);
        sceneGroup.add(objGroup);
    }
    catch (err){
        onError(err);
    }
}

async function loadGLTF(gltfModelUrl, configuration, objectGroup,sceneGroup, animationFlag) {
    try {
        const gltfLoader = new GLTFLoader();

        const result = await gltfLoader.loadAsync(gltfModelUrl);

        const object = result.scene.children[0];

        setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0, 0, 0));
        setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
        setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0, 0, 0));

        objectGroup.add(object);
        sceneGroup.add(objectGroup);

        object.animation = false;
        object.name = "sun";
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
    camera.position.set(0, 10, 35);
    camera.rotation.x = -Math.PI / 12;

    camera.add(audioListener);

    raycaster = new THREE.Raycaster();



    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerdown', onDocumentPointerDown);
    loadFBX(beeUrl, {position: new THREE.Vector3(0, 5, 10), scale: new THREE.Vector3(0.01, 0.01, 0.01), rotation: new THREE.Vector3(0, 0,0)}, beeGroup);

    scene.add(camera);

    createScene1();
    createScene2();
    createScene3();
    createScene4();
    createScene5();
    createScene6();
}

function createScene1() {
    
    scene_root_1 = new THREE.Object3D;

    spotLight = new THREE.SpotLight(0xfc6c49);
    spotLight.position.set(-6, 0, 25);
    spotLight.target.position.set(-6, 0, 20);
    scene_root_1.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight(0x888888);
    scene_root_1.add(ambientLight);
    

    group_one = new THREE.Object3D;
    createFloor(roadMapUrl);
    createBackgroundImage(sunriseUrl, group_one);
    createGrassFloor(grassUrl, group_one);

    let positionZ = 10;
    for (let i = 0; i < 5; i++) {
        
        loadObjMtl(ballTreeModelUrl, objectList, {position: new THREE.Vector3(10,floor, positionZ), scale: new THREE.Vector3(0.5, 0.5, 0.5), rotation: new THREE.Vector3(0, 0, 0)} ,ballTreeGroup, group_one);
        loadObjMtl(ballTreeModelUrl, objectList,{position: new THREE.Vector3(-27,floor, positionZ), scale: new THREE.Vector3(0.5, 0.5, 0.5), rotation: new THREE.Vector3(0, 0, 0)} ,ballTreeGroup, group_one);
        loadObjMtl(pineTreeModelUrl, objectList, {position: new THREE.Vector3(-30,floor, positionZ + 5), scale: new THREE.Vector3(0.5, 0.5, 0.5), rotation: new THREE.Vector3(0, 0, 0)},pineTreeGroup, group_one);
        loadObjMtl(pineTreeModelUrl, objectList, {position: new THREE.Vector3(10,floor, positionZ + 5), scale: new THREE.Vector3(0.5, 0.5, 0.5), rotation: new THREE.Vector3(0, 0, 0)},pineTreeGroup, group_one);
        loadObjMtl(rock2ModelUrl, objectList, {position: new THREE.Vector3(-15,floor, positionZ + 7), scale: new THREE.Vector3(3.0, 3.0, 3.0), rotation: new THREE.Vector3(0, 0, 0)} ,rockGroup, group_one);
        loadObjMtl(rock2ModelUrl, objectList, {position: new THREE.Vector3(45,floor, positionZ +7), scale: new THREE.Vector3(3.0, 3.0, 3.0), rotation: new THREE.Vector3(0, 0, 0)} ,rockGroup, group_one);

        positionZ -= 10;
    }

    loadObjMtl(carModelUrl, objectList, {position: new THREE.Vector3(-15.5,floor, 10), scale: new THREE.Vector3(0.025, 0.025, 0.025), rotation: new THREE.Vector3(0, 135, 0)} ,carGroup, group_one);
    loadBirdsGLTF();
    loadGLTF(sunUrl, { position: new THREE.Vector3(-10, -2, -42), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup, group_one ,true);
    group_one.position.x += 10;
    scene_root_1.add(group_one);
    scene.add(scene_root_1);
}

function createScene2() {
    camera.position.set(0, 6, 35);
    scene_root_2 = new THREE.Object3D;
    spotLight = new THREE.SpotLight ("white");
    spotLight.position.set(-6, 10, 30);
    spotLight.target.position.set(-6, 20, 20);
    scene_root_2.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    scene_root_2.add(ambientLight);
    group_two = new THREE.Object3D;
    createGrassFloor(grassUrl, group_two);
    createDirtFloor(dirtUrl, group_two);
    let positionZ = 0;
    let pinePosition = -10;
    for (let i=0; i<10; i++){
        loadObjMtl(ballTreeModelUrl, objectList,{ position: new THREE.Vector3(-35+Math.floor(Math.random()*-20), floor,positionZ), scale: new THREE.Vector3(0.8,0.8,0.8), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup, group_two);
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(-32+Math.floor(Math.random()*-40), floor, pinePosition), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup, group_two);
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(2-Math.floor(Math.random()*10), floor, pinePosition*-1), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup, group_two);
        positionZ -= 1;
    }

    
    loadObjMtl(carModelUrl, objectList, { position: new THREE.Vector3(0, floor, 20), scale: new THREE.Vector3(0.025, 0.025, 0.025), rotation: new THREE.Vector3(0, -90, 0) }, carGroup2, group_two);
    loadCharFBX(characterUrl, {position : new THREE.Vector3(0, floor, 15), scale: new THREE.Vector3(0.03, 0.03, 0.03), rotation: new THREE.Vector3(0,0,0)}, animatedObjects2, charGroup, group_two);

    console.log(charGroup);
    carGroup2.animation = true;
    carGroup2.position.x = 10;

    console.log(group_two);

    loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-50,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup, group_two);
    loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-10,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup, group_two);
    loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(30, floor,-40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup, group_two);
    loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(60,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup, group_two);

    loadGLTF(sunUrl, { position: new THREE.Vector3(-5, 10, -60), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup2, group_two,true);
    sunGroup.remove(sunGroup.children)

    console.log(carGroup)
    group_two.position.x += 10;
    scene_root_2.add(group_two);
    //scene.add(scene_root_2);
    
    
}

function createScene3() {
    camera.position.set(0, 6, 35); 
    scene_root_3 = new THREE.Object3D;
    
    // add lighting to scene
    spotLight = new THREE.SpotLight ("white");
    spotLight.position.set(-6, 10, 35);
    spotLight.target.position.set(-6, 20, 20);
    scene_root_3.add(spotLight);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    scene_root_3.add(ambientLight);
    
    //loadGLTF();

    
    group_three = new THREE.Object3D;
    scene_root_3.add(group_three);
    
    
    


    // floor with grass
    createGrassFloor(grassUrl, group_three);
    createLakeSurface(waterUrl, group_three);

    let positionZ = 10;
    let positionX = 0;
    let pinePosition = -10;
    let i = 0;
    for (i; i<5; i++){
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(-5, floor, positionZ), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup3, group_three);
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(-30, floor, positionZ ), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup3, group_three);
        loadObjMtl(rock2ModelUrl, objectList, {position: new THREE.Vector3(positionX,floor, -12), scale: new THREE.Vector3(4.0, 4.0, 4.0), rotation: new THREE.Vector3(0, 0, 0)} ,rockGroup3, group_three);

        positionX+=5;
        positionZ+=4;
    }

    loadCharFBX(characterThrowingUrl, {position: new THREE.Vector3(0, floor, 10), scale: new THREE.Vector3(0.03, 0.03, 0.03), rotation:  new THREE.Vector3(0,90,0)}, animatedObjects3, charGroup3, group_three)
    scene_root_3.add(charGroup3);
    console.log(charGroup3);
    loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-50,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup2, group_three);
    loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-10,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup2, group_three);
    loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(30, floor,-40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup2, group_three);
    loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(60,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup2, group_three);

    loadGLTF(sunUrl, { position: new THREE.Vector3(-5, 15, -60), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup3, group_three ,true);

    

    group_three.position.x += 10;

    
    
    
    
    // apparently nothing happens if we comment out scene.add(group)
    // NOTE that @ 243 there is a root.add(group)
    //  i.e., group is part of root
    // scene.add(group);
    
    // if we comment out this line, it all disappears
}

function createScene4() {
    audioLoader.load( TRAIL_FOOTSTEPS_SOUND_URI, 
        function( buffer ) {
            scene_4_sound.setBuffer( buffer );
            scene_4_sound.setLoop( true );
            scene_4_sound.setVolume( 0.75 );
            scene_4_sound.play();
    },
    // onProgress callback
    function ( xhr ) {
        console.log( 'AUDIO:', (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // onError callback
    function ( err ) {
        console.log( 'AUDIO ERROR - An error happened' );
    });

    // create root object to keep all objects of this scene
    scene_root_4 = new THREE.Object3D;
    
    // add lighting to scene
    spotLight = new THREE.SpotLight ("white");
    spotLight.position.set(-6, 10, 35);
    spotLight.target.position.set(-6, 20, 20);
    scene_root_4.add(spotLight);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    scene_root_4.add(ambientLight);
    
    // object groups for hierarchy and management in master scene file
    group_four = new THREE.Object3D;
    floor_group_four = new THREE.Object3D;
    scene_root_4.add(group_four);
    scene_root_4.add(floor_group_four)
    
    // background image
    createBackgroundImage(waterUrl, group_four);

    // create floor assets and add rotation to hill subgroup
    createDirtFloor(dirtUrl, group_four);
    createGrassFloor(grassUrl, floor_group_four);
    //createLakeSurface(waterUrl, group_four);
    floor_group_four.rotation.z = degrees_to_radians(-5);


    

    // loading and adding sun
    loadGLTF(sunUrl, { position: new THREE.Vector3(35, 25, -60), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup4, group_four ,true);
    loadWolfGLTF({position: new THREE.Vector3(0, floor, 20), scale: new THREE.Vector3(4.5, 4.5, 4.5), rotation:  new THREE.Vector3(0,-90,0)}, group_four);

    // loading and adding trees
    // front row
    let x_displacement = 0;
    let y_displacement = -4;
    const PINE_Z_POS = 2;
    for (let i = 0; i < 6; i++) {
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(x_displacement, y_displacement, PINE_Z_POS), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup4, group_four);    
        x_displacement -= 9;
        y_displacement += 1;
    }

    // middle row
    x_displacement = 10;
    y_displacement = -4;
    const BALLTREE_Z_POS = -10;
    for (let i = 0; i < 6; i++) {
        loadObjMtl(ballTreeModelUrl, objectList,{ position: new THREE.Vector3(x_displacement, y_displacement, BALLTREE_Z_POS), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup4, group_four);    
        x_displacement -= 12;
        y_displacement += 1;
    }

    // back row with scaled pines
    x_displacement = 1;
    y_displacement = -4;
    const BIGPINE_Z_POS = -20;
    for (let i = 0; i < 6; i++) {
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(x_displacement, y_displacement, BIGPINE_Z_POS), scale: new THREE.Vector3(1.75, 1.75, 1.75), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup4, group_four);    
        x_displacement -= 12;
        y_displacement += 1;
    }

    loadCharFBX(characterWalkingUrl, {position: new THREE.Vector3(0, floor, 10), scale: new THREE.Vector3(0.03, 0.03, 0.03), rotation:  new THREE.Vector3(0,-90,0)}, animatedObjects4, charGroup4, group_four)
    scene_root_4.add(charGroup4);




    group_four.position.x += 10;

    setTimeout(() => {
      document.getElementById('storyText').innerHTML = text_scene_3;  
    },
    3000);
    
}

function createScene5() {
    // load and play scene audio
    audioLoader.load( FOREST_SOUND_URI, 
        function( buffer ) {
            scene_5_sound.setBuffer( buffer );
            scene_5_sound.setLoop( true );
            scene_5_sound.setVolume( 0.75 );
            // sound.play();
    },
    // onProgress callback
    function ( xhr ) {
        console.log( 'AUDIO:', (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // onError callback
    function ( err ) {
        console.log( 'AUDIO ERROR - An error happened' );
    });

    scene.add(camera);

    
        
    // create root object to keep all objects of this scene
    scene_root_5 = new THREE.Object3D;
    
    // add spotlights for hot color temp lighting on scene
    spotLight1 = new THREE.SpotLight ( 0xF8B195 );
    spotLight1.position.set(-6, 10, 35);
    spotLight1.target.position.set(-6, 20, 20);
    
    spotLight2 = new THREE.SpotLight ( 0xF67280 );
    spotLight2.position.set(-7, 12, 35);
    spotLight2.target.position.set(-6, 20, 20);

    scene_root_5.add(spotLight1);
    scene_root_5.add(spotLight2);


    spotLight1.castShadow = true;
    spotLight1.shadow.camera.near = 1;
    spotLight1.shadow.camera.far = 200;
    spotLight1.shadow.camera.fov = 45;
    spotLight1.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight1.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    spotLight2.castShadow = true;
    spotLight2.shadow.camera.near = 1;
    spotLight2.shadow.camera.far = 200;
    spotLight2.shadow.camera.fov = 45;
    spotLight2.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight2.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    // -------------------------------------------

    

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    scene_root_5.add(ambientLight);
    
    // object groups for hierarchy and management in master scene file
    group_five = new THREE.Object3D;
    floor_group_five = new THREE.Object3D;
    
    
    // background image
    createBackgroundImage(sunriseUrl, group_five);

 

    // loading and adding sun
    loadGLTF(sunUrl, { position: new THREE.Vector3(-7, 25, -42), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup5, group_five,true);


    // loading and adding trees

    // load and add rock that is mountain top
    loadObjMtl(rock2ModelUrl, objectList, {position: new THREE.Vector3(111,0, -8), scale: new THREE.Vector3(22.0, 4.0, 8.0), rotation: new THREE.Vector3(0, 0, 0)} ,rockGroup5, group_five);

    
    
    // load cilff/mountains for landscape
    loadGLTF(cliffUrl, { position: new THREE.Vector3(-7, -20, -42), scale: new THREE.Vector3(10.0, 7.0, 7.0), rotation: new THREE.Vector3(0, 0, 0) }, cliffGroup, group_five,false);

    group_five.position.x += 10;

    setTimeout(() => {
      document.getElementById('storyText').innerHTML = text_scene_3;  
    },
    3000);
    scene_root_5.add(group_five);
    scene_root_5.add(floor_group_five)
}

function createScene6() {
    // load and play scene audio
    audioLoader.load( CAMPFIRE_SOUND_URI, 
        function( buffer ) {
            scene_6_sound.setBuffer( buffer );
            scene_6_sound.setLoop( true );
            scene_6_sound.setVolume( 0.75 );
            // sound.play();
    },
    // onProgress callback
    function ( xhr ) {
        console.log( 'AUDIO:', (xhr.loaded / xhr.total * 100) + '% loaded' );
    },

    // onError callback
    function ( err ) {
        console.log( 'AUDIO ERROR - An error happened' );
    });

    scene_root_6 = new THREE.Object3D;
    
    // add spotlights for hot color temp lighting on scene
    spotLight1 = new THREE.SpotLight ( 0x355C7D );
    spotLight1.position.set(-6, 10, 35);
    spotLight1.target.position.set(-6, 20, 20);

    scene_root_6.add(spotLight1);


    spotLight1.castShadow = true;
    spotLight1.shadow.camera.near = 1;
    spotLight1.shadow.camera.far = 200;
    spotLight1.shadow.camera.fov = 45;
    spotLight1.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight1.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    

    ambientLight = new THREE.AmbientLight ( 0x355C7D );
    scene_root_6.add(ambientLight);
    
    // object groups for hierarchy and management in master scene file
    group_six = new THREE.Object3D;
    floor_group_six = new THREE.Object3D;
    scene_root_6.add(group_six);
    scene_root_6.add(floor_group_six)
    
    // background image
    createBackgroundImage(waterUrl, group_six);


    // load and put moon
    loadObjMtl(moonUrl, objectList, { position: new THREE.Vector3(-30, 5, -40.5), scale: new THREE.Vector3(0.25, 0.25, 0.25), rotation: new THREE.Vector3(0, Math.PI, 0) }, moonGroup, scene_root_6);
    
    // load campsite
    loadGLTF(campUrl, { position: new THREE.Vector3(0, -3, 18), scale: new THREE.Vector3(5.5, 4.5, 4.5), rotation: new THREE.Vector3(0, Math.PI, 0) }, cliffGroup6, scene_root_6 ,false);

    group_six.position.x += 10;

    setTimeout(() => {
      document.getElementById('storyText').innerHTML = text_scene_6;  
    },
    3000);
    
}

function createTextScene3() {
    document.getElementById('storyText').innerHTML = text_scene_3; 
}

function update() {
    requestAnimationFrame(function () { update(); });

    renderer.render(scene, camera);
    

    animate();
    checkSceneTransition();

}

async function animate() {
    switch (currentScene) {
        case 0:
            animateScene1();
            break;
        case 1:
            animateScene2();
            break;
        case 2:
            animateScene3();
            break;
        case 3:
            animateScene4();
    }
}

function animateScene1() {
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

function animateScene2() {
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    if (carGroup2.animation == true){
    carGroup2.position.x -= 0.07;
    carGroup2.position.z -= 0.07;
    }
    if(carGroup2.position.x< -5){
        carGroup2.animation = false;
    if(charLoaded== true){
        scene_root_2.add(charGroup);
        charLoaded = false;
    }
    }

    for (const object of animatedObjects2) {
        if (object.mixer)
            object.mixer.update(deltat * 0.001);
    }
    
}

function animateScene3() {
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    for (const object of animatedObjects3) {
        if (object.mixer)
            object.mixer.update(deltat * 0.001);
    }
}

function animateScene4() {
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    for (const object of animatedObjects4) {
        object.position.x -= 0.001 * deltat;
        object.position.y += 0.0001 * deltat;
        if (object.mixer)
            object.mixer.update(deltat * 0.001);
    }
}

function animateScene5() {

}

function createLakeSurface(waterUrl, group) {
    const map = new THREE.TextureLoader().load(waterUrl);
    
  
    const planeGeometry = new THREE.PlaneGeometry(115, 85, 50, 50);
    const lakeSurface = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));
  
    lakeSurface.rotation.x = -Math.PI / 2;
    lakeSurface.position.y = floor+0.1;
    lakeSurface.position.x = 10;
    lakeSurface.position.z = -40;
    
    lake = lakeSurface;
    group.add( lakeSurface );
    lakeSurface.castShadow = false;
    lakeSurface.receiveShadow = true;
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

    group_one.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;

}

function createGrassFloor(grassUrl, group) {
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

function createDirtFloor(dirtUrl, group) {
    const map = new THREE.TextureLoader().load(dirtUrl["map"]);
    const normalMap = new THREE.TextureLoader().load(dirtUrl["normalMap"]);
    const roughnessMap = new THREE.TextureLoader().load(dirtUrl["roughnessMap"])
    // map.wrapS = map.wrapT = THREE.RepeatWrapping;
    // map.repeat.set(2, 1);

    const planeGeometry = new THREE.PlaneGeometry(50, 85, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide, normalMap: normalMap, roughness: roughnessMap }));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.0;
    floor.position.x = 0;
    floor.position.z = -5;

    group.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;
}

function createBackgroundImage(textureUrl, sceneGroup) {
    const map = new THREE.TextureLoader().load(textureUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    const planeGeometry = new THREE.PlaneGeometry(180, 50, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide }));

    floor.rotation.x = degrees_to_radians(360);
    floor.rotation.y = degrees_to_radians(0);
    floor.position.y = 0;
    floor.position.x = 0;
    floor.position.z = -42.5;

    sceneGroup.add(floor);
    floor.castShadow = false;
    floor.receiveShadow = true;
}

function resize() {
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight * 0.95;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

function checkSceneTransition() {
if (lastSceneTransition){
        switch (currentScene){
            case 0:
                beeGroup.position.z -= 1.5;
                camera.position.z -= 1;
                if (camera.position.z < -30){
                    scene.remove(scene_root_2);
                    lastSceneTransition = false;
                    beeGroup.position.z = 10;
                    carGroup.position.set(0,floor+2, 10);
                    camera.position.set(0, 6, 35);
                    scene.add(scene_root_1)
                }
                break;
            case 1:
                beeGroup.position.z -= 1.5;
                camera.position.z -= 1;
                if (camera.position.z < -30){
                    scene.remove(scene_root_3);
                    lastSceneTransition = false;
                    beeGroup.position.z = 10;
                    camera.position.set(0, 6, 35);
                    scene.add(scene_root_2)
                }
                break;
            case 2:
                beeGroup.position.z -= 1.5;
                camera.position.z -= 1;
                if (camera.position.z < -30){
                    scene.remove(scene_root_4);
                    lastSceneTransition = false;
                    beeGroup.position.z = 10;
                    camera.position.set(0, 6, 35);
                    scene.add(scene_root_3)
                }
                break;
            case 3:
                beeGroup.position.z -= 1.5;
                camera.position.z -= 1;
                if (camera.position.z < -30){
                    scene.remove(scene_root_5);
                    lastSceneTransition = false;
                    beeGroup.position.z = 10;
                    charGroup4.position.set(0, floor, 10);
                    wolfGroup4.position.set(0, floor, 20);
                    camera.position.set(0, 6, 35);
                    scene.add(scene_root_4)
                }
                break;
            case 4:
                    beeGroup.position.z -= 1.5;
                    camera.position.z -= 1;
                    if (camera.position.z < -30){
                        scene.remove(scene_root_6);
                        lastSceneTransition = false;
                        beeGroup.position.z = 10;
                        charGroup4.position.set(0, floor, 10);
                        wolfGroup4.position.set(0, floor, 20);
                        camera.position.set(0, 6, 35);
                        scene.add(scene_root_5)
                    }
                    break;
                    
        }
    }
if (nextSceneTransition){
    switch (currentScene){
        case 1:
            beeGroup.position.z -= 1.5;
            camera.position.z -= 1;
            if (camera.position.z < -30){
                scene.remove(scene_root_1);
                nextSceneTransition = false;
                beeGroup.position.z = 10;
                camera.position.set(0, 6, 35);
                charLoaded = true;
                scene.add(scene_root_2);
            }
            break;
        case 2:
            beeGroup.position.z -= 1.5;
            camera.position.z -= 1;
            if (camera.position.z < -30){
                scene.remove(scene_root_2);
                nextSceneTransition = false;
                beeGroup.position.z = 10;
                camera.position.set(0, 6, 35);
                scene.add(scene_root_3);
                createTextScene3(); 
            }
            break;
        case 3:
            beeGroup.position.z -= 1.5;
            camera.position.z -= 1;
            if (camera.position.z < -30){
                scene.remove(scene_root_3);
                nextSceneTransition = false;
                beeGroup.position.z = 10;
                camera.position.set(0, 6, 35);
                scene.add(scene_root_4);
            }
            break;
        case 4:
            beeGroup.position.z -= 1.5;
            camera.position.z -= 1;
            if (camera.position.z < -30){
                scene.remove(scene_root_4);
                nextSceneTransition = false;
                beeGroup.position.z = 10;
                camera.position.set(0, 6, 35);
                scene.add(scene_root_5);
            }
            break;
        case 5:
            beeGroup.position.z -= 1.5;
            camera.position.z -= 1;
            if (camera.position.z < -30){
                scene.remove(scene_root_5);
                nextSceneTransition = false;
                beeGroup.position.z = 10;
                camera.position.set(0, 6, 35);
                scene.add(scene_root_6);
            }
            break;                
    }
}
}


function initControls() {
    document.querySelector("#last-scene").addEventListener('click', () => { 
        lastSceneTransition = true;
        if (currentScene == 0) currentScene = 0;
        else currentScene--;
    } );
    document.querySelector("#next-scene").addEventListener('click', () => { 
        nextSceneTransition = true;
        currentScene++;
    } );

} 

window.onload = () => {
    main();
    resize();
    initControls();
};


window.addEventListener('resize', resize, false);