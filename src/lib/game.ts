import { writable, get } from 'svelte/store';
import type { LevelKey } from './constants';
import { BOMB_VALUE, Levels } from './constants';
import { randomInt, countAroundBombs } from './utils';

export let selectLevel: LevelKey;
export let cells = writable<number[][]>([]);
export let flags = writable<boolean[][]>([]);
export let history = writable<boolean[][]>([]);


export const isBombCell = (row: number, col: number) => {
  let cellsArray = get(cells);
  return cellsArray[row][col] === BOMB_VALUE;
};

export const init = (level: LevelKey) => {
  const { bombs, row, col } = Levels[level];
  selectLevel = level;
  const newCells = Array.from({ length: row }, () => Array(col).fill(0));
  const newFlags = Array.from({ length: row }, () => Array(col).fill(false));
  const newHistory = Array.from({ length: row }, () => Array(col).fill(false));

  for (let i = 0; i < bombs; i++) {
    let bombRow, bombCol;
    do {
      bombRow = randomInt(row);
      bombCol = randomInt(col);
    } while (newCells[bombRow][bombCol] === BOMB_VALUE);
    newCells[bombRow][bombCol] = BOMB_VALUE;
  }

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (newCells[i][j] !== BOMB_VALUE) {
        newCells[i][j] = countAroundBombs(i, j, newCells);
      }
    }
  }

  cells.set(newCells);
  flags.set(newFlags);
  history.set(newHistory);
};

export const openZeroBlock = (row: number, col: number) => {
  let cellsArray = get(cells);
  let historyArray = get(history);

  if (row < 0 || row >= cellsArray.length || col < 0 || col >= cellsArray[0].length || historyArray[row][col]) {
    return;
  }

  historyArray[row][col] = true;

  history.set(historyArray);

  if (cellsArray[row][col] !== 0) {
    return;
  }
  openZeroBlock(row - 1, col - 1);
  openZeroBlock(row - 1, col);
  openZeroBlock(row - 1, col + 1);
  openZeroBlock(row, col - 1);
  openZeroBlock(row, col + 1);
  openZeroBlock(row + 1, col - 1);
  openZeroBlock(row + 1, col);
  openZeroBlock(row + 1, col + 1);
};

export const checkCollectBombs = () => {
  const level = Levels[selectLevel];
  let flagsArray = get(flags);
  let cellsArray = get(cells);

  let collectCount = 0;
  for (let i = 0; i < flagsArray.length; i++) {
    for (let j = 0; j < flagsArray[0].length; j++) {
      if (flagsArray[i][j]) {
        collectCount += cellsArray[i][j] === BOMB_VALUE ? 1 : 0;
      }
    }
  }
  return collectCount === level.bombs;
};

export const clickBlock = (row: number, col: number) => {
  let historyArray = get(history);

  if (historyArray.every(row => row.every(col => col === false))) {
    init(selectLevel);
  }

  let cellsArray = get(cells);

  const cell = cellsArray[row][col];

  if (cell == BOMB_VALUE) {
    console.error('GAMEOVER');
    return false;
  }
  openZeroBlock(row, col);
  return true;
};
