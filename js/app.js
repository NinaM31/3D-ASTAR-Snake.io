import * as THREE from '../build/three.module.js';
import {OrbitControls} from '../build/OrbitControls.js';

function main() {
    const canvas = document.querySelector('#stage');
    const renderer = new THREE.WebGLRenderer({canvas});

    //Initialize scene and camera
    const scene = new THREE.Scene();

    function createCamera(fov, near, far){
        return new THREE.PerspectiveCamera(fov, 2, near, far);
    }
    
    const camera = createCamera(45, 0.1, 500);
    camera.position.set(0, 0, 2);

    //Camera controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    //Checks if window was resized and update accordingly
    function requireResize(renderer){
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if(needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    //Game Loop
    function render(){

        if(requireResize(renderer)) {
            //Update camera aspect 
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth/canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();