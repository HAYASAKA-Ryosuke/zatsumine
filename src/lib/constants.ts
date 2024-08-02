export const BLOCK = '壁';
export const BLOCK_VALUE = -4;
export const EMPTY = ' ';
export const EMPTY_VALUE = -1;
export const BOMB = '爆';
export const BOMB_VALUE = -2;
export const FLAG = '旗';
export const FLAG_VALUE = -3;

export type LevelKey = 'beginner' | 'intermediate' | 'expert' | 'alien';
export const Levels: Record<LevelKey, { bombs: number; row: number; col: number }> = {
  beginner: { bombs: 10, row: 9, col: 9 },
  intermediate: { bombs: 40, row: 16, col: 16 },
  expert: { bombs: 99, row: 30, col: 16 },
  alien: { bombs: 2000, row: 100, col: 100 },
};
