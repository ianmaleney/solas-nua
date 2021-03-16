<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
  import AudioPlayer from "../../components/AudioPlayer.svelte";
  import ArticleHeader from "../../components/ArticleHeader.svelte";

  import { onMount } from "svelte";

  import { themeColour, headerOpacity, blob1, blob2 } from "../../store.js";
  import { move } from "../../moveBlob";

  onMount(() => {
    document.title = "View Source | 'A Scarf' – Doireann Ní Ghríofa";
    let blobs = document.querySelectorAll(".blob");
    [...blobs].forEach((el) => move(el));
    themeColour.update((theme) => "#CED1CE");
    headerOpacity.update((o) => 0.5);
    blob1.update((c) => "#936b6766");
    blob2.update((c) => "#1f38348c");
  });

  //

  let audioActive = false;
</script>

<ArticleHeader
  title="A Scarf"
  author="Doireann Ní Ghríofa"
  bind:audioActive
  printFile="/assets/prints/a-scarf-print.pdf"
/>

<AudioPlayer
  src="/assets/audio/scarf.mp3"
  active={audioActive}
  credits={"Read by Vicky Langan."}
/>

<div
  class="text"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <p>
    Last year, during long-delayed works on our home, our family struggled to
    find anywhere to rent. My husband’s father agreed to lend us the
    twenty-five-year-old campervan he had recently purchased. For an uncertain
    number of months its three beds, chemical toilet, two-ring gas hob,
    child-sized sink and mini-fridge would accommodate the six of us.
  </p>
  <p>
    We did our best to adapt. I took to loitering in the schoolyard long after
    everyone else had left, so the children could play and shout and run. My
    husband hauled our ancient washing machine onto a table in the garage and
    improvised a rickety slide from old gutters and twine, rollercoastering suds
    out to the drain. The van’s side window, slightly ajar, became our
    letterbox; we thanked the postman through mouthfuls of cereal. I grew used
    to fetching water from the fresh-water pipe that lay in the gravel outside,
    but not to the stiff valve that always sprayed my shins, nor to the grit
    that inevitably found its way into my coffee. It’s only for a few months, we
    said, as the six of us showered in a local gym. Any time a cheap Airbnb
    became available within a ninety-minute drive, we hurried to its heaters,
    oven dinners and hot water – but such occasions were rare, and winter was
    approaching.
  </p>
  <p>
    It grew cold. Storm clouds gathered; the van flinched from the gales. I
    flinched too. No matter how long I bent over that small sink, scrubbing,
    always scrubbing, our belongings felt grimy. If two of us stood upright at
    once, the van felt intolerably crowded. I didn’t scream, but I often wanted
    to. When I dug out our box of hats and gloves, I held the familiar darkness
    of my favourite scarf to my face, inhaling deeply. It smelled like home. I
    began to wear it all the time, taking it off only while I slept.
  </p>
  <div class="window">
    <div class="pane" />
  </div>
  <p>
    An invitation to spend the Halloween midterm at a friend’s empty cottage in
    Mayo seemed too good to be true: a week of warm beds would be luxurious, not
    to mention a dishwasher. There was something else, too: a half-remembered
    family myth from Mayo. Stray threads began to come back to me as we drove
    the tunnel deep under the Shannon. My young great-grandfather on the run;
    soldiers surrounding a church while he was at mass; and his escape disguised
    as a woman.
  </p>
  <p>
    In Clare we paused for lunch at my parents’ home. While the children
    squabbled over pizza, I poked through bookshelves until I found what I was
    looking for. The first folder had been compiled by my grandfather and
    incorporated reminiscences of his own youth, a vast family tree, and
    recollections of his father, Pádhraic Ó Gabhláin. Pádhraic was the subject
    of the second folder too, a college project submitted by my mother as part
    of her teacher training. This included an appendix of photocopied sources:
    handwritten letters, old maps, obituaries, and copies of articles from the <em
      >Freeman’s Journal</em
    >, <em>An Claidheamh Solais</em>, the <em>Western People</em>, and the
    <em>Irish Independent</em>. Having little time before we had to get back on
    the road, I flicked through the obituaries until I found a trace of the
    story I sought, documented in newsprint by his friend Aodh Ó Nualláin. The
    obituary described events that had occurred one Sunday at Aghamore church in
    east Mayo during the War of Independence, when ‘a company of military
    arrived and surrounded the church’. Pádhraic – a member of what was
    initially known as the Irish Volunteers and later as the IRA –
  </p>
  <blockquote>
    by dressing as a woman and walking out of the church with as much dignity as
    possible among the women members of the congregation. Apparently there was
    some delay in getting the proper fit in clothes and shoes, but the celebrant
    of the mass, the late Reverend Father Garvey, was a staunch Republican, and
    many in the congregation noticed that on that particular Sunday the prayers
    after mass were unusually long.
  </blockquote>
  <p>
    I wanted to know more, but it was nearly time to leave. I made a quick run
    to the copy-shop and then hurried the folders back to the shelf.
  </p>
  <p>
    As we drove onwards to Mayo, I held my photocopies close. It was dark by the
    time we found our way to the cottage, unpacked, and put the children to bed.
    I poured a glass of wine, opened the documents, and began at the beginning.
  </p>
  <p>
    Born in 1892, Pádhraic left primary schooling to work on local farms and
    bogs, travelling alongside his neighbours to labour seasonally in England.
    This cluster of families had worked side by side for generations – the
    Bolands, Greallys, Spellmans, and Forkans had been neighbours since
    pre-Famine times, my grandfather wrote, their names marked on landlord’s
    maps ‘of linen in Indian ink and watercolour with lists of tenants and
    holdings’. He and his best friend Hugh Nolan (who, decades later, would sign
    his obituary as Aodh Ó Nualláin) were sometimes overheard chatting about
    characters from Dickens in terms so familiar that passers-by presumed they
    were speaking of locals. Together, they started a pamphlet that was posted
    from house to house, with each recipient filling an empty page with a new
    story.
  </p>
  <p>
    The 1911 census noted that Pádhraic’s parents spoke both Irish and English,
    whereas he and his siblings spoke English only. There, he was documented
    under the name he grew up with: Patrick Forkan. Shortly thereafter, in his
    early twenties, he and some friends were chatting by the roadside when a
    passing teacher greeted the group casually in Irish. My great grandfather
    felt such shame at his inability to reply that he began to attend Irish
    classes. He quickly took to the language. Such was the demand among young
    people wishing to do likewise at that time that anyone who had gained a
    minimal fluency in Irish was asked to volunteer to instruct new students. In
    those slapdash classrooms he found his vocation; and henceforth he always
    used the Irish form of his name. Teaching was to become what Ó Nualláin’s
    obituary described as ‘the pleasure of his life’. Beyond those classes, his
    days were spent in farmwork, reading, and writing.
  </p>
  <p>
    By April 1917 Pádhraic was secretary of a local branch of Conradh na Gaeilge
    and had established a company of the Irish Volunteers in Crossard.
    Photographed at the Sinn Féin ardfheis with neat tie, crisp collar, and hair
    swept to the side, he smiled with earnest eyes. He did not know what was to
    come. No one did. I found that my own grasp of what was to come was lacking
    too, so I turned to the internet to fill the gaps in my knowledge of the War
    of Independence. By 1920, I read, attacks on the constabulary were growing
    so common all over the country that supplementary forces were deployed. So
    many of the Black and Tans and Auxiliaries arriving in Ballyhaunis had
    fought in the First World War that the area in which they were billeted was
    nicknamed ‘The Dardanelles’. Incidents of cruelty, drunken violence and
    torture were soon reported across Mayo. In response, local resistance groups
    grew, companies of the Irish Volunteers proliferated, and both ambushes and
    retaliatory acts of violence intensified.
  </p>
  <p>
    Ó Nualláin noted that Pádhraic took a very active part in the organisation
    of the Ballyhaunis Battalion, a fact that was apparently noticed by the
    Occupation Forces of the area, for from early in the troubled times he
    seemed to have attracted their particular attention. From documents captured
    by the Dublin brigade and forwarded to the local volunteers it became clear
    that he was a marked man, and he was obliged to go ‘on the run’ and remain
    constantly on the alert.
  </p>
  <p>
    The next morning, I cleared the children’s breakfast bowls from the table
    and searched groggily through the online archives of the Bureau of Military
    History, hoping to find Pádhraic’s story recounted in his own words; but it
    seems he did not provide testimony to the Bureau. I did find his name in
    documentation from the Military Service Pensions Collection, dated 1935, in
    which those who fought in Mayo battalions were listed retrospectively. His
    name is among those recalled by Captain Seán Carney, who listed him as
    Patrick Forkan of the 2nd Western Division, I Brigade (South Mayo), 5th
    Battalion, B Company. Many of the surnames my grandfather had noted on local
    pre-Famine maps were also listed in this company, suggesting that he was
    among friends and neighbours.
  </p>
  <p>
    In the absence of a description in my great-grandfather’s own words, I
    sought out accounts by the others. Ernie O’Malley’s oral history of the War
    of Independence in Mayo was available online, and there I read how Johnny
    Greally – a man who was born, grew up, lived, and fought by Pádhraic’s side
    – described the day their commanding officer, Seán Corcoran, was murdered:
  </p>
  <blockquote>
    We heard that Curley’s house was to be burned, and we went to get rifles to
    defend it. Seán and Maurice Mullins were supposed to call at this house, but
    when he was coming over Seán ran into a patrol of Tans. His revolver jammed
    at the first shot and he was shot dead, and Maurice, who was unarmed, was
    beaten almost to death. They beat him there and they threw him in on top of
    the dead Seán Corcoran in the turf house of the Barracks.
  </blockquote>
  <p>
    Later that day, a sniper shot one of the Black and Tans in retaliation. As
    vengeance, the Black and Tans murdered a local man named Michael Coen,
    mutilating his corpse: ‘they cut off his private parts and pinned them on
    his breast, and they cut the flesh of his legs and arms. They cut off his
    ears and left him out on the road. They were night and day in that area in
    Crossard townland, searching, for they must have had information. [...] The
    people stiffened their resistance.’
  </p>
  <p>
    I do not know what part, if any, Pádhraic played in the events of that day,
    but Greally’s account allowed me a glimpse of the environment in which he
    was engaged. Pádhraic was one of many who survived by stealth in those
    years, hurrying from safe-house to safe-house. His continued evasion of the
    Black and Tans became a source of local bafflement. Ó Nualláin writes:
  </p>
  <blockquote>
    In spite of the special enemy attention he took part in all the activities
    of the area and was never captured, although his many hairbreadth escapes
    made him almost a legendary figure in his native district. On one occasion
    when visiting his own home he was suddenly told that a large force of police
    and military were surrounding the house. He slipped out, however, and
    although the enemy opened fire, his knowledge of the country enabled him to
    escape.
  </blockquote>
  <p>
    Greally explained to Ernie O’Malley that their small group ‘had no arms save
    shotguns. There were a couple of rifles but you couldn’t be sure of them. We
    fired off ammunition from Seán Corcoran’s rifles, but only an odd round went
    off. We had very few short arms.’ The best resource at their disposal was
    the goodwill offered by neighbours, whether through shelter or sustenance.
  </p>
  <p>
    Within a month of Corcoran and Coen’s deaths, I read, the men found
    themselves in peril again, having been traced to a remote area of bogland.
    Greally described how the Black and Tans had information that we would be in
    the bog, the six of us, myself and Paddy Boland, the company O/C, Pádhraic
    Forkan, a Gaelic teacher, Austin Kenny and Jim Kilkelly. They wanted these
    six of us. We were in a neighbour’s house where we used to stay, when Paddy
    Mullins, the Brigadier, sent over bombs with me. The Master sent word to us
    by a young lad, who came across the fields, and we had just time to get out.
    They, the soldiers, fired shots, and they went into the house again, and
    they bayoneted poor Paddy Boland who was an only son. They bursted the
    bayonet in him and they almost cut his nose off with a bayonet also.
  </p>
  <p>
    The neighbour in whose house they had sheltered was my
    great-great-grandmother: Pádhraic would marry her daughter. I remembered her
    from a section of my grandfather’s reminiscences I’d read the night before,
    a memorable passage that skipped from amusement to dread within a single
    paragraph: My grandmother looked like a grandmother. She was fat and
    comfortable and dressed in black. [...] She said very little about ‘the
    troubles’. The only thing I remember was her account of the day when Paddy
    Boland was shot. ‘The boys’ had run from her house as the troops approached
    and scattered across the bog. Paddy Boland was shot dead a few hundred yards
    from the house. She watched from a window as his body was carried on an
    improvised stretcher covered in a blanket. It was only when she could see
    the boots that she knew it was not one of her own sons.
  </p>
  <p>
    The date of Pádhraic’s escape from Aghamore church is not recorded in any
    document I have seen; all we know for sure is that it must have happened
    during the year and a half between the arrival of the Black and Tans in
    Ireland, at the beginning of 1920, and the truce that was agreed in the
    summer of 1921.
  </p>
  <p>
    After the truce, and the treaty, and the split in the republican movement,
    Pádhraic couldn’t bring himself to participate in the civil war that com
    menced in the summer of 1922. Another obituary, by C. Caimbhéal, noted that
    ‘He was a respecter of valour and worth in any who had shown faith in their
    cause. I recall his yearly buying of poppies from an ex-army captain on
    Armistice Day. He was no bigot.’ He married. He wrote. He worked. His
    children were born. He returned to his beloved books. He secured a job at
    Ballyhaunis Vocational School, and filled his summers with further teaching
    at Coláiste Chonnacht, in the heartlands of Conamara. He loved to read, to
    write, to teach, and to laugh.
  </p>
  <p>
    My grandfather noted that ‘a straightforward description of my father’s
    subsequent career might make him sound like a worthy, earnest and dull
    character. This is as far from the truth as could be. One of the most
    obvious things about him was his sense of humour – wild, anarchical humour
    in his youth; warm and witty in his later years and never fully subdued by
    old age.’ Reading this line, I wished that I could have heard him laugh.
    When Pádhraic died in 1965, his coffin was draped in the tricolour, and his
    surviving comrades, Johnny Greally among them, formed a guard of honour. A
    passionate graveside oration was delivered by John P. Jordan. Of this
    funeral, C. Caimbhéal wrote: ‘There were no tears on any face for it was the
    honouring of a warrior, and none weep when a soldier sleeps when his fight
    is over.’
  </p>
  <div class="window">
    <div class="pane" />
  </div>
  <p>
    After closing the folders and all the tabs on my phone, I couldn’t stop
    thinking about what I’d read. I woke that night thinking of how the young
    Pádhraic had sent his little pamphlets from house to house, always including
    empty pages in which recipients could add a new story. So far, his son and
    granddaughter and several obituarists had filled pages with their writings
    on his life; perhaps I could add a page, too. ‘Cloch le carn’ is the phrase
    used for the traditional act of adding one’s own stone to a cairn made in
    memory of another. Rather than a cairn, however, I found myself thinking of
    the story as a beloved scarf, a garment whose stitches I had already begun
    to unpick into a soft mass of unravelled facts. As a girl, the story of his
    escape from Aghamore church had seemed a neatly woven tale of adventure,
    prudently tailored to a child’s ears: no torn flesh, no torture, no terror.
    Now that the dark red of Greally’s voice had seeped in, however, there could
    be no erasing it. I wondered what other threads might add themselves as I
    set upon knitting my own telling of it.
  </p>
  <p>
    It was this curiosity that led me to bring the whole family to the church at
    Aghamore the following day. We are not a family of mass-goers, and I can’t
    recall how I sold them on this road trip. As soon as we parked, I hurried
    ahead, certain that I wouldn’t have much time before the kids lost patience,
    before pausing in the porch, suddenly nervous. I would be alone, if only for
    the length of time it took my husband to wrestle coats and hats onto our
    children. A residual whiff of sanctity haunted the air. My breath was short
    and growing shorter – I had wound my scarf too well, I realized, tucking a
    finger between fabric and throat until it gave a little. I drank a deep
    lungful and watched my breath hurry away, a small fog, or a ghost: glimpsed,
    then gone. I pushed the door and stepped into the story.
  </p>
  <p>
    The church was empty. I moved quickly up the aisle, snapshotting details on
    my phone as I went: a statue, an altar cloth, a dent worn into the floor by
    many decades of footfall. Outside, clouds broke and blew; when shards of
    sunlight met stained-glass eyes, I wondered whether those glassy faces had
    felt alive to my great-grandfather, too. Above my head, the intricately
    crafted timber roof was neat as a ribcage. All his life, Pádhraic returned
    to pray here, surrounding himself with the same people, all standing and
    kneeling in unison, their voices murmuring a warm chorus around his.
    Together and alone, they aged. Theirs were the eyes that met his in worship,
    on feast days, at funerals and baptisms, on the day he escaped from the
    Crown forces, and on his wedding day.
  </p>
  <p>
    My children flung open the door and galloped toward me, raucous as ever,
    with coats flapping open, hats and scarves forgotten, shouldering into each
    other, giggling and squabbling, their cheeks already reddened by cold. I
    rolled my eyes at my husband – it is a running joke between us that while I
    mollycoddle the children with mittens and vests and thermal underwear, he
    believes that a little cold will toughen them. Sitting in the pew with a
    child on each knee and another in each elbow, I began to adjust the story
    for their ears; but soon they were whingeing for the car. The only one who
    insisted on staying was the boy who always stays by my side when I lead my
    family on such jaunts, the child who at seven is skinny and bold and bright
    and always fights to hold my hand. I continued to photograph the little
    details that surrounded us, and that had once surrounded Pádhraic: the
    dinged brass of the altar bells, the dark lustre of the confessional box,
    the altar that had never figured in my imaginings until its inscription
    loomed before me. Sanctus, Sanctus, Sanctus: a male figure was carved there,
    each fold of his gown whittled from cold stone. Holy, Holy.
  </p>
  <p>
    Only when my son whispered ‘I’m cold, Mám,’ did I notice that his coat had
    been forgotten altogether. I was glad of the warmth my body had pressed into
    the weft of my scarf as I wound it into a pullover of sorts, criss-crossing
    its endings into his waistband: snug. I pressed my lips to his forehead and
    on we went with my hand in his, or his in mine. When he asked what we were
    looking for, I couldn’t answer because I didn’t know, beyond the sense that
    he and I had entered the story, and now we had to find our way towards some
    sort of an ending. Perhaps the gesture of leaving a little flame in our wake
    might do it? No, all the wicks were unlit, and I could see no matches.
  </p>
  <p>
    My son shrugged and asked me to finish telling the story, and I did, and was
    surprised on approaching the ending to find myself saying, ‘and if it
    weren’t for that moment, would we be here today, you and me?’
  </p>
  <p>
    I was smiling as I turned towards the door, until my son broke away to dash
    a giddy circuit of the room, hee-hawing the chorus of ‘Old Town Road’ and
    cackling over his shoulder. From the porch I called to him in exasperation,
    then called again, my voice growing colder now, cold and cranky. While I
    waited, I lined up one last photo of the aisle, the door ajar to show its
    neat symmetry of empty pews; but just as I got the framing right, my son
    hurtled through the shot, blurring past me and sprinting out towards the
    car. Little trespasser. I arranged the photo again, and then turned to catch
    up with him. The door of the church thumped heavily behind us.
  </p>
  <p>
    In the car, my husband was thumbing his phone and the children were munching
    chocolate biscuits. I felt satisfied as I clicked my seatbelt – seeing this
    place felt like some small achievement to show for our cold months away from
    home. But back in the cottage, I couldn’t sleep for incessant fidgeting: the
    story wouldn’t rest. If I couldn’t hear the story of this escape in
    Pádhraic’s own voice, then maybe there was a way to hear it in the voice of
    one who had stood by him. My mother had once heard a man on the radio
    describe how, long ago, his grandmother had disguised a man at mass to save
    him from the Black and Tans. She had made a note of the man’s name. Tadhg
    Mac Dhonnagáin was a publisher of Irish-language books, and I knew him a
    little from Twitter. He lived in Conamara, only an hour and a half or so
    away. I found his email address. I told him that I wanted to know how this
    story had been told in his childhood.
  </p>
  <div class="window">
    <div class="pane" />
  </div>
  <p>
    In the Buillín Blasta café in An Spidéal, Tadhg described his grandmother,
    Annie Kenny: a bright young woman who had been awarded a teacher-training
    scholarship in Belfast, but still travelled home at weekends to lead the
    church choir. The story he had inherited began there, with a young woman
    leading a chorus of voices, called to a sudden act of courage, then hurrying
    to save a life. It was a tale he had treasured as a child, Tadhg said, and
    he told it beautifully: Annie’s quick thinking, her gathering of garments,
    her supervision of the disguise, her palms rubbing distemper from the walls
    to press on Pádhraic’s cheeks. His favourite part of all, he said, was the
    importance placed on one detail: the height of the women chosen to escort
    him to safety. Those women: they were tall.
  </p>
  <p>
    I thanked Tadhg for his time, wound myself back into my scarf and rummaged
    my car keys from my handbag. Driving back to Mayo, between mountains and
    bogs, over stone bridges and boreens, I pictured Annie on the church
    mezzanine, her hair braided and pinned high, her face among the crowd in the
    choir, alive and afraid. A wild, fearful whisper was flying through the
    church below. She watched as one person whispered in dread to the next: they
    were surrounded. The soldiers were outside with their guns.
  </p>
  <p>
    When the whisper reached Pádhraic’s ear, I imagine that he sat in silence a
    moment, assessing his predicament and that of the people around him. There
    were elderly people present, women, and children. If he surrendered, might
    others be spared?
  </p>
  <p>
    The priest, knowing these soldiers as brutally violent and unpredictable,
    bought time by lengthening the prayers. Annie hurried down from the choir
    and gathered garments: a dark shawl here, a skirt there, perhaps a blouse.
    Pádhraic was urged to his feet and dressed. Palms were pressed to damp
    walls, and then to the shadow of his stubble. A black shawl was drawn over
    the crest of his skull, quick as a shadow. The priest drew the prayers to
    their end. The two tallest women stood by him, arm in arm, their trio folded
    within the close crowd. Elbows trembled. Down the aisle they all went, out
    the door, past the soldiers. Eyes lowered. Jaws tight. No flinching. A
    procession of bodies leaving the church gates and walking steadily away:
    almost an ordinary sight. On this Sunday, everyone leaves alive. The End.
  </p>
  <p>
    Exhilarated and weary from driving, I fell into bed early, but my heart
    raced, and my toes twitched: too much coffee. Eventually I fumbled my phone
    from where it was charging on the floor and swiped idly through photos of
    our trip: playgrounds, mountains, the gift of a barmbrack, Harry Clarke
    windows in Ballinrobe, a little dog called Marcie. I came to the penultimate
    photo I’d taken in the church, the one that had vexed me when my son flung
    himself through it. I zoomed in by fingertip. There was the aisle, along
    which a male shadow hurried. By the next photo the aisle was empty. How
    brief, his presence: glimpsed, then gone. When I swiped back, though, he
    reappeared, wrapped again in a borrowed shawl, folded into the fabric of
    that inherited story – too big and too dark – in which we all find ourselves
    bound by those who came before us.
  </p>
  <p><br /></p>
  <p style="text-align: center">&#x2059;</p>
