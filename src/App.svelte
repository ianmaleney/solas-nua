<script>
  import { onMount } from "svelte";
  import { themeColour, headerOpacity } from "./store.js";
  import { Router, Link, Route, navigate } from "svelte-routing";
  import Blobs from "./components/Blobs.svelte";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import Conjuring from "./routes/pieces/Conjuring.svelte";
  import Butterfly from "./routes/pieces/Butterfly.svelte";
  import OnlyJust from "./routes/pieces/OnlyJust.svelte";
  import Scarf from "./routes/pieces/Scarf.svelte";
  import SaintSisters from "./routes/pieces/SaintSisters.svelte";
  import Electric from "./routes/pieces/Electric.svelte";

  export let url;

  onMount(() => {
    navigate(window.location.pathname, { replace: true });
  });

  let bck, hc, ho;

  themeColour.subscribe((v) => (bck = v));
  headerOpacity.subscribe((o) => (ho = o));
  themeColour.subscribe(
    (v) =>
      (hc = `linear-gradient(180deg, ${v} 60%, rgba(255, 255, 255, 0) 100%)`)
  );
</script>

<Router {url}>
  <Blobs />
  <div class="overlay" style="background-color: {bck};" />
  <header id="app-header" style="background: {hc}; opacity: {ho}">
    <a href="/" class="title-link">View Source</a>
    <nav class="header-menu">
      <a href="/"><em>Index</em></a>
      <span>&nbsp;/&nbsp;</span>
      <Link to="/info"><em>About</em></Link>
    </nav>
  </header>
  <main>
    <Route path="/the-conjuring"><Conjuring /></Route>
    <Route path="/only-just"><OnlyJust /></Route>
    <Route path="/butterfly"><Butterfly /></Route>
    <Route path="/saint-sisters"><SaintSisters /></Route>
    <Route path="/a-scarf"><Scarf /></Route>
    <Route path="/getting-the-electric"><Electric /></Route>
    <Route path="/info"><About /></Route>
    <Route><Home /></Route>
  </main>
</Router>

<footer>
  <div class="footer-item">
    <p>
      View Source is a unique online publication, curated by Fallow Media and
      commissioned by Solas Nua, celebrating contemporary Irish literature at
      its most adventurous.
    </p>
  </div>
  <div class="footer-item">
    <a href="https://solasnua.org">
      <img
        class="footer-logo"
        src="/assets/images/solas-nua-logo.svg"
        alt="Solas Nua Logo"
      /></a
    >
    <a href="https://fallowmedia.com"
      ><img
        class="footer-logo"
        src="/assets/images/fallow-logo.png"
        alt="Fallow Media Logo"
      /></a
    >
  </div>
</footer>

<style lang="scss">
  :global(:root) {
    --serif: le-monde-livre-classic-byol, Cambria, Cochin, Georgia, Times,
      "Times New Roman", serif;
    --body: adobe-garamond-pro, Georgia, Times, "Times New Roman", serif;
  }
  :global(body) {
    font-family: var(--serif);
    max-width: 100vw;
    overflow-x: hidden;
  }
  .overlay {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    // background-color: #e4d4c5;
    pointer-events: none;
    transition: background-color 1s linear;
  }

  header {
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    padding: 0 3vw 30px;
    width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--serif);
    transition: all 1s linear;
  }
  .title-link {
    font-style: italic;
    color: #4f4950;
    text-decoration: none;
    margin: 20px 0;
    font-weight: 300;
    text-align: center;
  }
  main {
    position: relative;
    z-index: 10;
    margin: 10vh 0 0;
    min-height: 100vh;
  }

  footer {
    min-height: 320px;
    width: 100vw;
    margin-left: -8px;
    background-color: #4f4950;
    z-index: 25;
    position: relative;
    .footer-item {
      display: flex;
      justify-content: center;
      padding: 2rem 0;
      a {
        display: block;
        height: 80px;
        width: 80px;
        margin: 0 20px;
        &:hover {
          filter: invert(0);
        }
      }
    }
    .footer-logo {
      height: 80px;
      width: 80px;
      object-fit: contain;
      mix-blend-mode: overlay;
      filter: saturate(0) invert(1);
    }
    p {
      color: rgb(207, 207, 207);
      max-width: 480px;
      text-align: center;
      line-height: 1.45;
      font-family: var(--serif);
    }
  }
</style>
