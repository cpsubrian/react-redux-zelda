import * as React from 'react';
import throttle from 'raf-throttle';
import {Point} from '../../types';

interface Props {
  onMouseMove: (position: Point) => void;
  onMouseDown: (position: Point) => void;
  onMouseUp: (position: Point) => void;
  onMouseLeave: (position: Point) => void;
  onClick: (position: Point) => void;
}

interface State {
  bounds: Point;
}

export class MouseLayer extends React.PureComponent<Props, State> {
  private el: HTMLDivElement | null = null;
  public state: State = {
    bounds: {x: 0, y: 0},
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
    this.props.onMouseMove(this.eventToPosition(e));
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
    this.props.onMouseLeave(this.eventToPosition(e));
  };

  private handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onClick(this.eventToPosition(e));
  };

  public render() {
    return (
      <div
        ref={this.setEl}
        className="layer mouse-layer"
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
      />
    );
  }
}
