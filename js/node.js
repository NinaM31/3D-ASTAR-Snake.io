export default class Node {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;

    this.data = data;
    this.data.position.set(this.x, this.y, 0.6);

    this.previous = null;
    this.next = null;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;

    this.data.position.set(this.x, this.y, 0.6);
  }
}
