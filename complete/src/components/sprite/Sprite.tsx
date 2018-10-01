import * as React from 'react';
import * as cx from 'classnames';
import {sprites} from '../../sprites';
import './Sprite.css';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  sheet: string;
  sprite: string;
  onClick?: (sheet: string, sprite: string) => void;
}

export class Sprite extends React.PureComponent<Props, {}> {
  private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.sheet, this.props.sprite);
    }
  };
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
        onClick={this.props.onClick ? this.handleClick : undefined}
      />
    );
  }
}
