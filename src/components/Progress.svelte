<script>
  import { afterUpdate } from "svelte";

  export let elapsed, audioElement;

  const seek = (e) => {
    let o = e.offsetX;
    let w = e.target.getBoundingClientRect().width;
    let px = o / w;
    let d = audioElement.duration;
    let s = d * px;
    audioElement.currentTime = s;
  };

  afterUpdate(() => {
    document.querySelector(".slider").style.width = `${elapsed * 100}%`;
  });
</script>

<div class="progress" on:click={seek}>
  <div class="slider" width={elapsed} />
</div>

<style>
  .progress {
    width: 40vw;
    height: 4px;
    min-width: 200px;
    position: relative;
    background-color: #4f4950;
    margin: 0 10px;
  }
  .progress:hover {
    cursor: pointer;
  }
  .slider {
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    background-color: #736b1e;
  }
</style>
