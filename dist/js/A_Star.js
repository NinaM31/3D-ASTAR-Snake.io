import { GAME } from "./Game_Enum.js";

export default class ASTAR {
  constructor() {
    this.grid = [];
    this.hp = GAME.PSIZE / 2; //half plane size -15 to 15 {30 total}

    this.gridSize = GAME.PSIZE;
  }

  init() {
    this.grid = [];
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = [];
    }

    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j] = {
          i: i,
          j: j,
          x: -this.hp + j, //location of x on GUI plane
          y: this.hp - i, //location of y on GUI plane
          g: 0,
          h: 0,
          f: 100000,
          parent: null,
        };
      }
    }
  }

  search(start, end) {
    this.init();

    var openList = [];
    var closedList = [];

    //convert GUI location to Grid location
    let i_y = Math.floor((start.y - this.hp) / -1);
    let j_x = Math.floor(start.x + this.hp);

    openList.push(this.grid[i_y][j_x]);

    while (openList.length > 0) {
      //get lowest f(n)
      var lowestInd = 0;
      for (let i = 0; i < openList.length; i++) {
        if (openList[i] < openList[lowestInd]) {
          lowestInd = i;
        }
      }

      var currentNode = openList[lowestInd];

      // End case start == end
      if (currentNode.x == end.x && currentNode.y == end.y) {
        var curr = currentNode;
        var ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal Case
      openList.splice(lowestInd, 1);
      closedList.push(currentNode);

      var neighbors = this.neighbors(currentNode);

      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (closedList.includes(neighbor) || this.isBody(start, neighbor)) {
          // not a valid node to process, skip to next neighbor
          continue;
        }

        // g score is the shortest distance from start to current node, we need to check if
        //   the path we have arrived at this neighbor is the shortest one we have seen yet
        var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
        var gScoreIsBest = false;

        if (!openList.includes(neighbor)) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet

          gScoreIsBest = true;

          neighbor.h = this.heuristic(neighbor, end);
          openList.push(neighbor);
        } else if (gScore < neighbor.g) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.   Store info on how we got here and
          //  just how good it really is...
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
    // No result was found -- empty array signifies failure to find path
    return [];
  }
  isBody(snake, neighbor) {
    var current = snake;

    while (current.next != null) {
      if (neighbor.x == current.x && neighbor.y == current.y) {
        return true;
      }
      current = current.next;
    }

    //Check the last one
    if (neighbor.x == current.x && neighbor.y == current.y) {
      return true;
    }

    return false;
  }

  heuristic(node, target) {
    // This is the Manhattan distance
    var d1 = Math.abs(target.x - node.x);
    var d2 = Math.abs(target.y - node.y);
    return d1 + d2;
  }

  neighbors(currentNode) {
    var list = [];

    var i = currentNode.i;
    var j = currentNode.j;

    //Right i, j+1
    if (j < this.gridSize - 1) {
      list.push(this.grid[i][j + 1]);
    }

    //Left i, j-1
    if (j > 0) {
      list.push(this.grid[i][j - 1]);
    }

    //Up i-1, j
    if (i > 0) {
      list.push(this.grid[i - 1][j]);
    }

    //Down i+1, j
    if (i < this.gridSize - 1) {
      list.push(this.grid[i + 1][j]);
    }

    return list;
  }
}
