import * as React from "react";

import { Map } from "../map/Map";
import { MouseContainer } from "../mouse-container/MouseContainer";

import "./App.css";

class App extends React.Component {
  public render() {
    return (
      <MouseContainer className="app">
        <div className="map-container">
          <Map cellSize={32} gridSize={16} />
        </div>
      </MouseContainer>
    );
  }
}

export default App;
