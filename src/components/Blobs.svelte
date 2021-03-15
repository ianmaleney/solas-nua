<script>
  import { onMount } from "svelte";
  import { blob1, blob2 } from "../store.js";

  let blobColours = {
    bc1: "",
    bc2: "",
  };

  blob1.subscribe((v) => (blobColours.bc1 = v));
  blob2.subscribe((v) => (blobColours.bc2 = v));

  let b1, b2;

  // Should really do this with translation, not position.
  const move = (el) => {
    let x = Math.floor(Math.random() * 100);
    let y = Math.floor(Math.random() * 100);
    el.style.left = `${x}vw`;
    el.style.top = `${y}vh`;
    // setTimeout(() => {
    //   move(el);
    // }, 3000);
  };

  onMount(() => {
    // move(b1);
    // move(b2);
  });
</script>

<div class="blobs">
  <div
    class="blob"
    id="b1"
    bind:this={b1}
    style="background-color: {blobColours.bc1};"
  />
  <div
    class="blob"
    id="b2"
    bind:this={b2}
    style="background-color: {blobColours.bc2};"
  />
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
    top: calc(100vh - 25vw);
    left: 35vw;
  }
  #b2 {
    top: calc(100vh - 35vw);
    left: 75vw;
  }
</style>
