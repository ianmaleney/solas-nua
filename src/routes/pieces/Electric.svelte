<script>
  import { blur } from "svelte/transition";
  import { linear } from "svelte/easing";
  import AudioPlayer from "../../components/AudioPlayer.svelte";
  import ArticleHeader from "../../components/ArticleHeader.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    document.title = "View Source | 'Getting The Electric' – Louise Hegarty";
  });

  let audioActive = false;
</script>

<ArticleHeader
  title="Getting The Electric"
  author="Louise Hegarty"
  bind:audioActive
/>

<AudioPlayer
  src="/assets/audio/electric.mp3"
  active={audioActive}
  credits={"Composed and performed by Maija Sofia."}
/>

<div
  class="text electric-text"
  in:blur={{ delay: 100, duration: 800, amount: 10, easing: linear }}
  out:blur={{ delay: 0, duration: 600, amount: 10, easing: linear }}
>
  <span class="el-sec"
    >‘Before getting the electric, we had no running water, no refrigeration, no
    machine for washing. We were bound to daylight hours. Electricity meant
    parish hall dances and colour and fun. It was a release from the drudgery.
    It meant we could finally see ourselves.’</span
  >
  <span class="el-sec g7 justified"
    >The first induction coil was invented in 1836 by Nicholas Callan, a priest
    and scientist from Louth. This early form of transformer contributed greatly
    to the widespread distribution of electricity throughout the world.</span
  >
  <p class="el-sec g5 r2">
    <span class="r90cc"
      >The advantages of electricity to the agricultural industry and the
      day-to-day lives of farmers would be undeniably immense. It would lead to
      an improvement in hygiene and safety standards, the simplifying of many
      daily tasks and a rise in efficiency, which would result in greater
      profits. It would also make rural Ireland an attractive site for new
      industries. It is imperative therefore that such a scheme begins without
      further delay. - 'Electricity in Rural Ireland' by A. Byrne published in
      Muintir na Tíre (Issue 22, March 1929, p.8)</span
    >
  </p>
  <div class="img-wrapper el-sec g7">
    <img src="/assets/images/gte1.jpg" alt="gte1" class="grid-image" />
  </div>
  <span class="el-sec g7 justified"
    >Thomas McLaughlin (1896 - 1971) was born in Drogheda. After studying in UCD
    and UCG, McLaughlin moved to Berlin in 1922 to work for the German
    electrical engineering company Siemens-Schuckert. He returned to Ireland in
    December 1923 where he became one of the key figures in the Shannon
    hydroelectric scheme. He later became the executive director of the ESB.</span
  >
  <span class="el-sec g5 centred"
    >In Cavan there was a great fire,<br /> Judge McCarthy was sent to inquire,<br
    />
    It would be a shame, if the nuns were to blame,<br /> So it had to be caused
    by a wire.<br /> — Flann O’Brien & Tom O’Higgins</span
  >
  <span class="el-sec"
    ><strong
      >In our country, electrification is more than merely producing light or
      power. It is bringing light into darkness… we are going to put into the
      homes of our people in rural areas a light which will light up their minds
      as well as their homes. If we do that, we will have brought a new
      atmosphere and a new outlook to many of these people.</strong
    ><br /> — James Larkin Jnr, TD, speaking during the Second Stage debate on the
    Electricity Supply (Amendment) Bill, 1944</span
  >
  <p class="el-sec g7">
    <span class="r90cc"
      ><strong>Customs-Free Airport Act, 1947</strong><br /> 2.—(1) The Minister,
      with the concurrence of the Minister for Finance, may by order declare that,
      on and after a specified date, the land enclosed within the limits defined
      by the order shall be the Customs-free airport for the purposes of this Act.
      (2) The Minister, with the concurrence of the Minister for Finance, may from
      time to time by order amend the order under subsection (1) of this section
      by varying the limits of the airport. (3) The airport shall comprise only land
      which for the time being belongs to the State.</span
    >
  </p>
  <span class="el-sec"
    >The Rural Area Organiser was an important figure in developing the
    relationship between the ESB and local people. The job involved encouraging
    householders to sign up to the scheme as well as advising on the purchase of
    electrical appliances.</span
  >
  <span class="el-sec"
    >AN ACT TO MAKE PROVISION FOR THE FORMATION AND REGISTRATION OF A COMPANY
    HAVING FOR ITS PRINCIPAL OBJECTS THE ACQUISITION, ERECTION, AND OPERATION OF
    SUGAR FACTORIES IN SAORSTÁT ÉIREANN, AND TO PROVIDE FOR THE ACQUISITION BY
    THE MINISTER FOR FINANCE OF SHARE CAPITAL OF SUCH COMPANY, FOR THE GIVING OF
    GUARANTEES BY THE STATE IN RELATION TO DEBENTURES ISSUED BY SUCH COMPANY,
    FOR THE COMPULSORY ACQUISITION OF LAND AND THE CONSTRUCTION, MAINTENANCE,
    AND OPERATION OF TRANSPORT WORKS BY SUCH COMPANY, AND FOR OTHER MATTERS
    CONNECTED WITH THE MATTERS AFORESAID. [23rd August, 1933.]</span
  >
  <span class="el-sec"
    >Once upon a time there was a man and a woman who lived with their two
    children—a girl and a boy—on a small farm. Beside their house was a fairy
    fort. The woman was pregnant with a child and late one night she gave birth
    to a little boy. They warned the two older children never to leave the
    window to the bedroom open in case a fairy entered and took the baby, who
    was vulnerable… - The Changeling transcribed by a member of our volunteer
    transcription project, duchas.ie</span
  >
  <span class="el-sec"
    >… I hope to see the day that when a girl gets a proposal from a farmer she
    will inquire not so much about the number of cows, but rather concerning the
    electrical appliances that she will require before she gives her consent,
    including not merely electric light but a water heater, an electric clothes
    boiler, a vacuum cleaner and even a refrigerator. - Minister Seán Lemass
    speaking during the Second Stage debate on the Electricity Supply
    (Amendment) Bill, 1944</span
  >
  <span class="el-sec"
    >What does rural electrification mean to you? How can you get it to your
    house and farmyard?</span
  >
  <span class="el-sec"
    >The switching on ceremony was an important part of the process and
    generally featured a dance, a dinner and speeches from local politicians,
    members of the clergy and representatives of the ESB. - Switching on: A
    History of Rural Electrification in Ireland by John Swanzy (Mweelrea Press,
    2016)</span
  >
  <span class="el-sec"
    >Virginia O’Brien (1898 - 1988) was the longest serving chairwoman of the
    Irish Countrywomen’s Association. During her lifetime she witnessed
    significant changes in the lives of rural Irish people: the advent of
    independence, the rural electrification scheme and membership of the EEC.
    She was married to Frank O’Brien until his death and they had five children
    together.</span
  >
  <span class="el-sec"
    >This is the tenth issue of the staff magazine and we are now well into the
    swing of things. We have completed at least one area in each county with
    some counties already having completed two or three. Before the end of this
    year we will be adding another five construction crews to the ten already
    working in the field. Shortly, we will also be increasing the number and
    variety of appliances available in our showroom - Editor’s Letter, REO News
    (vol. 10, September 1948, p1)</span
  >
  <span class="el-sec"
    >A backslider was a householder who had initially signed up for the
    electricity scheme but who changed their minds once crews arrived.</span
  >
  <span class="el-sec"
    >THE REPUBLIC OF IRELAND ACT, 1948 AN ACT TO REPEAL THE EXECUTIVE AUTHORITY
    (EXTERNAL RELATIONS) ACT 1936, TO DECLARE THAT THE DESCRIPTION F THE STATE
    SHALL BE THE REPUBLIC OF IRELAND, AND TO ENABLE THE PRESIDENT TO EXERCISE
    THE EXECUTIVE POWER OR ANY EXECUTIVE FUNCTION OF THE STATE IN OR IN
    CONNECTION WITH ITS EXTERNAL RELATIONS. [21ST DECEMBER, 1948] BE IT ENACTED
    BY THE OIREACHTAS AS FOLLOWS:—
  </span>
  <span class="el-sec"
    >Each area was canvassed in order to assess interest and need and to promote
    the benefits of electricity. A majority needed to sign up to the scheme in
    order for it to proceed. Showrooms were opened so that electrical appliances
    could be demonstrated to the public. Routes were surveyed, budgets were
    drawn up and then the erection of electricity poles began. - Swanzy, ibid.</span
  >
  <span class="el-sec"
    >The key-note of Electric Water- Heating is simplicity. There is no
    complicated ritual of turning handles at the psychological moment – you just
    turn the hot water tap.</span
  >
  <span class="el-sec"
    >‘They were young men. They looked like my grandsons. But they did the job
    well. There was a lot of interest from everyone and we would all go out to
    watch them erect poles and string cables. My wife would bring them cups of
    tea and slices of warm brown bread.’</span
  >
  <span class="el-sec"
    >You will want a light on in every room. Place it so as to give the best
    light where you need it most. In some cases you might want two or more
    lights. Make sure that your staircase light can be switched on or off from
    either the foot of the stairs or the landing.</span
  >
  <span class="el-sec"
    >The switching on ceremony will take place from 8 o’clock on Tuesday night
    the 14th of October in the parish hall. There will be a blessing from Father
    Aherne and opening speeches from Mrs O’Brien of the ICA and Mr Geary of the
    ESB. The switching on will happen at half past nine sharp. Following this
    there will be a dance with music provided by the West Coast Showband. PUBLIC
    NOTICE</span
  >
  <span class="el-sec"
    >Transcript of recording made as part of a local history project: Once it
    was dark and the speeches were over, we put out the paraffin lights and
    candles and the local priest switched on the big metal switch and then
    everything was bright. Myself and Davey ran out into the street and all the
    streetlights were on and we could run around in the dark. And we could see
    the lights all over, up the hills and far away. The fields twinkled. When we
    came back, we sneaked a small bit of porter and danced and got shouted at
    because we trampled on the marigolds.</span
  >
  <span class="el-sec"
    >Supply will be given to whole areas. An ‘area’ should be about 25 sq.
    miles. A parish or creamery district might conveniently form the basis of
    such an area.</span
  >
  <span class="el-sec"
    >Statement of evidence of Garda ________ of An Garda Síochána made on the
    16th October 1948. I hereby declare this statement is true to the best of my
    knowledge and belief and I make it knowing that if it is tendered in
    evidence I will be liable to prosecution if I state in it anything which I
    know to be false or do not believe to be true. I was called to a house at
    ______ at 12:05am on the 15th of October 1948. I spoke with a man there who
    I know to be ___________ who resides at the residence with his wife,
    _______, his three children and his mother-in-law. He informed me that his
    infant child had gone missing from the house. He and his wife had been at
    the parish hall and had returned to the house at approximately 11:20pm. He
    says that his mother-in-law was in the house with the children while they
    were out and that she was asleep in the back kitchen when they returned.
    They went upstairs to check on the children and found that the youngest
    ______ was missing. They searched the house, but he could not be found. His
    wife then left the premises to see if he had maybe wandered into the street
    and he followed her. The child is 2 years old and was wearing blue and white
    pyjamas when he went to bed. He has light brown hair and blue eyes. This
    statement has been read over by me and is correct.</span
  >
  <span class="el-sec"
    >The entire village came out to search in laneways and ditches and
    neighbours’ gardens and fields and graveyards. But nothing. And no-one had
    seen anything of course because everyone had been at the switching on
    ceremony. There was no sign of anyone having gained entry to the house. The
    old woman downstairs never woke. The other children remained asleep in their
    beds. It was as if the child had just disappeared into thin air. - The
    Village in the Dark by JB Duane (New Editions, 1995)</span
  >
  <span class="el-sec"
    >The weather has been difficult in recent weeks for crews working in the
    West and Northwest, which has meant that we are slightly behind schedule.
    More workers will be sent to help these crews catch up. - Editor’s Letter,
    REO News (vol 12, November 1948, p.1)</span
  >
  <span class="el-sec"
    >HOLY HOUR TO PRAY FOR VOCATIONS on the 24th of October from 3 o’clock to 4
    o’clock. All are welcome—prayer followed by tea and biscuits. ANNUAL
    COLLECTION FOR CHARITY at all Masses during November. SPECIAL MASS to be
    held this Sunday for the _____ family. Prayers will be said for the safe
    return of their young boy.</span
  >
  <span class="el-sec"
    >‘Apparently she left the front door unlocked and her mother asleep
    downstairs. The older children didn’t even wake up. Someone snuck in and
    took the baby. And I feel terrible for them. I do. But they were very
    careless. Leaving the children like that to go out drinking and dancing.’</span
  >
  <span class="el-sec"
    >Statement of _______ of _______, ______ taken on the 15th of October 1948
    at _________ by Garda ________. We, my wife _______ and I, saw ______
    running through the street. We were on our way back from the switching on
    ceremony. I had consumed three drinks and my wife one. We were taking our
    time. We were admiring the new streetlights. Then we heard a woman screaming
    and crying and my wife said, ‘is that ______?’ She knows her from the ICA.
    And the woman was knocking on doors and was very distressed. We started to
    walk over to her and then her husband appeared and caught up with her and
    held her. We went to check that things were okay but obviously they weren’t.
    I went back to the parish hall to alert Garda ________ and he accompanied me
    back to the street. This statement has been read over by me is correct.</span
  >
  <span class="el-sec"
    >Statement of __________ of ___________. I hereby declare this statement is
    true to the best of my knowledge and belief and I make it knowing that if it
    is tendered in evidence I will be liable to prosecution if I state in it
    anything which I know to be false or do not believe to be true. I noticed a
    man in the village in the days before the disappearance of the young boy. I
    didn’t recognise him, which is unusual because we all know each other around
    here. He was about 5’10” with long dark hair. He was wearing a brown jacket
    and dark coloured pants. He didn’t seem to have washed in a couple of days.</span
  >
  <span class="el-sec"
    >Some people may think of electricity in the home as a luxury to provide
    comfort in various ways. This is to some extent true, but no housewife will
    need much propaganda to convince her that its labour-saving value in the
    domestic sphere is unchallengeable. An electric kettle will boil 12 pints of
    water for 1d. If you compare this with any other method of boiling water you
    will find that it is considerably cheaper and it is just as quick as any
    other method.</span
  >
  <span class="el-sec"
    >Transcript of recording made as part of a local history project: … And then
    another little boy was snatched. God love us and save us. I remember praying
    for his parents every night. They were good people. Myself and Máire joined
    the search and we hoped that we would find something—a clue, some hope—but
    of course we didn’t. The village was very glum. ‘Most of these cases… you
    should look at a member of the family. That elderly woman, I never see her
    out and about. She stays inside always. I wonder if something…’</span
  >
  <span class="el-sec"
    >DATE MISSING: SUNDAY 5TH DECEMBER 1948 18-MONTH-OLD BOY: SEÁN HAIR COLOUR :
    BLONDE EYE COLOUR: LIGHT BLUE LAST SEEN AT 11 O’CLOCK SUNDAY MORNING IN THE
    FRONT GARDEN OF HIS HOME DRESSED IN CREAM TOP AND BOTTOMS PLEASE ALERT THE
    GARDAÍ IF YOU HAVE ANY INFORMATION</span
  >
  <span class="el-sec"
    >Gardaí are investigating whether there is any connection between the
    abductions of two infant children from the same area. No-one has yet been
    arrested in relation to the disappearances, but the Gardaí have started
    re-interviewing people in the locality. They are specifically looking to
    speak to anyone who was on New Road on the morning of the 5th of December. -
    ‘Gardaí investigate link in missing child cases’ An Iar-Nuacht (7th December
    1948)</span
  >
  <span class="el-sec"
    >APPEAL FOR INFORMATION - MISSING PERSON A Garda source has informed An
    Iar-Nuacht that they have ruled out the involvement of any ESB workers or
    electricians in the recent disappearance of a two-year-old boy. It had been
    reported that the Gardaí were eager to speak to anyone who had been in the
    boy’s home in the days prior to his abduction but these men have now been
    officially discounted as suspects. - ‘No connection between ESB and missing
    child’ An Iar-Nuacht (20th October 1948)</span
  >
  <span class="el-sec"
    >‘I don’t think that little boy ever left that house’</span
  >
  <span class="el-sec"
    >Statement of ________ of _______. I hereby declare this statement is true
    to the best of my knowledge and belief and I make it knowing that if it is
    tendered in evidence I will be liable to prosecution if I state in it
    anything which I know to be false or do not believe to be true. ________
    admitted to me that he had taken the boy one night in ________ pub. He
    laughed about it. We had consumed three pints between</span
  >
  <span class="el-sec"
    >Everybody here today has been deeply affected by the disappearance of the
    poor boy who was baptised in this very church. We will pray for his parents
    and for his siblings and for his wider family. We pray also for friends and
    neighbours, for the Gardaí and the volunteers who have been searching
    tirelessly to bring Seán back home. - Homily of parish priest</span
  >
  <span class="el-sec"
    >After the disappearance of the second boy, the Gardaí came under increasing
    pressure to make an arrest. After interviewing and fingerprinting the adult
    population of the village they set their sights on the more likely of
    suspects: a labourer or drifter. They sought out men who had been known to
    be working or travelling through the area and tried to connect any of them
    to the two disappearances. - Missing: Ireland’s Vanished Children by Sorcha
    Cahalane (W&A Publishing, 2001)</span
  >
  <span class="el-sec"
    >LITIR UM THOGHCHÁIN An bhfuil tú cráite le polaiteoirí élite? Stop ag
    vótáil do FG, FF, Clann na Poblachta, LAB. Tabhair do vóta don iarrthóir
    neachspléach. Tabhair do vóta don iarrathóir fíor-Ghaelach. • Geallaim díobh
    32-contae Éire aontaithe. Áit a bhfuil COSC ar an teanga Béarla. • Bac ar
    fhrithchléireachas. • Táim réidh chun troid ar leith na daoine. • Bac ar
    cistiú poiblí na páirtí politíochta. • Bac ar an gCummanachas. • Tá sé
    soiléir san am atá inniú ann nach bhfuil meas againn ar saol an duine. Tá sé
    tabhachtach ansan go bhfuil ionadaí againn a bhfuil sásta troid ar son
    cearta daoine ó bhreith go bás nádúrtha. Tabhair do Vóta Uimh. 1 do Séan F
    Verrity.</span
  >
  <span class="el-sec"
    >Statement of ________ of ________ . I hereby declare this statement is true
    to the best of my knowledge and belief and I make it knowing that if it is
    tendered in evidence I will be liable to prosecution if I state in it
    anything which I know to be false or do not believe to be true. I was woken
    up one night just before the second child was taken—I think it was Monday—by
    the sound of a car outside. I am a light sleeper. My wife didn’t wake. I
    went to the window. I didn’t recognise the car. It just stopped in the
    middle of the road with the engine running. No-one got in or out and then
    after about five minutes it just drove off.</span
  >
  <span class="el-sec"
    >Extract from Garda report dated the 20th of December 1948: The man said
    that he was at home with his wife on the night in question. They live in
    _________. He says that he may have come through the village before, but he
    couldn’t remember. He says that he earns money doing odd jobs for people and
    travels about a lot.</span
  >
  <span class="el-sec"
    >… for Paraic, electricity means he can check on his animals early in the
    mornings or in the dark winter evenings with ease. He reckons he will
    increase his profits by at least 15% this year due to the increase in work
    he is able to… - Extract from radio documentary on the rural electrification
    scheme (October 1952)</span
  >
  <span class="el-sec"
    >‘My mother saved up her egg money to buy a brand new oven. We had a nice
    smart girl come to the house to demonstrate it for my mother. She made some
    brown bread to make sure the oven was working. She had a lovely dress on,
    and her hair was back from her face and I still think of it now every time I
    smell brown bread baking.’</span
  >
  <span class="el-sec"
    >I liked the cooker the best and I liked looking in all the cupboards. I
    liked how shiny and new everything was. They let us plug in some of the
    appliances to see how they worked. - Extract from an essay written by a
    schoolchild for a competition run by the ICA</span
  >
  <span class="el-sec"
    >2 SMALL BOYS MISSING AND yET NOTHING IS DONE THEIR aRE ThINGS THE
    GOVERNMENT DON’T WANT U TO NO. THeIR ARe MONSTERS IN THE ELICTRICS THEir
    TAKING ARE CHILDREN. We NEED TO PRTECT ARE FaMILies WE are BECOMIGN sick and
    tired ARE CHILDREN ARE SICK BECAUSE O THEM lord GOD HeLP US ALL</span
  >
  <span class="el-sec"
    >We have been thinking a lot lately about the real real-life affect our work
    has on people’s day-to-day lives. We have seen it already: housewives who
    now have more time for their hobbies, farmers who have increased production.
    And we also like to believe that we have improved the quality of people’s
    lives outside the realm of work… - Editor’s Letter, REO News (vol 16, March
    1949, p.1)</span
  >
  <span class="el-sec"
    >The middle-aged labourer who was arrested in connection with the recent
    disappearances of small children has been released without charge. Since
    October of last year two infants have been abducted from areas in the west
    of the country. No other arrests have been made. - ‘Man released without
    charge in baby-napping cases’ An Iar Nuacht (30th March 1949)</span
  >
  <span class="el-sec"
    >One socket in every room is now regarded as essential for convenient living
    - with two or three in some locations.</span
  >
  <span class="el-sec"
    >The initial connection between the disappearances and the introduction of
    electricity was unwittingly made by An Garda Síochána themselves. In the
    days before the first abduction two electricians had been in the boy’s house
    installing appliances. Gardaí interviewed these two men but they both had
    alibis for the night in question. They were completely ruled out as suspects
    but that tinge of doubt around the ESB never fully left the minds of some
    villagers. - Duane, ibid.</span
  >
  <span class="el-sec"
    >COMHAIRLE CHONTAE MINUTES OF JUNE MONTHLY MEETING OF COUNTY COUNCIL HELD IN
    ÁRAS AN CHONTAE, ON 10TH APRIL 1949 AT 2.00 P.M.</span
  >
  <span class="el-sec"
    >PRESENT MINISTER O’REILLY, CLLR O’DONOVAN, CLLR Ó MEALÓID, CLLR HIGGINS,
    CLLR SINCLAIR, CLLR LYNCH, CLLR HACKETT, CLLR McGRATH, CLLR MULLANE, CLLR
    TWOMEY, CLLR SCANLAN, CLLR PHILPOTT, CLLR FRANKS, CLLR Ó BRAONÁIN AND
    REPRESENTATIVES OF THE ESB APOLOGIES Cllr Mullins, Cllr O’Brien, Cllr Hynes,
    Cllr O’Sullivan CONFIRMATION OF MINUTES Minister O’Reilly spoke about the
    need for calm heads. He expressed regret and concern for the families of the
    missing boys. He introduced Mr Geary of the ESB to speak directly about the
    safety of electricity in homes. Mr. F Higgins circulated information to the
    members on the proposed budget. NOTICES OF MOTION To approve the draft deed
    of mortgage to provide a loan for the completion of O’Mahony Park.</span
  >
  <span class="el-sec"
    >Advice to parents: • Make sure that your doors and windows are locked and
    bolted • Do not allow your children out after dark or to play on their own •
    All children need to be supervised on their way to and from school • Please
    alert the Gardaí to any suspicious activity</span
  >
  <span class="el-sec"
    >Extract from Garda report dated the 14th of April 1949: The woman believed
    that the child was not hers. She said that he had been swapped with another
    child. She wanted us to take the boy into care and to issue a missing
    persons report for her own child. She seemed to be under the impression that
    something —‘a fairy’—had got into the house through the electricity cables
    and had taken her child and swapped him for ‘a changeling’.</span
  >
  <span class="el-sec"
    >This morning, the head of the ESB was being asked to clarify comments he
    reportedly made at a private luncheon over the weekend in which he described
    those who refused electricity as ‘backwards’ and ‘idiots’. - Radio Éireann
    (8th May 1949)</span
  >
  <span class="el-sec"
    >A group of men arrived at ESB headquarters in Athy yesterday morning to
    deliver a letter on behalf of the village of D_____. The area has recently
    suffered a number of unsolved abductions of children and these men believe
    that the ESB have a case to answer. Some local villagers have linked the
    disappearances to the recent switching on of electricity in the area. The
    ESB had no comment to make. - Translation from Raidió na Gael broadcast
    (17th April 1949)</span
  >
  <span class="el-sec"
    >I would like to bring the Minister’s attention to the very worrying case of
    two missing children in _ ____. I have been speaking to local people there
    in recent weeks who say they feel they have been forgotten about. There now
    appears to be only three fulltime Gardaí working on the case. There has been
    little to no reassurance from the authorities. It seems to me that the
    Government has abandoned the people of _____. Will there be any justice? Can
    the Minister tell me what he is planning to do? - Oral Questions in the Dáil
    (18th April 1949)</span
  >
  <span class="el-sec"
    >EXTRACT FROM REPORT BY HEALTH BOARD INTO OUTBREAK OF CERTAIN SYMPTOMS IN
    ______, JANUARY - MAY 1949: We have compiled a list of people who have
    reported to their General Practitioner any symptoms that did not have an
    obvious cause. These symptoms include headaches, vomiting, stomach cramps,
    tingling, numbness, burning and chest pain. The following list is a sample:
    • A 45-year-old woman who reported sudden occasions of vomiting and
    experiencing headaches after using her electric cooker. • A teenage girl who
    described having stomach cramps, headaches and nausea, which were not
    alleviated by any pain-relieving medication or anti-inflammatories. • A
    21-year-old man who had experienced tingling in his extremities and weakness
    in his upper arms which got better when he was outdoors. • A 52-year-old man
    who was found outside his home tearing his clothes off because he said that
    there were wires in them. • A 10-year-old boy who had a high fever and
    numbness in the extremities. • Two sisters aged 18 and 20 who complained of
    debilitating pain in their left upper abdomen with no obvious reason for
    said pain. • A 60-year-old woman who stated that her neighbours were playing
    tricks on her using electricity. • A woman in her mid-forties who said she
    was ‘full of electricity’ and who was kept up at night by the sound of men
    digging in her cellar and laying electric wires.</span
  >
  <span class="el-sec"
    >Ó Murchú, Paraic suddenly on 23rd of April 1949. Much loved by his wife
    Rose. Cremation Saturday. No Flowers.</span
  >
  <span class="el-sec"
    >The three-year-old girl who was declared missing early this morning has
    been found and returned home to her parents safe and sound. It seems that
    the child wandered off while shopping with her family and… - Translation
    from Raidió na Gael broadcast (20th April 1949)</span
  >
  <span class="el-sec"
    >You would barely recognise the village now we are so suspicious and
    untrusting. I find myself crossing the road to avoid people. I keep my head
    down to avoid making eye contact. We do not know our neighbours anymore like
    we should. I want to be more open, but we all have that lingering doubt in
    our minds. The Guards are telling us that it is most likely a drifter, an
    outsider but it could still be one of us. One of us could have kidnapped
    these children and done… Oh, I can’t bear thinking about it. What would
    anyone want with those poor boys? Couldn’t they have just left us alone? And
    the Guards have no leads, no suspects. For a while, we had several Gardaí
    stationed here. We would see them on their beat and they would give us
    comfort, but now we see them less and less. They are slowly forgetting us.
    They want to forget us. This is a crime that will never be solved, and they
    want rid of it. - Extract from letter dated 18th April 1949, found in the
    apartment of the late Ms Julia O’Keeffe of New York City</span
  >
  <span class="el-sec"
    >Electricity is the safest form of power available for both domestic and
    commercial use. Electricity poles and cables are organised and installed by
    highly trained workers and the wiring of your house and farm can only be
    done by a trained electrician. Rest assured, you and your family are safe
    with electricity in the home. If you still have doubts, please visit our
    showroom where we will demonstrate various electrical appliances and give
    advice on what is best for you and your home.</span
  >
  <span class="el-sec"
    >Two thousand people marched yesterday to bring national attention to what
    they believe is the mishandling of an investigation by the Gardaí into the
    disappearance of two infant children in the same area over a six-month
    period. The protesters are demanding an inquiry into the alleged mishandling
    of the matter by authorities. - ‘Protesters Demand Answers’, The Irish Times
    (29th April 1949)</span
  >
  <span class="el-sec"
    >Electric Water-Heating is peculiarly suitable for use in doctor’s and
    dentist’s surgeries owing to the ease of economy of installation, the
    simplicity and cleanliness of operation, and the complete absence of fumes
    and odours</span
  >
  <span class="el-sec"
    >Virginia O’Brien, Chairperson of the Irish Countrywomen’s Association, has
    urged people to continue to support rural electrification. She was speaking
    at an event last weekend regarding recent protests against the scheme,
    following links between the introduction of electricity and the
    disappearances of two young children. People have also been complaining of
    health issues relating to electricity in their homes. She informed the
    audience that the Gardaí and local health officials had completely ruled out
    any such connections and that people who perpetuated these falsehoods were
    doing damage to the local community. - ‘No link says ICA Chair’ An
    Iar-Nuacht (30th April 1949)</span
  >
  <span class="el-sec"
    >INFORMATION LEAFLET FROM THE ESB: A mass hysteria is a collective
    obsessional behaviour where a group of people spontaneously manifest similar
    hysterical symptoms.</span
  >
  <span class="el-sec"
    >IT WILL NEVER STOP THEY WILL CONTINU TO RUIN FAMILYS WE NEED TOO TAKE BACK
    CONTROL NO-ONE WILL HELP US WE AR ON ARE OWN</span
  >
  <span class="el-sec"
    >‘I have not been able to sleep through the night since they put in the
    electrics. It’s doing something to my brain. I feel groggy and tired all
    day. My wife feels nauseous. She has had weakness in her limbs. She’s so
    weak some days she can’t get out of bed. The doctor says he can do nothing
    for her.’</span
  >
  <span class="el-sec"
    >‘It’s clear that we’re not being told all the facts. Now I know there’s
    been talk of monsters. I’m an educated man. I don’t believe in monsters. But
    I can’t help but see a connection between these cables in our houses and the
    disappearances of our children. There is something. There is something
    affecting our children. Why aren’t the ESB answering our questions?’</span
  >
  <span class="el-sec"
    >Transcript of interview with Minister O’Reilly on Radio Éireann, 3rd May
    1949: Q: … Minister O’Reilly, these crimes have occurred in your own
    constituency. are An Garda Síochána doing enough? A: Firstly, I want to say
    that I completely understand the frustrations and the worry people are
    feeling as regards these cases. I want to assure everyone that the Gardaí
    are doing the best they can to get these two children back to their parents.
    I’m a parent myself and… Q: But I mean realistically, and I don’t really
    want to say this, but realistically what are the chances of the boys being
    returned to their families safely? A: I’m not going to get into that kind of
    talk. We need to think of the parents —some of whom will be listening to
    this. We need to think of them and how we can support them… Q: But Minister,
    one arrest has been made and that man was subsequently released. No other
    suspects. This man has now died, and it seems now that the trail has run
    cold. Will we ever get an answer?</span
  >
  <span class="el-sec"
    >Gardaí say that further investigations are needed to establish whether a
    man found in a ditch at the side of the road died from injuries due to a
    hit-and-run. A post-mortem was carried out on Monday by the State
    Pathologist, but the results have not yet been released. Gardaí are looking
    for any witnesses who may have been travelling on the Old Road between the
    hours of 5:30am and 6:30am on the 23rd of April to come forward. - Radio
    Éireann (14th July 1949)</span
  >
  <span class="el-sec"
    >‘I’m a farmer. I can see the benefits of electricity to my life, but I
    don’t believe it is worth putting my young family at risk. Until we have
    found out what has happened, all electricity to the village should be
    switched off.’</span
  > <span class="el-sec">‘The important thing is to remain calm.’ </span>
  <span class="el-sec"
    >First the lights went off. This happened suddenly one evening a couple of
    days after a rowdy meeting in the local hall. No kettles were boiled, and
    all electrical farming equipment was stopped. Candles and matches and
    paraffin lamps were passed around. Nobody outside of the village really
    noticed anything was amiss until the electricity poles and cables started
    crashing down. Men were sent out to replace or repair the poles, but they
    would just be torn down once more. The poles were cut down and used for
    firewood. Ovens and dishwashers were hauled out of houses and dumped in
    front of the ESB showroom. Door-to-door collections were made to collect
    lightbulbs… - Duane, ibid.</span
  >
  <span class="el-sec"
    >Transcript of recording made as part of a local history project: … and
    things got very scary. The streetlights were smashed. My father ripped the
    cables from the house and removed the hoover and cooker. My parents didn’t
    want any hassle.</span
  >
  <span class="el-sec"
    >… from the nuns in Italy who believed they were cats and the dancing manias
    of the 12th century to the small village in rural Ireland that refused
    electricity for fears of ‘monsters in the cables’… - A Brief History of
    Madness, by Madeleine Heffernan (Tigh Uí Dhrisceoil, 1987)</span
  >
  <span class="el-sec"
    >‘We had a glimpse of what life could be like. It was fleeting. I tell my
    grandchildren about it, but they don’t believe it.’</span
  >
  <span class="el-sec"
    >The washing machine is situated directly adjoining the sink so that the
    wringing may be carried out without wetting the floor.</span
  >
  <span class="el-sec"
    >They hold aloft their candles and gas lamps—symbols of their revolt against
    what they believe is the scourge of electricity. Some have called them
    Luddites; others have mocked them for their supposedly backwards ways but
    none of that has stopped them. They have remained steadfast in their belief.
    They are strong in their principles in a way that very few people are these
    days and I have to say I respect them for that. - ‘An Irishman’s Diary’ The
    Irish Times (1st August 1949)</span
  >
  <span class="el-sec"
    >There were reports of at least two households who refused to stop using
    electricity. They enjoyed the benefits that came with it and they did not
    want to return to harder times. Local opinion of them was hostile. The
    thought that they would be willing to put their children at risk for the
    sake of convenience was too much for their neighbours. These families were
    forced out of their homes, and effectively hounded out of the village. -
    Duane, ibid.</span
  >
  <span class="el-sec"
    >The electric cooker has been proved to be the cheapest method of preparing
    meals. It is quick too because of the speed-o-matic plates which are fitted
    to every new cooker.</span
  >
  <span class="el-sec"
    >Two men have been arrested on suspicion of setting fire to an ESB showroom
    just outside of ______. The men were protesting the introduction of
    electricity in the area. Gardaí are looking for witnesses to the incident. -
    Radio Éireann (20th July 1949)</span
  >
  <span class="el-sec"
    >And because he was a man, he tried to fix her: he bought her things, he
    listened, he yelled at her, he brought her to a doctor. He tried to change
    himself, tried to make himself into something new. But nothing seemed to
    work. He could never make her whole again and so he decided that instead he
    would create a life for them together: he found a cottage by the beach and
    placed her there. He cooked for her, he held her, he loved her, he married
    her. He kept others away. He made their lives together as small as they
    could be. They were each other’s secret. They were cocooned. Then came a
    brief flickering moment of joy: a baby came, and her belly grew. And she was
    happy, and he marvelled at how happy she was until the blood came and took
    the baby away. - Extract from This Gathering Light by Angela Czochara (2006)</span
  >
  <span class="el-sec"
    >MEMORANDUM FOR: ATTENTION OF THE MINISTER SUBJECT: RURAL ELECTRIFICATION
    DATE:10th SEPTEMBER 1949</span
  >
  <span class="el-sec"
    >Across the country parishes lit up. The lives of farmers and rural
    housewives improved dramatically in a short space of time. No longer did
    water have to be drawn from a well and carried by cart. No longer was
    cooking restricted to an open fire. By 1965, 80% of rural households were
    connected to the electricity supply. - Swanzy, ibid.</span
  >
  <span class="el-sec"
    >I live with my mammy and daddy, my two sisters, and a dog called Rusty. I
    have been in this new school for three months and I like it a lot and I have
    made lots of friends. I do miss my old friends and my old school and the
    rocky place where we would go and play. But here my room is bright and there
    aren’t monsters and my mammy and daddy are happy. I liked my old home a lot
    but then things were scary, and we had to come here. Everything is nice
    here. - Essay by a child that formed part of an exhibition in the National
    Museum of Country Life (March – October 2016)</span
  >
  <span class="el-sec"
    >Local party members advise against the forced introduction of electricity
    in the village of _____ in County ____. The presence of the army will only
    exacerbate an already tense situation. A representative from the ESB has
    also expressed concern for the wellbeing of their employees if they are
    forced to work in the area. As you know there have been reports of ESB
    workers being attacked, work gear being stolen, and a display shop being set
    on fire.</span
  >
  <span class="el-sec"
    >In loving memory of ____ who has been missing from his home since 14th
    October 1948. Mammy and Daddy think about you every day.</span
  >
  <span class="el-sec"
    >Transcript of recording made as part of a local history project: … I would
    tell Mammy I was going to stay with Máire and she would tell her mam that
    she was staying with me and then we would go and stay with Davey’s cousin.
    Davey was someone I knew from the village. His cousin lived in ______ and
    she had a record player and we listened to jazz records that her sister in
    America sent her. And we would dance in her living room and her mother made
    us a roast chicken dinner.</span
  >
  <span class="el-sec"
    >With the switching on of electricity in the Black Valley, Co. Kerry in June
    1976, the whole of the island was finally electrified. Except of course for
    one village which refused to be dragged into the 20th century. It remains
    the only area in the country without electricity to this day. - Swanzy,
    ibid.</span
  >
  <span class="el-sec"
    >The Numbers The Electricity Supply Board was established on 11 August 1927.
    1 million poles, 100,000 transformers and 75,000 miles of line 300,000 homes
    connected. By 1946 the number of consumers had reached 240,000 using 380
    million units per annum.</span
  >
  <span class="el-sec"
    >For decades the village of ______ has been ridiculed for its refusal to be
    welcomed into the 20th—not to mention 21st—century. However, the truth is
    altogether more worrying as the team from Prime Time Investigates uncovered
    Monday night on RTÉ One. The programme provided a rare insight into a people
    who have effectively closed themselves off from the outside world. We are
    first introduced to Mary, a pleasant woman in her late sixties who sees
    nothing wrong with the hard work involved in washing, cleaning and cooking
    without electricity. She says she was raised to work hard, and she sees no
    problem with it. We subsequently join local men at a pub where they sing
    songs and tell stories and create their own entertainment. They speak in an
    odd, old-fashioned dialect that marks them out as different. It is a quaint
    kind of life and one that looks appealingly nostalgic until we meet Neasa.
    Neasa grew up in the village and was subject to physical abuse at the hands
    of her family. She escaped when she was 18 and has never returned. For her
    it is not just about the electricity, she explains, the darkness is a form
    of control. The village does not allow strangers to stay long and they do
    not respect the authority of the Gardaí or the State. A place where no light
    shines will always be ripe for abuse… ‘An Dorchadas/The Darkness’, The Irish
    Times (15th December 2009)</span
  >
  <span class="el-sec"
    >It has been now over 30 years since two small boys vanished from their
    homes in ______. A recently formed community group is staging a rally this
    lunchtime to commemorate the disappearances. They will lay flowers at the
    locations the boys were last seen —a bedroom, a front garden, a
    pavement—before continuing on to the local Garda station. The Gardaí have
    responded to concerns by launching a renewed appeal for information. The
    Garda Superintendent in charge of the investigation said that the passage of
    time might have made some people more willing to come forward with
    information. He reassured people that they will be treated respectfully and
    discreetly. Anyone with information is asked to contact the Garda
    Confidential Line. - ‘30th anniversary of disappearances’ The Irish Examiner
    (October 1979)</span
  >
  <span class="el-sec"
    >Proper lighting in the home or workshop is the best guarantee of continued
    good eyesight for adults and children.</span
  >
  <span class="el-sec"
    >The expectation in official circles was that over time old superstitions
    would fade away, the older generation would die off and electricity would be
    reintroduced without incident. And yet the village remains in complete
    darkness to this very day. Partly this is to do with geography— it is
    situated in an isolated rural area—and partly it is due to a lack of
    financial support from the government. When the local population started to
    rip out poles and cables, the ESB were sent to restore the light, but their
    workers were attacked and abused. On the completion of the rural
    electrification scheme, the government refused further State funding for the
    area unless the locals agreed to allow electricity back in their homes. They
    declined and the stalemate has continued ever since. - Duane, ibid.</span
  >
  <span class="el-sec"
    >The initial amusement and subsequent alarm of some public servants in
    relation to a village in the West which had turned against the rural
    electrification scheme has been revealed in the latest batch of state
    documents released under the 30-year rule. Memos from the Department of
    Rural Affairs reveal the dismissive attitude of civil servants towards the
    area. The village had suffered several child abductions which were
    attributed to the recently installed electricity cables. The villagers
    become increasingly suspicious resulting in the tearing down of the
    electricity infrastructure. Their belief was that there were ‘monsters’ in
    the electricity lines. - ‘State papers: a round-up’ The Irish Examiner (27th
    December 1978)</span
  >
  <span class="el-sec"
    >‘I would do my homework in the evening by lamplight. At school we had dry
    toilets that were only flushed once a day.’</span
  >
  <span class="el-sec"
    >This is the last ever issue of the REO News and we hope that you have
    gained some insight and support from what we have published. - Editor’s
    Letter, REO News (vol. 168, November 1961)</span
  >
  <span class="el-sec"
    >Looking for a digital detox holiday on a budget? Then take a look at some
    of these amazing properties in ______ in Ireland. Step back in time to a
    simpler era. The entire village has no electricity which means you can have
    the opportunity to switch off completely. Enjoy your dinner by paraffin
    lamp, practice mindfulness while you wash clothes by hand, learn how to cook
    your food over an open fire… - Article in The New York Times Travel Section,
    (7th June 2012)</span
  >
  <span class="el-sec"
    >Welcome to Fade Away, the podcast about people who have disappeared without
    trace. In Season 1, we examined the case of Marcy Wainwright, a woman who
    one day vanished from her factory job. In Season 2, we focused on the
    Clement family, who haven’t been seen since Christmas Eve 1865. Now in
    Season 3, we are looking into the alleged abductions of two children in…
    Intro to Fade Away, August 2014</span
  >
  <span class="el-sec"
    >TO: info@fadeawaypodcast.com FROM: ------------------------ RE: PODCAST —
    INFO DATE: 29 Sept 2015, 13:47 -------------------------------------------
    Hi, My name is I’ve just come across your podcast and I think I might have
    some information for you. My grandmother grew up in the village and she was
    there when the abductions took place. She emigrated to Canada in the 60s.
    She never spoke about what happened but after she died, we found some notes
    she had written which may be useful to</span
  >
  <span class="el-sec"
    >Gardaí have confirmed that they are pursuing several new leads of inquiry
    following renewed interest in the cases arising out of a true-crime podcast
    which has… - ‘Podcast leads to new avenues of inquiry’, An Iar Nuacht (23rd
    November 2015)</span
  >
  <span class="el-sec"
    >‘This third season has been a real breakthrough for us. We got good numbers
    and interaction for season one and two but this year things have just gotten
    crazy,’ says Weeverman. And what does she say to critics who accuse the
    true-crime podcast genre of unethical behaviour and exploitation. ‘It’s
    something we are both very aware of. That’s part of the reason we chose
    crimes that were committed at least a generation ago. We don’t want
    relatives to be upset and having to read… ’ - Extract from interview with
    Harriet Gose and Francine Weeverman, Flash Magazine (13th April 2015)</span
  >
  <span class="el-sec"
    >… one of many who say that this is a cover up. The police missed vital
    clues while neighbours looked the other way. A lot of coincidences. What was
    really going on? I would recommend everyone to read Satan in Ireland by JM
    Henry to learn more about satanic groups that were… - Extract from blog
    entitled ‘The Disappearances 1948 - 49’</span
  >
  <section class="el-sec forum">
    <h1 class="forum-heading">
      Discussion thread on Episode 6: What Did the Neighbours Know?
    </h1>
    <div class="post">
      <div class="post-author">C_A_Dupin</div>
      <div class="post-body">
        The problem the cops had was that they believed ‘everyone was at the
        switching on’ so they never got a proper list of people together. And we
        all know of course that Mrs Geary didn’t attend because she was feeling
        unwell and so she went home by herself. And the O’Reillys didn’t attend
        either—were they going to a wedding the next day or something…
      </div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
    <div class="post">
      <div class="post-author">M4Murder</div>
      <div class="post-body">
        But are we seriously suggesting that any of these people were involved
        in the kidnapping of the first child? What’s the motive here? The first
        child to me is the key becuase he was upstairs in his own bed. That’s
        not a ‘by chance’ kidnapping. That was palnned. The switching on was the
        opportunity they needed.
      </div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
    <div class="post">
      <div class="post-author">Hastings</div>
      <div class="post-body">
        What about the witness statement from Francis Byrne? She saw footsteps
        in her garden but the police never took photos or imprints.
      </div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
    <div class="post">
      <div class="post-author">ChndlerR1</div>
      <div class="post-body red">[comment deleted]</div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
    <div class="post">
      <div class="post-author">C_A_Dupin</div>
      <div class="post-body">
        @ChndlerR1 This is a serious thread to discuss matters that arise in the
        course of the podcast. That’s serious discussion only pertaining to the
        facts of the case. If you want to speculate wildly there are plenty of
        other forums for that.
      </div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
    <div class="post">
      <div class="post-author">M4Murder</div>
      <div class="post-body">
        @Hastings Yeah, I thought that was interesting too. Like, FB’s garden
        backed on to the victims so someone could likely have escaped that way.
        They didn’t dwell on it on the pod though so maybe they know more than
        they are letting on abot that right now.
      </div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
    <div class="post">
      <div class="post-author">TruCrimFan</div>
      <div class="post-body">
        Hi! new to the thread. I’m just wondering what people feel about the
        parents. Am not talking shit I just am genuinely wondering. It’s kind of
        like occam’s razor.a lot of the neighbors seem to think that the house
        was a little dysfuntioncal. Maybe they were abusing the kid or they
        killed him accidentally or something. The other idnappings were a cover
        up. Again, please don’;t ban me. I really want to know more.
      </div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
    <div class="post">
      <div class="post-author">C_A_Dupin</div>
      <div class="post-body">
        @TruCrimFan There are threads about the parents. Check out the search
        bar.
      </div>
      <div class="post-buttons">
        <button>Like</button><button>Dislike</button><button>Comment</button
        ><button>Favourite</button>
      </div>
    </div>
  </section>
  <span class="el-sec"
    >Reviewers have often suggested illusions in his music to PJ Harvey, Steely
    Dan and Captain Beefheart, but all of this was news to the young Sammy
    Lynch. He had never heard of any of these artists. He grew up in a tiny
    village in the West of Ireland without electricity and therefore no record
    players, no radios and no internet. He had grown up with music, of course,
    but it was all traditional melodies and songs that had been written hundreds
    of years prior. For his twelfth birthday he asked for a guitar and started
    immediately to write his own weird little songs. -'Darkness into Light' by
    Oliver Rapid, PPOPP Magazine (Issue 381)</span
  >
  <span class="el-sec"
    >… a link in the minds of many people even today between the erection of
    electricity poles and the disappearance of fairies, banshees, leprechauns.
    Maybe their homes were indeed disturbed by workers or perhaps this is just a
    metaphor for… - ‘The Last of the Fairies’ by Sam Beaton Hibernian Monthly
    (vol 67, 3rd August 1998, p. 22 27)</span
  >
  <span class="el-sec"
    >The Network Renewal Plan began in the late 1990s to upgrade the electricity
    supply to reflect the needs of modern Ireland.</span
  >
  <span class="el-sec"
    >There remains a lot of interest from an anthropological view as well. The
    village has retained many of the old methods and routines that modernisation
    has swallowed up in the rest of the country. Old methods of cooking have
    been preserved and farming practices from a bygone age remain commonplace.
    Their isolation has preserved the village as if frozen in time. Naw purteen
    narr honchee - Duane, ibid.</span
  >
  <span class="el-sec"
    >Tch buteagh y ar maggee Fado al sunee thist giy ar nournagh - Song written
    in the local dialect</span
  >
  <span class="el-sec"
    >You Won’t Believe These Places That Have No Electricity - Buzzfeed (March
    2019)</span
  >
  <span class="el-sec"
    >The link between ‘screen time’ (short-wavelength, artificial blue light
    emitted from electronic devices) and sleep disorders has been well
    established in several studies (Delahunt et al., 2015; Brennan & Jones 2008;
    Parsons 2016). The comparisons as set out in Graph 1b shows the differences
    in sleep quality between Group A (control group) and Group B (digital
    natives) … - Comparative evaluation of the health effects of technology
    between digital natives and digital naïfs, Goetsmen & Waine (2017)</span
  >
  <span class="el-sec"
    >On the way out of the village is a memorial to the two children. It is
    well-kept and is always covered in flowers and teddy bears and mass cards. -
    Cahalane, ibid.</span
  >
  <span class="el-sec"
    >Mary Lane (1924 - 2020): Mary Lane worked as the chief archivist for the
    ESB between 1966 and 1996. She trained initially as a librarian and worked
    for a time for UCD before joining the ESB as assistant archivist in 1945. On
    the retirement of her predecessor, she took over the main role.</span
  >
  <span class="el-sec"
    >John 1:5 And the light shineth in darkness; and the darkness comprehended
    it not.</span
  >
