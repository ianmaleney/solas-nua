<script>
  export let paused, audioElement;

  const handlePlay = (e) => {
    let t = audioElement;
    if (t.paused) {
      t.play();
    } else {
      t.pause();
    }
  };
</script>

<svg
  version="1.1"
  id="playpause"
  xmlns="http://www.w3.org/2000/svg"
  x="0"
  y="0"
  viewBox="-50 -50 782 782"
  xml:space="preserve"
  class={paused ? "paused" : ""}
  on:click={handlePlay}
>
  <path
    d="M341 5a334.1 334.1 0 01237.6 98.4A334.4 334.4 0 01677 341a334.1 334.1 0 01-98.4 237.6A334.4 334.4 0 01341 677a334.1 334.1 0 01-237.6-98.4A334.4 334.4 0 015 341a334.1 334.1 0 0198.4-237.6A334.4 334.4 0 01341 5m0-5a341 341 0 100 682 341 341 0 000-682z"
    id="circle"
  />
  <path
    id="play"
    d="M199.4 132.2l190.6 110 170.6 98.6v.4L370 451.2l-170.6 98.6-.4.2V133"
  />
  <g id="pause">
    <path d="M199 132h132v418H199zM351 132h132v418H351z" />
  </g></svg
>

<style>
  #playpause {
    width: 45px;
    height: 45px;
  }
  #playpause:hover {
    cursor: pointer;
  }
  #circle {
    stroke: #4f4950;
    stroke-width: 1rem;
  }

  #play,
  #pause {
    transform: scale(0.9);
    transform-origin: center;
    fill: #4f4950;
  }

  #playpause:hover #play,
  #playpause:hover #pause {
    fill: #736b1e;
  }
  #playpause:hover #circle {
    stroke: #736b1e;
  }
  #play {
    opacity: 0;
  }

  #pause {
    opacity: 1;
  }
  .paused > #pause {
    opacity: 0;
  }
  .paused > #play {
    opacity: 1;
  }
</style>
