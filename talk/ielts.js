/* 2487 · IELTS Speaking sets in CupOfEnglish's lesson template (Misty 10:12–10:15, 20 Nov):
   Format → Assessment → Part 1 (A–R–E) → Part 2 cue cards (P–P–F, 2 per set so there is time for Part 3) → Part 3 (P–R–E–L) → Feedback.
   Every question has words and phrases to use and a model answer that stays hidden until the teacher shows it. [[ ]] = key words (teal).
   "Talent" follows Misty's own deck (IELTS ACADEMIC SPEAKING TEMPLATE PRACTICE); the other sets are original CupOfEnglish prompts. */
(function(){
  const q1 = (q, ph, a, r, e) => ({ q, ph, m: [a, r, e] });
  const card = (task, points, explain, ppf, ph) => ({ task, points, explain, ppf, ph });
  const q3 = (q, ph, p, r, e, l) => ({ q, ph, m: [p, r, e, l] });
  window.KITS = window.KITS || {};
  window.KITS.ielts2 = [
    { id: 'i-talent', cat: 'objects', theme: 'Talent', zh: '才能', from: 'CupOfEnglish deck',
      p1: [{ t: 'Talent', q: [
        q1('Do you have a talent or something you are good at?', ['I\'m quite good at…', 'a natural talent for', 'For instance,…'],
          'Yes, I\'d say I\'m [[quite good at]] drawing.', 'I think it\'s because I [[practise]] almost every day.', '[[For instance]], last month I designed the poster for our school event.'),
        q1('Do you think your talent can be helpful for your future work?', ['It could come in handy', 'a transferable skill', 'in the long run'],
          'Yes, I think it [[could come in handy]].', 'Being creative is [[a transferable skill]] in many jobs.', 'For example, designers and teachers both need to explain ideas visually.'),
        q1('Do you think people in your family have the same talent?', ['It runs in the family', 'take after', 'not really'],
          'Not really, although my mother is quite artistic.', 'I think I [[take after]] her more than my father.', 'She used to paint, and she taught me how to mix colours.') ] }],
      p2: [
        card('Describe a piece of furniture that you own.', ['what it is', 'where you bought it', 'how you use it'], 'and explain why you like it.',
          ['when and where you got it', 'how you use it every day', 'whether you will keep it'], ['I\'d like to talk about…', 'I bought it from…', 'practical and comfortable', 'I use it for…', 'It means a lot to me because…']),
        card('Describe your favourite piece of clothing.', ['where you got it', 'how often you wear it', 'when you wear it'], 'and explain why it is your favourite.',
          ['where and when you got it', 'how often and when you wear it now', 'whether you will keep wearing it'], ['It was a gift from…', 'comfortable and versatile', 'goes with everything', 'sentimental value'])
      ],
      p3: [
        q3('What are the differences between houses or buildings in the city and the countryside?', ['closer together', 'built for denser populations', 'further apart', 'in contrast'],
          'There are clear differences between the two.', 'In the city, buildings are taller and [[closer together]] because they are [[built for denser populations]].', 'In the countryside, houses are often [[further apart]] with more land around them.', '[[In contrast]] to city flats, rural homes give people more space but fewer services nearby.'),
        q3('Do you prefer to live in the city or the countryside?', ['I\'d rather… because…', 'hustle and bustle', 'a slower pace of life', 'Ultimately, it depends on…'],
          'I\'d rather live in the countryside.', 'It offers [[a slower pace of life]], away from the city\'s [[hustle and bustle]].', 'When I visit my grandparents\' village, I sleep better and spend more time outdoors.', '[[Ultimately, it depends on]] your job and lifestyle, but the countryside suits me better.'),
        q3('What are the safety risks in residential buildings in cities?', ['fire hazards', 'emergency exits', 'poorly lit', 'security'],
          'The main risks are fire and poor [[security]].', 'In tall buildings, fire can spread quickly and people need clear [[emergency exits]].', 'Some older blocks have [[poorly lit]] stairs or broken smoke alarms.', 'So regular safety checks are the best way to reduce these [[fire hazards]] and other risks.'),
        q3('Is it expensive to decorate a house or an apartment where you live?', ['It depends on your budget', 'affordable', 'without breaking the bank', 'lavish'],
          '[[It depends on your budget]].', 'Simple decorations can be quite [[affordable]], while designer furniture is costly.', 'For example, some families repaint old furniture and decorate [[without breaking the bank]].', 'So it can be cheap or [[lavish]], depending on what people want.')
      ] },
    { id: 'i-places', cat: 'places', theme: 'Places', zh: '地点',
      p1: [{ t: 'Your home town', q: [
        q1('Where is your home town?', ['I come from…', 'It\'s located in…', 'It\'s known for…'], 'I [[come from]] a city in the east of China.', 'It\'s [[located]] near the coast, so the weather is mild.', 'It\'s [[known for]] its seafood and its old harbour.'),
        q1('What do you like about it?', ['What I like most is…', 'friendly and welcoming', 'There\'s always something to do'], '[[What I like most is]] the food.', 'The local dishes are simple but delicious.', 'For example, my favourite noodle shop has been open for thirty years.'),
        q1('Has it changed much since you were a child?', ['It has changed a lot', 'There used to be…', 'new developments'], 'Yes, [[it has changed a lot]].', 'Many [[new developments]] have been built.', '[[There used to be]] a small market near my school, but now it\'s a shopping centre.') ] },
        { t: 'Parks', q: [
        q1('How often do you go to a park?', ['once or twice a week', 'whenever I have time', 'to get some fresh air'], 'I go [[once or twice a week]].', 'I like [[to get some fresh air]] after studying.', 'Last Sunday I went for a long walk around the lake.'),
        q1('What do people do in parks in your city?', ['go jogging', 'do tai chi', 'have a picnic'], 'People do all kinds of things.', 'Parks are free and close to most homes.', 'In the morning, older people [[do tai chi]], and at weekends families [[have a picnic]].'),
        q1('Were there parks near your home when you were young?', ['There was a small park…', 'I used to play…', 'not as many as now'], 'Yes, [[there was a small park]] near my flat.', 'My parents liked it because it was safe.', '[[I used to play]] football there with my neighbours every evening.') ] }],
      p2: [
        card('Describe a place you like to visit in your free time.', ['where it is', 'how often you go there', 'what you do there'], 'and explain why you like going there.',
          ['when you first went there', 'what you do there now', 'whether you will keep going'], ['One place I really enjoy is…', 'It\'s about … minutes from…', 'peaceful', 'It helps me unwind', 'I\'d recommend it because…']),
        card('Describe a quiet place you know.', ['where it is', 'how you found it', 'what you do there'], 'and explain why you like it.',
          ['how you found it', 'when you go there now', 'how it might change'], ['tucked away', 'away from the crowds', 'I go there to…', 'It gives me time to think'])
      ],
      p3: [
        q3('Why do people like to visit quiet places?', ['escape from', 'recharge', 'stressful lifestyles'], 'People visit quiet places to rest.', 'Many people have [[stressful lifestyles]] and need time to [[recharge]].', 'For instance, office workers often go hiking at weekends to [[escape from]] noise.', 'So quiet places are important for people\'s wellbeing.'),
        q3('How have free-time places in cities changed?', ['more commercial', 'shopping centres', 'green spaces'], 'They have become [[more commercial]].', 'Land in cities is expensive, so [[shopping centres]] replace open space.', 'In my city, an old sports field became a mall.', 'That\'s why many people now ask for more [[green spaces]].'),
        q3('Should cities spend more on parks or on sports centres?', ['On balance', 'accessible to everyone', 'public health'], '[[On balance]], I think parks are a better investment.', 'Parks are free and [[accessible to everyone]], including older people.', 'A park near my home is busy from early morning until night.', 'So parks do more for [[public health]] than sports centres.'),
        q3('How might tourism change a quiet place?', ['bring in money', 'overcrowded', 'lose its character'], 'Tourism can change a place a lot.', 'It can [[bring in money]], but it can also make a place [[overcrowded]].', 'A small village near my city became famous online and now has traffic jams.', 'If it is not managed well, a quiet place may [[lose its character]].')
      ] },
    { id: 'i-people', cat: 'people', theme: 'People', zh: '人物',
      p1: [{ t: 'Family', q: [
        q1('Do you have a big family?', ['a fairly small family', 'There are … of us', 'extended family'], 'No, I have [[a fairly small family]].', '[[There are]] three [[of us]] at home.', 'But my [[extended family]] is big, and we all meet at Spring Festival.'),
        q1('Who are you closest to in your family?', ['I\'m closest to…', 'get along well', 'confide in'], '[[I\'m closest to]] my older sister.', 'We [[get along well]] because we have similar interests.', 'When I have a problem at school, I always [[confide in]] her first.'),
        q1('What do you usually do together?', ['spend time together', 'eat out', 'catch up'], 'We usually [[eat out]] at weekends.', 'It\'s the best way to [[catch up]] after a busy week.', 'Last Saturday we tried a new hotpot restaurant together.') ] },
        { t: 'Neighbours', q: [
        q1('Do you know your neighbours?', ['only to say hello to', 'keep to themselves', 'on good terms'], 'I know some of them, but [[only to say hello to]].', 'Most people in my building [[keep to themselves]].', 'However, we are [[on good terms]] with the family next door.'),
        q1('How often do you talk to them?', ['now and then', 'bump into', 'in the lift'], 'Only [[now and then]].', 'Everyone is busy with work and school.', 'I usually [[bump into]] them [[in the lift]] and we chat for a minute.'),
        q1('Are neighbours important?', ['in an emergency', 'keep an eye on', 'sense of community'], 'Yes, I think they are.', 'They can help [[in an emergency]].', 'When we travel, our neighbour [[keeps an eye on]] our flat for us.') ] }],
      p2: [
        card('Describe a person who has helped you.', ['who this person is', 'how you know them', 'how they helped you'], 'and explain how you felt about their help.',
          ['how you met and what happened', 'your relationship now', 'how their help will matter in future'], ['I\'d like to talk about…', 'I\'ve known her/him since…', 'went out of her/his way', 'I\'ll always be grateful']),
        card('Describe a teacher you remember well.', ['who the teacher was', 'what subject they taught', 'what they were like'], 'and explain why you remember them.',
          ['when they taught you', 'what you still use from their lessons', 'what you would say to them now'], ['strict but fair', 'brought the subject to life', 'had a big influence on me', 'looking back'])
      ],
      p3: [
        q3('What kinds of help do people usually give their neighbours?', ['lend a hand', 'look after', 'practical help'], 'Most help is small and [[practical help]].', 'Neighbours are close by, so they can act quickly.', 'For example, they [[look after]] pets or collect parcels.', 'These small favours make a building feel friendlier.'),
        q3('Is it easier to ask family or friends for help?', ['It depends on', 'more comfortable', 'feel judged'], 'For most people, it\'s easier to ask family.', 'People feel [[more comfortable]] and don\'t [[feel judged]].', 'When I needed money for a course, I asked my parents first.', 'However, [[it depends on]] the problem; friends understand some things better.'),
        q3('Should schools teach children to help others?', ['Absolutely', 'empathy', 'volunteer'], '[[Absolutely]], they should.', 'Helping others builds [[empathy]], which is as important as grades.', 'Some schools ask students to [[volunteer]] at elderly homes once a term.', 'Lessons like this prepare children to be good members of society.'),
        q3('How has technology changed the way people help each other?', ['online fundraising', 'reach more people', 'face-to-face'], 'Technology has made helping much faster.', 'People can [[reach more people]] in minutes.', 'For example, [[online fundraising]] can pay for someone\'s hospital bills in a day.', 'Still, [[face-to-face]] help is important, especially for older people.')
      ] },
    { id: 'i-objects', cat: 'objects', theme: 'Objects', zh: '物品',
      p1: [{ t: 'Phones', q: [
        q1('How often do you use your phone?', ['all the time', 'more than I should', 'check messages'], 'Honestly, [[more than I should]].', 'I use it for study, chatting and paying for things.', 'This morning I [[checked messages]] before I even got up.'),
        q1('What do you use it for most?', ['mainly for', 'keep in touch', 'look things up'], 'I use it [[mainly for]] messaging.', 'It\'s the easiest way to [[keep in touch]] with friends.', 'I also [[look things up]] when I find a new English word.'),
        q1('Could you live without it for a week?', ['It would be tough', 'get used to it', 'switch off'], '[[It would be tough]], but I think I could.', 'At first I would miss my friends, but I would [[get used to it]].', 'Last summer on a camping trip, I had no signal for three days and enjoyed it.') ] },
        { t: 'Gifts', q: [
        q1('Do you like giving gifts?', ['I love…', 'see their reaction', 'thoughtful'], 'Yes, [[I love]] giving gifts.', 'It\'s nice to [[see their reaction]].', 'For my friend\'s birthday, I made a photo album of our trips.'),
        q1('What was the last gift you received?', ['The last thing I got was…', 'really useful', 'came as a surprise'], '[[The last thing I got was]] a pair of headphones.', 'They are [[really useful]] for my English listening.', 'My cousin gave them to me, and it [[came as a surprise]].'),
        q1('Is it difficult to choose a gift?', ['It can be tricky', 'what they would like', 'play it safe'], 'Yes, [[it can be tricky]].', 'It\'s hard to know [[what they would like]].', 'When I\'m not sure, I [[play it safe]] and buy a book or a gift card.') ] }],
      p2: [
        card('Describe something you own that is important to you.', ['what it is', 'how you got it', 'how often you use it'], 'and explain why it is important to you.',
          ['how you got it', 'how you use it now', 'whether you will keep it'], ['One thing I treasure is…', 'It was given to me by…', 'I use it almost every day', 'sentimental value']),
        card('Describe something you bought recently that made you happy.', ['what it was', 'where you bought it', 'how much it cost'], 'and explain why it made you happy.',
          ['why you decided to buy it', 'how you use it now', 'if you would buy it again'], ['I\'d been saving up for…', 'It was on sale', 'good value for money', 'worth every penny'])
      ],
      p3: [
        q3('Why do some people keep old things for a long time?', ['sentimental value', 'bring back memories', 'hard to let go'], 'Many people keep old things for emotional reasons.', 'Old objects [[bring back memories]] of people and places.', 'My grandmother still keeps her first radio from the 1970s.', 'So their [[sentimental value]] is often greater than their price.'),
        q3('Do people today buy more things than before?', ['consumer culture', 'online shopping', 'impulse buying'], 'Yes, I think they do.', '[[Online shopping]] makes buying fast and easy.', 'Shopping festivals with big discounts encourage [[impulse buying]].', 'This [[consumer culture]] means people own more than they need.'),
        q3('Are expensive things always better?', ['Not necessarily', 'paying for the brand', 'quality'], '[[Not necessarily]].', 'Often you are [[paying for the brand]], not better [[quality]].', 'My cheap phone case has lasted longer than an expensive one I had.', 'So price is only one thing to think about.'),
        q3('Should products be made to last longer?', ['reduce waste', 'repairable', 'in the long term'], 'Yes, I strongly believe they should.', 'Longer-lasting products [[reduce waste]] and save money [[in the long term]].', 'Some phones are now designed to be [[repairable]] at home.', 'That\'s better for both customers and the environment.')
      ] },
    { id: 'i-events', cat: 'events', theme: 'Events', zh: '经历与事件',
      p1: [{ t: 'Birthdays', q: [
        q1('How do you usually celebrate your birthday?', ['keep it simple', 'have a meal with', 'make a wish'], 'I usually [[keep it simple]].', 'I prefer spending time with close family.', 'Last year we [[had a meal with]] my grandparents and I [[made a wish]] over the cake.'),
        q1('Is your birthday important to you?', ['not a big deal', 'a chance to', 'look back on'], 'It\'s [[not a big deal]], but I like it.', 'It\'s [[a chance to]] see people I care about.', 'I also [[look back on]] what I learned that year.'),
        q1('What did you do on your last birthday?', ['I spent the day…', 'went out for', 'it was memorable'], '[[I spent the day]] with friends.', 'It was a weekend, so everyone was free.', 'We [[went out for]] karaoke, and [[it was memorable]] because we sang badly together.') ] },
        { t: 'Festivals', q: [
        q1('What is your favourite festival?', ['My favourite has to be…', 'family reunion', 'festive atmosphere'], '[[My favourite has to be]] Spring Festival.', 'It\'s a time for [[family reunion]].', 'I love the [[festive atmosphere]] when the streets are full of red lanterns.'),
        q1('What do people eat during it?', ['traditionally', 'symbolises', 'dumplings'], '[[Traditionally]], people eat [[dumplings]] in the north.', 'Their shape [[symbolises]] wealth.', 'In my family, we make them together on New Year\'s Eve.'),
        q1('Has the way people celebrate changed?', ['quite a lot', 'send red envelopes online', 'still'], 'Yes, [[quite a lot]].', 'Technology has changed some customs.', 'Many people now [[send red envelopes online]], but families [[still]] eat together.') ] }],
      p2: [
        card('Describe a celebration you enjoyed.', ['what it was for', 'where and when it happened', 'who was there'], 'and explain why you enjoyed it.',
          ['how it was planned and what happened', 'how you feel about it now', 'whether you would do it again'], ['The occasion was…', 'It took place in…', 'the highlight was', 'I\'ll never forget…']),
        card('Describe a time you were very busy.', ['when it was', 'what you had to do', 'how you managed'], 'and explain how you felt about it.',
          ['what happened then', 'what you learned from it', 'how you would handle it next time'], ['I was swamped with…', 'juggle', 'prioritise', 'in the end it paid off'])
      ],
      p3: [
        q3('Why are celebrations important in families?', ['bring people together', 'pass down traditions', 'create memories'], 'Celebrations matter because they [[bring people together]].', 'Busy families rarely sit down together otherwise.', 'At festivals, grandparents [[pass down traditions]] like making dumplings.', 'This helps children [[create memories]] and feel connected.'),
        q3('Are traditional festivals as popular as before?', ['still widely celebrated', 'younger generation', 'in a different way'], 'They are [[still widely celebrated]].', 'But the [[younger generation]] celebrates [[in a different way]].', 'For example, many young people travel during Spring Festival instead of staying at home.', 'So festivals are popular, but customs are changing.'),
        q3('Do people spend too much money on celebrations?', ['go overboard', 'social pressure', 'meaningful'], 'Some people do [[go overboard]].', 'There is [[social pressure]] to have big weddings.', 'I know families who borrowed money for a wedding banquet.', 'A smaller celebration can be just as [[meaningful]].'),
        q3('Should schools celebrate festivals from other countries?', ['broaden their horizons', 'cultural awareness', 'as long as'], 'Yes, I think they should.', 'It helps students [[broaden their horizons]].', 'My school had an international day with food from different countries.', 'It builds [[cultural awareness]], [[as long as]] local festivals are celebrated too.')
      ] },
    { id: 'i-study', cat: 'activities', theme: 'Study and work', zh: '学习与工作',
      p1: [{ t: 'Work or study', q: [
        q1('Do you work or are you a student?', ['I\'m currently…', 'majoring in', 'in my final year'], '[[I\'m currently]] a student.', 'I\'m [[majoring in]] business at university.', 'I\'m [[in my final year]], so I\'m busy with my graduation project.'),
        q1('What do you like about it?', ['What I enjoy most is…', 'hands-on', 'like-minded people'], '[[What I enjoy most is]] the group projects.', 'I meet [[like-minded people]] and learn from them.', 'Last term our team made a [[hands-on]] marketing plan for a real café.'),
        q1('What would you like to change?', ['If I could change one thing,…', 'workload', 'more practical'], '[[If I could change one thing]], it would be the [[workload]].', 'We often have several deadlines in the same week.', 'I\'d also like classes to be [[more practical]].') ] },
        { t: 'Reading', q: [
        q1('Do you enjoy reading?', ['I\'m a keen reader', 'whenever I can', 'page-turner'], 'Yes, [[I\'m a keen reader]].', 'Reading helps me relax and learn new words.', 'I just finished a mystery novel that was a real [[page-turner]].'),
        q1('What did you read recently?', ['I\'ve just finished…', 'it\'s about', 'highly recommend'], '[[I\'ve just finished]] a book about space travel.', '[[It\'s about]] how astronauts train.', 'I\'d [[highly recommend]] it to anyone who likes science.'),
        q1('Do you prefer paper books or e-books?', ['I prefer…', 'convenient', 'the feel of'], '[[I prefer]] paper books.', 'I like [[the feel of]] turning pages.', 'But e-books are [[convenient]] when I travel.') ] }],
      p2: [
        card('Describe a skill you would like to learn.', ['what the skill is', 'how you would learn it', 'how long it might take'], 'and explain why you want to learn it.',
          ['why you became interested', 'what you are doing now', 'how you will use it in future'], ['I\'ve always wanted to…', 'sign up for a course', 'step by step', 'it would open doors']),
        card('Describe a project you worked on.', ['what it was', 'who you worked with', 'what you did'], 'and explain what you learned from it.',
          ['how the project started', 'what you think of it now', 'how it will help you in future'], ['I was responsible for…', 'we ran into problems', 'meet the deadline', 'a valuable lesson'])
      ],
      p3: [
        q3('What skills are most useful for young people today?', ['communication skills', 'adaptability', 'digital literacy'], 'I\'d say [[communication skills]] are the most useful.', 'Almost every job needs teamwork and clear explanation.', 'In interviews, companies often test this with group tasks.', 'Together with [[digital literacy]] and [[adaptability]], they prepare young people for change.'),
        q3('Is it better to learn from a teacher or from the internet?', ['a combination of both', 'feedback', 'self-paced'], 'I think [[a combination of both]] is best.', 'Teachers give personal [[feedback]], while the internet is [[self-paced]].', 'I learn grammar online, then practise speaking with my teacher.', 'Each one covers what the other cannot.'),
        q3('Should adults keep learning new skills?', ['lifelong learning', 'stay competitive', 'keeps the mind active'], 'Yes, [[lifelong learning]] is important.', 'Jobs change, so adults need to [[stay competitive]].', 'My father learned to use design software in his fifties.', 'It also [[keeps the mind active]] as people get older.'),
        q3('How can schools prepare students for work?', ['real-world experience', 'internships', 'soft skills'], 'Schools should give more [[real-world experience]].', 'Students learn faster when they apply knowledge.', 'Short [[internships]] let students see how companies work.', 'This builds [[soft skills]] that exams cannot measure.')
      ] },
    { id: 'i-tech', cat: 'objects', theme: 'Technology', zh: '科技',
      p1: [{ t: 'The internet', q: [
        q1('How much time do you spend online each day?', ['roughly', 'a few hours', 'lose track of time'], '[[Roughly]] four hours a day.', 'Most of it is for study and messages.', 'At weekends I sometimes [[lose track of time]] watching videos.'),
        q1('What websites or apps do you use most?', ['I mostly use…', 'handy', 'keep up with'], '[[I mostly use]] a video app and a dictionary app.', 'The dictionary is very [[handy]] for English.', 'I also use news apps to [[keep up with]] current events.'),
        q1('Do you think you use the internet too much?', ['Probably', 'cut down on', 'screen time'], '[[Probably]], yes.', 'My [[screen time]] report is often higher than I expect.', 'I\'m trying to [[cut down on]] it by reading before bed instead.') ] },
        { t: 'Photos', q: [
        q1('Do you like taking photos?', ['I\'m into…', 'capture the moment', 'on my phone'], 'Yes, [[I\'m into]] photography.', 'I like to [[capture the moment]] when I travel.', 'Last month I took photos of the sunset [[on my phone]] and printed one.'),
        q1('What do you usually photograph?', ['mostly', 'scenery', 'food'], '[[Mostly]] [[scenery]] and [[food]].', 'They remind me of places I\'ve been.', 'My friends always laugh because I photograph every meal.'),
        q1('Do you print photos or keep them on your phone?', ['keep them on', 'every now and then', 'photo album'], 'I mostly [[keep them on]] my phone.', 'It\'s easy and free.', 'But [[every now and then]] I print a few for a [[photo album]].') ] }],
      p2: [
        card('Describe a piece of technology you find useful.', ['what it is', 'when you started using it', 'what you use it for'], 'and explain why it is useful for you.',
          ['when you started using it', 'how you use it now', 'how it might change in future'], ['I couldn\'t do without…', 'user-friendly', 'saves me a lot of time', 'I rely on it for…']),
        card('Describe an app you use often.', ['what the app is', 'how you found it', 'what you do with it'], 'and explain why you use it so often.',
          ['how you found it', 'how you use it now', 'whether you will keep using it'], ['I came across it…', 'the main feature is', 'it keeps me organised', 'I\'d recommend it to…'])
      ],
      p3: [
        q3('How has technology changed the way people communicate?', ['instant messaging', 'stay connected', 'less face-to-face'], 'Technology has made communication faster.', '[[Instant messaging]] lets people [[stay connected]] across countries.', 'I video-call my cousin in Canada every week.', 'The downside is that there is [[less face-to-face]] conversation.'),
        q3('Do older people find new technology difficult?', ['tend to', 'not tech-savvy', 'with a little help'], 'Many older people [[tend to]] find it hard.', 'They did not grow up with smartphones, so they are [[not tech-savvy]].', 'My grandmother learned to pay by phone [[with a little help]] from me.', 'So it is difficult at first, but they can learn.'),
        q3('Should children have their own phones?', ['at a certain age', 'with limits', 'safety'], 'Children should have phones [[at a certain age]], maybe twelve.', 'Phones help with [[safety]] when they travel alone.', 'My younger brother uses his phone to tell my parents when he leaves school.', 'But they should be used [[with limits]] on games and social media.'),
        q3('What are the risks of relying on AI tools?', ['make mistakes', 'double-check', 'think for yourself'], 'The main risk is trusting AI too much.', 'AI tools can [[make mistakes]] that sound correct.', 'A classmate copied an AI answer with a wrong date in his essay.', 'So people should [[double-check]] facts and still [[think for yourself]].')
      ] },
    { id: 'i-nature', cat: 'places', theme: 'Nature', zh: '自然',
      p1: [{ t: 'Animals', q: [
        q1('Do you like animals?', ['I\'m an animal lover', 'especially', 'fascinated by'], 'Yes, [[I\'m an animal lover]], [[especially]] of dogs.', 'They are loyal and friendly.', 'I volunteer at an animal shelter once a month.'),
        q1('Did you have a pet as a child?', ['I used to have…', 'look after', 'responsibility'], 'Yes, [[I used to have]] a goldfish.', 'My parents wanted me to learn [[responsibility]].', 'I had to [[look after]] it and clean the tank every week.'),
        q1('What animal would you like to see in the wild?', ['I\'d love to see…', 'natural habitat', 'endangered'], '[[I\'d love to see]] a panda in its [[natural habitat]].', 'They are rare and beautiful.', 'I read that some reserves in Sichuan let visitors watch them from a distance.') ] },
        { t: 'Plants', q: [
        q1('Do you have plants at home?', ['a few', 'easy to look after', 'brighten up'], 'Yes, I have [[a few]].', 'They [[brighten up]] my room.', 'I chose cactus plants because they are [[easy to look after]].'),
        q1('Who looks after them?', ['mainly', 'water them', 'remember to'], '[[Mainly]] my mother.', 'She is more careful than me.', 'I sometimes forget to [[water them]] when I\'m busy with exams.'),
        q1('Do you like gardens?', ['peaceful', 'take a stroll', 'well kept'], 'Yes, I find them [[peaceful]].', 'They are a good place to rest.', 'I like to [[take a stroll]] in the [[well kept]] gardens near my university.') ] }],
      p2: [
        card('Describe a time you spent outdoors in nature.', ['where you were', 'who you were with', 'what you did'], 'and explain how you felt about it.',
          ['when and where it happened', 'how you feel about it now', 'whether you will go again'], ['We set off early', 'breathtaking views', 'fresh air', 'it was well worth it']),
        card('Describe a beautiful view you remember.', ['where it was', 'when you saw it', 'what you could see'], 'and explain why you remember it.',
          ['when you saw it', 'how you remember it now', 'if you want to see it again'], ['It was stunning', 'as far as the eye could see', 'I took a photo of', 'it stayed with me'])
      ],
      p3: [
        q3('Why do people in cities want to spend time in nature?', ['get away from', 'reduce stress', 'concrete jungle'], 'City people want a break from urban life.', 'Nature helps them [[reduce stress]] and [[get away from]] noise.', 'Many families drive to the mountains at weekends to escape the [[concrete jungle]].', 'So nature is an important balance to city life.'),
        q3('How can schools help children learn about nature?', ['field trips', 'hands-on', 'school garden'], 'Schools should teach nature outside the classroom.', 'Children remember more from [[hands-on]] experiences.', '[[Field trips]] to forests or a [[school garden]] let them see plants grow.', 'This makes them care more about the environment.'),
        q3('Who should protect wild animals: governments or individuals?', ['both have a role', 'enforce laws', 'raise awareness'], 'I believe [[both have a role]].', 'Governments can [[enforce laws]], while individuals change daily habits.', 'For example, people can refuse to buy products made from wild animals.', 'Working together is the only way to protect wildlife.'),
        q3('How might cities become greener?', ['plant more trees', 'rooftop gardens', 'public transport'], 'Cities can become greener in several ways.', 'They can [[plant more trees]] and build [[rooftop gardens]].', 'Some cities have turned old railways into long parks.', 'Better [[public transport]] would also reduce pollution.')
      ] },
    { id: 'i-media', cat: 'events', theme: 'Media and news', zh: '媒体与新闻',
      p1: [{ t: 'TV and music', q: [
        q1('Do you watch much TV?', ['not much', 'streaming', 'binge-watch'], '[[Not much]] TV, but I watch shows online.', '[[Streaming]] lets me watch when I want.', 'Sometimes I [[binge-watch]] a whole series at the weekend.'),
        q1('What kind of music do you like?', ['I\'m really into…', 'catchy', 'it depends on my mood'], '[[I\'m really into]] pop music.', 'The songs are [[catchy]] and easy to sing.', 'But [[it depends on my mood]]; I listen to piano music when I study.'),
        q1('When do you usually listen to music?', ['on my way to', 'in the background', 'helps me focus'], 'Usually [[on my way to]] school.', 'It makes the journey feel shorter.', 'I also play soft music [[in the background]] because it [[helps me focus]].') ] },
        { t: 'Advertising', q: [
        q1('Do you notice advertisements?', ['They\'re everywhere', 'pop up', 'tend to ignore'], 'Yes, [[they\'re everywhere]].', 'They [[pop up]] on my phone all the time.', 'I [[tend to ignore]] them unless they are funny.'),
        q1('Have you bought something because of an advert?', ['I have to admit', 'convinced me', 'regret it'], '[[I have to admit]] I have.', 'An advert for sports shoes [[convinced me]].', 'They were expensive, but I don\'t [[regret it]] because I use them every day.'),
        q1('Which adverts do you remember?', ['stands out', 'clever', 'jingle'], 'One advert really [[stands out]].', 'It was [[clever]] and had a [[jingle]] I still remember.', 'It was for a milk tea brand, and everyone at school was singing it.') ] }],
      p2: [
        card('Describe a piece of news that interested you.', ['what the news was', 'where you heard about it', 'when it happened'], 'and explain why it interested you.',
          ['when and where you heard it', 'what you think about it now', 'what might happen next'], ['I came across it on…', 'it caught my attention', 'according to', 'I\'m curious to see']),
        card('Describe a film or show you enjoyed.', ['what it was', 'when you watched it', 'what it was about'], 'and explain why you enjoyed it.',
          ['when you watched it', 'what you think of it now', 'if you would recommend it'], ['It\'s set in…', 'the plot', 'the acting was', 'it\'s worth watching'])
      ],
      p3: [
        q3('Where do young people get their news today?', ['social media', 'short videos', 'traditional media'], 'Most young people get news from [[social media]].', 'It\'s fast and free on their phones.', 'Many of my friends learn about events from [[short videos]].', 'As a result, [[traditional media]] like newspapers is less popular with them.'),
        q3('How can people check if a news story is true?', ['check the source', 'compare with', 'reliable'], 'People should [[check the source]] first.', '[[Reliable]] news comes from known outlets with named reporters.', 'If a story seems shocking, [[compare with]] two or three other sites.', 'This simple habit stops people sharing false information.'),
        q3('Should news always be free?', ['quality journalism', 'subscriptions', 'accessible'], 'Basic news should be [[accessible]] to everyone.', 'But [[quality journalism]] costs money to produce.', 'Many newspapers use [[subscriptions]] for long reports.', 'So a mix of free and paid news seems fair.'),
        q3('Is local news as important as international news?', ['directly affects', 'community', 'equally'], 'I think they are [[equally]] important.', 'Local news [[directly affects]] our daily lives.', 'For example, road works or school changes matter to my [[community]].', 'International news, on the other hand, helps us understand the wider world.')
      ] },
    { id: 'i-friend', cat: 'people', theme: 'Friends', zh: '朋友',
      p1: [{ t: 'Friends', q: [
        q1('Do you have many friends?', ['a small circle of', 'close friends', 'acquaintances'], 'I have [[a small circle of]] [[close friends]].', 'I prefer a few good friends to many [[acquaintances]].', 'My three best friends and I have known each other since primary school.'),
        q1('How do you usually spend time with your friends?', ['hang out', 'grab a bite', 'chat online'], 'We usually [[hang out]] at weekends.', 'During the week we are all too busy, so we [[chat online]].', 'Last Saturday we went to [[grab a bite]] and then watched a film.'),
        q1('Is it easy to make new friends?', ['It depends', 'break the ice', 'in common'], '[[It depends]] on the situation.', 'It is easier when you have something [[in common]].', 'At university clubs, a shared hobby helps people [[break the ice]].') ] },
        { t: 'Being polite', q: [
        q1('Is being polite important in your culture?', ['very important', 'show respect', 'elders'], 'Yes, it is [[very important]].', 'Politeness is a way to [[show respect]], especially to [[elders]].', 'For example, children should greet older relatives first at family dinners.'),
        q1('Who taught you to be polite?', ['mainly my parents', 'set an example', 'remind'], '[[Mainly my parents]].', 'They always [[set an example]] for me at home.', 'When I was small, my mother would [[remind]] me to say thank you to shop assistants.'),
        q1('Are people less polite now than before?', ['in some ways', 'in a hurry', 'on the whole'], '[[In some ways]], yes.', 'People are often [[in a hurry]] and looking at their phones.', 'But [[on the whole]], most people I meet are still kind and polite.') ] }],
      p2: [
        card('Describe a friend you have known for a long time.', ['who this person is', 'how you met', 'what you do together'], 'and explain why you are still friends.',
          ['how and when you met', 'what you do together now', 'how you see the friendship in future'], ['We first met at…', 'we hit it off', 'we have a lot in common', 'stood by me', 'I can always count on her/him']),
        card('Describe a person who is good at their job.', ['who this person is', 'what their job is', 'how you know them'], 'and explain why you think they are good at it.',
          ['how you got to know them', 'what they do well now', 'what you can learn from them'], ['She/He works as…', 'goes the extra mile', 'patient and professional', 'I really admire'])
      ],
      p3: [
        q3('What makes a good friend?', ['trustworthy', 'be there for you', 'honest'], 'A good friend is above all [[trustworthy]].', 'You need someone who will [[be there for you]] in hard times.', 'When I failed an exam, my best friend helped me study for the retake.', 'So trust and support matter more than having fun together.'),
        q3('Do people today have fewer close friends than before?', ['busier lives', 'online friends', 'quality over quantity'], 'I think many people do.', 'People have [[busier lives]] and spend more time with [[online friends]].', 'Some of my classmates have hundreds of followers but few people to talk to.', 'Still, [[quality over quantity]] is what really matters in friendship.'),
        q3('Is it important for children to have friends of different ages?', ['learn from', 'look up to', 'responsibility'], 'Yes, I think it is useful.', 'Children [[learn from]] older friends and take [[responsibility]] for younger ones.', 'My cousin [[looks up to]] an older neighbour who helps him with homework.', 'So mixed-age friendships help children grow in different ways.'),
        q3('Why do some people prefer to work alone?', ['concentrate', 'at their own pace', 'teamwork'], 'Some people simply work better alone.', 'They can [[concentrate]] and work [[at their own pace]].', 'Many writers and programmers say they do their best work in a quiet room.', 'However, most jobs still need some [[teamwork]].')
      ] },
    { id: 'i-family2', cat: 'people', theme: 'Older and younger people', zh: '长辈与晚辈',
      p1: [{ t: 'Grandparents', q: [
        q1('Do you often see your grandparents?', ['as often as I can', 'live nearby', 'during holidays'], 'I see them [[as often as I can]].', 'They [[live nearby]], so I visit most weekends.', '[[During holidays]] we also cook a big family meal at their home.'),
        q1('What do you like doing with them?', ['listen to their stories', 'learn from them', 'go for walks'], 'I love to [[listen to their stories]].', 'They tell me what life was like when they were young.', 'My grandfather once told me how he walked an hour to school every day.'),
        q1('What have you learned from them?', ['the value of', 'hard work', 'be patient'], 'I\'ve learned [[the value of]] [[hard work]].', 'They grew up with very little.', 'My grandmother taught me to [[be patient]] when I learn something new.') ] },
        { t: 'Children', q: [
        q1('Do you like spending time with children?', ['full of energy', 'it can be tiring', 'fun'], 'Yes, they are [[full of energy]] and [[fun]].', 'But [[it can be tiring]] after a few hours.', 'I sometimes look after my little cousin, and we play board games.'),
        q1('What games did you play as a child?', ['I used to play…', 'hide and seek', 'outdoors'], '[[I used to play]] [[hide and seek]].', 'We played [[outdoors]] almost every evening.', 'All the children in my building joined in after dinner.'),
        q1('Is childhood today different from your childhood?', ['quite different', 'screens', 'more pressure'], 'Yes, it\'s [[quite different]].', 'Children now spend more time on [[screens]].', 'They also have [[more pressure]] from after-school classes.') ] }],
      p2: [
        card('Describe an older person you respect.', ['who this person is', 'how you know them', 'what they are like'], 'and explain why you respect them.',
          ['how you know them and what they did', 'your relationship now', 'what you hope to learn from them'], ['I\'d like to talk about…', 'wise', 'has been through a lot', 'I look up to her/him']),
        card('Describe a child you know.', ['who the child is', 'how you know them', 'what they like doing'], 'and explain how you feel about them.',
          ['when you first met them', 'what they are like now', 'what they might become'], ['She/He is … years old', 'curious', 'always asking questions', 'makes me laugh'])
      ],
      p3: [
        q3('What can young people learn from older people?', ['life experience', 'wisdom', 'pass on'], 'Young people can learn a great deal.', 'Older people have [[life experience]] and [[wisdom]].', 'My grandmother taught me how to manage money carefully.', 'If we listen, they can [[pass on]] lessons that books can\'t.'),
        q3('Should older people live with their adult children?', ['It depends on', 'take care of', 'independence'], '[[It depends on]] the family.', 'Living together lets children [[take care of]] their parents.', 'In my family, my grandparents live with my uncle and help with cooking.', 'But some older people prefer their [[independence]].'),
        q3('Do children today grow up too fast?', ['exposed to', 'pressure to', 'carefree'], 'In some ways, I think they do.', 'They are [[exposed to]] adult content online and feel [[pressure to]] succeed.', 'Some primary school pupils already study until late at night.', 'Children need more time to be [[carefree]].'),
        q3('How can families keep in touch when they live far apart?', ['video calls', 'family group chat', 'visit regularly'], 'Technology makes it much easier.', 'Families can use [[video calls]] and a [[family group chat]].', 'My aunt in Australia shares photos with us every day.', 'Even so, it is important to [[visit regularly]] when possible.')
      ] },
    { id: 'i-travel', cat: 'places', theme: 'Travel', zh: '旅行',
      p1: [{ t: 'Travel', q: [
        q1('Do you like travelling?', ['I love travelling', 'see new places', 'try local food'], 'Yes, [[I love travelling]].', 'I enjoy the chance to [[see new places]].', 'My favourite part is to [[try local food]], like the noodles I had in Xi\'an.'),
        q1('Do you prefer travelling alone or with others?', ['I\'d rather…', 'share the experience', 'more flexible'], '[[I\'d rather]] travel with friends.', 'It\'s nice to [[share the experience]].', 'But travelling alone is [[more flexible]], so I might try it one day.'),
        q1('Where did you go on your last trip?', ['The last place I went to was…', 'for a few days', 'sightseeing'], '[[The last place I went to was]] Hangzhou.', 'I went [[for a few days]] during the summer holiday.', 'We spent most of our time [[sightseeing]] around West Lake.') ] },
        { t: 'Weather', q: [
        q1('What is the weather like where you live?', ['mild', 'humid', 'four distinct seasons'], 'We have [[four distinct seasons]].', 'Summer is hot and [[humid]], but spring is [[mild]].', 'In winter it sometimes snows for a few days.'),
        q1('What is your favourite season?', ['My favourite season is…', 'pleasant', 'outdoor activities'], '[[My favourite season is]] autumn.', 'The weather is [[pleasant]], neither too hot nor too cold.', 'It\'s perfect for [[outdoor activities]] like hiking.'),
        q1('Does the weather affect your mood?', ['Definitely', 'gloomy', 'cheer me up'], '[[Definitely]].', 'Rainy, [[gloomy]] days make me feel tired.', 'A sunny morning always seems to [[cheer me up]].') ] }],
      p2: [
        card('Describe a city you would like to visit.', ['which city it is', 'how you know about it', 'what you would do there'], 'and explain why you want to visit it.',
          ['how you first heard about it', 'what you know about it now', 'when and how you plan to go'], ['I\'ve always wanted to go to…', 'it\'s famous for', 'I\'d love to explore', 'it\'s on my bucket list']),
        card('Describe a trip you enjoyed.', ['where you went', 'who you went with', 'what you did'], 'and explain why you enjoyed it.',
          ['when and where you went', 'how you remember it now', 'whether you would go again'], ['We set off…', 'the highlight was', 'unforgettable', 'I\'d go back in a heartbeat'])
      ],
      p3: [
        q3('Why do people like to travel?', ['broaden their horizons', 'a break from routine', 'different cultures'], 'People travel for many reasons.', 'It gives them [[a break from routine]] and helps them [[broaden their horizons]].', 'When I visited Yunnan, I learned about [[different cultures]] in China.', 'So travel is both relaxing and educational.'),
        q3('Is it better to travel with a tour group or independently?', ['convenient', 'freedom', 'It depends on'], '[[It depends on]] the traveller.', 'Tour groups are [[convenient]], while independent travel gives more [[freedom]].', 'My parents prefer tours abroad because they don\'t speak the language.', 'Young people, however, often enjoy planning their own trips.'),
        q3('How does tourism affect local people?', ['create jobs', 'rising prices', 'on the other hand'], 'Tourism has both good and bad effects.', 'It can [[create jobs]], but it can also cause [[rising prices]].', 'In some old towns, rent became too expensive for local families.', '[[On the other hand]], many small businesses depend on visitors.'),
        q3('Will people travel more or less in the future?', ['more affordable', 'environmental concerns', 'virtual tours'], 'I think people will travel more.', 'Travel is becoming [[more affordable]] for many families.', 'Even so, [[environmental concerns]] may make some people fly less.', 'Some might also choose [[virtual tours]] instead of long trips.')
      ] },
    { id: 'i-journey', cat: 'events', theme: 'Journeys and plans', zh: '出行与计划',
      p1: [{ t: 'Transport', q: [
        q1('How do you usually get to school or work?', ['I usually take…', 'it takes about', 'rush hour'], '[[I usually take]] the subway.', 'It\'s fast and [[it takes about]] twenty minutes.', 'During [[rush hour]] it\'s very crowded, so I leave early.'),
        q1('Do you prefer buses or trains?', ['I prefer…', 'more reliable', 'traffic jams'], '[[I prefer]] trains.', 'They are [[more reliable]] because there are no [[traffic jams]].', 'Last month my bus was stuck in traffic and I was late for class.'),
        q1('Would you like to have your own car?', ['Someday', 'expensive to run', 'parking'], '[[Someday]], maybe.', 'Cars are [[expensive to run]] and [[parking]] is difficult in my city.', 'For now, public transport works well for me.') ] },
        { t: 'Being on time', q: [
        q1('Are you usually on time?', ['I try to be', 'punctual', 'run late'], '[[I try to be]] [[punctual]].', 'Being late feels disrespectful.', 'But I sometimes [[run late]] when the subway is delayed.'),
        q1('How do you feel when others are late?', ['a bit annoyed', 'understand', 'let me know'], 'I feel [[a bit annoyed]].', 'But I [[understand]] if there is a good reason.', 'I just hope they [[let me know]] with a quick message.'),
        q1('How do you make sure you are on time?', ['set an alarm', 'plan ahead', 'leave early'], 'I always [[set an alarm]].', 'I also [[plan ahead]] the night before.', 'For important events I [[leave early]] in case of traffic.') ] }],
      p2: [
        card('Describe a journey you remember well.', ['where you went', 'how you travelled', 'who you were with'], 'and explain why you remember it.',
          ['when it happened and what you saw', 'how you remember it now', 'if you would make the same journey again'], ['It was a long journey', 'we travelled by', 'along the way', 'it stuck in my memory']),
        card('Describe a plan you made that did not go as expected.', ['what the plan was', 'what happened', 'what you did'], 'and explain how you felt about it.',
          ['what you planned', 'what you think about it now', 'what you would do differently'], ['Things didn\'t go to plan', 'at the last minute', 'make the best of it', 'a blessing in disguise'])
      ],
      p3: [
        q3('How can cities reduce traffic?', ['public transport', 'cycle lanes', 'car-sharing'], 'Cities need to give people better choices.', 'Good [[public transport]] and safe [[cycle lanes]] reduce the number of cars.', 'My city added bike lanes, and now many students cycle to school.', '[[Car-sharing]] could help even more in the future.'),
        q3('Is punctuality equally important in every culture?', ['attitudes vary', 'business', 'social events'], 'No, [[attitudes vary]] between cultures.', 'Some cultures are strict about time, others are more relaxed.', 'For example, being late for [[business]] meetings is rude in many countries, but less so for [[social events]].', 'So it\'s useful to learn local customs before travelling.'),
        q3('Why do some people find it hard to plan ahead?', ['unpredictable', 'spontaneous', 'procrastinate'], 'Some people simply prefer to be [[spontaneous]].', 'Others [[procrastinate]] or feel life is too [[unpredictable]].', 'One of my friends never books anything until the day before.', 'Still, planning ahead usually saves time and money.'),
        q3('Will people travel to work less in the future?', ['work from home', 'commute', 'face-to-face'], 'I think many people will.', 'More jobs let people [[work from home]], so they don\'t need to [[commute]].', 'My uncle now goes to his office only two days a week.', 'But some jobs will always need [[face-to-face]] contact.')
      ] },
    { id: 'i-sport', cat: 'activities', theme: 'Sport and exercise', zh: '运动',
      p1: [{ t: 'Sport', q: [
        q1('Do you like sport?', ['I\'m keen on', 'stay fit', 'team sports'], 'Yes, [[I\'m keen on]] basketball.', 'It helps me [[stay fit]], and I enjoy [[team sports]].', 'I play with classmates twice a week after school.'),
        q1('Did you do any sport when you were a child?', ['I used to…', 'swimming lessons', 'took part in'], '[[I used to]] take [[swimming lessons]].', 'My parents thought it was an important skill.', 'I even [[took part in]] a small race when I was ten.'),
        q1('What sport would you like to try?', ['I\'d like to have a go at…', 'challenging', 'looks fun'], '[[I\'d like to have a go at]] rock climbing.', 'It [[looks fun]] and [[challenging]].', 'A new climbing gym opened near my home, so I may try it soon.') ] },
        { t: 'Weekends', q: [
        q1('What do you usually do at weekends?', ['catch up on', 'have a lie-in', 'see friends'], 'I usually [[have a lie-in]] on Saturday.', 'I need to [[catch up on]] sleep after a busy week.', 'Then I [[see friends]] or go shopping in the afternoon.'),
        q1('Are your weekends busy or relaxing?', ['a bit of both', 'homework', 'unwind'], 'They are [[a bit of both]].', 'I have [[homework]] to do, but I also need time to [[unwind]].', 'Last weekend I studied in the morning and watched a film in the evening.'),
        q1('What did you do last weekend?', ['I spent most of…', 'went for a', 'it was relaxing'], '[[I spent most of]] the weekend at home.', 'The weather was bad, so I stayed in.', 'On Sunday I [[went for a]] short walk, and [[it was relaxing]].') ] }],
      p2: [
        card('Describe a sport or exercise you enjoy.', ['what it is', 'when and where you do it', 'who you do it with'], 'and explain why you enjoy it.',
          ['how you started', 'how often you do it now', 'whether you will keep doing it'], ['I got into it when…', 'I do it … times a week', 'it keeps me in shape', 'it clears my head']),
        card('Describe a hobby you enjoyed as a child.', ['what the hobby was', 'when you started it', 'how often you did it'], 'and explain why you enjoyed it.',
          ['how you started it', 'whether you still do it now', 'if you would like to start again'], ['When I was little,…', 'I spent hours', 'I grew out of it', 'it brings back good memories'])
      ],
      p3: [
        q3('Why do some people not exercise enough?', ['lack of time', 'sedentary', 'motivation'], 'The main reason is [[lack of time]].', 'Many people have [[sedentary]] jobs and feel too tired after work.', 'My father sits at a desk all day and rarely goes to the gym.', 'Finding [[motivation]] is often harder than finding time.'),
        q3('Should schools give children more time for sport?', ['Absolutely', 'physical and mental health', 'balance'], '[[Absolutely]].', 'Sport is good for both [[physical and mental health]].', 'Students who play sport at my school often seem less stressed before exams.', 'Schools need a better [[balance]] between study and activity.'),
        q3('Why are professional athletes paid so much?', ['entertainment industry', 'sponsorship', 'short careers'], 'Athletes are part of the [[entertainment industry]].', 'Millions watch them, so [[sponsorship]] brings in huge amounts of money.', 'Famous football players earn more from adverts than from playing.', 'Also, they have [[short careers]], so high pay is understandable.'),
        q3('How have hobbies changed compared with the past?', ['screen-based', 'hands-on', 'come back into fashion'], 'Many hobbies are now [[screen-based]].', 'Games and videos are easy to access anywhere.', 'However, [[hands-on]] hobbies like baking and knitting have [[come back into fashion]] online.', 'So technology changes hobbies but also helps old ones survive.')
      ] },
    { id: 'i-learn', cat: 'activities', theme: 'Learning and languages', zh: '学习与语言',
      p1: [{ t: 'Learning English', q: [
        q1('How long have you been learning English?', ['I\'ve been learning … for', 'since primary school', 'on and off'], '[[I\'ve been learning]] English [[since primary school]].', 'It\'s a required subject in my country.', 'I\'ve studied [[on and off]] for about ten years.'),
        q1('What is the most difficult part of English for you?', ['The hardest part is…', 'pronunciation', 'speaking fluently'], '[[The hardest part is]] [[speaking fluently]].', 'I know the grammar, but I hesitate when I speak.', 'In class, I sometimes forget simple words because I\'m nervous.'),
        q1('How do you practise English outside class?', ['watch … with subtitles', 'keep a vocabulary notebook', 'practise speaking'], 'I [[watch]] American shows [[with subtitles]].', 'It helps me hear natural expressions.', 'I also [[keep a vocabulary notebook]] for new phrases.') ] },
        { t: 'Handwriting', q: [
        q1('Do you write much by hand?', ['not as much as before', 'type', 'take notes'], '[[Not as much as before]].', 'I [[type]] most things on my laptop.', 'But I still [[take notes]] by hand in class because it helps me remember.'),
        q1('Is your handwriting easy to read?', ['fairly neat', 'messy when I rush', 'improve'], 'It\'s [[fairly neat]].', 'But it gets [[messy when I rush]].', 'My teacher once asked me to [[improve]] it before my exam.'),
        q1('Is handwriting still important today?', ['I believe so', 'exams', 'personal touch'], '[[I believe so]].', 'Many [[exams]] are still handwritten.', 'A handwritten card also has a [[personal touch]].') ] }],
      p2: [
        card('Describe a time you learned something new.', ['what you learned', 'when and where you learned it', 'how you learned it'], 'and explain how you felt about it.',
          ['when and how you learned it', 'how you use it now', 'what you want to learn next'], ['I picked up…', 'it took a while', 'practice makes perfect', 'I felt proud of myself']),
        card('Describe a language you would like to learn.', ['which language it is', 'how you would learn it', 'how difficult it might be'], 'and explain why you want to learn it.',
          ['why you became interested', 'what you know of it now', 'how you would use it'], ['I\'ve always been fascinated by…', 'I\'d sign up for', 'it would be useful for', 'open up opportunities'])
      ],
      p3: [
        q3('Why do people learn foreign languages?', ['career opportunities', 'communicate', 'cultural understanding'], 'People learn languages for many reasons.', 'Languages bring [[career opportunities]] and help people [[communicate]] with others.', 'Many of my classmates learn English so they can study abroad.', 'Learning a language also builds [[cultural understanding]].'),
        q3('Is it better to start learning a language as a child?', ['pick up', 'accent', 'never too late'], 'Starting young is usually easier.', 'Children [[pick up]] sounds naturally and often have a better [[accent]].', 'My younger cousin learned English songs faster than I did.', 'But it is [[never too late]]; adults can learn with effort.'),
        q3('Will translation apps replace language learning?', ['convenient', 'nuance', 'human connection'], 'I don\'t think so.', 'Apps are [[convenient]], but they often miss [[nuance]] and humour.', 'When my aunt used an app abroad, the waiter misunderstood her order.', 'Speaking a language yourself creates a real [[human connection]].'),
        q3('What makes a good language teacher?', ['patient', 'encouraging', 'feedback'], 'A good teacher is [[patient]] and [[encouraging]].', 'Students need to feel safe to make mistakes.', 'My best teacher gave clear [[feedback]] after every speaking task.', 'That kind of support helps students improve faster.')
      ] }
  ];
})();
