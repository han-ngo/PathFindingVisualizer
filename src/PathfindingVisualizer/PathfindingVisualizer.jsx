import $ from "jquery";
import React, { Component } from "react";
import Node from "./Node/Node";
import MyLegend from "./Legend/MyLegend";
import NextUINavbar from "./Navbar/NextUINavbar";
import { bfs, getBFSVistedNodesInOrder } from "../Algorithms/Path/bfs";
import { dfs, getDFSVistedNodesInOrder } from "../Algorithms/Path/dfs";
import {
  dijkstra,
  getDijkstraVisitedNodesInOrder,
} from "../Algorithms/Path/dijkstra";
import {
  recursiveDivisionMaze,
  getRecursiveDivisionWallsInOrder,
} from "../Algorithms/Maze/recuresiveDivision";
import { dfsMaze, getDFSWallsInOrder } from "../Algorithms/Maze/dfs";
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

    this.visualizeAlgorithm = this.visualizeAlgorithm.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.clearPath = this.clearPath.bind(this);
  }

  /********************/
  /****  RENDER UI ****/
  /********************/
  render() {
    const { grid } = this.state;

    return (
      <>
        <NextUINavbar
          onSelectPathAlgo={(e) => this.handleSelectPathAlgo(e)}
          onSelectMazeAlgo={(e) => this.handleSelectMazeAlgo(e)}
        />
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
                      status,
                      isVisited,
                      isWall,
                      mouseIsPressed,
                    } = node;
                    return (
                      <Node
                        row={row}
                        col={col}
                        key={nodeIndex} /* key is needed for iterable items */
                        status={status}
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
    const grid = this.initGrid();
    this.setState({ grid });

    document
      .getElementsByClassName("handle-visualize")[0]
      .addEventListener("click", this.visualizeAlgorithm);
    document
      .getElementsByClassName("clear-board")[0]
      .addEventListener("click", this.clearBoard);
    document
      .getElementsByClassName("clear-path")[0]
      .addEventListener("click", this.clearPath);
  }

  /**************************/
  /*** HANDLE MOUSE EVENT ***/
  /**************************/
  handleMouseDown(row, col) {
    const newGrid = this.createNewGridOnWallToggled(this.state.grid, row, col);
    this.setState({
      grid: newGrid,
      mouseIsPressed: true,
      pressedNode: this.state.grid[row][col],
    });
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
      const newGrid = this.createNewGridOnWallToggled(
        this.state.grid,
        row,
        col
      );
      this.setState({ grid: newGrid });
    }
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

  clearPath() {
    // clear other fields
    $(".path-not-found").empty();

    // clear path
    const { grid } = this.state,
      newGrid = this.clearGrid(grid, false);
    this.setState({ grid: newGrid });
  }

  clearBoard() {
    // clear other fields
    $(".path-not-found").empty();

    // reset all nodes state
    const { grid } = this.state,
      newGrid = this.clearGrid(grid);
    this.setState({ grid: newGrid });
  }

  handleSelectPathAlgo(event) {
    $(".handle-visualize").text("Visualize " + event + " Algorithm");
    this.setState({ algorithm: event });
  }

  swapNodes(oldNode, newNode, pressedNode) {
    const startNode = this.state.grid[START_NODE[0]][START_NODE[1]];
    const targetNode = this.state.grid[TARGET_NODE[0]][TARGET_NODE[1]];
    const newGrid = this.state.grid.slice(); // Copy the grid

    switch (pressedNode) {
      case startNode:
        // Update the START_NODE coordinates
        START_NODE[0] = newNode.row;
        START_NODE[1] = newNode.col;

        // Update the nodes in the grid
        newGrid[oldNode.row][oldNode.col] = {
          ...oldNode,
          isStart: false,
          status: "unvisited",
        };
        newGrid[newNode.row][newNode.col] = {
          ...newNode,
          isStart: true,
          status: "start",
        };
        break;

      case targetNode:
        // Update the TARGET_NODE coordinates
        TARGET_NODE[0] = newNode.row;
        TARGET_NODE[1] = newNode.col;

        // Update the nodes in the grid
        newGrid[oldNode.row][oldNode.col] = {
          ...oldNode,
          isTarget: false,
          status: "unvisited",
        };
        newGrid[newNode.row][newNode.col] = {
          ...newNode,
          isTarget: true,
          status: "target",
        };
        break;

      default:
        break;
    }

    // Update the state with the new grid
    this.setState({ grid: newGrid });
  }

  /***********************/
  /**** VISUALIZATION ****/
  /***********************/
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
      case "Dijkstra's":
        path = dijkstra(grid, startNode, targetNode);
        visitedNodesInOrder = getDijkstraVisitedNodesInOrder();
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

  animateNodes(nodes, classes, delay, isPath = false) {
    nodes.forEach((node, index) => {
      setTimeout(() => {
        // exclude animation on start & target node
        if (!node.isStart && !node.isTarget) {
          const element = document.getElementById(
            `node-${node.row}-${node.col}`
          );
          if (element) {
            element.classList.add(classes);
            // Create and append the dot element to path
            if (isPath) {
              const dot = document.createElement("div");
              dot.classList.add("dot");
              element.appendChild(dot);
            }
          }
        }
      }, delay * index);
    });
  }

  animatePathFindingAlgo(path, visited) {
    console.log("visualizing algorithm: " + this.state.algorithm);
    const delay = 10;
    // mark node as visited
    this.animateNodes(visited, "visited-node", delay);

    if (!path) {
      // if no path is found
      this.alertPathNotFound();
      return;
    }
    // animate path to target node if found
    setTimeout(() => {
      this.animateNodes(path, "shortestPath-node", 25, true);
    }, delay * visited.length);
  }

  alertPathNotFound() {
    $(".path-not-found").text("Path is NOT found! :(");
  }

  /**************/
  /**** INFO ****/
  /**************/
  displayAlgoDesc() {
    switch (this.state.algorithm) {
      case "BFS":
        return "Breath-first Search Algorithm is unweighted and guarantees the shortest path!";
      case "DFS":
        return "Depth-first Search Algorithm is unweighted and does NOT guarantee the shortest path!";
      case "Dijkstra":
        return "Dijkstra Algorithm is weighted and guarantees the shortest path!";
      default:
        return "Pick an algorithm to visualize! Use your mouse to add walls or drag the start and target nodes around.";
    }
  }

  /**************/
  /**** MAZE ****/
  /**************/
  handleSelectMazeAlgo(event) {
    let newGrid, walls;
    const { grid } = this.state,
      startNode = grid[START_NODE[0]][START_NODE[1]],
      targetNode = grid[TARGET_NODE[0]][TARGET_NODE[1]];
    switch (event) {
      case "Recursive_Division":
        newGrid = recursiveDivisionMaze(grid, "random");
        walls = getRecursiveDivisionWallsInOrder();
        break;
      case "Recursive_Division_Horizontal":
        newGrid = recursiveDivisionMaze(grid, "horizontal");
        walls = getRecursiveDivisionWallsInOrder();
        break;
      case "Recursive_Division_Vertical":
        newGrid = recursiveDivisionMaze(grid, "vertical");
        walls = getRecursiveDivisionWallsInOrder();
        break;
      case "DFS":
        newGrid = dfsMaze(grid, startNode, targetNode);
        walls = getDFSWallsInOrder();
        break;
      case "Random":
        break;
      default:
        break;
    }

    const delay = 10;
    // mark node as visited
    this.animateNodes(walls, "wall-node", delay);
    setTimeout(() => {
      // Update the state with the new grid
      this.setState({ grid: newGrid });
    }, delay * walls.length);
  }

  /**************/
  /**** GRID ****/
  /**************/
  createNode(row, col) {
    return {
      row,
      col,
      isStart: row === START_NODE[0] && col === START_NODE[1],
      isTarget: row === TARGET_NODE[0] && col === TARGET_NODE[1],
      isVisited: false,
      isWall: false,
      status: this.getInitialStatus(row, col),
    };
  }

  getInitialStatus(row, col) {
    if (row === START_NODE[0] && col === START_NODE[1]) {
      return "start";
    }
    if (row === TARGET_NODE[0] && col === TARGET_NODE[1]) {
      return "target";
    }
    return "unvisited";
  }

  initGrid() {
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
        const curNode = this.createNode(row, col);
        curRow.push(curNode);
      }
      grid.push(curRow);
    }
    return grid;
  }

  createNewGridOnWallToggled(grid, row, col) {
    // get a new copy of grid
    const newGrid = grid.slice();
    // toggle isWall for new node
    const node = grid[row][col];
    if (!node.isStart && !node.isTarget) {
      // cannot set wall on start and target node
      const newNode = {
        ...node,
        isWall: !node.isWall,
        status: node.status === "wall" ? "unvisited" : "wall",
      };
      // update new node on new grid
      newGrid[row][col] = newNode;
    }
    return newGrid;
  }

  clearGrid(grid, reset = true) {
    const newGrid = grid.map((row) =>
      row.map((node) => {
        if (node.isStart) {
          return {
            ...node,
            isVisited: false,
            isWall: reset ? false : node.isWall,
            status: "start",
          };
        } else if (node.isTarget) {
          return {
            ...node,
            isVisited: false,
            isWall: reset ? false : node.isWall,
            status: "target",
          };
        } else {
          const element = document.getElementById(
            `node-${node.row}-${node.col}`
          );
          if (element) {
            element.classList.remove("visited-node");
            // remove path & dot class if is shortest path
            const isPath = element.classList.contains("shortestPath-node");
            if (isPath) {
              element.classList.remove("shortestPath-node");
              element.innerHTML = ""; // remove `.dot`
            }
          }
          return {
            ...node,
            isVisited: false,
            isWall: reset ? false : node.isWall,
            status: reset ? "empty" : node.isWall ? "wall" : "empty",
          };
        }
      })
    );

    return newGrid;
  }
}
