<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
  import { headerOpacity, themeColour, blob1 } from "../../store.js";
  import { onMount } from "svelte";

  onMount(() => {
    themeColour.update((c) => "#222");
    headerOpacity.update((o) => 0.9);
    blob1.update((b) => "rgba(240,240,240,0.4)");
    document.title =
      "View Source | 'I Know, But Only Just' – Ruby Wallis & Claire-Louise Bennett";
  });
</script>

<div class="video-wrapper">
  <iframe
    src="https://player.vimeo.com/video/523137788?autoplay=1&color=8a8a8a&title=0&byline=0&portrait=0&quality=4k"
    frameborder="0"
    allow="fullscreen; picture-in-picture"
    quality="4k"
    allowfullscreen
    title="00 Assembly_2"
    width="1920"
    height="1080"
  />
</div>

<header
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
  class="invert"
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
<div class="credits text invert">
  <p>
    <em>I Know, But Only Just</em> was first published in
    <a href="https://winterpapers.com/">Winter Papers</a>.
  </p>
</div>

<style type="text/scss">
  .invert {
    filter: invert(1);
  }
  .video-wrapper {
    padding: 66.67% 0 0 0;
    position: relative;
    max-height: 80vmin;
    max-width: 80vmax;
    margin: -10vh auto 0;
    @media (max-width: 720px) {
      margin-top: 0;
    }
    iframe {
      filter: drop-shadow(3px 6px 12px rgba(0, 0, 0, 0.25));
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