</div>

<div class="credits text">
  <p>
    <em>A Scarf</em>, written by Doireann Ní Ghríofa, was first published in
    <em><a href="https://thedublinreview.com/">The Dublin Review</a></em>.
  </p>
  <p>
    Doireann Ní Ghríofa is a poet and essayist. <em>A Ghost in the Throat</em> was
    awarded Book of the Year at the Irish Book Awards, and described as “glowing”
    (Anne Enright), “spellbinding” (Joseph O’Connor), “gorgeous” (Lauren Elkin),
    “captivatingly original”​​ (The Guardian), “sumptuous” (The Sunday Times), and
    a “masterpiece” (Sunday Business Post).
  </p>
  <p>
    Doireann is also author of six critically-acclaimed books of poetry, each a
    deepening exploration of birth, death, desire, and domesticity. Awards for
    her writing include a Lannan Literary Fellowship (USA), the Ostana Prize
    (Italy), a Seamus Heaney Fellowship (Queen’s University), and the Rooney
    Prize for Irish Literature, among others.
  </p>
  <p>
    Vicky Langan is an artist whose practice operates across several often
    overlapping fields, chiefly sound, performance and film. Langan both
    embraces and projects vulnerability, offering an intimate territory loaded
    with personal symbolism and unguarded emotion. With a focus on field
    recordings and the amplified body coming into contact with simple raw
    materials, she layers physical gestures and scraps of rough sound to create
    intensely personal imaginary landscapes. Her decade-long filmmaking
    partnership with filmmaker and critic Maximilian Le Cain has resulted in
    screenings and retrospectives of their work having been shown throughout the
    world. Langan/Le Cain are affiliated with Experimental Film Society, a
    company dedicated to the creation of uncompromisingly personal, formally
    challenging filmmaking. Langan is a recipient of the Arts Council of
    Ireland's Next Generation Artists Award.
  </p>
</div>

<style lang="scss">
  :global(.text) {
    max-width: 740px;
    margin: 0 auto;
    font-size: 1.35rem;
    line-height: 1.5;
    padding: 0 2vw;
    font-family: var(--body);
  }
  :global(.text.wide) {
    max-width: 1280px;
    @media (max-width: 960px) {
      font-size: 1.1rem;
    }
  }
  :global(blockquote) {
    font-size: 1.15rem;
    line-height: 1.3;
    border-left: 1px solid #1f3834;
    padding-left: 10px;
  }
  .credits.text {
    border-top: none;
    border-bottom: none;
    margin-top: 100px;
  }
  .window {
    // border: 1px solid #1f3834;
    height: 200px;
    width: 100%;
    background: linear-gradient(90deg, transparent, #dbc282, transparent);
    position: relative;
    mix-blend-mode: soft-light;
    opacity: 0.5;
    .pane {
      // filter: blur(1px);
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-image: linear-gradient(to bottom, transparent 90%, #29140f 10%),
        linear-gradient(to right, transparent 90%, #29140f 10%);
      background-size: 10px 10px, 10px 10px;
    }
  }
</style>
