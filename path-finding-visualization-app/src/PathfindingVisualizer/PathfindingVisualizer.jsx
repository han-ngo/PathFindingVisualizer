import $ from "jquery";
import React, { Component } from "react";
// import { Container } from "@nextui-org/react";
import Node from "./Node/Node";
import MyLegend from "./Legend/MyLegend";
import NextUINavbar from "./Navbar/NextUINavbar";
import NavigationMenuDemo from "./Navbar/ShadcnNavbar";
import { bfs, getBFSVistedNodesInOrder } from "../Algorithms/bfs";
import { dfs, getDFSVistedNodesInOrder } from "../Algorithms/dfs";
import "./PathfindingVisualizer.css";
let GRID_HEIGHT, GRID_WIDTH, START_NODE, TARGET_NODE;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      algorithm: "",
      mouseIsPressed: false,
      pressedNode: undefined,
    };

    // TODO: why have to bind???
    this.visualizeAlgorithm = this.visualizeAlgorithm.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
  }

  render() {
    const { grid } = this.state;

    return (
      <>
        <NextUINavbar onSelect={(e) => this.handleSelectAlgo(e)} />
        <MyLegend algoDesc={this.displayAlgoDesc()} />
        <div className="dark text-foreground bg-background max-w-full flex justify-center items-center">
          <div className="grid">
            {grid.map((row, rowIndex) => {
              return (
                <div className="row" key={rowIndex}>
                  {row.map((node, nodeIndex) => {
                    const {
                      row,
                      col,
                      isStart,
                      isTarget,
                      isVisited,
                      isWall,
                      mouseIsPressed,
                    } = node;
                    return (
                      <Node
                        row={row}
                        col={col}
                        key={nodeIndex} /* key is needed for iterable items */
                        isStart={isStart}
                        isTarget={isTarget}
                        isVisited={isVisited}
                        isWall={isWall}
                        mouseIsPressed={mouseIsPressed}
                        onMouseDown={(row, col) =>
                          this.handleMouseDown(row, col)
                        }
                        onMouseEnter={(row, col) =>
                          this.handleMouseEnter(row, col)
                        }
                        onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                      ></Node>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  /* invoked immediately after a component is mounted (inserted into the tree) */
  componentDidMount() {
    const grid = initGrid();
    this.setState({ grid });

    document
      .getElementsByClassName("handle-visualize")[0]
      .addEventListener("click", this.visualizeAlgorithm);
    document
      .getElementsByClassName("clear-board")[0]
      .addEventListener("click", this.clearBoard);
  }

  clearBoard() {
    $(".path-not-found").empty();
    createNewCleanGrid(this.state.grid);
    this.setState({ grid: this.state.grid });
  }

  handleSelectAlgo(event) {
    $(".handle-visualize").text("Visualize " + event + " Algorithm");
    this.setState({ algorithm: event });
  }

  handleMouseDown(row, col) {
    const newGrid = createNewGridOnWallToggled(this.state.grid, row, col);
    this.setState({
      grid: newGrid,
      mouseIsPressed: true,
      pressedNode: this.state.grid[row][col],
    });

    // Add event listener to track mouse movement
    document.addEventListener("mousemove", this.handleMouseMove);
  }

  /* Invoke when mouse hover on grid */
  handleMouseEnter(row, col) {
    // Only toggle wall if mouseIsPressed
    const startNode = this.state.grid[START_NODE[0]][START_NODE[1]];
    const targetNode = this.state.grid[TARGET_NODE[0]][TARGET_NODE[1]];
    if (
      this.state.mouseIsPressed &&
      this.state.pressedNode !== startNode &&
      this.state.pressedNode !== targetNode
    ) {
      const newGrid = createNewGridOnWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseEnter(row, col) {
    const { grid, mouseIsPressed, pressedNode } = this.state;

    const startNode = this.state.grid[START_NODE[0]][START_NODE[1]];
    const targetNode = this.state.grid[TARGET_NODE[0]][TARGET_NODE[1]];
    if (
      this.state.mouseIsPressed &&
      this.state.pressedNode !== startNode &&
      this.state.pressedNode !== targetNode
    ) {
      // Only toggle wall if mouseIsPressed
      const newGrid = createNewGridOnWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    } else if (mouseIsPressed && pressedNode) {
      // Only move node if mouse is pressed and it's the same node being dragged
      const newGrid = grid.slice();
      const targetNode = newGrid[row][col];

      // Update state and move node
      this.setState({
        grid: this.moveNodeInGrid(newGrid, pressedNode, targetNode),
      });
    }
  }

  moveNodeInGrid(grid, pressedNode, targetNode) {
    // Clone grid and update node positions
    const newGrid = grid.slice();
    const newPressedNode = { ...pressedNode };
    newPressedNode.row = targetNode.row;
    newPressedNode.col = targetNode.col;
    newGrid[pressedNode.row][pressedNode.col] = { ...pressedNode };
    newGrid[targetNode.row][targetNode.col] = newPressedNode;

    return newGrid;
  }

  handleMouseUp(row, col) {
    const startNode = this.state.grid[START_NODE[0]][START_NODE[1]];
    const targetNode = this.state.grid[TARGET_NODE[0]][TARGET_NODE[1]];
    if (
      this.state.pressedNode === startNode ||
      this.state.pressedNode === targetNode
    ) {
      this.swapNodes(
        this.state.pressedNode,
        this.state.grid[row][col],
        this.state.pressedNode
      );
    }
    this.setState({ mouseIsPressed: false, pressedNode: undefined });
  }

  swapNodes(oldNode, newNode, pressedNode) {
    const startNode = this.state.grid[START_NODE[0]][START_NODE[1]];
    const targetNode = this.state.grid[TARGET_NODE[0]][TARGET_NODE[1]];
    switch (pressedNode) {
      case startNode:
        START_NODE[0] = newNode.row;
        START_NODE[1] = newNode.col;
        newNode.isStart = true;
        document.getElementById(
          `node-${newNode.row}-${newNode.col}`
        ).className = "node start-node fas fa-location-arrow";
        oldNode.isStart = false;
        document.getElementById(
          `node-${oldNode.row}-${oldNode.col}`
        ).className = "node";
        break;
      case targetNode:
        TARGET_NODE[0] = newNode.row;
        TARGET_NODE[1] = newNode.col;
        newNode.isTarget = true;
        document.getElementById(
          `node-${newNode.row}-${newNode.col}`
        ).className = "node target-node fas fa-star";
        oldNode.isTarget = false;
        document.getElementById(
          `node-${oldNode.row}-${oldNode.col}`
        ).className = "node";
        break;
      default:
        break;
    }
  }

  visualizeAlgorithm() {
    const { grid } = this.state,
      startNode = grid[START_NODE[0]][START_NODE[1]],
      targetNode = grid[TARGET_NODE[0]][TARGET_NODE[1]];
    let path = [],
      visitedNodesInOrder = [];

    switch (this.state.algorithm) {
      case "BFS":
        path = bfs(grid, startNode, targetNode);
        visitedNodesInOrder = getBFSVistedNodesInOrder();
        break;
      case "DFS":
        path = dfs(grid, startNode, targetNode);
        visitedNodesInOrder = getDFSVistedNodesInOrder();
        break;
      case "Dijkstra":
        break;
      default:
        this.handleAlgoNotPicked();
        break;
    }

    this.animatePathFindingAlgo(path, visitedNodesInOrder);
  }

  handleAlgoNotPicked() {
    $(".handle-visualize").text("Pick an Algorithm!");
  }

  animatePathFindingAlgo(path, visited) {
    console.log("visualizing algorithm: " + this.state.algorithm);
    for (let i = 0; i <= visited.length; i++) {
      // mark shortest path found
      if (i === visited.length) {
        setTimeout(() => {
          this.animateShortestPath(path);
        }, 10 * i);
        return;
      }
      // mark node as visited
      setTimeout(() => {
        const node = visited[i];
        if (!node.isStart && !node.isTarget) {
          // exclude animation on start & target node
          $(`#node-${node.row}-${node.col}`).attr("class", "node visited-node");
        }
      }, 10 * i);
    }
  }

  moveStartObjToTarget() {
    const startNode = document.querySelector(".start-node");
    const targetNode = document.querySelector(".target-node");
    const svgContainer = document.querySelector(".svg-display");

    if (!startNode || !targetNode || !svgContainer) {
      console.error("Start node, target node, or svg display not found!");
      return;
    }

    const startRect = startNode.getBoundingClientRect();
    const targetRect = targetNode.getBoundingClientRect();

    const translateX = targetRect.left - startRect.left;
    const translateY = targetRect.top - startRect.top;

    svgContainer.style.setProperty("--translate-x", `${translateX}px`);
    svgContainer.style.setProperty("--translate-y", `${translateY}px`);

    svgContainer.style.transform = `translate(${translateX}px, ${translateY}px)`;
  }

  animateShortestPath(path) {
    if (!path) {
      this.alertPathNotFound();
      return;
    }
    for (let i = 0; i < path.length; i++) {
      // mark shortest path found
      setTimeout(() => {
        const node = path[i];
        // exclude animation on start & target node
        if (!node.isStart && !node.isTarget) {
          const element = document.getElementById(
            `node-${node.row}-${node.col}`
          );
          if (element) {
            element.classList.add("shortestPath-node");
            // Create and append the dot element
            const dot = document.createElement("div");
            dot.classList.add("dot");
            element.appendChild(dot);
          }
        }
      }, 25 * i);
    }

    setTimeout(() => {
      this.moveStartObjToTarget();
    }, 25 * path.length);
  }

  alertPathNotFound() {
    $(".path-not-found").text("Path is NOT found! :(");
  }

  displayAlgoDesc() {
    switch (this.state.algorithm) {
      case "BFS":
        return "Breath-first Search Algorithm is unweighted and guarantees the shortest path!";
      case "DFS":
        return "Depth-first Search Algorithm is unweighted and does NOT guarantee the shortest path!";
      case "Dijkstra":
        return "Dijkstra Algorithm is weighted and guarantees the shortest path!";
      default:
        return "Pick an algorithm to visualize!";
    }
  }
}

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_NODE[0] && col === START_NODE[1],
    isTarget: row === TARGET_NODE[0] && col === TARGET_NODE[1],
    isVisited: false,
    isWall: false,
  };
};

const initGrid = () => {
  // Calculate grid size
  let navbarHeight = $("nav").height(),
    footerHeight = $("footer").height(),
    textHeight = $(".main-text").height(),
    legendHeight = $(".legend").height();
  GRID_HEIGHT = Math.floor(
    ($(document).height() -
      navbarHeight -
      textHeight -
      legendHeight -
      footerHeight) /
      28
  );
  GRID_WIDTH = Math.floor(($(document).width() - 45 * 2) / 27);
  // Calculate start and target node position
  START_NODE = [Math.floor(GRID_HEIGHT / 2), Math.floor(GRID_WIDTH / 7)];
  TARGET_NODE = [Math.floor(GRID_HEIGHT / 2), Math.floor(GRID_WIDTH / 7) * 6];

  const grid = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const curRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      const curNode = createNode(row, col);
      curRow.push(curNode);
    }
    grid.push(curRow);
  }
  return grid;
};

const createNewGridOnWallToggled = (grid, row, col) => {
  // get a new copy of grid
  const newGrid = grid.slice();
  // toggle isWall for new node
  const node = grid[row][col];
  if (!node.isStart && !node.isTarget) {
    // cannot set wall on start and target node
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    // update new node on new grid
    newGrid[row][col] = newNode;
  }
  return newGrid;
};

const createNewCleanGrid = (grid) => {
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const node = grid[row][col];
      // reset all settings
      node.isVisited = false;
      node.isWall = false;
      if (!node.isStart && !node.isTarget) {
        // exclude start and target node
        $(`#node-${node.row}-${node.col}`).attr("class", "node");
      }
    }
  }
};
