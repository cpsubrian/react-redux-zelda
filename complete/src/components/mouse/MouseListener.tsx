import * as React from 'react';
import throttle from 'raf-throttle';
import {Point} from '../../types';

interface Props {
  className?: string;
  onMouseDown: (position: Point) => void;
  onMouseUp: (position: Point) => void;
  onMouseLeave: (position: Point) => void;
  children?: (position: Point) => JSX.Element;
}

interface State {
  bounds: Point;
  position: Point;
}

export class MouseListener extends React.PureComponent<Props, State> {
  private el: HTMLDivElement | null = null;
  public state: State = {
    bounds: {x: 0, y: 0},
    position: {x: -1, y: -1},
  };

  public componentDidMount() {
    window.addEventListener('resize', this.updateRect);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateRect);
  }

  private setEl = (el: HTMLDivElement | null) => {
    this.el = el;
    this.updateRect();
  };

  private updateRect = () => {
    if (this.el) {
      const rect = this.el.getBoundingClientRect();
      this.setState({bounds: {x: rect.left, y: rect.top}});
    }
  };

  private eventToPosition(e: Partial<React.MouseEvent<HTMLDivElement>>): Point {
    return {
      x: Math.max(e.pageX! - this.state.bounds.x, 0),
      y: Math.max(e.pageY! - this.state.bounds.y, 0),
    };
  }

  private throttledMouseMove = throttle((e: Partial<React.MouseEvent<HTMLDivElement>>) => {
    let position = this.eventToPosition(e);
    this.setState({position});
  });

  private handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    this.throttledMouseMove({pageX: e.pageX, pageY: e.pageY});
  };

  private handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onMouseDown(this.eventToPosition(e));
  };

  private handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onMouseUp(this.eventToPosition(e));
  };

  private handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({position: {x: -1, y: -1}});
    this.props.onMouseLeave(this.eventToPosition(e));
  };

  public render() {
    return (
      <div
        ref={this.setEl}
        className={this.props.className}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children ? this.props.children(this.state.position) : null}
      </div>
    );
  }
}
