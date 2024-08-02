export const randomInt = (max: number) => Math.floor(Math.random() * max);

export const countAroundBombs = (row: number, col: number, cells: number[][]) => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  return directions.reduce((result, [dx, dy]) => {
    if (row + dx >= 0 && col + dy >= 0 && row + dx < cells.length && col + dy < cells[0].length && cells[row + dx][col + dy] === -2) {
      result++;
    }
    return result;
  }, 0);
};

