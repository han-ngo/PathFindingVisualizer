import path from "path";

let walls = [];

/**
 * Recursive Division Maze Generator
 *
 * Description: This method recursively divides the space into smaller sections by adding walls with passages.
 * It can be done either horizontally, vertically, or a mix of both.
 *
 * Characteristics: Produces mazes with a clear structure and large open spaces.
 *
 *
 * Generates a maze within the given grid.
 * This function modifies the grid to add walls in a maze-like pattern.
 *
 * @param {Array} grid - The grid containing all nodes.
 * @param {string} style - The style of maze generation (random, horizontal, vertical).
 * @returns {Array} The new grid.
 */
export function recursiveDivisionMaze(grid, style = "random") {
  const newGrid = grid.slice(),
    ROW = grid.length,
    COL = grid[0].length;
  walls = []; // Reset the walls list

  // build the surrounding walls first
  buildSurroundingWalls(newGrid, ROW, COL);

  // build the maze using recursive division
  // excluding the outer walls
  divide(1, newGrid.length - 2, 1, newGrid[0].length - 2);

  return newGrid;

  function divide(top, bottom, left, right) {
    let height = bottom - top + 1,
      width = right - left + 1;
    if (height <= 1 || width <= 1) return;
    // if (top >= bottom || left >= right) return;

    // Choose where to place the wall: horizontally or vertically
    let horizontal;
    if (style === "random") {
      // horizontal = Math.random() > 0.5;
      horizontal = height > width;
    } else {
      horizontal =
        style === "horizontal" ? Math.random() > 0.35 : Math.random() > 0.65;
    }

    if (horizontal) {
      // Horizontal wall
      const row = top + getRandInt(0, height - 1);
      const pathway = left + getRandInt(0, width) * 2; // pick a random column to leave a pathway
      for (let col = left; col < right; col++) {
        if (pathway != col) {
          if (!newGrid[row][col].isStart && !newGrid[row][col].isTarget) {
            newGrid[row][col].isWall = true;
            newGrid[row][col].status = "wall";
            walls.push(newGrid[row][col]);
          }
        }
      }

      // Recursive calls
      divide(top, row - 1, left, right);
      divide(row + 1, bottom, left, right);
    } else {
      // Vertical wall
      const col = left + getRandInt(0, width - 1);
      const pathway = left + getRandInt(0, height) * 2; // pick a random row to leave a pathway
      for (let row = top; row < bottom; row++) {
        if (pathway != row) {
          if (!newGrid[row][col].isStart && !newGrid[row][col].isTarget) {
            newGrid[row][col].isWall = true;
            newGrid[row][col].status = "wall";
            walls.push(newGrid[row][col]);
          }
        }
      }

      // Recursive calls
      divide(top, bottom, left, col - 1);
      divide(top, bottom, col + 1, right);
    }
  }
}

/**
 * Generates a random integer between min (inclusive) and max (exclusive).
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} - A random integer between min and max.
 */
function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function buildSurroundingWalls(newGrid, ROW, COL) {
  for (let row = 0; row < ROW; row++) {
    if (!newGrid[row][0].isStart && !newGrid[row][0].isTarget) {
      // left walls
      newGrid[row][0].isWall = true;
      newGrid[row][0].status = "wall";
      walls.push(newGrid[row][0]);
    }
    if (!newGrid[row][COL - 1].isStart && !newGrid[row][COL - 1].isTarget) {
      // right walls
      newGrid[row][COL - 1].isWall = true;
      newGrid[row][COL - 1].status = "wall";
      walls.push(newGrid[row][COL - 1]);
    }
  }
  for (let col = 0; col < COL; col++) {
    if (!newGrid[0][col].isStart && !newGrid[0][col].isTarget) {
      // upper walls
      newGrid[0][col].isWall = true;
      newGrid[0][col].status = "wall";
      walls.push(newGrid[0][col]);
    }
    if (!newGrid[ROW - 1][col].isStart && !newGrid[ROW - 1][col].isTarget) {
      // lower walls
      newGrid[ROW - 1][col].isWall = true;
      newGrid[ROW - 1][col].status = "wall";
      walls.push(newGrid[ROW - 1][col]);
    }
  }
}

export function getRecursiveDivisionWallsInOrder() {
  return walls;
}
