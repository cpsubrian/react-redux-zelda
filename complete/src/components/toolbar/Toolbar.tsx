import * as React from 'react';
import * as cx from 'classnames';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {selectSprite, unselectSprite} from '../../data/action_creators';
import {selectedSelector} from '../../data/selectors';
import {Sprite} from '../sprite/Sprite';
import './Toolbar.css';

interface PropsFromState {
  selected?: null | {
    sheet: string;
    sprite: string;
  };
}

interface PropsFromDispatch {
  selectSprite: typeof selectSprite;
  unselectSprite: typeof unselectSprite;
}

class ToolbarView extends React.Component<PropsFromState & PropsFromDispatch, {}> {
  private layerClickHandlers: {
    [key: string]: (sheet: string, sprite: string) => void;
  } = {};

  private handleClickSprite = (layer: string) => {
    if (!this.layerClickHandlers[layer]) {
      this.layerClickHandlers[layer] = (sheet: string, sprite: string) => {
        if (this.isSelected(sheet, sprite)) {
          this.props.unselectSprite();
        } else {
          this.props.selectSprite(sheet, sprite);
        }
      };
    }
    return this.layerClickHandlers[layer];
  };

  private isSelected(sheet: string, sprite: string) {
    return (
      this.props.selected &&
      this.props.selected.sheet === sheet &&
      this.props.selected.sprite === sprite
    );
  }

  render() {
    return (
      <div className="toolbar">
        <div className="base-tiles">
          <Sprite
            className={cx({selected: this.isSelected('overworld', 'grass')})}
            sheet="overworld"
            sprite="grass"
            onClick={this.handleClickSprite('base')}
          />
          <Sprite
            className={cx({selected: this.isSelected('overworld', 'tree_trunk')})}
            sheet="overworld"
            sprite="tree_trunk"
            onClick={this.handleClickSprite('objects')}
          />
          <Sprite
            className={cx({selected: this.isSelected('overworld', 'tree')})}
            sheet="overworld"
            sprite="tree"
            onClick={this.handleClickSprite('objects')}
          />
        </div>
      </div>
    );
  }
}

export const Toolbar = connect(
  createSelector(selectedSelector, selected => ({selected})),
  {selectSprite, unselectSprite}
)(ToolbarView);
