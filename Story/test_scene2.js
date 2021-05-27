import * as THREE from '../libs/three.js/r125/three.module.js'
import { GLTFLoader } from '../libs/three.js/r125/loaders/GLTFLoader.js'
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

let renderer = null, scene = null, camera = null, scene_root_2 = null, group = null, orbitControls = null;

let objectList = [];
let animatedObjects = [];

let currentTime = Date.now();

let spotLight = null, ambientLight = null;
let roadMapUrl = "../Assets/Scene_1/Road.jpg";
let canvasUrl = "../Assets/canvas_background.jpg"
let sunriseUrl = "../Assets/Scene_1/sunrise_background.jpg"

let grassUrl = "../Assets/Scene_3/Grass/Vol_42_1_Base_Color.png"
let dirtUrl = {map: "../Assets/Scene_3/DirtPath/Vol_16_2_Base_Color.png", normalMap: "../Assets/Scene_3/DirtPath/Vol_16_2_Normal.png"}
let pineTreeModelUrl = {obj: "../Assets/Scene_1/pineTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let ballTreeModelUrl = {obj: "../Assets/Scene_1/ballTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let bushTreeModelUrl = {obj: "../Assets/Scene_1/bush.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let rock2ModelUrl = {obj: "../Assets/Scene_1/rock2.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let mountainUrl = {obj: "../Assets/Scene_2/mountain_asset/lowpolymountains.obj", mtl: "../Assets/Scene_2/mountain_asset/lowpolymountains.mtl"}
let carModelUrl = {obj: "../Assets/Scene_1/car/toon_car.obj", mtl: "../Assets/Scene_1/car/toon_car.mtl"};
let cloverUrl = "../Assets/Scene_2/clover/clover.gltf";
let lilypadUrl = "../Assets/Scene_2/lilyPad/LilyPad.gltf";
let leafsUrl = {obj: "../Assets/Scene_2/leafs/clover.obj", mtl: "../Assets/Scene_2/leafs/clover.mtl"};
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
let sunUrl = "../Assets/Scene_1/Sun/Sun_01.gltf";
let sunGroup = new THREE.Object3D;
let leafGroup = new THREE.Object3D;
let treeGroup = new THREE.Object3D;
let mountainGroup = new THREE.Object3D;
let carGroup = new THREE.Object3D;
let floor = -2;
let pointerAnimator = null;
let animatePointer = true;
let keyAnimations = [];

const BIRD_SOUND_URI = '../Assets/audio/birds-singing-01.ogg';
const audioListener = new THREE.AudioListener();
const sound = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();




function main() 
{
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

function onError ( err ){ console.error( err ); };

function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

// async function loadObj(modelUrls, objectList)
// {
//     try {
//         const object = await new OBJLoader().loadAsync(modelUrls.obj, onProgress, onError);
//         let texture = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
//         let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
//         let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

//         console.log(object);
        
//         object.traverse(function (child) {
//             if (child.isMesh) {
//                 child.castShadow = true;
//                 child.receiveShadow = true;
//                 child.material.map = texture;
//                 child.material.normalMap = normalMap;
//                 child.material.specularMap = specularMap;
//             }
//         });

//         object.scale.set(3, 3, 3);
//         object.position.z = -6;
//         object.position.x = -1.5;
//         object.rotation.y = -3;
//         object.name = "objObject";
//         objectList.push(object);
//         scene.add(object);

//     }
//     catch (err) {
//         onError(err);
//     }
// }

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
        group.add(objGroup);
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
        group.add(objectGroup);

        object.animation = false;
        object.name = "sun";
        if (animationFlag) animatedObjects.push(object);
    }
    catch (err) {
        console.error(err);
    }
}


function createScene(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const canvasTexture = new THREE.TextureLoader().load(canvasUrl);
    scene = new THREE.Scene();
    scene.background = canvasTexture;

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 6, 20);
    camera.add(audioListener);
    audioLoader.load( BIRD_SOUND_URI, 
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
    }
    );

    scene.add(camera);
    // TEST change camera position on created scene
    // setTimeout(() => {
    //     // camera.position.set(0, 6, 20);   // original pos
    //     // x - right (+), left (-)
    //     // y - upwards(+), downwards(-)
    //     // z - into or out of screen
    //     camera.position.set(0, 6, 50);
    //     console.log('change of pos');
    // },
    // 3000);

    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    scene_root_2 = new THREE.Object3D;
    
    spotLight = new THREE.SpotLight ("white");
    spotLight.position.set(-6, 10, 25);
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
    
    //loadGLTF();

    group = new THREE.Object3D;
    scene_root_2.add(group);
    
    
    
    // background image
    // createBackgroundImage(sunriseUrl);

    // floor with road
    // createFloor(roadMapUrl);

    // floor with grass
    createGrassFloor(grassUrl);

    let positionZ = 0;
    let pinePosition = -10;
    for (let i=0; i<10; i++){
        loadObjMtl(ballTreeModelUrl, objectList,{ position: new THREE.Vector3(-35+Math.floor(Math.random()*-20), floor,positionZ), scale: new THREE.Vector3(0.8,0.8,0.8), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup);
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(-32+Math.floor(Math.random()*-40), floor, pinePosition), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup);
        loadObjMtl(pineTreeModelUrl, objectList,{ position: new THREE.Vector3(2-Math.floor(Math.random()*10), floor, pinePosition*-1), scale: new THREE.Vector3(1, 1, 1), rotation: new THREE.Vector3(0, 0, 0) }, treeGroup);
        positionZ -= 1;
    }

    //loadObjMtl(carModelUrl, objectList, -5, floor,-10, 0.025);
    loadObjMtl(carModelUrl, objectList, { position: new THREE.Vector3(-5, floor,-10), scale: new THREE.Vector3(0.025, 0.025, 0.025), rotation: new THREE.Vector3(0, 0, 0) }, carGroup);

    


    loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-50,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);
    loadObjMtl(mountainUrl,objectList, { position: new THREE.Vector3(-10,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);
    loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(30, floor,-40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);
    loadObjMtl(mountainUrl,objectList,{ position: new THREE.Vector3(60,floor, -40), scale: new THREE.Vector3(2.5, 2.5, 2.5), rotation: new THREE.Vector3(0, 0, 0) }, mountainGroup);

    loadGLTF(sunUrl, { position: new THREE.Vector3(-5, 10, -60), scale: new THREE.Vector3(0.02, 0.02, 0.02), rotation: new THREE.Vector3(33, 0, 0) }, sunGroup, true);

    loadObjMtl(leafsUrl, animatedObjects, { position: new THREE.Vector3(-10, 5, 10), scale: new THREE.Vector3(0.75, 0.75, 0.75), rotation: new THREE.Vector3(45, 45, 0) }, leafGroup);   
    

    group.position.x += 10;
    
    // apparently nothing happens if we comment out scene.add(group)
    // NOTE that @ 243 there is a root.add(group)
    //  i.e., group is part of root
    // scene.add(group);
    
    // if we comment out this line, it all disappears
    scene.add( scene_root_2 );
    // TEST remove root group
    // setTimeout(() => {
    //     scene.remove(scene_root_2);
    // },
    // 3000);

    

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



function createFloor(floorMapUrl){
    const map = new THREE.TextureLoader().load(floorMapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 1);

    const planeGeometry = new THREE.PlaneGeometry(25, 75, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.position.x = -12
    floor.position.z = -5
    
    group.add( floor );
    floor.castShadow = false;
    floor.receiveShadow = true;

}

function createGrassFloor(){
    const map = new THREE.TextureLoader().load(dirtUrl.map);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2, 1);

    const planeGeometry = new THREE.PlaneGeometry(115, 85, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.01;
    floor.position.x = 0;
    floor.position.z = -5;
    
    group.add( floor );
    floor.castShadow = false;
    floor.receiveShadow = true;
}

function createBackgroundImage(textureUrl){
    const map = new THREE.TextureLoader().load(textureUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;

    const planeGeometry = new THREE.PlaneGeometry(115, 25, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = degrees_to_radians(360);
    floor.rotation.y = degrees_to_radians(0);
    floor.position.y = 10;
    floor.position.x =0;
    floor.position.z = -42.5;
    
    group.add( floor );
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

function playAnimations()
{   
    let a = range(0,1);

    console.log(a);
    // position animation
    if (pointerAnimator)
        pointerAnimator.stop();
    
    if (animatePointer)
    {
        pointerAnimator = new KF.KeyFrameAnimator;
        pointerAnimator.init({ 
            interps:
                [
                    { 
                        keys: a, 
                        values:[
                                { x : 0, y:0, z: 0 },
                                { x : 0., y:0.1, z: 0 },
                                { x : 0.2, y:0.2, z: 0 },
                                { x : .3, y:0.3, z: 0 },
                                { x : 0.4, y:0.4, z: 0 },
                                { x : 0.5, y:0.5, z: 0 },
                                { x : 0.6, y:0.6, z: 0 },
                                { x : 0.7, y:0.7, z: 0 },
                                { x : 0.8, y:0.8, z: 0 },
                                { x : 0.9, y:0.9, z: 0 },
                                { x : 1, y:1, z: 0 },
                                { x : 0.9, y:0.9, z: 0 },
                                { x : 0.8, y:0.8, z: 0 },
                                { x : 0.7, y:0.7, z: 0 },
                                { x : 0.6, y:0.6, z: 0 },
                                { x : 0.5, y:0.5, z: 0 },
                                { x : 0.4, y:0.4, z: 0 },
                                { x : 0.3, y:0.3, z: 0 },
                                { x : 0.2, y:0.2, z: 0 },
                                { x : 0.1, y:0.1, z: 0 },
                                { x : 0, y:0, z: 0 },
                                { x : 0.1, y:-0.1, z: 0 },
                                { x : 0.2, y:-0.2, z: 0 },
                                { x : 0.3, y:-0.3, z: 0 },
                                { x : 0.4, y:-0.4, z: 0 },
                                { x : 0.5, y:-0.5, z: 0 },
                                { x : 0.6, y:-0.6, z: 0 },
                                { x : 0.7, y:-0.7, z: 0 },
                                { x : 0.8, y:-0.8, z: 0 },
                                { x : 0.9, y:-0.9, z: 0 },
                                { x : 1, y:-1, z: 0 },
                                { x : 0.9, y:-0.9, z: 0 },
                                { x : 0.8, y:-0.8, z: 0 },
                                { x : 0.7, y:-0.7, z: 0 },
                                { x : 0.6, y:-0.6, z: 0 },
                                { x : 0.5, y:-0.5, z: 0 },
                                { x : 0.4, y:-0.4, z: 0 },
                                { x : 0.3, y:-0.3, z: 0 },
                                { x : 0.2, y:-0.2, z: 0 },
                                { x : 0.1, y:-0.1, z: 0 },
                                ],
                        target:leafGroup.position
                    }
                ],
            loop: true,
            duration:10 * 1000,
            easing:TWEEN.Easing.Bounce.InOut,

        });
        pointerAnimator.start();
        
    }
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
    playAnimations();
};

window.addEventListener('resize', resize, false);