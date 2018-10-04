import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Point, TileInstance, StoreState} from '../../types';
import {idgen} from '../../lib/idgen';
import {selectedTileTypeSelector} from '../../data/selectors';
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
}

interface PropsFromDispatch {
  paintTile: typeof paintTile;
  eraseTile: typeof eraseTile;
}

interface State {
  isPainting: boolean;
}

class MapView extends React.PureComponent<Props & PropsFromState & PropsFromDispatch, {}> {
  public state: State = {
    isPainting: false,
  };

  private paintTile(tileType: string, position: Point) {
    const {layer, size} = tiles[tileType];

    // Create a new tile instance.
    const tile: TileInstance = {
      id: idgen(),
      tileType,
      bounds: {
        ...position,
        width: size[0],
        height: size[1],
      },
      edges: {},
    };

    // Paint the new tile.
    this.props.paintTile(layer, tile);
  }

  private handleCursorDown = (position: Point) => {
    if (this.props.selectedTileType) {
      this.setState({isPainting: true});
      this.paintTile(this.props.selectedTileType, position);
    }
  };

  private handleCursorUp = (position: Point) => {
    this.setState({isPainting: false});
  };

  private handleCursorMove = (position: Point) => {
    if (this.state.isPainting && this.props.selectedTileType) {
      this.paintTile(this.props.selectedTileType, position);
    }
  };

  private handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({isPainting: false});
  };

  public render() {
    return (
      <div className="map" onMouseLeave={this.handleMouseLeave}>
        <div
          className="layers"
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
        >
          <TilesLayer name="terrain" />
          <TilesLayer name="objects" />
          <MouseListener>
            {position => (
              <CursorLayer
                position={position}
                cellSize={this.props.cellSize}
                selectedTileType={this.props.selectedTileType}
                onCursorDown={this.handleCursorDown}
                onCursorUp={this.handleCursorUp}
                onCursorMove={this.handleCursorMove}
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
    };
  },
  {paintTile, eraseTile}
)(MapView);
