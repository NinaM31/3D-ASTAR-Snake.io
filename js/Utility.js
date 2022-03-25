import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../build/OrbitControls.js";
import { GAME } from "./Game_Enum.js";

export const Camera = {
  camera: new THREE.PerspectiveCamera(45, 2, 0.1, 500),

  init: function (canvas) {
    this.camera.position.set(0, -25, 25);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  },
};

export const Texture = {
  loader: new THREE.TextureLoader(),
  pTexture: null,

  init: function () {
    this.pTexture = this.loader.load("../textures/grass.png");
    this.pTexture.wrapS = THREE.RepeatWrapping;
    this.pTexture.wrapT = THREE.RepeatWrapping;
    this.pTexture.magFilter = THREE.NearestFilter;
    this.pTexture.repeat.set(GAME.TILE, GAME.TILE);
  },
};

export const Lights = {
  Pointlight: function (color, intensity) {
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 0, 6);
    return light;
  },
  HemisphereLight: function (skyColor, groundColor, intensity) {
    return new THREE.HemisphereLight(skyColor, groundColor, intensity);
  },
};

export const Mesh = {
  getPlane(planetexture) {
    const planeGeometry = new THREE.PlaneBufferGeometry(GAME.PSIZE, GAME.PSIZE);
    const planeMaterial = new THREE.MeshToonMaterial({
      map: planetexture,
      side: THREE.DoubleSide,
    });

    return new THREE.Mesh(planeGeometry, planeMaterial);
  },

  getSnake(color) {
    const snakeGeometry = new THREE.DodecahedronBufferGeometry(GAME.SSIZE);
    const snakeMaterial = new THREE.MeshPhongMaterial({
      color: color,
    });

    return new THREE.Mesh(snakeGeometry, snakeMaterial);
  },

  getFood() {
    const sphereGeometry = new THREE.DodecahedronBufferGeometry(GAME.FSIZE);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: GAME.FCOLOR,
    });
    return new THREE.Mesh(sphereGeometry, sphereMaterial);
  },
};
