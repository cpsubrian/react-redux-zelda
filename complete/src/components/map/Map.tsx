import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Bounds, Point, StoreState} from '../../types';
import {idgen} from '../../lib/idgen';
import {selectedTileTypeSelector, layersSelector} from '../../data/selectors';
import {tiles} from '../../tiles';
import {paintTile, eraseTile} from '../../data/action_creators';
import {MouseListener} from '../mouse/MouseListener';
import {TilesLayer} from '../layers/TilesLayer';
import {CursorLayer} from '../layers/CursorLayer';
import './Map.css';

interface Props {
  width: number;
  height: number;
  cellSize: number;
}

interface PropsFromState {
  selectedTileType: StoreState['selectedTileType'];
  layers: StoreState['layers'];
}

interface PropsFromDispatch {
  paintTile: typeof paintTile;
  eraseTile: typeof eraseTile;
}

interface State {
  isPainting: boolean;
  lastSnap: Bounds | null;
}

class MapView extends React.PureComponent<Props & PropsFromState & PropsFromDispatch, {}> {
  public state: State = {
    isPainting: false,
    lastSnap: null,
  };

  private paintTile(tileType: string, position: Point) {
    const {cellSize} = this.props;
    const tile = tiles[tileType];
    const snapSize =
      tile.size[0] < cellSize ? tile.size[0] : tile.size[1] < cellSize ? tile.size[1] : cellSize;

    // Create position, normalized to our 'snap size'.
    const bounds: Bounds = {
      x: Math.floor(position.x / snapSize) * snapSize,
      y: Math.floor(position.y / snapSize) * snapSize,
      width: tile.size[0],
      height: tile.size[1],
    };

    // If we haven't changed bounds since our last 'snap', bail.
    if (this.state.lastSnap && _.isEqual(this.state.lastSnap, bounds)) {
      return;
    }

    // Save the snap bounds.
    this.setState({lastSnap: bounds});

    // Paint the new tile.
    this.props.paintTile(tile.layer, idgen(), tile.tileType, bounds);
  }

  private handleMouseDown = (position: Point) => {
    this.setState({isPainting: true});
  };

  private handleMouseUp = (position: Point) => {
    this.setState({isPainting: false});
  };

  private handleMouseMove = (position: Point) => {
    if (this.state.isPainting && this.props.selectedTileType) {
      this.paintTile(this.props.selectedTileType, position);
    }
  };

  private handleMouseLeave = (position: Point) => {
    this.setState({isPainting: false});
  };

  private handleClick = (position: Point) => {
    if (this.props.selectedTileType) {
      this.paintTile(this.props.selectedTileType, position);
    }
  };

  public render() {
    return (
      <div className="map">
        <div
          className="layers"
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
        >
          <TilesLayer {...this.props.layers.terrain} />
          <TilesLayer {...this.props.layers.objects} />
          <MouseListener
            onMouseMove={this.handleMouseMove}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick}
          >
            {position => (
              <CursorLayer
                position={position}
                cellSize={this.props.cellSize}
                selectedTileType={this.props.selectedTileType}
              />
            )}
          </MouseListener>
        </div>
      </div>
    );
  }
}

export const Map = connect(
  (state: StoreState, props: Props) => {
    return {
      selectedTileType: selectedTileTypeSelector(state, props),
      layers: layersSelector(state, props),
    };
  },
  {paintTile, eraseTile}
)(MapView);
