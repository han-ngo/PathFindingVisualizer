import $ from "jquery";
import React, { Component } from "react";
// import { Container } from "@nextui-org/react";
import Node from "./Node/Node";
import MyLegend from "./Legend/MyLegend";
import NextUINavbar from "./Navbar/NextUINavbar";
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
                        // onDragStart={(event, row, col) =>
                        //   this.handleDragStart(event, row, col)
                        // }
                        // onDrag={(event, row, col) =>
                        //   this.handleDrag(event, row, col)
                        // }
                        // onDragEnd={(event, row, col) =>
                        //   this.handleDragEnd(event, row, col)
                        // }
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
  }

  clearBoard() {
    $(".path-not-found").empty();
    this.createNewCleanGrid(this.state.grid);
    this.setState({ grid: this.state.grid });
  }

  handleSelectAlgo(event) {
    $(".handle-visualize").text("Visualize " + event + " Algorithm");
    this.setState({ algorithm: event });
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
    console.log("mouse up =", row, col, this.state.grid[row][col]);
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

  /**************************/
  /*** HANDLE DRAG EVENT ***/
  /**************************/
  handleDragStart(event, row, col) {
    console.log("start =", row, col);
  }
  handleDrag(event, row, col) {
    console.log("drag =", row, col);
  }
  handleDragEnd(event, row, col) {
    console.log("end =", this.state.grid[row][col]);
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

  createNewCleanGrid(grid) {
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
  }
}
