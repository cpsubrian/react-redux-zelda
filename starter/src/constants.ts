import {LayerName} from './types';

export const CELL_SIZE = 16;
export const MAP_WIDTH = CELL_SIZE * (process.env.NODE_ENV === 'production' ? 48 : 16);
export const MAP_HEIGHT = CELL_SIZE * (process.env.NODE_ENV === 'production' ? 24 : 16);
export const LAYERS: Array<LayerName> = ['terrain', 'objects'];
