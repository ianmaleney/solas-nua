<script>
  export let audioActive, title, author, page;
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
</script>

<header
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <h1>{title}</h1>
  <h2>{author}</h2>
  {#if !page}
    <div class="text-options">
      <button on:click={() => (audioActive = !audioActive)}>Listen</button>
      <button on:click={() => window.print()}>Print</button>
    </div>
  {/if}
</header>

<style type="text/scss">
  header {
    display: flex;
    max-width: 740px;
    margin: 2rem auto;
    flex-direction: column;
    h1 {
      text-align: center;
      font-size: 4.5rem;
      font-weight: 400;
      letter-spacing: 1px;
      font-style: italic;
      font-family: var(--serif);
      margin: 1.5rem 0;
    }
    h2 {
      font-family: var(--body);
      font-weight: 300;
      text-align: center;
      font-size: 2.4rem;
    }
    .text-options {
      display: flex;
      width: 100%;
      margin: 0 auto;
      border-top: 1px solid #4f4950;
      border-bottom: 1px solid #4f4950;
      align-items: center;
      button {
        flex: 1 0 50%;
        background-color: rgba(255, 255, 255, 0);
        border: none;
        color: #4f4950;
        margin-top: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
        &:hover {
          background-color: #4f4950;
          color: rgb(207, 207, 207);
          cursor: pointer;
        }
      }
    }
  }
</style>
