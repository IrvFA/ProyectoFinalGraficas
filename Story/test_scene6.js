import * as THREE from '../libs/three.js/r125/three.module.js'
import { GLTFLoader } from '../libs/three.js/r125/loaders/GLTFLoader.js'
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { FBXLoader } from '../libs/three.js/r125/loaders/FBXLoader.js';
import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

// Three and scene key elements
let renderer = null, scene = null, camera = null, orbitControls = null;

// master/root groups/objects
let scene_root_6 = null;
// floor group will contain the floor groups, which are going to be rotated
let floor_group_six = null;
let group_six = null;

// object lists
let objectList = [];
let animatedObjects = [];

let currentTime = Date.now();

// lights for the scenes
let spotLight1 = null, ambientLight = null;

// texture URLs
let roadMapUrl = "../Assets/Scene_1/Road.jpg";
let canvasUrl = "../Assets/canvas_background.jpg";
let sunriseUrl = "../Assets/Scene_1/sunrise_background.jpg";
let waterUrl = "../Assets/Scene_3/waterTexture.png";
let grassUrl = { map: "../Assets/Scene_3/Grass/Vol_42_1_Base_Color.png", normalMap: "../Assets/Scene_3/Grass/Vol_42_1_Normal.png"}
let dirtUrl = {map: "../Assets/Scene_3/DirtPath/Vol_16_2_Base_Color.png", normalMap: "../Assets/Scene_3/DirtPath/Vol_16_2_Normal.png"}

// 3D asset URLs
let pineTreeModelUrl = {obj: "../Assets/Scene_1/pineTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let ballTreeModelUrl = {obj: "../Assets/Scene_1/ballTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let bushTreeModelUrl = {obj: "../Assets/Scene_1/bush.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let rock2ModelUrl = {obj: "../Assets/Scene_1/rock2.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let mountainUrl = {obj: "../Assets/Scene_2/mountain_asset/lowpolymountains.obj", mtl: "../Assets/Scene_2/mountain_asset/lowpolymountains.mtl"}
let carModelUrl = {obj: "../Assets/Scene_1/car/toon_car.obj", mtl: "../Assets/Scene_1/car/toon_car.mtl"};
let lilypadUrl = "../Assets/Scene_2/lilyPad/LilyPad.gltf";

let sunUrl = "../Assets/Scene_1/Sun/Sun_01.gltf";
let cliffUrl = "../Assets/Scene_5/mountainLandscape/model.gltf";
let campUrl = "../Assets/Scene_6/campingTent/model.gltf";

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

let sunGroup = new THREE.Object3D;
let cliffGroup = new THREE.Object3D;
let leafGroup = new THREE.Object3D;
let treeGroup = new THREE.Object3D;
let mountainGroup = new THREE.Object3D;
let carGroup = new THREE.Object3D;
let floor = -2;

let rockGroup5 = new THREE.Object3D;


let pointerAnimator = null;
let animatePointer = true;
let keyAnimations = [];

// elements for playing sound
const FOREST_SOUND_URI = '../Assets/audio/forest-wind-ambient-01.ogg';
const audioListener = new THREE.AudioListener();
const sound = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();

const text_scene_3 = `This is scene 5 text`;


function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene5(canvas);
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

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}



async function loadObjMtl(objModelUrl, objectList, configuration, objGroup)
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
        group_six.add(objGroup);
    }
    catch (err){
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
        group_six.add(objectGroup);

        object.animation = false;
        object.name = "sun";
        if (animationFlag) animatedObjects.push(object);
    }
    catch (err) {
        console.error(err);
    }
}


