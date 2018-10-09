import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import {LAYERS} from '../../constants';
import {tiles} from '../../tiles';
import {StoreState, LayerName, Tile as TileType} from '../../types';
import {selectTileType, unselectTileType} from '../../data/action_creators';
import {selectedTileTypeSelector} from '../../data/selectors';
import {Tile} from '../tile/Tile';
import './Toolbar.css';

// Toolbar tile size.
const TILE_SIZE = 32;

// Primary props.
interface Props {
  maxHeight: number;
}

// Props provided by the react-redux higher order component wrapper.
interface PropsFromState {
  selectedTileType: string;
  selectTileType: typeof selectTileType;
  unselectTileType: typeof unselectTileType;
}

// Toolbar internal state.
interface State {
  hoveredTileType: string | null;
}

/**
 * The toolbar component lets us select which tile type
 * we would like to paint with.
 */
class ToolbarView extends React.Component<Props & PropsFromState, State> {
  // Default component state.
  public state: State = {
    hoveredTileType: null,
  };

  /**
   * Return the tiles for a given layer.
   */
  private getLayerTiles(layerName: LayerName) {
    return Object.keys(tiles)
      .map(tileType => tiles[tileType])
      .filter(tile => tile.layer === layerName);
  }

  /**
   * Helper to check if a tile type is currently selected.
   */
  private isSelected(tileType: string) {
    return this.props.selectedTileType && this.props.selectedTileType === tileType;
  }

  /**
   * Return tile-specific styles.
   */
  private getTileStyle(tile: TileType) {
    return {
      transform: `scale(${TILE_SIZE / tile.size[0]})`,
    };
  }

  private handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({hoveredTileType: e.currentTarget.getAttribute('data-tile-type')});
  };

  private handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({hoveredTileType: null});
  };

  /**
   * Handle a tile click event and toggle our selected tile.
   */
  private handleClickTile = (tileType: string, id: string) => {
    if (this.isSelected(tileType)) {
      this.props.unselectTileType();
    } else {
      this.props.selectTileType(tileType);
    }
  };

  render() {
    return (
      <div className="toolbar" style={{maxHeight: this.props.maxHeight}}>
        <div className="layers">
          {LAYERS.map(layerName => (
            <div key={layerName} className="tiles">
              <div className="layer-name">{layerName}</div>
              {this.getLayerTiles(layerName).map(tile => (
                <div
                  key={tile.tileType}
                  data-tile-type={tile.tileType}
                  className={cx('tile-button', {
                    'tile-button--selected': this.isSelected(tile.tileType),
                  })}
                  onMouseOver={this.handleMouseOver}
                  onMouseOut={this.handleMouseOut}
                >
                  <Tile
                    id={`toolbar-${tile.tileType}`}
                    style={this.getTileStyle(tile)}
                    tileType={tile.tileType}
                    onClick={this.handleClickTile}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="preview">
          {this.state.hoveredTileType ? (
            <div className="name">{this.state.hoveredTileType}</div>
          ) : null}
          {this.state.hoveredTileType ? (
            <Tile id={`toolbar-preview`} tileType={this.state.hoveredTileType} />
          ) : null}
        </div>
      </div>
    );
  }
}

/**
 * Wrap the toolbar component with a react-redux connect()
 * higher-order-component. This subscribes to store changes
 * and pulls in the selected tile. It also binds the select
 * and unselect action creators.
 */
export const Toolbar = connect(
  (state: StoreState, props: Props) => {
    return {
      selectedTileType: selectedTileTypeSelector(state, props),
    };
  },
  {selectTileType, unselectTileType}
)(ToolbarView);
