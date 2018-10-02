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
