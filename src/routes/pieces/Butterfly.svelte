<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
  import AudioPlayer from "../../components/AudioPlayer.svelte";

  let audioActive = false;
</script>

<div
  class="text-wrapper"
  in:blur={{ delay: 50, duration: 600, amount: 8, easing: linear }}
  out:blur={{ delay: 0, duration: 400, amount: 8, easing: linear }}
>
  <header>
    <h1>Butterfly</h1>
    <h2>Colm O'Shea</h2>
  </header>

  <div class="text-options">
    <button on:click={() => (audioActive = !audioActive)}>Listen</button>
    <button on:click={() => window.print()}>Print</button>
  </div>

  <AudioPlayer
    src="/assets/audio/butterfly.mp3"
    active={audioActive}
    credits={"Composed and performed by Tom Roseingrave."}
  />

  <div class="text">
    <p>
      A border is a line made by man. A border is a line made by woman. A border
      is not real. A border is an agreement that something unreal is real. A
      border is an agreed exclusion. A border is a way of saying what is here
      and what is there are different. A border is a way of describing a
      difference.
    </p>
    <p>
      It starts in the airport. It starts before the airport. It starts by not
      saying, by not telling. It starts in the airport, looking around without
      being seen to look around for faces who would not know why I am in the
      airport. It’s about not being seen. It’s about making up excuses, making
      up stories. It’s about being consistent in my stories. It’s about telling
      people the same lie. It’s about knowing it’s best to tell one lie. It’s
      about knowing that one lie is easier to remember, one lie is easier to not
      trip over, one lie is less likely to be questioned if everyone believes it
      to be true. It’s about lying about being somewhere else when you’re in an
      airport.
    </p>
    <p>
      She has to know where every border is. She can’t get caught. She can’t get
      caught out. She has to know where everything stops and everything starts.
      It’s a survival instinct. It’s automatic now. She has to read every
      situation and know where she is. She has to know whether she’s crossed a
      border and how to act. She has to know how near she is to a border, and
      whether to turn and go back or prepare to cross over. She has to be
      whatever is expected of her on any side of any border.
    </p>
    <p>
      In a room listening to the artist Tamarin Norwood speak. I know the other
      speakers but not her. That is, I’ve heard others mention her and her work,
      but have never come across it until now. I strain to remember what is
      being said, what she is saying. I know I will forget a lot of what she is
      saying. I always do. I’m hoping someone is recording the event but I’ll
      find out later that no one is. I won’t be the only one regretting that the
      event isn’t being recorded.
    </p>
    <p>
      A border is a boundary. A border is more than a line drawn in the sand. A
      border is a line drawn to mean something more than a line. A border is
      meant to say more about what is beyond the line, on either side. A border
      becomes nothing when you see a border because a border is a line drawn and
      a line drawn only has the thickness it has been given. A border drawn can
      be reduced to nothing if you allow it because a line can be reduced to
      nothing if you allow it, but a border is a shared belief that a line means
      something.
    </p>
    <p>
      Crossing the border doesn’t make it any easier. Crossing the border is
      when real field craft comes into play. Crossing the border means there can
      be no excuses, no stories, no lies. Getting caught crossing a border means
      no escape. Even before the airport and the border it’s the messages and
      the codes. It’s the letter drops and the fake names. It’s covering tracks.
      Field craft teaches you that it’s easier to cover tracks before you’ve
      even made them. It’s easier now and it’s harder. Different contacts,
      different names, different addresses. Knowing who she is when she contacts
      you even if the name isn’t your name for her. Knowing how to respond.
      Knowing which questions are safe to ask and which will only cause trouble.
      Field craft is knowing how much I can say without the risk of blowing her
      cover, or mine.
    </p>
    <p>
      A line means something. A line means direction. A line is a vector. A line
      can be a vector but either side of a line is nothing unless you say it is
      something, unless you agree it is something. A line becomes a border when
      either side of the line means more than the line itself.
    </p>
    <p>
      The first train is the greatest risk, it’s the greatest risk of being
      spotted. I try to find a seat to stay inconspicuous but it’s standing room
      only. It means I can watch the stations as we approach. It means I can
      make a dash for the door before I’m spotted. It means I’m on edge the
      entire time. Ignore what’s outside the windows. Don’t be a tourist, don’t
      be a visitor. Blend in. Disappear. Be like everyone else. Glance at what
      passes by the window the same way everyone else glances at what passes by
      the window because we’ve all seen it a million times before. Don’t meet
      anyone’s eyes, without meaning to not meet their eyes. Everyone else on
      the train is a potential trap. Everyone else on the train could be the
      cause of getting caught.
    </p>
    <p>
      The room is full. I arrive early, earlier than I had planned, and take a
      seat away from the door. Watch the room fill up. The rest of the audience
      will know the other speakers, and her and her work, far better than I
      will. I know I will paraphrase. I know I will misinterpret. I know I will
      want to speak to her after the event but I will never get the chance. That
      is, I will be sitting in the pub after the event with friends and she will
      be sitting nearby with friends and I will mean to dip into her
      conversation on the way out to tell her how interesting I found the
      evening, hearing her speak, hearing her explain her work. But when the end
      of the evening comes, when the end of my evening comes and I put my coat
      on to leave, I say nothing to her.
    </p>
    <p>
      She has to be invisible. She has to be discrete. She has to be at home
      wherever she stands. She is a spy. She has to live as a spy. When she
      speaks she has to know how to speak. When she speaks she has to know what
      name to give and to stick with that name. The easiest way for a spy to
      have their cover blown is to trip themselves up. Inconsistency means
      death. She has to know where she is, stick to being whoever she is on that
      side of that border and never waiver.
    </p>
    <p>
      A place has no meaning without a border. A place is a space given a name
      by a man. A place is a space given a name by a woman. A place has no
      meaning without a border. A place is a nothing until it comes to an end;
      otherwise it is just a nothing. A place has no meaning until it meets
      another place. A place and a place only have meaning in themselves when
      they meet. When two places meet and become something it is the border that
      gives them meaning. So that means places have no meaning without a border
      which has no meaning without it being given a meaning by a man or a woman,
      by men or women.
    </p>
    <p>
      I haven’t messaged her yet. I meant to before I left the airport but I
      walked in the middle of a group all moving in the same direction. I’m less
      likely to be picked out that way. I have my papers if needed but the less
      chance I give them to ask me any questions the better my chances are. I
      count the stations before I have to change trains. I don’t look up. I’m as
      bored as everyone else beside me. I should message her. I look at my phone
      but it’s as much to avoid looking up as anything else. I have no signal
      but I know I’ll have a chance when I change trains. The platforms are
      crowded but staying in the middle is the safest place of all. Changing
      trains means emerging into the open air before going underground again.
    </p>
    <p>
      Places have no meaning until they are given a meaning by giving them a
      name. Nothing has a meaning until it is given a name. Nothing exists until
      it is given a name. A butterfly does not exist until it is named. A
      non-existent butterfly is free to cross a non-existent border. To name a
      butterfly is to catch it. To catch a butterfly is to want to hold it in
      your hands. To catch a butterfly is to risk crushing it. No butterfly
      seeks out the net. A name is also a limit. A name is a limit given by
      somebody else. A butterfly does not exist until it is captured and killed
      and stuck to a board with a pin through its heart. Is a pin only a pin and
      a butterfly only a butterfly when they come into contact? A butterfly only
      has a name when a difference is defined between one butterfly and another.
      A butterfly only exists when a line is drawn between one butterfly and
      another. A butterfly only exists when a border is drawn between one
      butterfly and another by a man or a woman. Metaphor is murder.
    </p>
    <p>
      I message her to say I’m on my way. Nothing more. Nothing less. If they
      know I’m here we’re caught anyway. If not it’s just the same message as
      hundreds, if not thousands, are sending this moment across the city.
      Changing trains means a safer train. I’m less likely to be spotted now.
      Moving through a safer part of town. I take a seat, holding my bag in
      front of me. I remember on a similar train with a larger bag accidentally
      hitting a man across the shins. I apologised immediately but he continued
      to wince and rub his leg for the rest of the journey. Today my bag is
      smaller, less obtrusive. My bag is no bigger than many others I see around
      me. My bag is easily forgettable. My bag is like me. A man and a bag on a
      train going nowhere important. That’s all anyone will see.
    </p>
    <p>
      A border is a line drawn but a line drawn can be changed. A border can be
      changed. A difference can be changed. The difference between here and
      there can be erased or revised by the erasure or revision of a border. The
      definition of what is acceptable here and unacceptable there can be
      redefined and redrawn like a border. A border has no meaning except for
      that difference in meaning either side of it. A border is where someone
      says no. A border is where a difference is applied. A border is where what
      you do is not acceptable but what we do is.
    </p>
    <p>
      She’ll pass by many names keeping her own locked safely in a box. To me
      she’s Jane but she doesn’t go by that name with anybody else. Every time
      she hears one of her names on a street or across a room she has to know
      where she is and who she is this time. She can’t afford to have her cover
      blown by answering a name she hasn’t been called. One doubt. One question
      and she’s dead.
    </p>
    <p>
      I look her work up afterwards to see if I get it right, if what I remember
      is consistent with what she talks about and how she represents her work. I
      will get it wrong. That is I listen to her speak and describe how she
      works and what she is trying to do and I hear it in relation to this
      piece. That is I have the germ of this piece in my head, a few scribbles
      on pieces of paper I keep in my back pocket and swap from trousers to
      trousers with a handkerchief as I add to them until I am ready to begin. I
      hear her speak and watch her work on the screen and think of it in terms
      of what is in my head. That means I will get it wrong. That means I will
      misrepresent her and her work. That means I will regret that the event is
      not recorded so at least there would be an accurate record of the artist
      speaking that isn’t filtered through a different idea in my head.
    </p>
    <p>
      There’s no reply from her. I don’t expect one. We’re underground now
      anyway. She knows when I’m due to arrive. At the final station I wheel my
      bag up the ramp and out onto the street. At the top of the ramp I move in
      beside a wall and check my phone. Still nothing from her. A few other
      passengers pass me by. One walks in the direction I’m going while the
      others turn right and wait at the pedestrian crossing. It’s about
      watching. Waiting I can see if I’m being followed. Waiting I can see if
      they’re on to me. Nothing. Nothing from them and nothing from her.
    </p>
    <p>
      She can only relax when she knows where she is. Enter a room, read a room,
      watch. All the time watch without watching. Look without looking. Listen
      without listening. Read without reading. All the time paying attention
      without appearing to pay attention. All the time looking for that crack.
      All the time looking for that one person with that one voice with that one
      name looking for that one reaction that would blow her cover. Like the
      time she was questioned in Buenos Aries. These were only casual questions.
      These were only an effort to make conversation. These were just someone
      trying to get to know her, maybe flirt a little, maybe ask her to dance or
      have a drink. Innocent questions near the wrong ears. Innocent questions
      near ears that shouldn’t have been listening to innocent questions.
      Keeping her cover while answering innocent questions.
    </p>
    <p>
      Borders exist because of force. Borders exist because of agreement.
      Borders exist because of consent. A border is a line around a place. A
      border is a line around a people. A border is a line around a person. To
      cross a border around a place or a people is to consent to what is
      acceptable within that border. To cross a border is to be told that what
      is acceptable elsewhere is not acceptable here.
    </p>
    <p>
      Her building is only a couple of minutes away. I should say nothing but I
      message her again to say I’m at the station. I’m waiting for the all
      clear. I’m waiting for her to say it’s safe to come up. I keep my head
      down on the street. It’s too close and too late to have my cover blown
      now. If they get me now they get us both. Still nothing from her. The
      trick is to not stop now. The trick is to keep walking. The trick is to
      make it look like my destination is still some way off. I pass her
      building. If I look down one of the side streets I can see her door. If I
      look up from her door I can see her window. I keep my head down. I keep
      walking. I can walk around the block a few times until she says it’s safe,
      until she’s ready for me to call. I guess the layout of the streets and
      walk laps of her building, of her street. I glance behind me when I can to
      check. Few people pass me. It’s a quiet day around this part of the city.
    </p>
    <p>
      A border is a list of instructions. A border is a list of instructions on
      how to live. A border is a list of instructions on how to act. To cross a
      border is to accept that you will comply with the list of instructions
      that is the border. To cross a border while paying lip service to the
      border, to the list of instructions, is to be a spy. To be a spy is to
      recognise that a border exists but to refuse to act as the border
      requires. To cross a border as a spy is to risk being found out. To cross
      a border as a spy is to live with the fear that you will be exposed as a
      spy. To be exposed as a spy is to pay a heavy price. To be exposed as a
      spy is to be exposed as someone who refuses to live by the list of
      instructions that the border supplies.
    </p>
    <p>
      Tamsin Norwood speaks about the point, the point of contact between a
      stylus, a nib, and a page, between point and page. As she speaks a video
      plays of one of her works. I will learn later it is called Keeping Time. I
      will learn this while searching online to try to learn if what I remember
      of the event and her work is accurate. The video shows the point of
      contact between a pen and a page. The video follows the nib of the pen, of
      two pens, or of one pen recorded twice, as it moves around a page, as it
      makes a mark on the page. I watch the nib and the page. I watch the nib
      moving around the page. I watch the mark it leaves on the page. I watch
      what results from a nib and a page coming into contact.
    </p>
    <p>
      The day hasn’t really begun around here. I could try to find a small café
      and sit, and wait. But my inconspicuous bag on the train could become a
      conspicuous bag now. Avoid shops. Avoid cafes. Avoid bars. Just keep
      walking. I pass a woman walking a dog. Has she passed me before? Think.
      Has she? Did I notice the dog the first time around and not her? Fuck.
      Stupid, beginner’s mistake. Watch. That’s the whole thing, watch without
      being seen to watch. I turn a corner and pass a school. Make a note. Don’t
      pass this way again. You can pass an office building, a row of shops or
      apartments or houses, or anywhere else more than once. But you can’t pass
      a school for a second time. Walking past a school again attracts
      questions. A man passing a school again wheeling a bag attracts attention,
      attracts questions. A man passing a school again is a fool and deserves to
      have his cover blown.
    </p>
    <p>
      Borders exist within borders. A spy can live within a border and only
      become a spy when they choose to disobey the list of instructions that the
      border supplies. A spy can live their life without ever crossing the
      border and becoming a spy. A spy does not have to act for anyone or
      anything outside the border. A spy can be a spy for him or herself. A spy
      does not have to be recruited. A spy does not have to be turned. A spy
      does not have to be a spy on behalf of anyone else. A spy can choose to be
      a spy for themselves and no one else. A border is a line made by man. A
      border is a line made by woman. A spy can live within a border and choose
      not to live as the border requires.
    </p>
    <p>
      I want to message her again, I want to pass her building and pass her
      door, pass under her window. I want to look up as I pass under her window
      and see her watching for me. I check my phone. I check my phone again. I
      walk and I check my phone. It’s late. She’s late. I try to avoid walking
      up and down the same streets but I’m conscious of not walking too far from
      her place in case she messages me and tells me to come up. Behind her
      building a main road skirts the river. I could sit on a bench and look at
      the river. A man wheeling a bag sitting on a bench looking at the river
      won’t attract any attention. I only see one bench; a woman is feeding a
      young child. I walk past them.
    </p>
    <p>
      So easy to slip up. But she knows what she’s doing. She knows the game. It
      becomes second nature for her to cover her tracks. It becomes second
      nature to look over her shoulder without making it look like she’s looking
      over her shoulder. It becomes second nature to check every street before
      entering any door. Walking into a hotel or out of a bar. Putting on a hat
      or adjusting a scarf. Fixing her gloves in the cold or fanning herself in
      the heat. A nothing gesture by anybody else, an afterthought. Taking that
      one small moment to look, to see, to watch.
    </p>
    <p>
      Without the nib touching the page there is nothing. That is there is a nib
      and there is a page. But a nib is something that makes a mark and a page
      is something that receives and records the mark of a nib. So is a nib a
      nib if it isn’t touching a page? Is a page a page if there is nothing
      making contact with it leaving a mark? Is a nib only a nib and a page only
      a page when they come into contact? Is all we know of their existence the
      record of what happens when the nib and the page come into contact?
    </p>
    <p>
      The list of instructions defined by a border can be more than the law. The
      list of instructions defined by a border may never be written down. The
      list of instructions defined by a border may require those living within
      the border to live and act in a particular way different from those who
      may live outside the border and those within the border will never be told
      or never need to be told. The list of instructions provided by a border
      can exist unwritten for generations and be followed by everyone within the
      border automatically. The list of instructions provided by a border define
      a way to act that complies with the wishes of the border. The list of
      instructions provided by a border define a way to act that complies with
      the wishes of the border as defined by those within the border who drew
      the line to form the border.
    </p>
    <p>
      Did she get my message? Did she have to go out? Did something come up? Did
      someone call? Can she answer my message? I picture someone calling and
      taking up her time. I picture her trying to act normally and being polite
      while the light flashes on her phone indicating my message. I picture her
      trying to get her caller to leave, to find an excuse to check her phone
      and message me to call later. I picture her trying to find a way to let me
      know it’s not safe. I picture all the things that can go wrong but my
      phone buzzes and she says to come up. At this point I just turn back on
      myself. I don’t care. I have my phone in my hand so if I’m stopped, if I’m
      questioned I can just say there’s been a change of plans and I have to go
      in this direction instead of the other. I form a response to the question
      but there’s no one there to ask me.
    </p>
    <p>
      When she walks she leaves no footprints. Nothing to say she was there.
      Leaving every room is a meticulous operation. Checking out. Empty the
      bathroom of every trace. Everything back in the bag. Everything in its
      place. Leave nothing, forget nothing. No sign. No trace left behind. The
      time she forgot a purse and panicked all the way to the airport. Relaxing
      only when I went back to collect it. Remembering to give a different name.
    </p>
    <p>
      A border defines a way to act. A border defines a way to live. A border
      defines what is the correct way to live and what is incorrect. A border is
      nodding approval. A border is exposure and censure for those who
      transgress the border. A border is ruin for those who transgress the
      border. A spy lives within a border but chooses not to obey the border. A
      spy does not ignore a border; to ignore a border is to risk exposure for
      transgression of the border. A spy knows the border and respects the
      border. A spy respects what a border can do. A spy lives his or her life
      in constant awareness of the border. A spy lives his or her life in
      constant awareness of what the border can do.
    </p>
    <p>
      If I’m spotted from a building, if I’m watched from a building it’s too
      late anyway. If I’m recorded turning into the side street by the side of
      her building it’s too late anyway. If someone is going to see me, if
      someone is going to say or do anything it will be now. I approach her
      door. I look up at her window. Even when I’m close enough I see nothing in
      her window, nothing that isn’t in every other window. There’s a desk
      inside the door of her building but it’s unmanned. Nobody there. Nobody in
      the hallway. Nobody in the lift. Nobody in the corridor on her floor.
      Looking left and right at her door. Knocking gently. Hearing nothing from
      any of the doors I pass. Hearing nothing from the corridor behind or in
      front of me. Hearing nothing but the lift moving on, up or down.
    </p>
    <p>
      Learning to contact her. Learning the dead letter drops. Learning the code
      words. Learning the fake names and the real names. Learning to communicate
      with a spy means learning to become a spy yourself. Learning to embrace
      the game. Learning that if your cover is blown she will disappear to avoid
      the risk of being blown herself. Learning to learn. Learning what you can
      leave behind. Learning what is and isn’t important. Learning that it may
      be important now but if it risks her cover being blown she will abandon it
      without looking back. Learning that security is everything.
    </p>
    <p>
      A spy chooses to transgress a border because a spy chooses to live outside
      of the list of instructions provided by a border. A spy learns quickly how
      to act to avoid suspicion. A spy learns quickly or a spy is exposed. An
      exposed spy is a lost spy. An exposed spy is a blown spy. A blown spy is
      lost. A spy learns to live outwardly as if they respect and obey
      everything that the border requires. A spy lives from safehouse to
      safehouse. A safehouse is a space a spy defines that is inside a border
      but outside the world of the border. A safehouse is defined by a line
      drawn by a spy. A safehouse is defined by a border drawn by a spy. Within
      the border of a safehouse a spy lives and acts as they choose.
    </p>
    <p>
      Hearing nothing but her singing. Hearing nothing but her undoing the chain
      and the door opening. She’s singing gently as the door opens. She stands
      behind the door as I step through so the first time I see her is when she
      closes the door behind me. Seeing her in the dim light of the hallway and
      putting my arms around her. First, gentle kiss. First gentle kiss of being
      here. First gentle kiss of being safe.
    </p>
    <p>
      She gauges every story. What to tell and what not to tell. Which names to
      change and which to leave in. Which names to just omit all together and
      just tell a story about a friend. She knows how to tell any story in a way
      that barely leaves any traces. She knows who she has told and what she has
      told them. She knows who she has told and who she hasn’t. She knows how to
      pick up different conversations at just the right point so they look like
      the only conversations in the world.
    </p>
    <p>
      The door is the line we draw between us and the rest. The door is the line
      we draw to say we are here and everything else is excluded. The door is
      the border we close. The door is our border, meaning we and only we make
      the laws here, we decide what is right and what is wrong. We decide how we
      should act and we decide to exclude everyone else who says otherwise.
    </p>
    <p>
      I think about borders. I think about boundaries. I think about edges. I
      think about the idea that things only come into existence when they come
      into contact with another. I follow the nib moving over the page leaving
      its mark and I see the mark as the only record of its existence. At one
      point Tamasin Norwood describes taking a pen and marking a border around
      the inside of a house she and her husband had just vacated because they
      were moving somewhere else. I don’t know if she means to mention this
      event as part of her talk or just chooses to include it as an anecdote
      supporting her overall fascination with the point of contact between a nib
      and a page. By drawing a line she is drawing a border. By drawing a border
      around the interior of every room is she creating the room? By drawing a
      border is she describing that this room, this house, is now different from
      what is outside the border? By drawing this line, this border, is what is
      inside this border something else? By drawing this border is she saying
      that this house was not a house, it was a home? By drawing this border is
      she saying that this house is now different from all the other houses
      outside the border because they are just houses and this was a home?
    </p>
    <p>
      Checking herself when she crosses a border she files away anything she
      won’t need, any stories she won’t need. Every spy operates in a cell of
      their own. Every spy operates without wires. Every spy has a safehouse.
      Knowing what to leave in a safehouse and what to leave elsewhere. Knowing
      who to tell about the safehouse and who to never let know it even exists.
      Looking at a face and deciding in an instant how much to tell them.
      Looking at a face and deciding in an instant that they will learn nothing.
      Taking a circuitous route back to the safehouse. Making it look like there
      is no safehouse. Allowing me into the safehouse.
    </p>
    <p>
      I tell stories. She sings. I put on some music and we dance. We kiss. She
      makes a meal. I watch and offer to help. We sit on the couch in each
      other’s arms. We watch the day darken and end outside. We draw the
      curtains before turning on a light. She tells me stories. We kiss. Share
      the bathroom washing our teeth. We have drawn our border and now this
      place is our country, our land. These rooms are our empire. The door with
      the chain drawn is our border we’ve closed. We touch as we pass cleaning
      up glasses and rinsing plates. We undress and slip beneath the covers. We
      decree that it is too cold outside of the bed for either of us to leave.
      This is our country and these are our laws. The line we have drawn is the
      only line that matters. We make love and feed off the heat of each other.
      Behind our closed border the only currency is the heat of our bodies. The
      only language is touch and kiss.
    </p>
    <p>
      I know I could be getting her work very wrong. I know if I ask her and
      suggest what I think as I listen to her speak and watch the video of her
      work and consider her story that I could be getting everything wrong, very
      wrong. I know this and I know that by asking her she will explain where I
      am going wrong. But as I choose to not talk to her in the pub after the
      event, as I choose not to ask her I know I will probably never know. So I
      will keep my wrongness, in whatever shape it may be.
    </p>
    <p>
      Knowing what is out there about her. Making sure she leaves no traces. No
      breadcrumbs to follow. Like the time, horse riding in the hills above the
      city. Pretending to the guide that phones had been forgotten and left back
      in the car so she couldn’t take a photograph. Knowing just what to say to
      make sure she leaves no footprints. Knowing how cautious she has to be
      because she knows what will happen if she gets caught. She knows the
      penalty for being a spy. She knows the price she would pay. Knowing the
      risk. Knowing the reward. She is a spy but she crosses the border for me.
    </p>
    <p>
      The enemy of every border is time. Time erodes and erases borders. Borders
      that stand for millennia disappear in an instant. Borders that stand and
      repel invaders for generations eventually fall over nothing. The enemy is
      time. We make love in the morning to feed our border. We eat breakfast and
      shower and return to bed to make love to keep our border intact. But time
      is the enemy. Time is the enemy and our border cannot hold. Time is the
      enemy and our border crumbles and I have to go.
    </p>
    <p>
      The door is just a door now. The chain is just a chain. The corridor
      outside is the same corridor as it was before it was a border post. We
      kiss before I pass through the door, we kiss before I cross what is left
      of the border. We kiss and I promise to message her as soon as I get home.
      We kiss and we already make plans to declare our own country again. There
      will be walls. There will be dogs and searchlights. There will be other
      borders to cross and lies to keep. There will be codes and secret
      messages, checking for watchers and disappearing in plain sight. But we
      will draw our line. We will make our border again and stake out our own
      land. We will close a door and seal it with a line and ward off the world.
    </p>
  </div>
</div>

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
  .text-options {
    display: flex;
    max-width: 740px;
    margin: 0 auto;
    border-top: 1px solid #4f4950;
    border-bottom: 1px solid #4f4950;
    align-items: center;
    button {
      flex: 1 0 50%;
      background-color: rgba(255, 255, 255, 0);
      border: none;
      color: #4f4950;
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
      &:hover {
        background-color: #4f4950;
        color: rgb(207, 207, 207);
        cursor: pointer;
      }
    }
  }
</style>