</div>

<div class="credits text">
  <p>
    <em>Getting The Electric</em>, written by Louise Hegarty, was first
    published in
    <em><a href="http://stingingfly.org">The Stinging Fly</a></em>.
  </p>
  <p>
    Louise Hegarty has had work published in <em>Banshee</em>,
    <em>The Tangerine</em>, and
    <em>The Dublin Review</em>. Recently, she had a short story featured on BBC
    Radio 4’s Short Works. She lives in Cork.
  </p>
</div>

<!-- 


list
table
forum

 -->
<style lang="scss">
  .electric-text {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 20px;
    max-width: 960px;
    .el-sec {
      grid-column: 1 / -1;
    }
    .g1 {
      grid-column: span 1;
    }
    .g4 {
      grid-column: span 4;
    }
    .g5 {
      grid-column: span 5;
    }
    .g6 {
      grid-column: span 6;
    }
    .g7 {
      grid-column: span 7;
    }
    .g8 {
      grid-column: span 8;
    }
    .r90cw {
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
    .r90cc {
      direction: rtl;
      text-orientation: mixed;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
    }
    .r180 {
      transform: rotate(180deg);
    }
    .centred {
      text-align: center;
    }
    .justified {
      text-align: justify;
    }
    .bordered {
      border: 1px solid black;
    }
    .grid-image {
      max-width: 100%;
      object-fit: contain;
    }
    .r2 {
      grid-row: span 2;
    }
  }
  .forum {
    padding: 10px;
    border: 1px solid #29140f;
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    font-size: 0.8rem;
    line-height: 1.15;
    .post {
      display: grid;
      grid-template-columns: 1fr 5fr;
      margin: 20px 0;
      border: 1px solid #3d5686;
      .post-author {
        grid-column: 1;
        background-color: rgb(240, 240, 240);
        padding: 8px 10px;
        font-size: 1rem;
      }
      .post-body {
        padding: 8px 10px;
        grid-column: 2 / -1;
        &.red {
          color: red;
        }
      }
      .post-buttons {
        grid-column: 1 / -1;
        display: flex;
        background-color: #3d5686;
        justify-content: flex-end;
        padding: 5px 10px;
        button {
          margin: 0 12px;
          padding: 3px 6px;
          font-size: 0.5rem;
        }
      }
    }
  }
</style>
