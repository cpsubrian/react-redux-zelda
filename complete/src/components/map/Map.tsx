import * as React from 'react';
import {connect} from 'react-redux';
import {Layer, Point} from '../../types';
import {StoreState} from '../../data/types';
import {selectedSelector, layersSelector} from '../../data/selectors';
import {paintSprite} from '../../data/action_creators';
import {getSpriteAttrs} from '../../sprites';
import {MouseLayer} from '../layers/MouseLayer';
import {SpriteLayer} from '../layers/SpriteLayer';
import {CursorLayer} from '../layers/CursorLayer';
import './Map.css';

interface Props {
  width: number;
  height: number;
}

interface PropsFromState {
  selected?: null | {
    sheet: string;
    sprite: string;
  };
  layers: {
    base: Layer;
  };
}

interface PropsFromDispatch {
  paintSprite: typeof paintSprite;
}

interface State {
  mouseX: number;
  mouseY: number;
  isPainting: boolean;
}

class MapView extends React.PureComponent<Props & PropsFromState & PropsFromDispatch, {}> {
  public state: State = {
    mouseX: -1,
    mouseY: -1,
    isPainting: false,
  };

  private handleMouseDown = (position: Point) => {
    this.setState({isPainting: true});
  };

  private handleMouseUp = (position: Point) => {
    this.setState({isPainting: false});
  };

  private handleMouseMove = (position: Point) => {
    this.setState({mouseX: position.x, mouseY: position.y});
  };

  private handleMouseLeave = (position: Point) => {
    this.setState({mouseX: -1, mouseY: -1});
  };

  private handleClick = (position: Point) => {
    if (this.props.selected) {
      const attrs = getSpriteAttrs(this.props.selected.sheet, this.props.selected.sprite);
      if (attrs && attrs.w && attrs.h) {
        this.props.paintSprite(
          {
            x: Math.floor(position.x / attrs.w) * attrs.w,
            y: Math.floor(position.y / attrs.h) * attrs.h,
          },
          this.props.selected.sheet,
          this.props.selected.sprite
        );
      }
    }
  };

  public render() {
    return (
      <div className="map">
        <div
          className="layers"
          style={{
            width: this.props.width,
            height: this.props.height,
          }}
        >
          <SpriteLayer {...this.props.layers.base} />
          <CursorLayer
            selected={this.props.selected}
            mouseX={this.state.mouseX}
            mouseY={this.state.mouseY}
          />
          <MouseLayer
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
            onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

export const Map = connect(
  (state: StoreState, props: Props) => {
    return {
      selected: selectedSelector(state, props),
      layers: layersSelector(state, props),
    };
  },
  {paintSprite}
)(MapView);
