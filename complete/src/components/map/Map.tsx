import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Bounds, Point, StoreState, LayerName} from '../../types';
import {getCollisions} from '../../lib/collisions';
import {idgen} from '../../lib/idgen';
import {selectedTileTypeSelector, layersSelector} from '../../data/selectors';
import {tiles} from '../../tiles';
import {paintTile, eraseTile} from '../../data/action_creators';
import {MouseLayer} from '../layers/MouseLayer';
import {TilesLayer} from '../layers/TilesLayer';
import {CursorLayer} from '../layers/CursorLayer';
import './Map.css';

const LAYERS: Array<LayerName> = ['terrain', 'objects'];

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
    const snapSize =
      tile.size[0] < cellSize ? tile.size[0] : tile.size[1] < cellSize ? tile.size[1] : cellSize;

    // Create bounds, normalized to our 'snap size'.
    const bounds: Bounds = {
      x: Math.floor(position.x / snapSize) * snapSize,
      y: Math.floor(position.y / snapSize) * snapSize,
      width: tile.size[0],
      height: tile.size[1],
    };

    // Check for sprite collisions in same or higher layers.
    const level = LAYERS.indexOf(tile.layer);
    for (let i = level; i < LAYERS.length; i++) {
      const layer = this.props.layers[LAYERS[i]];
      getCollisions(layer.tiles, bounds).forEach(({id}) => {
        this.props.eraseTile(LAYERS[i], id);
      });
    }

    // Paint the new tile.
    this.props.paintTile(tile.layer, idgen(), tile.type, bounds);
  }

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
  {paintTile, eraseTile}
)(MapView);
