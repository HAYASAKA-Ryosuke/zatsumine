<script lang="ts">
  const BLOCK = '壁'
  const BLOCK_VALUE = -4
  const EMPTY = ' ';
  const EMPTY_VALUE = -1
  const BOMB = '爆';
  const BOMB_VALUE = -2
  const FLAG = '旗';
  const FLAG_VALUE = -3
  const levels = {'beginner': {bombs: 10, row:  9, col: 9}, }
  let selectLevel = ''
  let clickFlagState = false
  let cells = []
  let flags = []
  let history = []

  const randomInt = (max: number) => {
    return Math.floor(Math.random() * max)
  }
  const countAroundBombs = (row, col, cells) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]
    let result = 0
    for (let i = 0; i < directions.length; i++) {
      const x = directions[i][0]
      const y = directions[i][1]
      if (row + x >= 0 && col + y >= 0 && row + x < cells.length && col + y < cells.length && cells[row + x][col + y] === BOMB_VALUE) {
        result++
      }
    }
    return result
  }
  const isBombCell = (row: number, col: number) => {
    return cells[row][col] === BOMB_VALUE
  }
  const init = (level: string) => {
    const {bombs, row, col} = levels[level]
    selectLevel = level
    for (let i = 0; i < row; i++) {
      const cols = []
      for (let j = 0; j < col; j++){
        cols.push(0)
      }
      cells.push(cols)
      flags.push(cols.map(col => false))
      history.push(cols.map(col => false))
    }
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (!isBombCell(i, j)) {
          cells[i][j] = 0
        }
      }
    }
  }
  const openZeroBlock = (row, col) => {
    if (row < 0 || row >= cells.length || col < 0 || col >= cells[0].length) {
      return;
    }
    if (history[row][col]) {
      return;
    }
    history[row][col] = true;
    if (cells[row][col] !== 0) {
      return;
    }
    openZeroBlock(row - 1, col - 1)
    openZeroBlock(row - 1, col)
    openZeroBlock(row - 1, col + 1)
    openZeroBlock(row, col - 1)
    openZeroBlock(row, col + 1)
    openZeroBlock(row + 1, col - 1)
    openZeroBlock(row + 1, col)
    openZeroBlock(row + 1, col + 1)
  }

  const putBombs = (row: number, col: number) => {
    const level = levels[selectLevel]
    let bombCount = 0;
    while (bombCount < level.bombs) {
      const bombRow = randomInt(level.row)
      const bombCol = randomInt(level.col)
      if (cells[bombRow][bombCol] === -1 || (row === bombRow && col === bombCol)) {
        continue
      }
      bombCount++
      cells[bombRow][bombCol] = BOMB_VALUE
    }

    for (let i = 0; i < level.row; i++) {
      for (let j = 0; j < level.col; j++) {
        if (!isBombCell(i, j)) {
          cells[i][j] = countAroundBombs(i, j, cells)
        }
      }
    }
  }

  const checkCollectBombs = () => {
    const level = levels[selectLevel]
    let collectCount = 0
    for (let i = 0; i < flags.length; i++) {
      for (let j = 0; j < flags[0].length; j++) {
        if (flags[i][j]) {
          collectCount += cells[i][j] === BOMB_VALUE ? 1 : 0
        }
      }
    }
    return collectCount === level.bombs
  }

  const clickBlock = (row: number, col: number) => {
    if (history.every((row) => row.every(col => col === false))) {
      putBombs(row, col)
    }
    const cell = cells[row][col]
    if (clickFlagState) {
      flags[row][col] = true
      if (checkCollectBombs()) {
        alert('clear!!')
      }
      return
    }

    if (cell == BOMB_VALUE) {
      console.error('GAMEOVER')
      return
    }
    openZeroBlock(row, col)
  };
</script>

<button on:click={() => init('beginner')}>start</button>
<button on:click={() => { clickFlagState ^= true }}>{clickFlagState ? 'normal' : FLAG}</button>
<p>{selectLevel !== '' ? levels[selectLevel].bombs - flags.flat().filter(v => v === true).length : ''}</p>

<table>
  {#each cells as tr, row}
    <tr>
      {#each tr as td, col} 
        {#if td === EMPTY_VALUE && history[row][col]}
          <td>{EMPTY}</td>
        {:else if td === BOMB_VALUE && history[row][col]}
          <td>{BOMB}</td>
        {:else if flags[row][col]}
          <td>{FLAG}</td>
        {:else if td === 0 && history[row][col]}
          <td>{EMPTY}</td>
        {:else if history[row][col]}
          <td>{td}</td>
        {:else}
          <td on:click={() => clickBlock(row, col)}>{BLOCK}</td>
        {/if}
      {/each}
    </tr>
  {/each}
</table>
<style>
table {
  background-color: #f0f0f0;
  border-collapse: collapse;
}
tr td {
  border: 1px solid black;
  width: 30px;
  height: 30px;
  text-align: center;
}
</style>
