import * as THREE from '../libs/three.js/r125/three.module.js'
import { GLTFLoader } from '../libs/three.js/r125/loaders/GLTFLoader.js'
import { OrbitControls } from '../libs/three.js/r125/controls/OrbitControls.js';
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { FBXLoader } from '../libs/three.js/r125/loaders/FBXLoader.js';
import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

class Loaders {


    constructor(modelUrl, configuration, objectGroup){
        this.modelUrl = modelUrl;
        this.configuration = configuration;
        this.objectGroup = objectGroup;
    }

    loadGLTF(animationFlag){
        try {
            const gltfLoader = new GLTFLoader();
    
            const result = await gltfLoader.loadAsync(gltfModelUrl);
    
            const object = result.scene.children[0];
    
            setVectorValue(object.position, configuration, 'position', new THREE.Vector3(0, 0, 0));
            setVectorValue(object.scale, configuration, 'scale', new THREE.Vector3(1, 1, 1));
            setVectorValue(object.rotation, configuration, 'rotation', new THREE.Vector3(0, 0, 0));
    
            objectGroup.add(object);
            group_one.add(objectGroup);
    
            object.animation = false;
            object.name = "sun";
            console.log(object);
            if (animationFlag) animatedObjects.push(object);
        }
        catch (err) {
            console.error(err);
        }
    }

}