import { GAME } from "./Game_Enum.js";

export default class Food {
  constructor(data) {
    this.x = 14;
    this.y = 12;

    this.data = data;
    this.data.position.set(this.x, this.y, 0.6);

    this._min_max = GAME.PSIZE / 2 - (GAME.SSIZE + GAME.FSIZE);
  }

  getFoodPosition() {
    return [this.x, this.y];
  }
  generateFood() {
    var _min_max = this._min_max;

    this.x = this.generateRandom(_min_max, _min_max);
    this.y = this.generateRandom(_min_max, _min_max);
    this.data.position.set(this.x, this.y, 0.6);
  }

  generateRandom(min, max) {
    return Math.round(Math.random() * (min + max) - min);
  }
}
