import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../build/OrbitControls.js";
import Snake from "./snake.js";

//Enviroment Constants
const planeSize = 30;
const singlePlaneTile = 10;
const snakeSize = 1;
const appleSize = 0.9;

//Colors
const headColor = "#4a4343";
const bodyColor = "#698fff";
const appleColor = "#ffe5a8";

function run() {
  const canvas = document.querySelector("#stage");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  const loader = new THREE.TextureLoader();
  const snake = new Snake(planeSize, snakeSize);

  //Init scene
  const scene = new THREE.Scene();

  //Init camera
  const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 500);
  camera.position.set(0, -25, 25);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  //Camera controls
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  //Loadng texture
  const planetexture = loader.load("../textures/grass.png");

  //Reapiting across the plane size
  planetexture.wrapS = THREE.RepeatWrapping;
  planetexture.wrapT = THREE.RepeatWrapping;
  planetexture.magFilter = THREE.NearestFilter;
  planetexture.repeat.set(singlePlaneTile, singlePlaneTile);

  function draw() {
    //Adding plane
    scene.add(plane);

    //Adding snake head
    scene.add(head);

    //Adding apple
    scene.add(apple);

    //Lights
    {
      const color = "#ffaded";
      const intensity = 0.5;
      const light = new THREE.PointLight(color, intensity);
      light.position.set(0, 0, 6);
      scene.add(light);
    }
    {
      const skyColor = "#ff6666";
      const groundColor = "#249155";
      const intensity = 0.9;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }
  }

  //Plane
  const planeGeometry = new THREE.PlaneBufferGeometry(planeSize, planeSize);
  const planeMaterial = new THREE.MeshToonMaterial({
    map: planetexture,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  //Snake material and geo
  const snakeGeometry = new THREE.DodecahedronBufferGeometry(snakeSize);
  const snakeHeadMaterial = new THREE.MeshPhongMaterial({ color: headColor });
  const snakeBodyMaterial = new THREE.MeshPhongMaterial({ color: bodyColor });

  const head = new THREE.Mesh(snakeGeometry, snakeHeadMaterial);
  head.position.set(snake.xPos, snake.yPos, 0.6);

  //Apple material and Geo
  const sphereGeometry = new THREE.DodecahedronBufferGeometry(appleSize);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: appleColor });
  const apple = new THREE.Mesh(sphereGeometry, sphereMaterial);
  apple.position.set(snake.appleX, snake.appleY, 0.6);

  // Score banner
  const infoElem = document.querySelector("#info");

  //Checks if window was resized and update accordingly
  function requireResize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  var last = 0;

  draw();
  //Game Loop
  function render(now) {
    //Listen to user input and switch snake direction accordingly
    document.addEventListener(
      "keydown",
      function (e) {
        snake.switchDirection(e);
      },
      false
    );
    if (!last || now - last >= 60) {
      last = now;

      if (snake.ateApple()) {
        const body = new THREE.Mesh(snakeGeometry, snakeBodyMaterial);
        body.position.set(snake.xPos, snake.yPos);
        snake.body.push(body);
        snake.length += 1;

        scene.add(body);
        snake.changeAppleLocation();
      }

      snake.move();

      head.position.set(snake.xPos, snake.yPos, 0.6);
      apple.position.set(snake.appleX, snake.appleY, 0.6);

      if (snake.die()) {
        snake.clear();
        scene.remove.apply(scene, scene.children);
        draw();
      }

      //Display score
      infoElem.textContent = "Score: " + snake.score;
    }
    if (requireResize(renderer)) {
      //Update camera aspect
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    //Render Screen
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
run();
