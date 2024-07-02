import $ from "jquery";
import Node from "./Node";

/* COLOR MAPPING */
let DEFAULT_COLOR = "#09090B",
  VISITED_COLOR = "grey",
  VISITED_ANIMATION_COLOR = "#75FBE0",
  PATH_COLOR = "#FEFBA2",
  WALL_COLOR = "#2529CA";

/* DIMENSIONS */
let CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRID_HEIGHT,
  GRID_WIDTH,
  START_NODE,
  TARGET_NODE;

/* GRID & EVENTS */
let grid = []; // Initialize grid as an empty array
let mouseIsPressed = false;

export default function sketch(p) {
  p.setup = () => {
    [
      CANVAS_HEIGHT,
      CANVAS_WIDTH,
      GRID_HEIGHT,
      GRID_WIDTH,
      START_NODE,
      TARGET_NODE,
    ] = calculateGridSize();

    const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    // p.frameRate(10); // Set frame rate for smoother animation
    canvas.parent("p5-container"); // This id should match the one in your React component

    grid = p.initGrid(); // Initialize the grid with nodes
  };

  p.draw = () => {
    p.background("#52525b");

    // Loop through the grid and show each node
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        if (grid[row][col].isPath) {
          grid[row][col].show(PATH_COLOR);
        } else if (grid[row][col].isVisited) {
          grid[row][col].show(VISITED_COLOR);
        } else if (grid[row][col].isWall) {
          grid[row][col].show(WALL_COLOR);
        } else {
          grid[row][col].show(DEFAULT_COLOR);
        }
      }
    }
  };

  p.getGrid = () => {
    return grid;
  };

  p.initGrid = () => {
    const tempGrid = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
      const curRow = [];
      for (let col = 0; col < GRID_WIDTH; col++) {
        const curNode = createNode(row, col);
        curRow.push(curNode);
      }
      tempGrid.push(curRow);
    }
    return tempGrid;
  };

  // Animation for visited nodes
  p.animateVisitedNodes = (nodes, color, delay) => {
    nodes.forEach((node, index) => {
      setTimeout(() => {
        const { row, col } = node;
        grid[row][col].isVisited = true;
        grid[row][col].animatePath(color);
      }, delay * index);
    });
  };

  // Animation for shortest path
  p.animatePathNodes = (nodes, color, delay) => {
    nodes.forEach((node, index) => {
      setTimeout(() => {
        const { row, col } = node;
        grid[row][col].isPath = true;
        grid[row][col].animatePath(color);
      }, delay * index);
    });
  };

  p.drawPath = function (path, visited) {
    const delay = 6;
    p.animateVisitedNodes(visited, VISITED_ANIMATION_COLOR, delay); // Animate visited nodes

    setTimeout(() => {
      p.animatePathNodes(path, PATH_COLOR, 35); // Animate shortest path nodes
    }, delay * visited.length);
  };

  // Drawing path as continuous line
  // p.noFill();
  // p.stroke("pink");
  // p.strokeWeight(5);
  // p.strokeWeight(CANVAS_WIDTH / GRID_WIDTH / 2);
  // p.beginShape();
  // p.noStroke();
  // p.endShape();

  p.mousePressed = (event) => {
    event.preventDefault();
    mouseIsPressed = true;
    if (p.mouseButton === p.LEFT) {
      addWallAtMousePosition();
    } else if (p.mouseButton === p.RIGHT) {
      removeWallAtMousePosition();
    }
  };

  p.mouseDragged = (event) => {
    event.preventDefault();
    if (mouseIsPressed) {
      if (p.mouseButton === p.LEFT) {
        addWallAtMousePosition();
      } else if (p.mouseButton === p.RIGHT) {
        removeWallAtMousePosition();
      }
    }
  };

  p.mouseReleased = (event) => {
    event.preventDefault();
    mouseIsPressed = false;
  };

  const addWallAtMousePosition = () => {
    const row = Math.floor(p.mouseY / (CANVAS_HEIGHT / GRID_HEIGHT));
    const col = Math.floor(p.mouseX / (CANVAS_WIDTH / GRID_WIDTH));
    if (row >= 0 && row < GRID_HEIGHT && col >= 0 && col < GRID_WIDTH) {
      const node = grid[row][col];
      if (!node.isStart && !node.isTarget) {
        node.isWall = true; // Add wall
      }
    }
  };

  const removeWallAtMousePosition = () => {
    const row = Math.floor(p.mouseY / (CANVAS_HEIGHT / GRID_HEIGHT));
    const col = Math.floor(p.mouseX / (CANVAS_WIDTH / GRID_WIDTH));
    if (row >= 0 && row < GRID_HEIGHT && col >= 0 && col < GRID_WIDTH) {
      const node = grid[row][col];
      if (!node.isStart && !node.isTarget) {
        node.isWall = false; // Remove wall
      }
    }
  };

  const calculateGridSize = () => {
    const navbarHeight = $("nav").height();
    const footerHeight = $("footer").height();
    const textHeight = $(".main-text").height();
    const legendHeight = $(".legend").height();

    CANVAS_HEIGHT =
      $(document).height() -
      navbarHeight -
      textHeight -
      legendHeight -
      footerHeight -
      125;
    CANVAS_WIDTH = $(document).width() - 45 * 2;

    GRID_HEIGHT = Math.floor(
      ($(document).height() -
        navbarHeight -
        textHeight -
        legendHeight -
        footerHeight) /
        28
    );
    GRID_WIDTH = Math.floor(($(document).width() - 45 * 2) / 27);

    START_NODE = [Math.floor(GRID_HEIGHT / 2), Math.floor(GRID_WIDTH / 7)];
    TARGET_NODE = [
      Math.floor(GRID_HEIGHT / 2),
      Math.floor((GRID_WIDTH / 7) * 6),
    ];

    return [
      CANVAS_HEIGHT,
      CANVAS_WIDTH,
      GRID_HEIGHT,
      GRID_WIDTH,
      START_NODE,
      TARGET_NODE,
    ];
  };

  const createNode = (row, col) => {
    return new Node({
      p,
      row,
      col,
      isStart: row === START_NODE[0] && col === START_NODE[1],
      isTarget: row === TARGET_NODE[0] && col === TARGET_NODE[1],
      isVisited: false,
      isWall: false,
      isPath: false,
      canvasSize: [CANVAS_WIDTH, CANVAS_HEIGHT],
      gridSize: [GRID_WIDTH, GRID_HEIGHT],
    });
  };
}
