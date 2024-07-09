let visited = [];

/**
 * Dijkstra's Search Algorithm
 *
 * Finding the shortest paths between nodes in a weighted graph.
 * Uses a priority queue to always expand the shortest known distance node first.
 *
 * Also keep track of all visited nodes in order
 * for visualization purposes
 *
 * @param {Array} grid the grid contains all nodes
 * @param {Node} start starting node
 * @param {Node} target target node
 * @returns {Array} shortest path
 */
export function dijkstra(grid, start, target) {
  visited = []; // Clear the visited array at the start
  // Queue - tracking path tracing back to node

  // Initialize distance as Infinity for all nodes
  const dist = [];
  for (let row = 0; row < grid.length; row++) {
    const curRow = [];
    for (let col = 0; col < grid[0].length; col++) {
      curRow.push(Number.MAX_VALUE);
    }
    dist.push(curRow);
  }
  // starting from start node as it has a distance of 0 to itself
  dist[start.row][start.col] = 0;

  // Priority queue (min-heap) to keep track of nodes to visit
  // in order of distance from start node
  const pq = new PriorityQueue();
  pq.enqueue(start, 0, [start]); // {node, distance, pathToCurrentNode}

  // Dijkstra's Algorithm
  while (pq.size() > 0) {
    // Extract the node with the shortest distance
    const { node, priority: distance, pathToCurNode: path } = pq.dequeue();

    // Skip if node is a wall
    if (node.isWall) continue;

    // Mark node as visited if not already visited
    if (!node.isVisited) {
      visited.push(node);
      node.isVisited = true;
    }

    // If the current node is the target, reconstruct and return the path
    if (node === target) {
      console.log("Found target at node " + node.row + " " + node.col);
      return path;
    }

    // Get neighbors of the current node
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);

    // Update distances to neighbors and add them to the priority queue
    for (let neighbor of unvisitedNeighbors) {
      const distanceToNeighbor = distance + 1; // Assuming uniform cost (1 per step)

      if (distanceToNeighbor < dist[neighbor.row][neighbor.col]) {
        // Update distance if found shorter path to neighbor
        dist[neighbor.row][neighbor.col] = distanceToNeighbor;
        pq.enqueue(neighbor, distanceToNeighbor, path.concat([neighbor]));
      }
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function getDijkstraVisitedNodesInOrder() {
  return visited;
}

/* Priority Queue (Min Heap) for Dijkstra algorithm */
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(node, priority, pathToCurNode) {
    var flag = false;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].priority > priority) {
        this.values.splice(i, 0, { node, priority, pathToCurNode });
        flag = true;
        break;
      }
    }
    if (!flag) {
      this.values.push({ node, priority, pathToCurNode });
    }
  }

  dequeue() {
    return this.values.shift();
  }

  size() {
    return this.values.length;
  }
}
