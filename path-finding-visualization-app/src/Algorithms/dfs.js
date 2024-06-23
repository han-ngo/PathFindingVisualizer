// Keep track of visited nodes
let visited = [];

export function dfs(grid, start, target) {
  let stack = [start];
  while (stack.length > 0) {
    // pop stack
    let curNode = stack.pop();

    // skip wall node if encounter
    if (curNode.isWall) {
      continue;
    }
    // keep track of visited nodes
    visited.push(curNode);

    // return path if curNode is target
    if (curNode === target) {
      console.log("found target at node " + curNode.row + " " + curNode.col);
      return visited;
    }

    // explore current node if not visited yet
    if (!curNode.isVisited) {
      // add unvisited neighbors to Queue
      const unvisitedNeighbors = getUnvisitedNeighbors(curNode, grid);
      // mark current node as visited and add path
      curNode.isVisited = true;
      stack = stack.concat(unvisitedNeighbors);
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  let neighbors = [];
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
