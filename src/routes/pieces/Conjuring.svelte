<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
  import { onMount } from "svelte";

  import { themeColour, headerOpacity, blob1 } from "../../store.js";

  onMount(() => {
    themeColour.update((theme) => "#fff");
    headerOpacity.update((o) => 0.5);
    blob1.update((c) => "#c16a7cb5");
  });

  import AudioPlayer from "../../components/AudioPlayer.svelte";
</script>

<div class="video-wrapper">
  <iframe
    src="https://player.vimeo.com/video/523755168?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
    width="1920"
    height="1080"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
    title="Mystic - Video (B_W).mov"
  />
</div>

<div
  class="poem-wrapper nt"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <div class="text t1">
    <div class="poem-header">
      <h1>The Conjuring</h1>
      <h2>Nidhi Zak/Aria Eipe</h2>
    </div>
    <p>
      how a horse, or more, rose<br />
      from the water, still and gray<br />
      as a lake how could they know<br />
      the truth: an ambush of snow
    </p>

    <p>
      how the crane called to its kin<br />
      faint, auriga moving through<br />
      a home, stranger, a shadow<br />
      falling low across the limen
    </p>

    <p>
      how a mare stood sentinel<br />
      by the door, wise eyes wide<br />
      unblinking foaling sprawling<br />
      twin kings, a flagstone floor
    </p>
  </div>
  <img src="assets/images/y3.jpg" class="poem-image y2" alt="Mountain" />
  <div class="text t2">
    <p>
      how we bore your temper wild<br />
      spur upon our backs a man<br />
      hounded, as our mother yet<br />
      outruns us, how she stuns us
    </p>

    <p>
      with her pain, mooned belly<br />
      heaving life, sharp her cries<br />
      cursing their men days five<br />
      lineal nine across the line
    </p>

    <p>
      how the birds shift beneath<br />
      lust’s gaze, how they turned<br />
      on you, swift as a whipping<br />
      boy caught in a bind of rage
    </p>

    <p>
      how they trembled, the fury<br />
      filled sprites as you suffered<br />
      the life you were denied then<br />
      married to the envy of a bride
    </p>
  </div>
  <img src="assets/images/y5.jpg" class="poem-image y5" alt="Mountain" />
  <div class="text t3">
    <p>
      how they’ll swear you loved<br />
      but one of us, singular, true:<br />
      balking, bridled, only one —<br />
      brother standing before you.
    </p>
  </div>
</div>

<div class="player-wrapper">
  <AudioPlayer
    src="/assets/audio/nidhi-michael.mp3"
    active={true}
    credits={"Read by Nidhi Zak/Aria Eipe & Michael Dooley."}
  />
</div>

<div class="poem-wrapper mt">
  <div class="text wide t4">
    <div class="poem-header">
      <h1>Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death</h1>
      <h2>Michael Dooley</h2>
    </div>
    <p>
      You were first from the shore of her, the dam who slipped us in the dark; <br
      />
      who slung like coin her womb’s worth at the door, left us to weave our tongues<br
      />
      in each other’s eyes; to lick the water from our backs, the Moorhen at our
      mouths. <br />
      I smelled her once in fog, the night the sounds of war split beyond the fort
      — <br />
      trills of curlew magicked into cries of slaughtered men, wind-tap of branches
      <br />
      shaped to clanging blades. And when they saddled us and led us<br />
      to the Valley of the Deaf, we tasted her on grasses, in the downwind rot
      <br />
      of that hooked and sweet-flowered tree; heard her heave in the draws of river,
      <br />
      her groan in pushing us from pools — white cascades popping at the falls
      <br />
      our birth-bleached hooves. Was she in the blood that let from your eye?
      <br />
      That shape aroused in the wine that spilled three times, or in the woman at
      the crossing ford, <br />
      all sorrows and spoiled armour, who wept he was to die? Was her snort the gale
      that lunged
    </p>
  </div>
  <img src="assets/images/y4.jpg" class="poem-image y4" alt="Mountain" />
  <div class="text wide t5">
    <p>
      a spear of some warrior’s spited kin, tore Láegh from his root like a
      soft-soiled yew, <br />
      ran him as a spring beneath our hocks? What could I but run, and Cú Chulainn
      torn <br />
      like a bag of meal, regarding with wonder that hole in himself — little rat
      rip, <br />
      clean as a saddler’s punch — like a blink in recollection, or a net laboured
      into shore <br />
      only to see it fat with his own catch, and picked by many hands? I left him
      for the sorceresses, <br />
      and salmon-snorted home; broke woodlands with my goosegrass breast, stamped
      crescents <br />
      in mud and shale, startled a hag turning rope in the dew, passed strangers’
      palisades, <br />
      and laughing children mad like calves at dusk, until I stood and shook before
      water in the glen. <br />
      And when I dipped my shameful head to step beneath a mirror of the moon, your
      form went hurtling<br /> from the shimmer of my lips: turning in the
      bindweed root like an otter hunting crays; <br />
      broken pottery of skulls a shingle beneath your feet, the thirty skins behind
      your teeth. <br />
      And I saw Cú Chulainn, too, pinned to the stone in his own twines, a sick-cloth
      fluttering <br />
      in wind, in current; saw the raven berry-picking hedges of his bursting sides.<br
      />
      I will leave this Milesian pit, this festered wound in water; will slip beneath
      the tail of it, <br />
      grow wings again and drown, before her.
    </p>
  </div>
  <img src="assets/images/y1.jpg" class="poem-image y1" alt="Mountain" />
