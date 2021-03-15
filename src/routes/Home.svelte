<script>
  import { Link } from "svelte-routing";
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";

  import { onMount } from "svelte";

  import { themeColour } from "../store.js";

  onMount(() => {
    themeColour.update((theme) => "#e4d4c5");
  });
</script>

<nav
  id="home-nav"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <ul id="toc">
    <li>
      <Link to="/getting-the-electric"
        ><em>Getting The Electric</em>&nbsp;&middot;&nbsp;Louise Hegarty</Link
      >
    </li>
    <li>
      <Link to="/a-scarf"
        ><em>A Scarf</em>&nbsp;&middot;&nbsp;Doireann Ní Ghríofa</Link
      >
    </li>
    <li>
      <Link to="/saint-sisters"
        ><em>Saint Sisters And The Sea</em>&nbsp;&middot;&nbsp;Méabh de Brún</Link
      >
    </li>
    <li>
      <Link to="/butterfly"
        ><em>Butterfly</em>&nbsp;&middot;&nbsp;Colm O'Shea</Link
      >
    </li>
    <li>
      <Link to="/only-just"
        ><em>I Know, But Only Just</em>&nbsp;&middot;&nbsp;Ruby Wallis
        <em>&</em> Claire-Louise Bennett</Link
      >
    </li>
    <li>
      <Link to="/the-conjuring"
        ><em
          >The Conjuring / Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death</em
        >
        &middot Nidhi Zak/Aria Eipe <em>&</em> Michael Dooley</Link
      >
    </li>
  </ul>
</nav>

<style>
  #home-nav {
    max-width: 80vw;
    margin: 0 auto;
    padding-top: 5vh;
  }
  #toc {
    list-style: none;
    padding-left: 0;
  }
  #toc li {
    font-size: 1.5rem;
    font-family: le-monde-livre-classic-byol, Cambria, Cochin, Georgia, Times,
      "Times New Roman", serif;
    border-bottom: 1px solid #4f4950;
    padding: 1rem 0;
    line-height: 1.4;
  }
  #toc li:nth-child(1),
  #toc li:nth-child(6) {
    margin-left: 8rem;
  }
  #toc li:nth-child(2),
  #toc li:nth-child(5) {
    margin-left: 4rem;
  }
</style>
