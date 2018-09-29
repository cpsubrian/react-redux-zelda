//import * as React from "react";
//import { Point } from "../../types";
//import { MouseContainer } from "../mouse-container/MouseContainer";
//import "./Map.css";
//
//interface Props {
//  cellSize: number;
//  gridSize: number;
//}
//
//interface State {
//  painting: boolean;
//  hovered: Point | null;
//  painted: { [key: string]: { [key: string]: boolean } };
//}
//
//export class Map extends React.Component<Props, State> {
//  public state: State = {
//    painting: false,
//    hovered: null,
//    painted: {}
//  };
//
//  private cellFromPos = (pos: Point): Point => {
//    return {
//      x: Math.floor(pos.x / this.props.cellSize),
//      y: Math.floor(pos.y / this.props.cellSize)
//    };
//  };
//
//  private getPaintedCells = (): Point[] => {
//    return Object.keys(this.state.painted).reduce((cells: Point[], xPos) => {
//      Object.keys(this.state.painted[xPos]).forEach(yPos => {
//        cells.push({ x: parseInt(xPos, 10), y: parseInt(yPos, 10) });
//      });
//      return cells;
//    }, []);
//  };
//
//  private paintCell = (cell: Point) => {
//    this.setState(state => {
//      state.painted[cell.x] = state.painted[cell.x] || {};
//      state.painted[cell.x][cell.y] = true;
//      return state;
//    });
//  };
//
//  private handleMouseMove = (pos: Point) => {
//    const { painting, hovered } = this.state;
//    const cell = this.cellFromPos(pos);
//    if (
//      !hovered ||
//      (hovered && (hovered.x !== cell.x || hovered.y !== cell.y))
//    ) {
//      this.setState({
//        hovered: cell
//      });
//      if (painting) {
//        this.paintCell(cell);
//      }
//    }
//  };
//  private handleMouseLeave = () => {
//    this.setState({ hovered: null });
//  };
//
//  private handleMouseDown = (pos: Point) => {
//    const cell = this.cellFromPos(pos);
//    this.setState({ painting: true });
//    this.paintCell(cell);
//  };
//
//  private handleMouseUp = (pos: Point) => {
//    const cell = this.cellFromPos(pos);
//    this.setState({ painting: false });
//    this.paintCell(cell);
//  };
//
//  public render() {
//    const { hovered } = this.state;
//    return (
//      <div
//        className="map"
//        style={{
//          width: this.props.cellSize * this.props.gridSize,
//          height: this.props.cellSize * this.props.gridSize
//        }}
//        onMouseLeave={this.handleMouseLeave}
//      >
//        {this.getPaintedCells().map(cell => (
//          <div
//            key={`painted-${cell.x}-${cell.y}`}
//            className="painted-cell"
//            style={{
//              width: this.props.cellSize,
//              height: this.props.cellSize,
//              top: cell.y * this.props.cellSize,
//              left: cell.x * this.props.cellSize
//            }}
//          />
//        ))}
//
//        {hovered && (
//          <div
//            className="hovered-cell"
//            style={{
//              width: this.props.cellSize,
//              height: this.props.cellSize,
//              top: hovered.y * this.props.cellSize,
//              left: hovered.x * this.props.cellSize
//            }}
//          />
//        )}
//      </div>
//    );
//  }
//}

export const Map = {};
