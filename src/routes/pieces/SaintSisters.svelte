<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
  import AudioPlayer from "../../components/AudioPlayer.svelte";
  import ArticleHeader from "../../components/ArticleHeader.svelte";

  import { onMount } from "svelte";

  import { themeColour, blob1 } from "../../store.js";
  import { move } from "../../moveBlob";

  onMount(() => {
    let blobs = document.querySelectorAll(".blob");
    [...blobs].forEach((el) => move(el));
    themeColour.update((theme) => "#f8fff1");
    blob1.update((c) => "#f290a280");
  });

  let audioActive = false;
</script>

<ArticleHeader
  title="Saint Sisters & The Sea"
  author="Méabh de Brún"
  bind:audioActive
/>

<AudioPlayer
  src="/assets/audio/saint-sisters.mp3"
  active={audioActive}
  credits={"Read by Méabh de Brún."}
/>

<div
  class="text"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <section>
    <p class="num">1.</p>
    <p>
      When your sister goes missing you are twenty-seven years old. She had just
      turned thirty. One day she was there, the next day she was Gone. It was
      three days before anyone realized; it happened on a Friday and she had
      just moved to Wicklow Town. She was after nabbing a tidy number as the
      local orthodontist, wearing tidy white scrubs and sorting people’s teeth
      into tidy white rows.
    </p>
    <p>
      You usually rang her every evening, but she had been a bit of a downer
      lately, what with the new town, new job, no friends. A manageable downer
      though. Run of the mill stuff. No alarm bells. But you were tired, and
      reluctant to take on her woes.
    </p>
    <p>
      Somewhere deep in the pit of your stomach you know this is your fault.
      Your calls were the talisman that kept the Gone at bay.
    </p>
  </section>
  <section>
    <p class="num">2.</p>
    <p>
      The worst thing is that everyone around you expects life to go on, and
      they expect you to go on too, so you do. Not because you think it’s right
      or because you want to, but because you accede to their beliefs and are
      loath to cause discomfort.
    </p>
  </section>
  <section>
    <p class="num">3.</p>
    <p>
      <strong>Actuary</strong><br />/ˈaktʃʊ(ə)ri/ <br /><em>noun</em><br /> An actuary
      is someone that analyses data and works with statistics, using mathematical
      skill to assess or predict the probability of an uncertain future event.
    </p>
  </section>
  <section>
    <p class="num">4.</p>
    <p>
      You’re the middle sister. You were three years younger than Becca; you are
      three years older than Niamh. You never quite clicked with Niamh beyond
      the dutiful clicking that comes with unavoidably shared genes and
      reluctantly shared jeans.
    </p>
    <p>
      Niamh isn’t doing well. She’s a tightly coiled spring over an open flame.
      She has a scalding tongue on her, ready to snap at any stage. Her
      targetless anger floods out like waves of acid, burning friends and family
      alike. On some level you know that she’s pushing out what you’re turning
      in. She calls you Bean Uí Robot with a sneer on her lips.
    </p>
    <p>
      How can you tell her that you’ve run out of responses? That you are sick
      of receiving condolences for something that is not a death, not an ending.
      Something that just goes on and on, forever and ever without end amen.
    </p>
  </section>
  <section class="tc">
    <p class="num">5.</p>
    <p><strong>MISSING PERSON<br />REBECCA DALY</strong></p>
    <p>
      30 years old, medium build. Last seen on 25 November 2016. Wearing a navy
      coat with decorative patterns on the hem and brown boots.
    </p>
    <p>
      If you have seen this woman or know of her whereabouts, please contact
      Wicklow Garda Station – 0404 60140
    </p>
  </section>
  <section>
    <p class="num">6.</p>
    <p>
      The Gardaí show you the CCTV footage, hoping you’ll have some insight into
      Becca’s body language. You sit in the station and lean hungrily towards
      the screen, watching the final minutes of your sister’s existence.
    </p>
    <p>
      The camera is positioned over the Bank of Ireland, down the street from
      the Mariner. The quality is poor, the picture in black and white. You
      watch Becca walk out of the pub. Her face is an inscrutable blob of
      pixels. She’s wearing her good blue coat, the one you described to the
      Gardaí and showed them on the Zara website. The one they will later call
      navy in the official missing person release. The coat is a dark shade of
      grey on the screen, but it remains distinctive due to its decoration: a
      city silhouette airbrushed on the hem.
    </p>
    <p>
      You know that coat, you know those boots. You know that underneath she’s
      wearing her green dress and black tights. Her go-to going-out outfit when
      she wasn’t going out out. The Gardaí won’t let you put that on the
      posters. They’re apologetic, but they can only go on established facts.
    </p>
    <p>
      You watch Becca walk down the street. You watch her turn the corner and
      disappear. The tape continues for another twelve seconds. Twelve seconds
      of total absence. Then the loop starts again and there is your sister,
      walking out of the Mariner.
    </p>
    <p>
      You want to ask for a copy, but you stop yourself. You know even then that
      nothing good can come from having it. It would be nothing more than owning
      the final seconds of a grainy ghost composed in monochrome.
    </p>
    <p>
      ‘Thirty can be a tough year for some women,’ the Garda comments, and you
      think <em>can it?</em>
    </p>
  </section>
  <img class="cctv" src="/assets/images/ss1.jpg" alt="cctv" />
  <section>
    <p class="num">7.</p>
    <p>
      There’s no such thing as a Missing Person’s Mass but there’s a Mass said,
      nonetheless. When the priest says <em>we’ll kneel now</em>, everyone
      kneels. When the priest says <em>we’ll bow our heads now</em>, everyone
      bows. The priest keeps saying <em>we’ll do this now</em> and does none of it
      himself. The Eucharist is given out and it sits dry and hard on your tongue.
      This is the anno domini of your life, nothing will be the same after this.
    </p>
  </section>
  <section>
    <p class="num">8.</p>
    <p>
      There’s no reason to believe she went to the sea, but you believe she went
      to the sea.
    </p>
  </section>
  <section>
    <p class="num">9.</p>
    <p>
      The official search lasts two months. That’s all it takes to write your
      sister off from reality. Becca was always the neat one, the tidy one.
      Whatever force made her Gone has respected that core aspect of her
      personality. There is no body. There are no leads. From the outside it
      looks as though she has been sliced from reality. Perhaps by a sharp
      scalpel, the kind she boasted her prowess with when describing her more
      surgical procedures.
    </p>
    <p>
      That’s how it looks, but that’s not the truth of it. The truth is that her
      disappearance has left a messy, open wound. A torn hole in the
      quintessential fabric of existence. Ragged edges and pumping blood. Your
      family must learn to exist around this wound because you know it’s not the
      kind that will heal. It’s the kind that stays open. Stays raw.
    </p>
  </section>
  <section>
    <p class="num">10.</p>
    <p>
      Saint Anthony looks, Saint Anthony finds, Saint Anthony places in front of
      my eyes.
    </p>
  </section>
  <section>
    <p class="num">11.</p>
    <p>
      You studied to be an actuary and then realized about fifteen minutes after
      qualifying that you fucking hated it. You work in a call centre these days
      while trying to figure out what to do with your life. Your parents used to
      give you a hard time about it. Not anymore. Not since they learned that
      there are darker outcomes for daughters than unrealized potential.
    </p>
    <p>
      They are so much older now, older than they were. More timid, as though
      they think that pushing you would disrupt the delicate balance of whatever
      force protects you from being Gone. They’re more affectionate. They call
      you ‘pet’. Your lips press into a thin smile at each saccharine sentiment,
      as though you’re making sure it doesn’t get into your mouth. The rotting
      honey-juice of their guilt-sodden tenderness.
    </p>
  </section>
  <img class="cctv" src="/assets/images/ss2.jpg" alt="cctv" />
  <section>
    <p class="num">12.</p>
    <p>
      Eight months later, on the first night you go out out, your friend’s
      boyfriend rants about how much he hates his job. You sit with the group
      and listen, your finger drawing tight little lines on the condensation of
      your glass. <em>It’s boring,</em>
      he says. <em>My boss is a gobshite</em>, he says.
      <em>I swear to god, one more week and I’ll off myself</em>, he says.
      There’s a brief susurration of laughter before it fades into awkward
      silence, people’s eyes sliding to you. You smile to cut the tension and
      continue to stockpile reasons why your sister couldn’t have killed
      herself.
    </p>
    <p>
      You hate that you’re doing it. The existence of the mental list you have
      curated seems to give weight to the other side of the argument, the idea
      that there is a debate to be rebutted. But you can’t stop, and though you
      never write it down, it is always a single thought away, added to as
      appropriate.
    </p>
    <p>
      You begin to dream of the sea. The crashing, roiling sea. Becca is down
      there somewhere and but for the violence of the waves blocking her
      attempts to surface, she could come back. You spend entire nights
      following winding paths down to the seashore, ready to dive in and save
      her. You never make it. You always wake just as you reach the crest of the
      sand dunes, the sound of the sea crashing in your ears.
    </p>
    <p>
      The dreams don’t stop, so you start avoiding sleep. Instead you lie in the
      dark and go through your list, running a mental finger down the smudged
      and tattered page, worn from constant rehashing. You lie there, listening
      to the sound of your boyfriend breathing. Your boyfriend who has no open
      wounds in his life and keeps putting his hands over yours, trying to close
      it with his clumsy fingers. Like he doesn’t know that some things just
      need to fucking bleed.
    </p>
  </section>
  <section>
    <p class="num">13.</p>
    <p>
      Say someone was in Wicklow Town on a Friday night, and they had a drink at
      the Mariner. Say they were homesick and lonely and missing Dublin. Say
      they wanted to leave. Say they wanted to go somewhere alone. Say they
      wanted to go to the sea.
    </p>
    <p>
      First, they’d walk out of the bar, pulling their good blue coat around
      their shoulders. They’d take a second to look down the dark street,
      stained with autumnal spatterings of rain. Then they’d turn off to the
      right, walking alone in the dark. Past the garishly painted Toymaster, and
      past the Bank of Ireland. They’d turn right again, out of the scope of the
      bank’s security cameras. They’d turn what’s locally known as the Long
      Corner, onto a road with farther spaced streetlamps, puddles of darkness
      gathering at set spaces.
    </p>
    <p>
      They’d walk on, past rows of houses predominantly painted in shades of
      blue. They’d pass the Bridge Tavern, then cross the River Vartry. They’d
      walk to the bit of town less preoccupied with looking twee for tourists,
      its houses a more functional spackled brown. They’d walk until they got to
      the low ones, the bungalows built in deference to sea gales and salty
      winds.
    </p>
    <p>A six-minute walk and there they’d be. At the endless, endless sea.</p>
  </section>
  <section>
    <p class="num">14.</p>
    <p>
      When calculating the risks posed to a missing person, actuaries used to
      use the classification method.
    </p>
    <p>
      Part One of the risk matrix dealt with personal circumstances. It included
      factors like age, environment, drug/alcohol dependency and isolation. Part
      Two examined the circumstances of the disappearance. It included things
      like ‘out of character behaviour’ or ‘inclement weather conditions’. Each
      of these was awarded a single score and could then be judged on a scale.
    </p>
    <p>
      This method is no longer used. It was too easy to weigh circumstances
      heavier than they warranted. Too easy to become embroiled into the
      personal details. Every case became a high-risk case. Every case became
      important.
    </p>
    <p>The classification method was deemed inefficient and abandoned.</p>
  </section>
  <section>
    <p class="num">15.</p>
    <p>
      <em>The Irish Times</em><br />Tuesday 20 November 2018, 18:28<br /><strong
        >Gardaí issue Rebecca Daly appeal two years after disappearance</strong
      ><br /><em
        >Supt Derek O’Mahoney calls for those with information to come forward
      </em>
    </p>
    <p>
      Gardaí have issued a new appeal for information in relation to missing
      woman Rebecca Daly as her family prepares to mark the second anniversary
      of her disappearance.
    </p>
    <p>
      Ms Daly (30) vanished from the streets of Wicklow Town in the late hours
      of 25 November 2016. Her disappearance from a relatively small town so
      close to Christmas was the subject of a high-profile search and publicity
      campaign, but no trace was ever found. A Bank of Ireland CCTV camera on
      Main Street, Wicklow recorded her passing by at 11.20pm heading towards
      Bridge Street.
    </p>
    <p>
      Supt Derek O’Mahoney is appealing for anybody with information to contact
      the Garda Confidential line 1800 666 111 or any Garda Station.
    </p>
    <p>
      Ms Daly is described as 5ft 6ins, of medium build with blonde
      shoulder-length hair and brown eyes.
    </p>
  </section>
  <img class="cctv" src="/assets/images/ss3.jpg" alt="cctv" />
  <section>
    <p class="num">16.</p>
    <p>
      Your boyfriend doesn’t leave, because imagine leaving. Leaving his
      girlfriend with the missing sister. His girlfriend who has grown distant
      and cold and still, like a lake frozen over in winter. That’s the only
      reason he doesn’t leave and you know it. When it hits the two year mark
      you push him out instead, and still manage to make him feel like it’s his
      fault.<em>Grand</em>, you say.
      <em>Fine. Fuck off with yourself.</em> Your social circle is neatly halved.
      You feel better for it.
    </p>
  </section>
  <section>
    <p class="num">17.</p>
    <p>
      Niamh rings you one evening, while you’re examining your new conditioner.
      You’re trying to go all natural, and you can’t remember whether parabens
      are allowed. You answer the phone without thinking, and it’s only after
      the pleasantries that you remember Niamh never calls.
    </p>
    <p>
      ‘I have to do a Form 12 for Revenue,’ she says. ‘They sent me a letter.’
      There’s something about the way she says it that makes you hesitate, and
      that beat of silence is enough to damage whatever was hanging in the
      balance. ‘Yeah, it’s fine, never mind. I’ll ask Dad.’ Her voice sounds
      thick, her throat sounds raw, and before you can say anything else, she
      hangs up.
    </p>
    <p>
      You feel bad for a minute, but then the feeling fades. It is unfortunate
      that Niamh has lost the sister who took care of her, but in fairness, so
      have you.
    </p>
  </section>
  <section>
    <p class="num">18.</p>
    <p>
      In most fatal accident cases that make it to the High Court, an actuary is
      brought in as an expert witness, to tally up the total loss to the
      survivors. The losses incurred by the financial dependents of the deceased
      are quantified under the following headings:
    </p>
    <ul>
      <li>Loss of financial dependency since the accident;</li>
      <li>Loss of future financial dependency prior to retirement;</li>
      <li>Loss of future financial dependency after retirement;</li>
      <li>Loss of services provided by the deceased;</li>
      <li>Accelerated value of deductible assets passing on death.</li>
    </ul>
    <p>
      The actuary sits down with a calculator. They tot up the total financial
      loss accumulated as a result of a person being taken before their time.
      ‘Before their time,’ as though it’s possible to know when that time is.
    </p>
    <p>
      Maybe there’s another kind of actuary. A tall figure draped in seaweed and
      stinking of fish. A dark shadow who rises from the depths to skulk the
      streets at night. Who watches us and records the tally marks that the
      years carve into our bones. An actuary who, through some strange
      arithmetic, decides when it is time.
    </p>
  </section>
  <section>
    <p class="num">19.</p>
    <p>
      Becca had thick hair, chopped at an elegant length that circled her neck.
      When she was working, she tied it back in a neat ponytail. It was
      efficient hair, knowledgeable hair.
    </p>
    <p>
      Your hair is wild and thin and prone to over-enthusiastic impressionist
      shapes. No matter how tight you tie it back there are always escaping
      strands, tiny tendrils coiling and cajoling you back to dreamland. One
      day, as you sit at your computer, fighting the flailing strands into a
      bejewelled hairclip, a question occurs to you.
    </p>
    <p>Are you the eldest sister now? Is that how it works?</p>
    <p>
      You wonder about your parents. You wonder if your parents pause when they
      meet new people, if they are asked about their children. You wonder if
      they say they have three daughters or two.
    </p>
    <p>
      You get sick in the toilet at work. You swallow two Panadol, willow-bark
      bitterness coating your tongue. Someone suggests you go home early. You
      refuse. After all, it’s over two years since your sister disappeared.
    </p>
    <p>You throw out the hairclip. Garish, shiny tat.</p>
  </section>
  <section>
    <p class="num">20.</p>
    <p>
      <strong
        >A Mental List of Reasons Why Your Sister Couldn’t Have Killed Herself</strong
      >
    </p>
    <ol>
      <li>She was thinking about getting a cat.</li>
      <li>She just bought, like, three succulents.</li>
      <li>
        One week before she died, she bought the Sunday Riley Good Genes Lactic
        Acid Treatment on the internet for £85.00, not including shipping and
        when the pound to euro exchange rate was bad, so there’s no way that
        would have been let go to waste.
      </li>
      <li>She was talking about taking up guitar.</li>
      <li>It was too close to Christmas, she loved Christmas.</li>
      <li>
        When you went to her apartment, after it was clear that this was
        serious, it was clear that she was Gone, and you were enveloped in the
        scent of her, surrounded by her things, you started picking through her
        drawers looking for clues, and you opened her fridge and you looked
        inside and there was half a cheesecake, and if you were going to kill
        yourself you would have eaten the whole cheesecake and you and your
        sister are quite alike in impulses and general temperament, or so you
        are told.
      </li>
      <li>She wouldn’t do that.</li>
      <li>She just wouldn’t do that.</li>
      <li>She wouldn’t do that to you.</li>
    </ol>
  </section>
  <img class="cctv" src="/assets/images/ss4.jpg" alt="cctv" />
  <section>
    <p class="num">21.</p>
    <p>
      One day, nearly three years later, you’re in the Penneys on Mary Street
      and you’re not thinking about Becca at all.
    </p>
    <p>
      You meet an old neighbour of your parents’, a woman whose sun-exposed skin
      reminds you of the last time your father cooked duck – all puckered, oily,
      uneven brown. She’s been living in Spain the last seven years, she says.
      Moved there when she retired, just back to visit family. She asks you how
      your Mammy is. She asks you how Niamh is getting on. She asks you how
      Becca is doing.
    </p>
    <p>
      The moment when a drowning person takes an involuntary breath under water
      is known as the ‘break point’. For a moment you think that this is it.
      This is the point at which you break. Her mouth is still moving, but all
      you can hear is muffled ringing, all you can feel is the rush of cold
      water against your skin as you drown. You want to slap her for reminding
      you and you want to slap her for being here and you want to slap her for
      not knowing. How can she not <em>know?</em> But then you remember that life
      goes on. That the gaping ragged hole only exists in your world.
    </p>
    <p>
      Even though it feels hateful to her memory, you don’t want to talk about
      your missing sister here, while you’re holding a jumpsuit reduced to €5
      that’s a size too small but could be aspirational. You don’t feel like you
      owe this woman enough to do that to yourself, and so you dodge the
      question, change the subject. You move on.
    </p>
  </section>
  <section>
    <p class="num">22.</p>
    <p>
      The Life Table is a table created by actuarial science which shows, for
      each age, what the probability is that a person of that age will die
      before their next birthday.
    </p>
  </section>
  <section>
    <p class="num">23.</p>
    <p>Listen. Here is your secret: You still call Becca.</p>
    <p>You call Becca all the fucking time.</p>
    <p>
      Her phone rang, the first couple of days during the search. Then it
      stopped ringing and started going straight to voicemail. It’s been three
      years and you can still remember the exact moment, the electric shock that
      raced down your spine, the crashing wave of relief when you heard her
      voice, thinking <em>she’s okay, she’s okay</em> before you realized.
    </p>
    <p>
      You still ring her, listening to the careless trip of her words as she
      tells you that <em
        >You’ve reached Becca Daly. I can’t get to the phone right now but leave
        a message and I’ll get back to you as soon as I can!</em
      >
    </p>
    <p>
      It’s like a promise, so you do. You ring her, you listen to her voice, and
      you leave her a message.
    </p>
    <p>She’ll get back to you as soon as she can.</p>
  </section>
  <section>
    <p class="num">24.</p>
    <p>The year you turn thirty is not a good year.</p>
    <p>
      Will this be the year that you go missing? Snatched from the footpath, in
      the shadow between two streetlights. Leaving no trace, leaving the world
      to go on without you after the appropriate two months of searching and
      handwringing.
    </p>
    <p>That’s nonsense. You won’t let it colour your decision making.</p>
    <p>It does anyway.</p>
    <p>
      You cancel plans, curb the extent of your social presence, fail to renew
      subscriptions. You’re due new glasses, and you put off the optometrist
      appointment because you won’t need them when you’re Gone.
    </p>
    <p>
      You drink more. You’re alone more. The strange tumour of a thought
      pertaining to your birthday, the idea that it will fatefully and
      unavoidably be your last, comes with a righteous indignation that tastes
      like tin. It comes with the idea that you are safe until then. No dark
      shadow would dare snatch you up. Not yet. Not before your time.
    </p>
  </section>
  <section>
    <p class="num">25.</p>
    <p>
      ‘Finally the Immaculate Virgin, preserved free from all stain of original
      sin, when the course of her earthly life was finished, was taken up body
      and soul into heavenly glory, and exalted by the Lord as Queen over all
      things, so that she might be the more fully conformed to her Son, the Lord
      of lords and conqueror of sin and death.’
    </p>
    <p class="attrib">
      — The Bodily Assumption of Mary, Catechism of the Catholic Church, 966
    </p>
  </section>
  <img class="cctv" src="/assets/images/ss5.jpg" alt="cctv" />
  <section>
    <p class="num">26.</p>
    <p />
    <p>
      You agree to have your birthday party in Annascaul, your father’s
      childhood town. Your parents are looking for a distraction; they want to
      make it about family. You’re relieved to give the few friends you have
      left an excuse not to attend.
    </p>
    <p>
      The festivities are held in Patcheen’s Pub, its stone walls bedecked with
      balloons. Streamers hang between black and white photos, over the glass
      case housing a taxidermy hare. There’s a buffet of cocktail sausages and
      eggy sandwiches. Aunts and uncles and second cousins all drink and laugh
      and dance furiously to the over-enthusiastic DJ who keeps asking <em
        >Are we all having a good tyyyyyme?</em
      >
    </p>
    <p>
      You’re there to smile and chat and slip away unnoticed around midnight.
      You’re not there to fight with Niamh, but that’s what ends up happening.
      You watch her mouth as she screams at you, tequila salt still clinging to
      her lips. She’s very drunk. You can’t remember what the instigating
      incident was, the only thing you remember is that she spat the words
      ‘She’s dead, not you’ so you slapped her.
    </p>
    <p>Hard.</p>
    <p>
      You push past the inward rush of relatives and manage to slam your way
      into the ladies. You pull a stall door closed and lock it, shaking hands
      pulling your mobile from your purse. Hardly thinking, moving by muscle
      memory, your thumb flicks open Contacts and taps Becca’s name. You make
      sure it’s ringing, and then lift the phone to your ear.
    </p>
    <p>‘Hello?’</p>
    <p>Your heart might shatter your ribs. ‘Becca?’</p>
    <p>‘No, sorry.’ A man’s voice. ‘Wrong number.’</p>
    <p>The number is the same. It’s been given away.</p>
    <p>
      You want your phone to shatter into a thousand pieces. When you fuck it to
      the floor, you want it obliterated. Instead it hits the tile with a sound
      like snapping plastic. It lands face up and you see that the screen is now
      a mass of ugly jagged pieces. You know that’s what you are. Splintered
      pieces of glass trying to stay together.
    </p>
    <p>
      When you return to the party, they tell you that Niamh left. They tell you
      they can’t find her.
    </p>
    <p>They tell you that your sister is Gone.</p>
  </section>
  <section>
    <p class="num">27.</p>
    <p>
      ‘Oh my fuck. Are these all <em>Niamh’s</em>? Is this her MED1 paperwork?
      Becca!’ You’re going through the piles of papers on Becca’s desk in her
      living room. She’s moving out of Dublin in three weeks, and her apartment
      is messier than you’ve ever seen it. Higgledy piggledy, boxes and clothes
      on every surface. ’Jesus Christ. You always do her forms for her, would
      you not just leave her at it?’
    </p>
    <p>
      ‘Ah but she gets fierce stressed.’ Becca is in her room getting changed.
      Her voice carries over the low thump of music from the Bluetooth speakers
      on the couch.
    </p>
    <p>
      ‘She’ll keep getting stressed if she’s allowed avoid them,’ you snort,
      tossing the forms back on the table. ‘It’s just paperwork, for fuck’s
      sake.’
    </p>
    <p>
      ‘Come here, how do I look?’ Becca comes out. She’s going <em>out</em> out,
      all red dress and dangly earrings.
    </p>
    <p>‘Fuck me, does he know he’s getting the ride?’</p>
    <p>‘It’s my goodbye tour of Dublin, I’d say he knows all right.’</p>
    <p>
      You shriek with laughter and throw a pillow at her. ‘A goodbye tour means
      visiting the fucking landmarks, not doing a round on every fella you’ve
      shifted in Coppers!’
    </p>
    <p>
      Becca takes a drink of red wine from her glass and is left with two curled
      lines coming up from her bottom lip, giving her grin a devilish cast. A
      month ago, she went blonde. Objectively, it suits her, but you still
      prefer her dark. ‘Sure, I’m thirty now. I have to engage in a bit of
      debauchery before moving to the backarse of nowhere. Drowning in the
      boredom of adulthood.’
    </p>
    <p>
      ‘Lovely.’ You rub the sides of your mouth with your forefinger and thumb,
      flagging the wine marks.
    </p>
    <p>
      She takes the hint and wipes, peering in the mirror to ensure her face is
      unmarred. Then she pulls her phone from her bag. ‘Fuck. My taxi is here.
      Can you lock up on your way out?’
    </p>
    <p>‘Yeah, no bother. Enjoy yourself!’</p>
    <p>
      ‘Say a prayer to St. Jude!’ She’s halfway out the door, coat pulled on,
      dangly earrings brushing her fragrant, powdered cheeks.
    </p>
    <p>
      ‘Patron saint of lost causes!’ you both chorus, and you’re laughing as she
      closes the door behind her.
    </p>
  </section>
  <section>
    <p class="num">28.</p>
    <p>
      You can taste bile and saltwater in your mouth as your car bumps and dips
      along the narrow rural roads. You shouldn’t be driving; you’ve had three
      glasses of wine. Maybe more, by the way it’s creeping up the back of your
      throat.
    </p>
    <p>
      You’ve developed the habit of counting seconds in sets of twelve when the
      world gets overwhelming. Over and over. You’re counting now, as you drive
      a little too fast and take turns a little too hard.
    </p>
    <p>
      You have no idea where Niamh has gone but you drive to the sea, feeling
      like you’re dreaming, feeling like this is the end of all the dreams. This
      is where it ends, and you will either be Gone by morning (before your
      time) or nothing will happen at all. No other options. Because it was
      meant to be you. It was meant to be you, and you will not do this again.
      You will not lose the other half of your heart.
    </p>
  </section>
  <section>
    <p class="num">29.</p>
    <p>
      Saint Anthony looks, Saint Anthony finds, Saint Anthony places in front of
      my eyes.
    </p>
  </section>
  <img class="cctv" src="/assets/images/ss6.jpg" alt="cctv" />
  <section>
    <p class="num">30.</p>
    <p>
      The car that your sister shouldn’t have driven is parked at an angle on
      Inch Beach. The door is open, the headlights are on. Niamh isn’t inside,
      but you spot her silhouette in the distance, illuminated by the beams. She
      may be the youngest, but she’s also the tallest. When she was a teenager
      learning to walk in heels, you watched her long coltish legs wobble as
      they picked out safe paths.
    </p>
    <p>She’s going to the sea.</p>
    <p>
      Niamh doesn’t hear your engine over the sound of the waves, doesn’t turn
      as you stumble from the car. You are far, far behind her, so you have to
      run and run and run as she walks, slow and with purpose. The sound of the
      crashing water is loud enough that she doesn’t hear your bare feet
      thudding on the sand until the last second – you don’t remember taking off
      your heels – half-turning to you as your bodies collide and her hair is in
      your mouth and the filmy material of her dress (an out out outfit) is
      gripped in your fist as you knock her to the ground, you hold her down,
      and you keep her Here.
    </p>
    <p>
      ‘Let me go!’ she screams, thrashing beneath you, voice ragged and wet and
      broken. There’s sand on her lips. The words come from her throat in a
      drawn out, jagged wail. A child’s cry of pure misery. ‘Let me go!’
    </p>
    <p>You don’t let her go.</p>
    <p>
      The sound of the waves is a smooth, repeating rumble. Nothing like the
      sharp fractured crashes of your dreams.
    </p>
    <p>You hold your sister. You are thirty years old.</p>
    <p><br /></p>
    <p style="text-align: center">&#x2059;</p>
  </section>
