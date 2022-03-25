export default class Snake {
  constructor(planeSize, snakeSize) {
    this.score = 0;
    this.xPos = 0;
    this.yPos = 0;

    this.velocityX = 0;
    this.velocityY = 0;

    this.direction = "IDLE";

    this.planeSize = planeSize;
    this.snakeSize = snakeSize;

    this.appleX;
    this.appleY;
    this._generateLocation();

    this.body = [];
    this.length = 0;

    this.closedSet = [];
    this.openSet = [];
    this.path = [];
    this.current;
  }

  _generateLocation() {
    var offset = this.planeSize / 2 - 2;
    var min = offset;
    var max = offset;
    var resultX;
    var resultY;
    var insideBody;

    do {
      resultX = Math.floor(Math.random() * (min + max)) - min;
      resultY = Math.floor(Math.random() * (min + max)) - min;

      insideBody = false;
      for (let i = 0; i < this.length; i++) {
        var x = this.body[i].position.x;
        var y = this.body[i].position.y;

        if (resultX == x && resultY == y) {
          insideBody = true;
        }
      }
    } while (insideBody);

    this.appleX = resultX;
    this.appleY = resultY;
  }
  _setDirection(d) {
    this.direction = d;
  }

  die() {
    for (let i = 0; i < this.length; i++) {
      var body = this.body[i];
      var bodyX = body.position.x;
      var bodyY = body.position.y;

      if (bodyX == this.xPos && bodyY == this.yPos) {
        return true;
      }
    }

    return false;
  }
  clear() {
    this.score = 0;
    this.xPos = 0;
    this.yPos = 0;

    this.velocityX = 0;
    this.velocityY = 0;

    this.direction = "IDLE";

    this._generateLocation();

    this.body = [];
    this.length = 0;
  }
  keepInsidePlane() {
    var boundary = this.planeSize / 2 - this.snakeSize / 2;

    this.xPos = this.changePosition(this.xPos, boundary);
    this.yPos = this.changePosition(this.yPos, boundary);
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

  switchDirection(event) {
    var keyCode = event.which;
    // up
    if (keyCode == 87) {
      this._setDirection("UP");
      // down
    } else if (keyCode == 83) {
      this._setDirection("DOWN");
      // left
    } else if (keyCode == 65) {
      this._setDirection("LEFT");
      // right
    } else if (keyCode == 68) {
      this._setDirection("RIGHT");
    }
  }

  ateApple() {
    var xLeft = this.xPos - this.snakeSize / 2;
    var xRight = this.xPos + this.snakeSize / 2;

    var yTip = this.yPos + this.snakeSize / 2;
    var yBottom = this.yPos - this.snakeSize / 2;

    var insideX = this.appleX >= xLeft && this.appleX <= xRight;
    var insideY = this.appleY <= yTip && this.appleY >= yBottom;

    return insideX && insideY;
  }

  changeAppleLocation() {
    this._generateLocation();
    this.score += 10;
  }

  moveBody() {
    if (this.length <= 0) return;

    var xPrevious = this.xPos;
    var yPrevious = this.yPos;

    for (let i = 0; i < this.body.length; i++) {
      var xTemp = this.body[i].position.x;
      var yTemp = this.body[i].position.y;

      this.body[i].position.set(xPrevious, yPrevious, 0.6);

      xPrevious = xTemp;
      yPrevious = yTemp;
    }
  }

  move() {
    this.keepInsidePlane();
    this.moveBody();

    if (this.direction == "UP" && this.velocityY != -1) {
      this.velocityY = 1;
      this.velocityX = 0;
    } else if (this.direction == "DOWN" && this.velocityY != 1) {
      this.velocityY = -1;
      this.velocityX = 0;
    } else if (this.direction == "LEFT" && this.velocityX != 1) {
      this.velocityY = 0;
      this.velocityX = -1;
    } else if (this.direction == "RIGHT" && this.velocityX != -1) {
      this.velocityY = 0;
      this.velocityX = 1;
    }

    this.xPos += this.velocityX;
    this.yPos += this.velocityY;
  }
}
