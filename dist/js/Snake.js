import Node from "./node.js";

export default class Snake {
  constructor(data) {
    this.head = new Node(0, 0, data);
    this.tail = this.head;
    this.length = 0;

    this.direction = "IDLE";

    this.velocityX = 0;
    this.velocityY = 0;
  }

  getCurrentPosition() {
    return [this.head.x, this.head.y];
  }

  setPosition(x, y) {
    this.head.setPosition(x, y);
  }

  generateBody(body) {
    body.name = `${this.length}`;
    var newNode = new Node(0, 0, body);

    this.tail.next = newNode;
    newNode.previous = this.tail;
    this.tail = this.tail.next;

    this.length += 1;
  }
  moveBody(xh, yh) {
    //First move body
    if (this.length > 0) {
      var current = this.tail;

      while (current != this.head) {
        var x = current.previous.x;
        var y = current.previous.y;

        current.setPosition(x, y);
        current = current.previous;
      }
    }

    //Then Move head
    this.head.x = xh;
    this.head.y = yh;

    this.setPosition(this.head.x, this.head.y);
  }

  die() {
    var current = this.tail;

    while (current != this.head) {
      if (current.x == this.head.x && current.y == this.head.y) {
        return true;
      }
      current = current.previous;
    }
    return false;
  }

  clear() {
    this.head.setPosition(0, 0);
    this.tail = this.head;
    this.length = 0;

    this.direction = "IDLE";

    this.velocityX = 0;
    this.velocityY = 0;
  }

  move(x, y) {
    // if (this.direction == "UP" && this.velocityY != -1) {
    //   // when UP can't go DOWN
    //   this.velocityY = 1;
    //   this.velocityX = 0;
    // } else if (this.direction == "DOWN" && this.velocityY != 1) {
    //   // when DOWN can't go UP
    //   this.velocityY = -1;
    //   this.velocityX = 0;
    // } else if (this.direction == "LEFT" && this.velocityX != 1) {
    //   // when LEFT can't go RIGHT
    //   this.velocityY = 0;
    //   this.velocityX = -1;
    // } else if (this.direction == "RIGHT" && this.velocityX != -1) {
    //   // when RIGHT can't go LEFT
    //   this.velocityY = 0;
    //   this.velocityX = 1;
    // }

    this.moveBody(x, y);
  }
}
