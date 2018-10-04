import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Bounds, Point, StoreState} from '../../types';
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
    const tile = tiles[tileType];

    // Create bounds for our new tile.
    const bounds: Bounds = {
      ...position,
      width: tile.size[0],
      height: tile.size[1],
    };

    // Paint the new tile.
    this.props.paintTile(tile.layer, idgen(), tile.tileType, bounds);
  }

  private handleMouseDown = (position: Point) => {
    this.setState({isPainting: true});
  };

  private handleMouseUp = (position: Point) => {
    this.setState({isPainting: false});
  };

  private handleCursorMove = (position: Point) => {
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
          <TilesLayer name="terrain" />
          <TilesLayer name="objects" />
          <MouseListener
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseLeave}
          >
            {position => (
              <CursorLayer
                position={position}
                cellSize={this.props.cellSize}
                selectedTileType={this.props.selectedTileType}
                onCursorMove={this.handleCursorMove}
                onClick={this.handleClick}
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
