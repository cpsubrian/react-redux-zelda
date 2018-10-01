import * as React from 'react';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import {Quadtree} from '../../lib/quadtree';
import {Point, SpriteAttrs} from '../../types';
import {StoreState} from '../../data/types';
import {selectedSelector, layersSelector} from '../../data/selectors';
import {paintSprite} from '../../data/action_creators';
import {getSpriteAttrs} from '../../sprites';
import {MouseLayer} from '../layers/MouseLayer';
import {SpriteLayer} from '../layers/SpriteLayer';
import {CursorLayer} from '../layers/CursorLayer';
import './Map.css';

const CELL_SIZE = 16;

interface Props {
  width: number;
  height: number;
}

interface PropsFromState {
  selected?: null | {
    sheet: string;
    sprite: string;
  };
  layers: StoreState['layers'];
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

  private paintSprite(position: Point, sheet: string, sprite: string) {
    const attrs = getSpriteAttrs(sheet, sprite);
    if (attrs && attrs.w && attrs.h) {
      // Normalize position to cells.
      const pos = {
        x: Math.floor(position.x / CELL_SIZE) * CELL_SIZE,
        y: Math.floor(position.y / CELL_SIZE) * CELL_SIZE,
      };

      // Check for sprite collision and paint.
      if (!this.hasCollision(attrs, pos)) {
        this.props.paintSprite(attrs.layer!, pos, sheet, sprite);
      }
    }
  }

  private hasCollision = (attrs: SpriteAttrs, position: Point) => {
    const bounds = {x: position.x, y: position.y, width: attrs.w!, height: attrs.h!};
    const quadtree = this.createQuadtree(attrs.layer!);
    const possible = quadtree.retrieve(bounds);

    for (let check of possible) {
      if (
        bounds.x + bounds.width <= check.x ||
        bounds.x >= check.x + check.width ||
        bounds.y + bounds.height <= check.y ||
        bounds.y >= check.y + check.height
      ) {
        continue;
      } else {
        return true;
      }
    }

    return false;
  };

  private createQuadtree = (layer: string) => {
    const quadtree = new Quadtree(
      {x: 0, y: 0, width: this.props.width, height: this.props.height},
      5,
      10
    );
    if (this.props.layers[layer]) {
      _.each(this.props.layers[layer].columns, (col, x) => {
        _.each(col.rows, (row, y) => {
          const rowAttrs = getSpriteAttrs(row.sheet, row.sprite);
          if (rowAttrs) {
            quadtree.insert({
              x: parseInt(x, 10),
              y: parseInt(y, 10),
              width: rowAttrs.w,
              height: rowAttrs.h,
            });
          }
        });
      });
    }
    return quadtree;
  };

  private handleMouseDown = (position: Point) => {
    this.setState({isPainting: true});
  };

  private handleMouseUp = (position: Point) => {
    this.setState({isPainting: false});
  };

  private handleMouseMove = (position: Point) => {
    this.setState({mouseX: position.x, mouseY: position.y});
    if (this.state.isPainting && this.props.selected) {
      const {sheet, sprite} = this.props.selected;
      this.paintSprite(position, sheet, sprite);
    }
  };

  private handleMouseLeave = (position: Point) => {
    this.setState({mouseX: -1, mouseY: -1});
  };

  private handleClick = (position: Point) => {
    if (this.props.selected) {
      const {sheet, sprite} = this.props.selected;
      this.paintSprite(position, sheet, sprite);
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
          <SpriteLayer {...this.props.layers.decorations} />
          <SpriteLayer {...this.props.layers.objects} />
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
