import React, { Component } from "react";
// import { Container, Row, Col } from "@nextui-org/react";
import { Ghost, PacMan } from "@/components/icons";
import "../Node/Node.css";

export default class MyNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { algoDesc } = this.props;
    return (
      <>
        <div className="container text-center legend py-[20px] dark text-foreground bg-background max-w-7xl">
          <div className="row">
            <div className="col text-small flex inline-flex">
              <PacMan />
              <div className="pl-3 pt-0.5">Start Node</div>
            </div>
            <div className="col text-small flex inline-flex">
              <Ghost />
              <div className="pl-3 pt-0.5">Target Node</div>
            </div>
            <div className="col text-small flex inline-flex">
              <div className="node"></div>
              <div className="pl-3 pt-0.5">Unvisited Node</div>
            </div>
            <div className="col text-small flex inline-flex">
              <div className="visited-node w-[25px] h-[25px]"></div>
              <div className="pl-3 pt-0.5">Visited Node</div>
            </div>
            <div className="col text-small flex inline-flex">
              <div className="wall-node w-[25px] h-[25px]"></div>
              <div className="pl-3 pt-0.5">Wall Node</div>
            </div>
            <div className="col text-small flex inline-flex">
              <div className="water-node w-[25px] h-[25px]"></div>
              <div className="pl-3 pt-0.5">Water Node</div>
            </div>
          </div>
        </div>
        <div className="main-text">
          <div className="algo-desc pt-4 pb-2">{algoDesc}</div>
          <div className="path-not-found"></div>
        </div>
      </>
    );
  }
}
