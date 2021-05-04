import * as THREE from '../libs/three.js/r125/three.module.js'
import { GLTFLoader } from '../libs/three.js/r125/loaders/GLTFLoader.js'
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

let renderer = null, scene = null, camera = null, root = null, group = null, orbitControls = null;

let objectList = [];

let currentTime = Date.now();

let spotLight = null, ambientLight = null;
let roadMapUrl = "../Assets/Scene_1/Road.jpg";
let canvasUrl = "../Assets/canvas_background.jpg"
let sunriseUrl = "../Assets/Scene_1/sunrise_background.jpg"

let grassUrl = "../Assets/Scene_3/Grass/Vol_42_1_Base_Color.png"
let pineTreeModelUrl = {obj: "../Assets/Scene_1/pineTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let ballTreeModelUrl = {obj: "../Assets/Scene_1/ballTree.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let bushTreeModelUrl = {obj: "../Assets/Scene_1/bush.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};
let rock2ModelUrl = {obj: "../Assets/Scene_1/rock2.obj", mtl: "../Assets/Scene_1/NatureFreePack1.mtl"};

let carModelUrl = {obj: "../Assets/Scene_1/car/toon_car.obj", mtl: "../Assets/Scene_1/car/toon_car.mtl"};
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
let floor = -2;




function main() 
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    update();
}

function degrees_to_radians(degrees)
{
  let pi = Math.PI;
  return degrees * (pi/180);
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

async function loadObjMtl(objModelUrl, objectList, position_x, position_z, scale)
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
        
        object.scale.set(scale, scale, scale);
        object.position.x = position_x;
        object.position.y = floor;
        object.position.z = position_z;
        
        //object.scale.set(0.05, 0.05, 0.05);

        objectList.push(object);
        group.add(object);
    }
    catch (err){
        onError(err);
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
    scene.add(camera);

    orbitControls = new OrbitControls(camera, renderer.domElement);
        
    root = new THREE.Object3D;
    
    spotLight = new THREE.SpotLight (0xfc6c49);
    spotLight.position.set(-6, 10, 25);
    spotLight.target.position.set(-6, 20, 20);
    root.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    //loadGLTF();

    group = new THREE.Object3D;
    root.add(group);
    
    
    
    // background image
    // createBackgroundImage(sunriseUrl);

    // floor with road
    // createFloor(roadMapUrl);

    // floor with grass
    createGrassFloor(grassUrl);

    let positionZ = 10;
    let ballTreeScale = 0.5;
    let pineTreeScale = 0.5;
    let rockTreeScale = 3.0;
    for (let i=0; i<5; i++){
        loadObjMtl(ballTreeModelUrl, objectList, 5, positionZ,ballTreeScale);
        loadObjMtl(ballTreeModelUrl, objectList, -25, positionZ,ballTreeScale);
        loadObjMtl(pineTreeModelUrl, objectList, -30, positionZ+5,pineTreeScale);
        loadObjMtl(pineTreeModelUrl, objectList, 0, positionZ+5,pineTreeScale);
        loadObjMtl(rock2ModelUrl, objectList, -10, positionZ+7,rockTreeScale);
        loadObjMtl(rock2ModelUrl, objectList, 20, positionZ+7,rockTreeScale);

        positionZ -= 10;
    }

    loadObjMtl(carModelUrl, objectList, -19, -17, 0.025);

    group.position.x += 10;
    scene.add(group);
    scene.add( root );
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    
    renderer.render( scene, camera );

    animate();

    orbitControls.update();
}

function animate(){

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

function createGrassFloor(grassUrl){
    const map = new THREE.TextureLoader().load(grassUrl);
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