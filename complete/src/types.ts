export interface Point {
  x: number;
  y: number;
}

export type LayerColumns = Readonly<{
  [key: number]: Readonly<{
    updated: number;
    rows: Readonly<{
      [key: number]: Readonly<{
        sheet: string;
        sprite: string;
      }>;
    }>;
  }>;
}>;

export interface Layer {
  name: string;
  columns: LayerColumns;
}

export interface SpriteSheet {
  name: string;
  url: string;
  defaults: SpriteAttrs;
  sprites: {
    [key: string]: SpriteAttrs;
  };
}

export interface SpriteAttrs {
  className?: string;
  w?: number;
  h?: number;
}
