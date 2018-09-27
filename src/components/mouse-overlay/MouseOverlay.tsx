import * as React from "react";
import throttle from "raf-throttle";
import "./MouseOverlay.css";

export interface Position {
  x: number;
  y: number;
}

interface Props {
  onMouseMove: (pos: Position) => void;
}

interface State {
  pos: Position;
}

export class MouseOverlay extends React.Component<Props, State> {
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

  private throttledMouseMove = throttle((mousePos: Position) => {
    this.props.onMouseMove({
      x: mousePos.x - this.state.pos.x,
      y: mousePos.y - this.state.pos.y
    });
  });

  private handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    this.throttledMouseMove({ x: e.pageX, y: e.pageY });
  };

  public render() {
    return (
      <div
        ref={this.setEl}
        className="mouse-overlay"
        onMouseMove={this.handleMouseMove}
      />
    );
  }
}
