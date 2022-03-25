this.grid = {
  position: new Array(this.planeSize),
  init: function () {
    for (let i = 0; i < this.planeSize; i++) {
      this.position[i] = new Array(this.planeSize);
    }

    for (let i = 0; i < this.planeSize; i++) {
      for (let j = 0; j < this.planeSize; j++) {
        this.position[i][j] = {
          i: i,
          j: j,
          x: j * this.planeSize + this.snakeSize,
          y: i * this.planeSize + this.snakeSize,
          g: 0,
          h: 0,
          f: 9999999,
          cameFrom: 0,
        };
      }
    }
  },

  getHValue: function (node, goal) {
    let diffX = goal.x - node.x;
    let diffY = goal.y - node.y;

    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  },
  addNeighbour: function (neighbour) {
    let isNeighbourSnake = false;

    // if the neighbour is snake
    for (let i = 0; i < snake.position.length; i++) {
      if (
        neighbour.x == snake.position[i].x &&
        neighbour.y == snake.position[i].y
      ) {
        isNeighbourSnake = true;
        break;
      }
    }

    if (!isNeighbourSnake) {
      let tempG = current.g + 1;
      let tempH = this.getHValue(neighbour, food);
      let tempF = tempG + tempH;
      if (tempF < neighbour.f) {
        neighbour.cameFrom = current; //{i : current.i, j : current.j};
        neighbour.g = tempG;
        neighbour.h = tempH;
        neighbour.f = tempF;
      }
      if (!openSet.includes(neighbour)) {
        openSet.push(neighbour);
      }
    }
  },

  aStar: function () {
    let p = Math.floor((snake.position[0].y - 10) / 20);
    let q = Math.floor((snake.position[0].x - 10) / 20);
    openSet.push(grid.position[p][q]);

    while (openSet.length > 0) {
      current = openSet[0];
      openSet.splice(0, 1);
      closedSet.push(current);

      if (current.x == food.x && current.y == food.y) {
        break;
      }

      // for all neighbours
      // i, j+1
      if (current.j < 19) {
        let neighbour = this.position[current.i][current.j + 1];
        if (!closedSet.includes(neighbour)) {
          this.addNeighbour(neighbour);
        }
      }
      if (current.i < 19) {
        let neighbour = this.position[current.i + 1][current.j];
        if (!closedSet.includes(neighbour)) {
          this.addNeighbour(neighbour);
        }
      }
      if (current.j > 0) {
        let neighbour = this.position[current.i][current.j - 1];
        if (!closedSet.includes(neighbour)) {
          this.addNeighbour(neighbour);
        }
      }
      if (current.i > 0) {
        let neighbour = this.position[current.i - 1][current.j];
        if (!closedSet.includes(neighbour)) {
          this.addNeighbour(neighbour);
        }
      }

      // bring the cell with lowest F value to the index 0 in openSet
      for (let r = openSet.length - 1; r > 0; r--) {
        if (openSet[r].f < openSet[r - 1].f) {
          let temp = openSet[r - 1];
          openSet[r - 1] = openSet[r];
          openSet[r] = temp;
        }
      }
    }
    path.splice(0);
    this.findPath();
  },

  findPath: function () {
    let previous = "";
    for (let i = closedSet.length - 1; i >= 0; i--) {
      if (i == closedSet.length - 1 && previous == "") {
        previous = closedSet[i];
        path.push(previous);
      } else if (
        previous.cameFrom.i == closedSet[i].i &&
        previous.cameFrom.j == closedSet[i].j
      ) {
        previous = closedSet[i];
        path.push(previous);
      }
    }
  },
};