</div>

<div class="credits text">
  <p><em>The Conjuring</em>, written by Nidhi Zak/Aria Eipe.</p>
  <p>
    <em>Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death</em>, written by
    Michael Dooley.
  </p>
  <p>
    Video <em>&</em> Images by
    <a href="https://www.artofthebrush.ie/">Yingge Xu</a>.
  </p>
</div>

<style lang="scss">
  .player-wrapper {
    margin: 200px 0;
  }
  .poem-wrapper {
    max-width: 1260px;
    margin: 0 auto;
    font-size: 1.35rem;
    line-height: 1.5;
    padding: 0 2vw;
    font-family: var(--body);
    display: grid;
    z-index: 2;
    position: relative;
    grid-template-columns: repeat(12, minmax(20px, 1fr));
    grid-gap: 10px;
    @media (max-width: 720px) {
      * {
        grid-column: 1 / -1 !important;
      }
      img {
        max-width: 100% !important;
      }
    }
    &.nt,
    &.mt {
      .text {
        margin: 0;
        z-index: 10;
        position: relative;
        padding: 0;
      }
    }
    .poem-image {
      margin: 2rem 0;
      filter: drop-shadow(3px 6px 12px rgba(0, 0, 0, 0.25));
    }
    .poem-header {
      h1 {
        margin: 0;
        font-style: italic;
      }
      h2 {
        margin: 0.5rem 0;
        font-size: 1.4rem;
        border-bottom: 1px solid #4f4950;
      }
    }
    .y2 {
      grid-row: 2;
      max-height: 400px;
      grid-column: 7 / 12;
    }
    .y5 {
      grid-row: 4;
      grid-column: 3 / 10;
      max-height: 800px;
    }
    .y4 {
      grid-row: 2;
      grid-column: 1 / -1;
      max-height: 600px;
    }
    .y1 {
      grid-row: 4;
      grid-column: 3 / 9;
      max-width: 740px;
    }
    .t1 {
      grid-column: 3 / 7;
      grid-row: 1;
    }
    .t2 {
      grid-column: 5 / 10;
      grid-row: 3;
    }
    .t3 {
      grid-column: 8 / -1;
      grid-row: 5;
    }
    .t4 {
      grid-column: 1 / 9;
      grid-row: 1;
    }
    .t5 {
      grid-column: 4 / -1;
      grid-row: 3;
    }
  }
  .video-wrapper {
    padding: 66.67% 0 0 0;
    position: relative;
    margin: -20vh auto 0;
    max-height: 80vmin;
    max-width: 80vmax;
    z-index: 100;
    @media (max-width: 960px) {
      margin-top: -10vh;
    }
    @media (max-width: 650px) {
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
  .credits {
    margin: 200px auto;
    border-top: 1px solid #4f4950;
    border-bottom: 1px solid #4f4950;
    padding-bottom: 0;
  }
</style>
