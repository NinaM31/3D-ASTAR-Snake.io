import Snake from "./Snake.js";
import Food from "./Food.js";
import ASTAR from "./A_Star.js";
import { GAME } from "./Game_Enum.js";
var i = 0;
export default class Game {
  constructor(sdata, fdata) {
    this.snake = new Snake(sdata);
    this.food = new Food(fdata);
    this.score = 0;
    this.score_inc = 10;
    this.snakeHeadIndex = 1;
    this.boundary = GAME.PSIZE / 2 - GAME.SSIZE / 2;
    this.astar = new ASTAR();
  }

  switchDirection(event) {
    var keyCode = event.which;
    // up
    if (keyCode == 87) {
      this.snake.direction = "UP";
      // down
    } else if (keyCode == 83) {
      this.snake.direction = "DOWN";
      // left
    } else if (keyCode == 65) {
      this.snake.direction = "LEFT";
      // right
    } else if (keyCode == 68) {
      this.snake.direction = "RIGHT";
    }
  }

  die() {
    if (this.snake.die()) {
      this.snake.clear();
      this.food.generateFood();
      this.score = 0;
      return true;
    }
    return false;
  }

  generateBody(body) {
    this.snake.generateBody(body);
    this.generateFood();
    this.score += this.score_inc;
  }

  ateFood() {
    const svalues = this.getSnakePosition(); // current x and y
    const bodySize = GAME.SSIZE / 2;

    var xLeft = svalues[0] - bodySize;
    var xRight = svalues[0] + bodySize;

    var yTip = svalues[1] + bodySize;
    var yBottom = svalues[1] - bodySize;

    const fvalues = this.getFoodPosition();
    var insideX = fvalues[0] >= xLeft && fvalues[0] <= xRight;
    var insideY = fvalues[1] <= yTip && fvalues[1] >= yBottom;

    return insideX && insideY;
  }

  generateFood() {
    var insideBody;
    do {
      this.food.generateFood();
      insideBody = false;

      var current = this.snake.head;
      while (current.next != null) {
        if (current.x == this.food.x && current.y == this.food.y) {
          insideBody = true;
        }
        current = current.next;
      }
      //check last one
      if (current.x == this.food.x && current.y == this.food.y) {
        insideBody = true;
      }
    } while (insideBody);
  }

  keepSnakeInsidePlane() {
    var boundary = this.boundary;
    var values = this.snake.getCurrentPosition(); //current x and y

    var newx = this.changePosition(values[0], boundary);
    var newy = this.changePosition(values[1], boundary);

    this.snake.setPosition(newx, newy);
  }

  getSnakePosition() {
    return this.snake.getCurrentPosition();
  }

  getFoodPosition() {
    return this.food.getFoodPosition();
  }

  changePosition(position, boundary) {
    if (position > boundary) {
      position -= 1;
      position = position * -1;
    } else if (position < -boundary) {
      position += 1;
      position = position * -1;
    }
    return position;
  }

  moveSnake() {
    var path = this.astar.search(this.snake.head, this.food);
    var x = this.snake.head.x;
    var y = this.snake.head.y;

    //There is a path
    if (path.length > 0) {
      x = path[0].x;
      y = path[0].y;
    } else {
      // no path
      //continue going
      if (x >= 0) x += 1;
      if (x < 0) x -= 1;

      if (y >= 0) y += 1;
      if (x < 0) y -= 1;
    }

    this.snake.move(x, y);
    this.keepSnakeInsidePlane();
  }
}
