import * as React from 'react';
import * as cx from 'classnames';
import '../../sprites'; // Side-effect to load CSS.
import './Sprite.css';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  sheet: string;
  sprite: string;
}

/**
 * Renders a simple 'sprite'. The sprite picks up styles
 * from a sprite-sheet via the side-effectful import above.
 *
 * A sprite is the basic unit of 'art' for our game map. Sprite
 * sheets contain many textures and the div is sized and styled
 * with background-position in order to only reveal one 'item'.
 */
export class Sprite extends React.PureComponent<Props, {}> {
  render() {
    return (
      <div
        className={cx(
          'sprite',
          `sprite-${this.props.sheet}`,
          `sprite-${this.props.sheet}--${this.props.sprite}`,
          this.props.className
        )}
        style={this.props.style}
      />
    );
  }
}
