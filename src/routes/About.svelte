<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
</script>

<div
  class="text"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <h1>Irish Book Day: View Source</h1>
  <p>
    Expanding on our long tradition of providing Washington D.C. with free Irish
    books on St. Patrick’s Day, this year Solas Nua is staying green and
    producing another digital offering - online and available anywhere in the
    world to view on-screen, print-at-home, or even kick back and listen to.
  </p>
  <p>
    View Source is a unique online publication, curated by Fallow Media and
    commissioned by Solas Nua, celebrating contemporary Irish literature at its
    most adventurous.
  </p>
  <p>
    Working alongside six cutting-edge literary publications in Ireland today –
    The Stinging Fly, The Dublin Review, Gorse, Banshee, Winter Papers, and
    Fallow Media – View Source has invited writers and artists to reimagine
    stories, poems, and essays first made available in print.
  </p>
  <p>
    Taking advantage of the many possibilities of publishing on the internet,
    View Source presents each text in multiple ways, giving visitors the
    opportunity to choose how they want to experience each piece through unique
    on-screen design, creative audio, or a print-at-home publication.
  </p>
  <p>
    The temporary loss of bookstores and literary gatherings is just one of the
    many changes wrought by the Covid-19 pandemic. View Source uses this moment
    of confusion and crisis to ask what opportunities might lie hidden within
    our global shift to online spaces. By publishing this work digitally,
    contemporary Irish literature becomes accessible in new ways to new
    audiences, reaching people who might never otherwise have access to it. So
    what could a book, a journal, a story look like online? How might we use the
    specific strengths of the internet to expand the literary text and break
    down the borders between different media? Most importantly, how might
    readers discover new and meaningful connections to this work?
  </p>
  <p>
    View Source brings together the talents of many contemporary Irish writers
    and artists, including: Claire-Louise Bennett, Ruby Wallis, Colm O'Shea, Tom
    Roseingrave, Méabh de Brún, Nidhi Zak/Aria Eipe, Michael Dooley, and Louise
    Hegarty. Throughout the publication, the finest writing blends with
    inventive audio and visual work to create a truly special literary
    experience.
  </p>
  <p>
    The launch will be marked with a series of events to be confirmed. Details
    to follow soon on how to access your copy of View Source on St. Patrick’s
    Day.
  </p>

  <h2>About Fallow Media</h2>
  <p>
    With the belief that the internet offers us critical and conceptual
    approaches that remain largely unexplored in the worlds of literature, music
    and the arts, Fallow Media has become an alternative space for contemporary
    creativity in Ireland. Each project is a learning process, and an attempt to
    share work from across the artistic spectrum in a new way. The hope is not
    only to change the way people see this work, but also the way work is
    created in the first place.
  </p>
</div>