</div>

<div class="credits text">
  <p>
    <em>Saint Sisters & The Sea</em>, written by Méabh de Brún, was first
    published in
    <em><a href="https://www.bansheelit.com/">Banshee</a></em>.
  </p>
  <p>
    Méabh de Brún is an award-winning actor, playwright and writer. Her short
    fiction has been published in <em>The Stinging Fly</em>,
    <em>Banshee Lit</em>, <em>Mysterion Magazine</em>, <em>Giganotosaurus</em>
    and more. She is a finalist for RTÉ's Francis MacManus Short Story Award and
    received the DCLI/ACDI Playwriting Award for her play
    <em>Dead Man's Bells</em>, which picked up eight awards nationally,
    including her festival award for Best Actor.
  </p>
  <p>
    A recipient of the Tyrone Guthrie bursary and the Valentino Scholarship for
    Emerging Writers, she currently lives in Kerry, where she is working on her
    first novel and on anything else that comes to mind.
  </p>
  <p><a href="meabhdebrun.org">meabhdebrun.org</a></p>
</div>

<style lang="scss">
  section {
    margin: 4rem 0;
  }
  .tc {
    text-align: center;
  }
  .num {
    font-weight: 800;
    margin: 0;
    text-align: left;
    @media (min-width: 960px) {
      margin-left: -50px;
      margin-bottom: -1.4rem;
      height: 0;
    }
  }
  .cctv {
    max-width: 100%;
    margin: 2rem 0;
  }
  ol {
    list-style-type: lower-alpha;
  }
  .attrib {
    font-style: italic;
    text-align: right;
  }
  .credits.text {
    border-top: none;
    border-bottom: none;
    margin-top: 100px;
    text-align: center;
  }
</style>
