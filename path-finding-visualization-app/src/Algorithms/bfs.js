// Keep track of visited nodes
let visited = [];

/**
 * Breadth First Search Algorithm
 *
 * Keep track of shortest path to current node every time it's encountered
 * in order to find shortest path from start to target node
 *
 * Also keep track of all visited nodes in order
 * for visualization purposes
 *
 * @param {Array} grid the grid contains all nodes
 * @param {Node} start starting node
 * @param {Node} target target node
 * @returns {Array} shortest path
 */
export function bfs(grid, start, target) {
  // Queue - tracking path tracing back to node
  let trackQueue = [
    {
      [start.row + " " + start.col]: [],
    },
  ];

  // Breadth First Search
  while (trackQueue.length !== 0) {
    // explore next node in queue
    const curTrace = trackQueue.shift(); // pop Queue
    const curNode = getNodeById(grid, Object.keys(curTrace)[0]);

    // skip wall node if encountered
    if (curNode.isWall) {
      continue;
    }
    // keep track of visited nodes
    visited.push(curNode);

    const curNodeId = curNode.row + " " + curNode.col;
    const pathToCurNode = curTrace[curNodeId].slice(); // Clone the path array

    // return path if curNode is target
    if (curNode === target) {
      console.log("found target at node " + curNode.row + " " + curNode.col);
      pathToCurNode.push(curNode); // Add the target node to the path
      return pathToCurNode;
    }

    // explore current node if not visited yet
    if (!curNode.isVisitedSearch) {
      // mark current node as visited and add path
      curNode.isVisitedSearch = true;
      pathToCurNode.push(curNode);

      // add unvisited neighbors to Queue
      const unvisitedNeighbors = getUnvisitedNeighbors(curNode, grid);
      // add unvisited neighbor & its path to Queue
      for (let unvisitedNeighbor of unvisitedNeighbors) {
        const unvisitedNeighborId =
          unvisitedNeighbor.row + " " + unvisitedNeighbor.col;
        trackQueue.push({ [unvisitedNeighborId]: pathToCurNode.slice() }); // Clone the path array for each neighbor
      }
    }
  }

  // Return an empty array if no path is found
  return [];
}

function getNodeById(grid, curNodeId) {
  const curNodeRowCol = curNodeId.split(" ");
  const curNode = grid[curNodeRowCol[0]][curNodeRowCol[1]];
  return curNode;
}

function getUnvisitedNeighbors(node, grid) {
  let neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisitedSearch);
}

export function getBFSVistedNodesInOrder() {
  return visited;
}
