import * as THREE from '../build/three.module.js';

function main() {
    const canvas = document.querySelector('#stage');
    const renderer = new THREE.WebGLRenderer({canvas});

    //Initialize scene and camera
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
}
main();