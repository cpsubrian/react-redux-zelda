import * as React from 'react';
import throttle from 'raf-throttle';
import {Point} from '../../types';

interface Props {
  className?: string;
  onMouseMove?: (position: Point) => void;
  children?: (position: Point) => JSX.Element;
}

interface State {
  bounds: Point;
  position: Point;
}

/**
 * The mouse listener component tracks mouse movement, normalizes
 * it against its bounding box, and 'updates' children via the
 * 'render props' pattern.
 */
export class MouseListener extends React.PureComponent<Props, State> {
  private el: HTMLDivElement | null = null;
  public state: State = {
    bounds: {x: 0, y: 0},
    position: {x: -1, y: -1},
  };

  /**
   * Listner for window resize events, since this will change the
   * bounding box of this element.
   */
  public componentDidMount() {
    window.addEventListener('resize', this.updateRect);
  }
  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateRect);
  }

  /**
   * Store a reference to our DOM element and calculate the
   * current bounding box.
   */
  private setEl = (el: HTMLDivElement | null) => {
    this.el = el;
    this.updateRect();
  };

  /**
   * Re-calculate our current bounding box and set it on state.
   */
  private updateRect = () => {
    if (this.el) {
      const rect = this.el.getBoundingClientRect();
      this.setState({bounds: {x: rect.left, y: rect.top}});
    }
  };

  /**
   * Normalize the position of the mouse aginast our bounding
   * box. E.g. if the mouse is at the top-left of our
   * DOM element, then we call that {x: 0, y:0}.
   *
   * @param e A mouse event fired by a mousemove event.
   */
  private eventToPosition(e: Partial<React.MouseEvent<HTMLDivElement>>): Point {
    return {
      x: Math.max(e.pageX! - this.state.bounds.x, 0),
      y: Math.max(e.pageY! - this.state.bounds.y, 0),
    };
  }

  /**
   * A throttled handler for mousemove events. This throttles based
   * on requestAnimationFrame via the raf-throttle library.
   *
   * We update the current mouse position (normalized to our bounds).
   */
  private throttledMouseMove = throttle((e: Partial<React.MouseEvent<HTMLDivElement>>) => {
    let position = this.eventToPosition(e);
    this.setState({position});
    if (this.props.onMouseMove) {
      this.props.onMouseMove(position);
    }
  });
  private handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    this.throttledMouseMove({pageX: e.pageX, pageY: e.pageY});
  };

  /**
   * Handle mouseleave events by resetting the current position to
   * be outside our bounds (negative).
   */
  private handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({position: {x: -1, y: -1}});
  };

  public render() {
    return (
      <div
        ref={this.setEl}
        className={this.props.className}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
      >
        {/* This renders children using the 'render props' pattern,
            invoking the children as a function with the
            current position */}
        {this.props.children ? this.props.children(this.state.position) : null}
      </div>
    );
  }
}
