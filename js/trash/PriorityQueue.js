import PQNode from "./PQNode.js";

export default class PQueue {
  constructor() {
    this.size = 0;
    this.head = null;
  }
  empty() {
    return this.size == 0;
  }

  enqueue(x, y, f, h, g) {
    var newNode = new PQNode(x, y, f, h, g);
    if (this.size == 0 || f < this.head.f) {
      newNode.next = this.head;
      this.head = newNode;
    } else {
      var current = this.head;
      var prev = null;

      while (current.next != null && f >= current.f) {
        prev = current;
        current = current.next;
      }

      if (f < current.f) {
        newNode.next = current;
        prev.next = newNode;
      } else {
        current.next = newNode;
      }
    }

    this.size += 1;
  }

  serve() {
    var current = this.head;
    this.head = this.head.next;

    this.size -= 1;
    return current;
  }
}
