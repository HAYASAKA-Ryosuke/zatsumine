<script lang="ts">
  import { checkCollectBombs, cells, clickBlock, history, flags, init } from '../lib/game';
  import { Levels, BLOCK, EMPTY, BOMB, FLAG, EMPTY_VALUE, BOMB_VALUE } from '../lib/constants';
  import { get } from 'svelte/store';

  let gameOver = false;
  let selectedLevel;

  const startGame = () => {
    gameOver = false;
    init(selectedLevel);
  };

  const leftClick = (row: number, col: number) => {
    const result = clickBlock(row, col);
    if (!result) {
      gameOver = true;
      alert('You lose!');
    }
  };

  const handleRightClick = (event: MouseEvent, row: number, col: number) => {
    event.preventDefault();
    const newFlags = get(flags);
    newFlags[row][col] = !newFlags[row][col];
    flags.set(newFlags);
    if (checkCollectBombs()) {
      alert('You win!');
    }
  };
  $: flagCount = selectedLevel ? Levels[selectedLevel].bombs - $flags.flat().filter(flag => flag).length : 0;
</script>

<select bind:value={selectedLevel}>
  <option value="beginner">Beginner</option>
  <option value="intermediate">Intermediate</option>
  <option value="expert">Expert</option>
  <option value="alien">Alien</option>
</select>
<button on:click={startGame}>Start</button>
<p> flags: { flagCount } </p>

<table>
  {#each $cells as tr, row}
    <tr>
      {#each tr as td, col}
        {#if td === BOMB_VALUE && gameOver}
          <td>{BOMB}</td>
        {:else if td === EMPTY_VALUE && $history[row][col]}
          <td>{EMPTY}</td>
        {:else if td === BOMB_VALUE && $history[row][col]}
          <td>{BOMB}</td>
        {:else if $flags[row][col]}
          <td on:contextmenu={(e) => handleRightClick(e, row, col)}>{FLAG}</td>
        {:else if td === 0 && $history[row][col]}
          <td>{EMPTY}</td>
        {:else if $history[row][col]}
          <td>{td}</td>
        {:else}
          <td on:click={() => leftClick(row, col)} on:contextmenu={(e) => handleRightClick(e, row, col)}>{BLOCK}</td>
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
  cursor: pointer;
}
</style>

