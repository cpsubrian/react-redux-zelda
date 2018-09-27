import * as React from "react";
import throttle from "raf-throttle";
import { Point } from "../../types";

interface Props {
  className: string;
  onMouseMove: (pos: Point) => void;
  onMouseDown: (pos: Point) => void;
  onMouseUp: (pos: Point) => void;
}

interface State {
  pos: Point;
}

export class MouseContainer extends React.Component<Props, State> {
  private el: HTMLDivElement | null = null;
  public state: State = {
    pos: { x: 0, y: 0 }
  };

  public componentDidMount() {
    window.addEventListener("resize", this.updateRect);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.updateRect);
  }

  private setEl = (el: HTMLDivElement | null) => {
    this.el = el;
    this.updateRect();
  };

  private updateRect = () => {
    if (this.el) {
      const rect = this.el.getBoundingClientRect();
      this.setState({ pos: { x: rect.left, y: rect.top } });
    }
  };

  private throttledMouseMove = throttle((mousePos: Point) => {
    this.props.onMouseMove({
      x: Math.max(mousePos.x - this.state.pos.x, 0),
      y: Math.max(mousePos.y - this.state.pos.y, 0)
    });
  });

  private handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.button);
    this.throttledMouseMove({ x: e.pageX, y: e.pageY });
  };

  private handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onMouseDown({
      x: Math.max(e.pageX - this.state.pos.x, 0),
      y: Math.max(e.pageY - this.state.pos.y, 0)
    });
  };

  private handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onMouseUp({
      x: Math.max(e.pageX - this.state.pos.x, 0),
      y: Math.max(e.pageY - this.state.pos.y, 0)
    });
  };

  public render() {
    return (
      <div
        ref={this.setEl}
        className={`${this.props.className} mouse-container`}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      />
    );
  }
}
