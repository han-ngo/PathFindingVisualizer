import { useState } from "react";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <PathfindingVisualizer></PathfindingVisualizer>
      </div>
    </>
  );
}

export default App;
