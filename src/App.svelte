<script>
  import { onMount } from "svelte";
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
</script>

<Router {url}>
  <Blobs />
  <div class="overlay" />
  <header>
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

<style>
  :global(:root) {
    --serif: le-monde-livre-classic-byol, Cambria, Cochin, Georgia, Times,
      "Times New Roman", serif;
    --body: adobe-garamond-pro, Georgia, Times, "Times New Roman", serif;
  }
  :global(body) {
    font-family: var(--serif);
  }
  .overlay {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #e4d4c5;
    pointer-events: none;
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
    background: linear-gradient(
      180deg,
      #e4d4c5 60%,
      rgba(255, 255, 255, 0) 100%
    );
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
    margin: 15vh 0;
  }
</style>
