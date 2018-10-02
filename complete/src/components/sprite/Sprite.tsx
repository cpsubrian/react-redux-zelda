import * as React from 'react';
import * as cx from 'classnames';
import {sprites} from '../../sprites';
import './Sprite.css';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  sheet: string;
  sprite: string;
}

export class Sprite extends React.PureComponent<Props, {}> {
  private getSpriteStyles = () => {
    const spriteSheet = sprites[this.props.sheet];
    return {
      ...(this.props.style || {}),
      backgroundImage: `url(${spriteSheet.url})`,
    };
  };
  render() {
    const spriteSheet = sprites[this.props.sheet];
    return (
      <div
        className={cx(
          'sprite',
          `sprite-${spriteSheet.name}`,
          `sprite-${spriteSheet.name}--${this.props.sprite}`,
          this.props.className
        )}
        style={this.getSpriteStyles()}
      />
    );
  }
}
