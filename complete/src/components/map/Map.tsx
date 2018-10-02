import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Bounds, Point, StoreState} from '../../types';
import {idgen} from '../../lib/idgen';
import {Quadtree} from '../../lib/quadtree';
import {selectedTileTypeSelector, layersSelector} from '../../data/selectors';
import {tiles} from '../../tiles';
import {paintTile} from '../../data/action_creators';
import {MouseLayer} from '../layers/MouseLayer';
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
}

interface State {
  mouseX: number;
  mouseY: number;
  isPainting: boolean;
}

class MapView extends React.PureComponent<Props & PropsFromState & PropsFromDispatch, {}> {
  public state: State = {
    mouseX: -1,
    mouseY: -1,
    isPainting: false,
  };

  private paintTile(type: string, position: Point) {
    const {cellSize} = this.props;
    const tile = tiles[type];

    // Create normalized bounds.
    const bounds: Bounds = {
      x: Math.floor(position.x / cellSize) * cellSize,
      y: Math.floor(position.y / cellSize) * cellSize,
      width: tile.size[0],
      height: tile.size[1],
    };

    // Check for sprite collision and paint.
    if (!this.getCollision(tile.layer, bounds)) {
      this.props.paintTile(tile.layer, idgen(), tile.type, bounds);
    }
  }

  private getCollision = (layer: string, bounds: Bounds): Bounds | null => {
    const quadtree = this.createQuadtree(layer);
    const possible = quadtree.retrieve(bounds);

    for (let check of possible) {
      if (
        bounds.x + bounds.width <= check.x ||
        bounds.x >= check.x + check.width ||
        bounds.y + bounds.height <= check.y ||
        bounds.y >= check.y + check.height
      ) {
        continue;
      } else {
        return check;
      }
    }

    return null;
  };

  private createQuadtree = (layer: string) => {
    const quadtree = new Quadtree(
      {x: 0, y: 0, width: this.props.width, height: this.props.height},
      5,
      10
    );
    if (this.props.layers[layer]) {
      _.each(this.props.layers[layer].tiles, ({bounds, id, tile}) => {
        quadtree.insert({...bounds, id, tile});
      });
    }
    return quadtree;
  };

  private handleMouseDown = (position: Point) => {
    this.setState({isPainting: true});
  };

  private handleMouseUp = (position: Point) => {
    this.setState({isPainting: false});
  };

  private handleMouseMove = (position: Point) => {
    this.setState({mouseX: position.x, mouseY: position.y});

    // If we're painting, then paint the sprite.
    if (this.state.isPainting && this.props.selectedTileType) {
      this.paintTile(this.props.selectedTileType, position);
    }
  };

  private handleMouseLeave = (position: Point) => {
    this.setState({mouseX: -1, mouseY: -1});
  };

  private handleClick = (position: Point) => {
    // If we have a sprite selected, paint it.
    if (this.props.selectedTileType) {
      this.paintTile(this.props.selectedTileType, position);
      return;
    }

    // Otherwise, try to select a sprite under the cursor.
    ['objects', 'decorations', 'base'].forEach(layer => {
      const bounds = this.getCollision(layer, {...position, width: 1, height: 1});
      if (bounds) {
        // Select the sprite.
      }
    });
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
          <TilesLayer {...this.props.layers.base} />
          <TilesLayer {...this.props.layers.decorations} />
          <TilesLayer {...this.props.layers.objects} />
          <CursorLayer
            cellSize={this.props.cellSize}
            selectedTileType={this.props.selectedTileType}
            mouseX={this.state.mouseX}
            mouseY={this.state.mouseY}
          />
          <MouseLayer
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick}
          />
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
  {paintTile}
)(MapView);
