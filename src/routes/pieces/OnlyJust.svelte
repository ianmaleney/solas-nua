<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
</script>

<div class="video-wrapper">
  <iframe
    src="https://player.vimeo.com/video/523137788?autoplay=1&color=8a8a8a&title=0&byline=0&portrait=0&quality=4k"
    frameborder="0"
    allow="autoplay quality='4k'; fullscreen; picture-in-picture"
    allowfullscreen
    title="00 Assembly_2"
  />
</div>

<header
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <h1>Πανδώρα</h1>
  <p>ꬱ</p>
  <p>Ruby &amp; Claire-Louise</p>
  <p>Ͼ Ϸ ϧ Ϣ Ϙ Φ Ϯ ω ͽ π α Ж Ђ Ќ Ϗ Ϩ Ϭ Д Ϫ</p>

  <p>
    Chloe Phil Sarah Mary Louise Róisín Suzanne Ruth Áine Jessamyn Alice Mary
    Michal Karole Kate Sarah Anne Vicky Deborah
  </p>
</header>

<style type="text/scss">
  .video-wrapper {
    padding: 66.67% 0 0 0;
    position: relative;
    margin: 0 auto;
    max-height: 80vmin;
    max-width: 80vmax;
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  header {
    display: flex;
    max-width: 740px;
    margin: 0 auto;
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
    p {
      font-family: var(--body);
      font-weight: 300;
      text-align: center;
      font-size: 1.4rem;
    }
  }
</style>
