import * as React from 'react';
import * as cx from 'classnames';
import {connectStub} from '../../lib/connectStub';
import {tiles} from '../../tiles';
import {Tile} from '../tile/Tile';
import './Toolbar.css';

// Props provided by the react-redux higher order component wrapper.
interface Props {
  selectedTileType: string | null;
  selectTileType: Function;
  unselectTileType: Function;
}

/**
 * The toolbar component lets us select which tile type
 * we would like to paint with.
 */
export class ToolbarView extends React.Component<Props, {}> {
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

export const Toolbar = connectStub(
  {
    selectedTileType: null,
    selectTileType: () => null,
    unselectTileType: () => null,
  },
  ToolbarView
);
