import React, { Component } from "react";
import { Ghost, PacMan } from "@/components/icons";
import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      row,
      col,
      isStart,
      isTarget,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;
    const nodeClassName = isStart
      ? "start-node"
      : isTarget
      ? "target-node"
      : isWall
      ? "wall-node "
      : "";
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${nodeClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
      >
        <div className={`svg-display ${isStart ? "show-svg" : ""}`}>
          <PacMan />
        </div>
        <div className={`svg-display ${isTarget ? "show-svg" : ""}`}>
          <Ghost />
        </div>
      </div>
    );
  }
}
