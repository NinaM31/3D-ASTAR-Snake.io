import * as THREE from "../build/three.module.js";
import { GAME } from "./Game_Enum.js";
import Game from "./Game.js";
import { Camera, Texture, Lights, Mesh } from "./Utility.js";

function run() {
  const canvas = document.querySelector("#stage");
  const infoElem = document.querySelector("#info"); //Score banner
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  //Init scene
  const scene = new THREE.Scene();

  //Init camera, Controls and texture
  Camera.init(canvas);
  Texture.init();
  const camera = Camera.camera;
  const planetexture = Texture.pTexture;

  //create Plane, sanke and apple GUI
  const plane = Mesh.getPlane(planetexture);
  const head = Mesh.getSnake(GAME.HCOLOR);
  const apple = Mesh.getFood();

  //create Game
  const game = new Game(head, apple);

  function draw() {
    //Adding plane, Snake head and apple
    scene.add(plane);
    scene.add(head);
    scene.add(apple);

    //Lights
    scene.add(Lights.Pointlight("#ffaded", 0.5));
    scene.add(Lights.HemisphereLight("#ff6666", "#249155", 0.9));
  }

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
        game.switchDirection(e);
      },
      false
    );

    //Game play
    if (!last || now - last >= 60) {
      last = now;

      if (game.ateFood()) {
        //create body GUI
        var body = Mesh.getSnake(GAME.BCOLOR);
        game.generateBody(body);
        scene.add(body);
      }

      game.moveSnake();

      if (game.die()) {
        scene.remove.apply(scene, scene.children);
        console.log("died");
        draw();
      }
    }

    if (requireResize(renderer)) {
      //Update camera aspect
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    //Display score
    infoElem.textContent = "Score: " + game.score;

    //Render Screen
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
run();
