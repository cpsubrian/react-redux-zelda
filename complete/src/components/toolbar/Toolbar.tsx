import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import {StoreState} from '../../types';
import {selectTileType, unselectTileType} from '../../data/action_creators';
import {selectedTileTypeSelector} from '../../data/selectors';
import {Tile} from '../tile/Tile';
import './Toolbar.css';

interface PropsFromState {
  selectedTileType: string;
}

interface PropsFromDispatch {
  selectTileType: typeof selectTileType;
  unselectTileType: typeof unselectTileType;
}

class ToolbarView extends React.Component<PropsFromState & PropsFromDispatch, {}> {
  private layerClickHandlers: {
    [layerName: string]: (tileType: string) => void;
  } = {};

  private handleClickTile = (layer: string) => {
    if (!this.layerClickHandlers[layer]) {
      this.layerClickHandlers[layer] = tileType => {
        if (this.isSelected(tileType)) {
          this.props.unselectTileType();
        } else {
          this.props.selectTileType(tileType);
        }
      };
    }
    return this.layerClickHandlers[layer];
  };

  private isSelected(tileType: string) {
    return this.props.selectedTileType && this.props.selectedTileType === tileType;
  }

  render() {
    return (
      <div className="toolbar">
        <div className="tiles">
          <Tile
            className={cx({selected: this.isSelected('grass')})}
            type="grass"
            onClick={this.handleClickTile('base')}
          />
          <Tile
            className={cx({selected: this.isSelected('tree_trunk')})}
            type="tree_trunk"
            onClick={this.handleClickTile('objects')}
          />
          <Tile
            className={cx({selected: this.isSelected('tree')})}
            type="tree"
            onClick={this.handleClickTile('objects')}
          />
        </div>
      </div>
    );
  }
}

export const Toolbar = connect(
  (state: StoreState, props: {}) => {
    return {
      selectedTileType: selectedTileTypeSelector(state, props),
    };
  },
  {selectTileType, unselectTileType}
)(ToolbarView);
