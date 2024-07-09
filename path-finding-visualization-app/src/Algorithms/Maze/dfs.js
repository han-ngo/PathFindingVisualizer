let walls = [];

/**
 * DFS / Recursive Backtracking Maze Generator
 *
 * Description: This algorithm creates a maze by carving out passages in a depth-first manner.
 * It uses a stack to keep track of the path, backtracking when it hits a dead-end.
 *
 * Characteristics: Tends to create long, winding passages with few short dead-ends.
 *
 *
 * Generates a maze within the given grid.
 * This function modifies the grid to add walls in a maze-like pattern.
 *
 * @param {Array} grid - The grid containing all nodes.
 * @param {string} start - The starting node.
 * @returns {Array} The new grid.
 */
export function dfsMaze(grid, start, target) {
  const newGrid = grid.slice();
  walls = []; // Reset the walls list
  const stack = [start];
  const visited = new Set();
  visited.add(start.row + "," + start.col);

  while (stack.length > 0) {
    const { row, col } = stack.pop();
    newGrid[row][col].isWall = false; // Remove wall (mark as passage)

    // Define the four possible directions (up, down, left, right)
    const directions = [
      [-2, 0], // Up
      [2, 0], // Down
      [0, -2], // Left
      [0, 2], // Right
    ];

    // Shuffle the directions randomly
    shuffle(directions);

    // Visit each neighbor cell
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the neighbor is within bounds and hasn't been visited
      if (
        newRow >= 0 &&
        newRow < newGrid.length &&
        newCol >= 0 &&
        newCol < newGrid[0].length &&
        !visited.has(newRow + "," + newCol)
      ) {
        // Mark the cell as visited and add to stack
        visited.add(newRow + "," + newCol);
        stack.push({ row: newRow, col: newCol });

        // Remove the wall between the current cell and the neighbor
        newGrid[row + Math.floor(dr / 2)][
          col + Math.floor(dc / 2)
        ].isWall = false;

        // Store the wall for visualization purposes
        walls.push(newGrid[row + Math.floor(dr / 2)][col + Math.floor(dc / 2)]);

        // If the neighbor is the target, stop generating and return the grid
        if (newRow === target.row && newCol === target.col) {
          return newGrid;
        }
      }
    }
  }

  // If we reach here, the maze has been generated without reaching the target
  // We can now use recursive backtracking to ensure there's a path to the target
  recursiveBacktrack(newGrid, start, target, visited);

  return newGrid;
}

/**
 * Recursive Backtracking function to ensure there's a path from start to target
 * @param {Array} grid The grid containing all nodes
 * @param {Object} current The current node { row, col }
 * @param {Object} target The target node { row, col }
 * @param {Set} visited Set of visited nodes
 */
function recursiveBacktrack(grid, current, target, visited) {
  const { row, col } = current;
  grid[row][col].isVisited = true; // Mark current node as visited

  // Define the four possible directions (up, down, left, right)
  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ];

  // Shuffle the directions randomly
  shuffle(directions);

  // Visit each neighbor cell
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    // Check if the neighbor is within bounds and hasn't been visited
    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      !visited.has(newRow + "," + newCol) &&
      !grid[newRow][newCol].isWall
    ) {
      visited.add(newRow + "," + newCol);

      // If the neighbor is the target, return true to indicate a path is found
      if (newRow === target.row && newCol === target.col) {
        return true;
      }

      // Recursively call the function on the neighbor
      if (
        recursiveBacktrack(grid, { row: newRow, col: newCol }, target, visited)
      ) {
        return true;
      }
    }
  }

  // If no path is found from current node, mark it as not part of the solution
  grid[row][col].isWall = true;
  return false;
}

/**
 * Function to shuffle an array using Fisher-Yates algorithm
 * @param {Array} array The array to shuffle
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Function to get the list of walls generated by DFS maze generator in order
 * @returns {Array} The list of walls in order of generation
 */
export function getDFSWallsInOrder() {
  return walls;
}