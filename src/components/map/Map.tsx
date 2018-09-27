import * as React from "react";
import { MouseOverlay, Position } from "../mouse-overlay/MouseOverlay";
import "./Map.css";

type Cell = [number, number];

interface Props {
  cellSize: number;
  gridSize: number;
}

interface State {
  hovered: Cell | null;
}

export class Map extends React.Component<Props, State> {
  public state = {
    hovered: null
  };

  private handleMouseMove = (pos: Position) => {
    const { hovered } = this.state;
    const cell: Cell = [
      Math.floor(pos.x / this.props.cellSize),
      Math.floor(pos.y / this.props.cellSize)
    ];
    if (!hovered || hovered[0] !== cell[0] || hovered[1] !== cell[1]) {
      this.setState({
        hovered: cell
      });
    }
  };
  private handleMouseLeave = () => {
    this.setState({ hovered: null });
  };

  private handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("down", this.state.hovered);
  };
  private handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("up", this.state.hovered);
  };

  public render() {
    const { hovered } = this.state;
    return (
      <div
        className="map"
        style={{
          width: this.props.cellSize * this.props.gridSize,
          height: this.props.cellSize * this.props.gridSize
        }}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
      >
        <MouseOverlay onMouseMove={this.handleMouseMove} />
        {hovered && (
          <div
            className="hovered-cell"
            style={{
              width: this.props.cellSize,
              height: this.props.cellSize,
              top: hovered[1] * this.props.cellSize,
              left: hovered[0] * this.props.cellSize
            }}
          />
        )}
      </div>
    );
  }
}
