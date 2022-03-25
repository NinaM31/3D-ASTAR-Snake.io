export default class PQNode {
  constructor(x, y, f, h, g) {
    this.x = x;
    this.y = y;
    this.f = f;
    this.h = h;
    this.g = g;

    this.next = null;
  }
}
