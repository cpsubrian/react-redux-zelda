import * as React from 'react';
import * as cx from 'classnames';
import * as _ from 'lodash';
import {TileEdges} from '../../types';
import {tiles} from '../../tiles';
import {Sprite} from '../sprite/Sprite';
import './Tile.css';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  type: string;
  edges?: TileEdges;
  onClick?: (type: string) => void;
}

export class Tile extends React.Component<Props, {}> {
  shouldComponentUpdate(nextProps: Props) {
    return !(
      this.props.className === nextProps.className &&
      this.props.type === nextProps.type &&
      this.props.onClick === nextProps.onClick &&
      _.isEqual(this.props.style, nextProps.style) &&
      _.isEqual(this.props.edges, nextProps.edges)
    );
  }

  private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.onClick) {
      this.props.onClick(this.props.type);
    }
  };

  render() {
    const {className, onClick, style, type, edges} = this.props;
    const hasEdges = !!(edges && Object.keys(edges).length);
    const tile = tiles[type];
    return (
      <div
        className={cx('tile', className)}
        style={style}
        onClick={onClick ? this.handleClick : undefined}
      >
        <Sprite {...tile.sprite} />
        {hasEdges && (
          <div className="edges" style={{width: tile.size[0], height: tile.size[1]}}>
            {_.map(edges, (edgeType, edgeDir) => {
              return edgeType &&
                tile.edges &&
                tile.edges[edgeType] &&
                tile.edges[edgeType][edgeDir] ? (
                <Sprite
                  key={edgeDir}
                  className={`edge edge--${edgeDir}`}
                  {...tile.edges[edgeType][edgeDir]}
                />
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  }
}
