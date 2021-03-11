<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";

  import ArticleHeader from "../../components/ArticleHeader.svelte";
  import AudioPlayer from "../../components/AudioPlayer.svelte";

  let audioActive = false;
</script>

<div
  class="poem-wrapper"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <section class="half">
    <ArticleHeader
      title="The Conjuring"
      author="Nidhi Zak/Aria Eipe"
      bind:audioActive
    />
    <AudioPlayer
      src="/assets/audio/nidhi-michael.mp3"
      active={audioActive}
      credits={"Read by Nidhi Zak/Aria Eipe & Michael Dooley."}
    />
    <div class="text">
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

      <p>
        how they’ll swear you loved<br />
        but one of us, singular, true:<br />
        balking, bridled, only one —<br />
        brother standing before you.
      </p>
    </div>
  </section>
  <section class="half">
    <ArticleHeader
      title="Dubh Sainglend to Liath Macha, on Cú Chulainn’s Death"
      author="Michael Dooley"
      bind:audioActive
    />
    <AudioPlayer
      src="/assets/audio/nidhi-michael.mp3"
      active={audioActive}
      credits={"Read by Nidhi Zak/Aria Eipe & Michael Dooley."}
    />
    <div class="text wide">
      <p>
        You were first from the shore of her, the dam who slipped us in the
        dark; <br />
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
        That shape aroused in the wine that spilled three times, or in the woman
        at the crossing ford, <br />
        all sorrows and spoiled armour, who wept he was to die? Was her snort the
        gale that lunged
      </p>
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
        And when I dipped my shameful head to step beneath a mirror of the moon,
        your form went hurtling<br /> from the shimmer of my lips: turning in
        the bindweed root like an otter hunting crays; <br />
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
  </section>
</div>

<style lang="scss">
  .poem-wrapper {
    max-width: 1260px;
    margin: 0 auto;
    font-size: 1.35rem;
    line-height: 1.5;
    padding: 0 2vw 40vh;
    font-family: var(--body);
    display: grid;
  }
</style>
