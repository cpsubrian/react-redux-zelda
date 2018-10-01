export interface SpriteAttributes {
  url?: string;
  background?: string;
  bounds?: [number, number];
  off?: [number, number];
  pos?: [number, number];
  size?: [number, number];
  transform?: string;
}

export interface SpriteAnimation {
  rest?: number;
  start?: number;
  fps?: number;
  snake?: boolean;
  loop?: boolean;
}

export interface SpriteFrames {
  foo: string;
}

export interface SpriteSet {
  _attrs?: SpriteAttributes;
  _animation?: SpriteAnimation;
  _frames?: SpriteFrames;
  _children?: {
    [key: string]: SpriteSet;
  };
}

export type SpriteProps = {};

// tslint:disable-next-line:no-any
export type SpriteFrame = any;

// tslint:disable-next-line:no-any
export type Tile = any;
