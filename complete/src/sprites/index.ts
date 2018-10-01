import {SpriteAttrs} from '../types';
import {overworld} from './overworld/overworld';

// Map of sprite sheets.
export const sprites = {
  overworld,
};

// Helper to get sprite attributes (merged with sheet defaults).
export const getSpriteAttrs = (sheet: string, sprite: string): SpriteAttrs | null => {
  const spriteSheet = sprites[sheet];
  if (spriteSheet) {
    if (spriteSheet.sprites[sprite]) {
      return {
        ...(spriteSheet.defaults || {}),
        ...spriteSheet.sprites[sprite],
      };
    }
  }
  return null;
};
