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
    { id: 'i-talent', theme: 'Talent', zh: '才能', from: 'CupOfEnglish deck',
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
    { id: 'i-places', theme: 'Places', zh: '地点',
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
    { id: 'i-people', theme: 'People', zh: '人物',
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
    { id: 'i-objects', theme: 'Objects', zh: '物品',
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
    { id: 'i-events', theme: 'Events', zh: '经历与事件',
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
    { id: 'i-study', theme: 'Study and work', zh: '学习与工作',
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
    { id: 'i-tech', theme: 'Technology', zh: '科技',
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
    { id: 'i-nature', theme: 'Nature', zh: '自然',
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
    { id: 'i-media', theme: 'Media and news', zh: '媒体与新闻',
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
      ] }
  ];
})();
