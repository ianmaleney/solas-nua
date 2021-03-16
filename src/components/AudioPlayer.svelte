<script>
  export let src, active, credits;
  import Progress from "./Progress.svelte";
  import PlayPause from "./PlayPause.svelte";

  let audioElement,
    currentTime,
    duration,
    paused = true;

  const formatTime = (time) => {
    function pad(n, width, z) {
      z = z || "0";
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join(z) + n;
    }
    let mm = pad(parseInt(time / 60), 2);
    let ss = pad(parseInt(time % 60), 2);
    return `${mm}:${ss}`;
  };
</script>

<div id="audioPlayer" class:active>
  <!-- svelte-ignore a11y-media-has-caption -->
  <audio
    id="a"
    {src}
    bind:duration
    bind:currentTime
    bind:paused
    bind:this={audioElement}
  />
  <div class="controls">
    <PlayPause {paused} {audioElement} />
    {#if credits}
      <span class="credits">{credits}</span>
    {/if}
    <div class="audiotime">
      <span class="elapsed"
        >{currentTime ? formatTime(currentTime) : "00:00"}</span
      >
      <Progress
        elapsed={currentTime ? currentTime / duration : 0}
        {audioElement}
      />
      <span class="duration">{formatTime(duration)}</span>
    </div>
  </div>
</div>

<style lang="scss">
  @keyframes playerIn {
    0% {
      transform: translateY(-200px);
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    75% {
      transform: translateY(0);
      opacity: 0.5;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  #audioPlayer {
    border-top: 1px solid #4f4950;
    border-bottom: 1px solid #4f4950;
    max-width: 740px;
    margin: 2rem auto;
    opacity: 0;
    padding: 1rem 0;
    transform: translateY(-200px);
    transform-origin: top;
    &.active {
      animation: playerIn 0.6s linear;
      animation-fill-mode: forwards;
    }
  }
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .credits {
    margin: 8px 0 5px 0;
  }
  .audiotime {
    display: flex;
    align-items: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 0.75rem;
  }
</style>
