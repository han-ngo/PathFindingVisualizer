// Keep track of visited nodes
let visited = [];

export function dfs(grid, start, target) {
  visited = []; // Clear the visited array at the start

  let stack = [start];
  while (stack.length > 0) {
    let curNode = stack.pop();

    // skip wall and visited node if encounter
    if (curNode.isWall || curNode.isVisited) {
      continue;
    }

    // mark current node as visited
    curNode.isVisited = true;
    visited.push(curNode);

    // return path if curNode is target
    if (curNode === target) {
      console.log("found target at node " + curNode.row + " " + curNode.col);
      return visited;
    }

    // explore current node and add unvisited neighbors to Stack
    const unvisitedNeighbors = getUnvisitedNeighbors(curNode, grid);
    stack = stack.concat(unvisitedNeighbors);
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function getDFSVistedNodesInOrder() {
  return visited;
}