function createScene5(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setSize(canvas.width, canvas.height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const canvasTexture = new THREE.TextureLoader().load(canvasUrl);
    scene = new THREE.Scene();
    scene.background = canvasTexture;

    // create, position, and add camera to scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 6, 33);
    // camera.rotation.y = degrees_to_radians(10);
    camera.add(audioListener);
    
    // load and play scene audio
    audioLoader.load( FOREST_SOUND_URI, 
        function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.75 );
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

    
    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    // create root object to keep all objects of this scene
    scene_root_6 = new THREE.Object3D;
    
    // add spotlights for hot color temp lighting on scene
    spotLight1 = new THREE.SpotLight ( 0xF8B195 );
    spotLight1.position.set(-6, 10, 35);
    spotLight1.target.position.set(-6, 20, 20);

    scene_root_6.add(spotLight1);


    spotLight1.castShadow = true;
    spotLight1.shadow.camera.near = 1;
    spotLight1.shadow.camera.far = 200;
    spotLight1.shadow.camera.fov = 45;
    spotLight1.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight1.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    scene_root_6.add(ambientLight);
    
    // object groups for hierarchy and management in master scene file
    group_six = new THREE.Object3D;
    floor_group_six = new THREE.Object3D;
    scene_root_6.add(group_six);
    scene_root_6.add(floor_group_six)
    
    // background image
    createBackgroundImage(sunriseUrl);

    // create floor assets and add rotation to hill subgroup
    // createDirtFloor(dirtUrl);


    // adding mountains
    // loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-50,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);
    // loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-10,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);
    // loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(30, floor,-40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);
    // loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(60,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);
    // mountainGroup.position.x = -35;
    // mountainGroup.position.z = 5;
    // mountainGroup.rotation.y = degrees_to_radians(-10);

    // loading and adding sun
    loadGLTF(sunUrl, { position: new THREE.Vector3(-7, 25, -42), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup, true);


    // loading and adding trees

    // load and add rock that is mountain top
    loadObjMtl(rock2ModelUrl, objectList, {position: new THREE.Vector3(111,0,-13), scale: new THREE.Vector3(22.0, 4.0, 8.0), rotation: new THREE.Vector3(0, 0, 0)} ,rockGroup5, group_six);

    
    
    // load campsite
    loadGLTF(campUrl, { position: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(10.0, 7.0, 7.0), rotation: new THREE.Vector3(0, 0, 0) }, cliffGroup, false);





    group_six.position.x += 10;

    setTimeout(() => {
      document.getElementById('storyText').innerHTML = text_scene_3;  
    },
    3000);
    
    
    
    // add root group -which contains all scene assets- to the scene
    scene.add( scene_root_6 );
}



function update() 
{
    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );
    KF.update();

    animate();

    orbitControls.update();
}

function animate(){
    let duration = 5000; // ms

    let now = Date.now();
    let timestamp = Date.now() * 0.0001;
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    if (animatedObjects.length > 1)
    animatedObjects[1].rotation.y += angle;
}

function createBackgroundImage(textureUrl){
    const map = new THREE.TextureLoader().load(textureUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    const planeGeometry = new THREE.PlaneGeometry(150, 75, 50, 50);
    const background = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    background.position.y = 9.8;
    background.position.z = -42.5;
    
    group_six.add( background );
    background.castShadow = false;
    background.receiveShadow = true;
}

function createLakeSurface() {
  const map = new THREE.TextureLoader().load(waterUrl);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 1);

  const planeGeometry = new THREE.PlaneGeometry(115, 85, 50, 50);
  const lakeSurface = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));


lakeSurface.rotation.x = degrees_to_radians(-90);
lakeSurface.position.x = 67;
lakeSurface.position.y = -4;
lakeSurface.position.z = -20;
  
  group_six.add( lakeSurface );
  lakeSurface.castShadow = false;
  lakeSurface.receiveShadow = true;
}

function createDirtFloor(){
    const map = new THREE.TextureLoader().load(dirtUrl.map);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 1);

    const planeGeometry = new THREE.PlaneGeometry(115, 85, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.x = 0;
    floor.position.y = -2.01;
    floor.position.z = -15;
    
    floor_group_six.add( floor );
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

  floor.rotation.x = degrees_to_radians(90);
  floor.rotation.z = degrees_to_radians(10);
  // floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.99;
  floor.position.x = 0;
  floor.position.z = -35;

  group.add(floor);
  floor.castShadow = false;
  floor.receiveShadow = true;
}


function range(start, end) {
	/* generate a range : [start, start+1, ..., end-1, end] */
	var len = end - start + 1;
	var a = new Array(len);
    let counter = 0.025;
	for (let i = 0; counter < 1; i++) {
        a[i] = counter;
        counter+=0.025;
    }
	return a;
}



function resize()
{
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