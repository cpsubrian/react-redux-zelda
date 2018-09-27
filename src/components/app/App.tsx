import * as React from "react";

import { Map } from "../map/Map";

import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <div className="app">
        <Map cellSize={32} gridSize={16} />
      </div>
    );
  }
}

export default App;
