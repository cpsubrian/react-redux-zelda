import * as React from 'react';
import * as cx from 'classnames';
import {getSpriteAttrs} from '../../sprites';
import {Sprite} from '../sprite/Sprite';
import './CursorLayer.css';

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

    if (withinMap) {
      let width = 16;
      let height = 16;

      if (selected && selected.sheet && selected.sprite) {
        const spriteAttrs = getSpriteAttrs(selected.sheet, selected.sprite);
        if (spriteAttrs && spriteAttrs.w && spriteAttrs.h) {
          width = spriteAttrs.w;
          height = spriteAttrs.h;
        }
      }

      return {
        top: Math.floor(mouseY / height) * height,
        left: Math.floor(mouseX / width) * width,
        width,
        height,
      };
    } else {
      return {
        display: 'none',
      };
    }
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
