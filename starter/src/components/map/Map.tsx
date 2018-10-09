import * as React from 'react';
import * as _ from 'lodash';
import {connectStub} from '../../lib/connectStub';
import {Point, TileInstance} from '../../types';
import {idgen} from '../../lib/idgen';
import {tiles} from '../../tiles';
import {MouseListener} from '../mouse/MouseListener';
import {TilesLayer} from '../layers/TilesLayer';
import {CursorLayer} from '../layers/CursorLayer';
import './Map.css';

// Primary input props.
interface Props {
  width: number;
  height: number;
  cellSize: number;
  selectedTileType: string | null;
  paintTile: Function;
  eraseTile: Function;
}

// We track the current 'painting' status in local state.
interface State {
  isPainting: boolean;
}

/**
 * The map view pulls together the cursor and tile layers. It is the
 * main UI responsible for painting our game scene.
 */
export class MapView extends React.PureComponent<Props, {}> {
  public state: State = {
    isPainting: false,
  };

  /**
   * Helper to paint a tile, calling the actionCreator that was bound
   * by the react-redux connect() wrapper.
   *
   * @param tileType The type of tile to paint.
   * @param position A position telling us where to paint the tile.
   */
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

  /**
   * On cursor down, we want to start 'painting' and also paint
   * the first tile under our current position.
   */
  private handleCursorDown = (position: Point) => {
    if (this.props.selectedTileType) {
      this.setState({isPainting: true});
      this.paintTile(this.props.selectedTileType, position);
    }
  };

  /**
   * On cursor up, we should stop painting.
   */
  private handleCursorUp = (position: Point) => {
    this.setState({isPainting: false});
  };

  /**
   * When the cursor moves, if we are currently painting then
   * we should paint another tile at the new position.
   */
  private handleCursorMove = (position: Point) => {
    if (this.state.isPainting && this.props.selectedTileType) {
      this.paintTile(this.props.selectedTileType, position);
    }
  };

  /**
   * When the mouse leaves the map, stop painting.
   */
  private handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({isPainting: false});
  };

  /**
   * Map render function.
   */
  public render() {
    return (
      <div
        className="map"
        style={{
          width: this.props.width,
          height: this.props.height,
        }}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="layers">
          {/* Render the tile layers */}
          <TilesLayer name="terrain" />
          <TilesLayer name="objects" />

          {/* Wrap the cursor layer in a mouse listener. The MouseListern
              component uses the 'render props' pattern to update its
              children without forcing any parent levels to re-render. */}
          <MouseListener>
            {position => (
              <CursorLayer
                position={position}
                cellSize={this.props.cellSize}
                tileType={this.props.selectedTileType}
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

// We'll be connecting this to our Redux store during
// the tutorial. This is just a stub to make typechecking
// pass.
export const Map = connectStub(
  {
    selectedTileType: null,
    paintTile: () => null,
    eraseTile: () => null,
  },
  MapView
);
