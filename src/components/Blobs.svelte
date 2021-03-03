<script>
  import { onMount } from "svelte";
  let b1, b2;

  // Should really do this with translation, not position.
  const move = (el) => {
    let x = Math.floor(Math.random() * 100);
    let y = Math.floor(Math.random() * 100);
    el.style.left = `${x}vw`;
    el.style.top = `${y}vh`;
    setTimeout(() => {
      move(el);
    }, 3000);
  };

  onMount(() => {
    // move(b1);
    // move(b2);
  });
</script>

<div class="blobs">
  <div class="blob" id="b1" bind:this={b1} />
  <div class="blob" id="b2" bind:this={b2} />
</div>

<style>
  .blob {
    position: fixed;
    width: 25vw;
    height: 25vw;
    border-radius: 50%;
    z-index: 2;
    filter: blur(80px);
    will-change: transform;
    transition: all 3s linear;
  }
  #b1 {
    background-color: #f2cb90;
    top: calc(100vh - 25vw);
    left: 35vw;
  }
  #b2 {
    background-color: #b9b4ba;
    top: calc(100vh - 35vw);
    left: 75vw;
  }
</style>
