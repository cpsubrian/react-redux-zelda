import * as React from 'react';
import * as cx from 'classnames';
import {tiles} from '../../tiles';
import {Sprite} from '../sprite/Sprite';
import './Tile.css';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  type: string;
  onClick?: (type: string) => void;
}

export class Tile extends React.PureComponent<Props, {}> {
  private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.type);
    }
  };

  render() {
    const tile = tiles[this.props.type];
    return (
      <div
        className={cx('tile', this.props.className)}
        style={this.props.style}
        onClick={this.props.onClick ? this.handleClick : undefined}
      >
        <Sprite {...tile.sprite} />
      </div>
    );
  }
}
