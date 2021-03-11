<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
</script>

<iframe
  src="https://player.vimeo.com/video/522269305?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
  width="1380"
  height="600"
  frameborder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowfullscreen
  title="00 Assembly_2"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
/>

<header
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <h1>I Know, But Only Just</h1>
  <h2>Ruby Wallis <em>&</em> Claire-Louise Bennett</h2>
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
  }
</style>
