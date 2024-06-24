import React, { Component } from "react";
import { Ghost, PacMan } from "@/components/icons";
import classNames from "classnames";
import "./Node.css";

const Node = ({
  row,
  col,
  status,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  // onDrag,
  // onDragEnd,
}) => {
  const nodeClass = classNames({
    "start-node": status === "start",
    "target-node": status === "target",
    object: status === "object",
    unvisited: status === "unvisited",
    wall: status === "wall",
  });

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${nodeClass}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp(row, col)}
      // draggable={status === 'start' || status === 'target'}
      // onDrag={(e) => onDrag(e, row, col)}
      // onDragEnd={(e) => onDragEnd(e, row, col)}
    >
      {status === "start" && (
        <div className="svg-display show-svg">
          <PacMan />
        </div>
      )}
      {status === "target" && (
        <div className="svg-display show-svg">
          <Ghost />
        </div>
      )}
    </div>
  );
};

export default Node;
