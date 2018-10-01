import * as React from 'react';
import * as cx from 'classnames';
import {getSpriteAttrs} from '../../sprites';
import {Sprite} from '../sprite/Sprite';
import './CursorLayer.css';

const CELL_SIZE = 16;

interface Props {
  mouseX: number;
  mouseY: number;
  selected?: null | {
    sheet: string;
    sprite: string;
  };
}

export class CursorLayer extends React.PureComponent<Props, {}> {
  private getCursorStyle() {
    const {mouseX, mouseY, selected} = this.props;
    const withinMap = mouseX >= 0 && mouseY >= 0;

    if (withinMap && selected && selected.sheet && selected.sprite) {
      if (selected && selected.sheet && selected.sprite) {
        const spriteAttrs = getSpriteAttrs(selected.sheet, selected.sprite);
        if (spriteAttrs && spriteAttrs.w && spriteAttrs.h) {
          return {
            top: Math.floor(mouseY / CELL_SIZE) * CELL_SIZE,
            left: Math.floor(mouseX / CELL_SIZE) * CELL_SIZE,
            width: spriteAttrs.w,
            height: spriteAttrs.h,
          };
        }
      }
    }

    return {
      display: 'none',
    };
  }
  render() {
    return (
      <div className="layer cursor-layer">
        <div
          className={cx('cursor', {'has-sprite': !!this.props.selected})}
          style={this.getCursorStyle()}
        >
          {this.props.selected ? (
            <Sprite sheet={this.props.selected.sheet} sprite={this.props.selected.sprite} />
          ) : null}
        </div>
      </div>
    );
  }
}
