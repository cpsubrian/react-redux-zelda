import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import {tiles} from '../../tiles';
import {StoreState} from '../../types';
import {selectTileType, unselectTileType} from '../../data/action_creators';
import {selectedTileTypeSelector} from '../../data/selectors';
import {Tile} from '../tile/Tile';
import './Toolbar.css';

// Props provided by the react-redux higher order component wrapper.
interface Props {
  selectedTileType: string;
  selectTileType: typeof selectTileType;
  unselectTileType: typeof unselectTileType;
}

/**
 * The toolbar component lets us select which tile type
 * we would like to paint with.
 */
class ToolbarView extends React.Component<Props, {}> {
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

  /**
   * Helper to check if a tile type is currently selected.
   */
  private isSelected(tileType: string) {
    return this.props.selectedTileType && this.props.selectedTileType === tileType;
  }

  render() {
    return (
      <div className="toolbar">
        <div className="tiles">
          {Object.keys(tiles).map(tileType => (
            <Tile
              key={tileType}
              id={`toolbar-${tileType}`}
              className={cx({selected: this.isSelected(tileType)})}
              tileType={tileType}
              onClick={this.handleClickTile}
            />
          ))}
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
  (state: StoreState, props: {}) => {
    return {
      selectedTileType: selectedTileTypeSelector(state, props),
    };
  },
  {selectTileType, unselectTileType}
)(ToolbarView);
