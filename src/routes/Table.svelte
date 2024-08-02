<script lang="ts">
  import { cells, clickBlock, history, flags } from '../lib/game';
  import { BLOCK, EMPTY, BOMB, FLAG, EMPTY_VALUE, BOMB_VALUE } from '../lib/constants';
</script>

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

