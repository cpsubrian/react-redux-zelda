import * as React from 'react';
import {Point} from '../../types';
import {BaseLayer} from '../layers/BaseLayer';
import {CursorLayer} from '../layers/CursorLayer';
import './Map.css';

interface Props {
  cellSize: number;
  width: number;
  height: number;
}

interface State {
  painting: boolean;
  hovered: Point | null;
  painted: {[key: string]: {[key: string]: boolean}};
}

export class Map extends React.Component<Props, State> {
  /*
  public state: State = {
    painting: false,
    hovered: null,
    painted: {},
  };

  private cellFromPos = (pos: Point): Point => {
    return {
      x: Math.floor(pos.x / this.props.cellSize),
      y: Math.floor(pos.y / this.props.cellSize),
    };
  };

  private getPaintedCells = (): Point[] => {
    return Object.keys(this.state.painted).reduce((cells: Point[], xPos) => {
      Object.keys(this.state.painted[xPos]).forEach(yPos => {
        cells.push({x: parseInt(xPos, 10), y: parseInt(yPos, 10)});
      });
      return cells;
    }, []);
  };

  private paintCell = (cell: Point) => {
    this.setState(state => {
      state.painted[cell.x] = state.painted[cell.x] || {};
      state.painted[cell.x][cell.y] = true;
      return state;
    });
  };

  private handleMouseMove = (pos: Point) => {
    const {painting, hovered} = this.state;
    const cell = this.cellFromPos(pos);
    if (!hovered || (hovered && (hovered.x !== cell.x || hovered.y !== cell.y))) {
      this.setState({
        hovered: cell,
      });
      if (painting) {
        this.paintCell(cell);
      }
    }
  };
  private handleMouseLeave = () => {
    this.setState({hovered: null});
  };

  private handleMouseDown = (pos: Point) => {
    const cell = this.cellFromPos(pos);
    this.setState({painting: true});
    this.paintCell(cell);
  };

  private handleMouseUp = (pos: Point) => {
    const cell = this.cellFromPos(pos);
    this.setState({painting: false});
    this.paintCell(cell);
  };
  */

  public render() {
    return (
      <div
        className="map"
        style={{
          width: this.props.cellSize * this.props.width,
          height: this.props.cellSize * this.props.height,
        }}
      >
        <div className="layers">
          <BaseLayer />
          <CursorLayer />
        </div>
      </div>
    );
  }
}
