/* 2885 · Teacher guides (Misty 25 Nov): one place for every "how to".
   To add or update a guide, edit this list only. `updated` shows a "New" or "Updated" badge for 14 days. */
window.COE_GUIDES=[
 {id:'check-homework',title:'Check Homework',cat:'Homework',icon:'check',updated:'2026-11-25T12:10',
  sum:'Mark a photo of homework and send the parent a picture.',open:'../homework/',cover:'img/cover-check.webp',mins:2,
  rule:'Type corrections in RED, beside the mistake. Only red counts as "To fix" for the parent.',
  parts:[
   {h:'The screen',p:'Each number points to one part.',img:'img/screen.webp'},
   {h:'Paste the photo the student sent',p:'Copy it in WeChat, click the homework area, then press ⌘ Cmd + V (Ctrl + V on Windows). If it is one of our own pictures, the app keeps only the homework, so the logo shows once.',img:'img/paste.webp'},
   {h:'Five steps, photo to parent',img:'img/flow.webp'},
   {h:'Red, not blue or green',red:1,p:'Blue and green are for comments and praise only.',img:'img/redblue.webp'},
   {h:'Typing a correction in four taps',p:'Put it just below or beside the word, never on top. Double-click a tag to change its words.',img:'img/typing.webp'},
   {h:'Before you send',list:['Every correction is red and beside the mistake','"To fix" matches the mistakes you marked','You tapped Save and saw "Saved at…"','You pasted the picture, not a screenshot of the screen']}
  ]},
 {id:'trial-feedback',title:'Trial Class Feedback',cat:'Classes',icon:'star',updated:'2026-11-25T13:20',mins:3,
  sum:'Fill in the trial report: fair ratings, real examples and the best-fitting book.',
  rule:'Be objective: rate only what you saw in the trial, with a real example for each line. Recommend the book that fits the level, not the one you like most.',
  parts:[
   {h:'Open it',p:'After the trial class: Today › the trial class card › Trial report. Fill it in the same day.'},
   {h:'Be objective',red:1,img:'img/trial-objective.webp'},
   {h:'Learner type and recommended book',p:'Pick the learner type first; the books for that type come first. Then pick the one book the student should start with.',img:'img/trial-tr2.webp'},
   {h:'Rate each line, with one real example',p:'Nine lines: 5 speaking, 2 listening, 2 reading. For each, pick what you saw and write the words the student actually said or did.',img:'img/trial-tr3.webp'},
   {h:'Check the level and the book',red:1,p:'The total and the CEFR level are worked out for you. The book you recommended should be one of the Suggested materials for that level. If it is not, change the book, not the ratings.',img:'img/trial-tr4.webp'},
   {h:'Comments, next steps and send',p:'Strengths match your highest ratings; areas to improve match your lowest. Next steps start with the book you chose. Then tap Send trial report.',img:'img/trial-tr5.webp'},
   {h:'Before you send',list:['Every line has a rating and a real example','The ratings show what you saw, not what the parent hopes','The book is in the Suggested materials for the level','Strengths and areas match your ratings','Next steps start with the recommended book']}
  ]},
 {id:'ielts-trial',title:'IELTS Trial Assessment',cat:'Classes',icon:'star',updated:'2026-11-25T14:00',mins:4,
  sum:'For IELTS trial classes: score speaking with real evidence, then recommend the best-fitting pathway.',
  rule:'Be objective: give each band from what you heard in the trial, not from what the student or parent hopes. Your ticks show the range; if your band is outside it, check your evidence. Recommend the pathway that fits the result.',
  parts:[
   {h:'Open it',p:'After an IELTS trial: Today › the trial class card › Trial report. It opens the IELTS assessment, not the young-learner report. You can edit it later from Students › Your online IELTS trial assessments.'},
   {h:'Set up: test, questions and parts reached',p:'Share only the Student screen on the call. Choose IELTS (or KET / PET for those exams). Work through Speaking, Writing and Result in order. Pick the question set you taught from, and mark only the parts you really reached.',img:'img/ielts-1.webp'},
   {h:'Part 2: cue card, timers and notes',p:'Read the cue card to the student. Use the timers: 1 minute to prepare, 1 to 2 minutes to speak. In the notes, write what the student actually said.',img:'img/ielts-2.webp'},
   {h:'Tick what you heard, then choose the band',red:1,p:'For each of the four criteria (Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation), tick only what you heard. Your ticks point to a band range; choose a band from 0 to 9 inside that range.',img:'img/ielts-3.webp'},
   {h:'Outside the range? Check your evidence',red:1,p:'If the band you chose is outside the range of your ticks, the app warns you. Look at your ticks and notes again and fix whichever is wrong. The Speaking band and CEFR level are worked out for you.',img:'img/ielts-4.webp'},
   {h:'Result: strengths, areas and pathway',p:'Strengths: real examples from the class. Areas for improvement: match your lowest bands. Then choose the one pathway that fits: Integrated Speaking and Academic Writing, Speaking and Communication Skills, or Academic Writing Development.',img:'img/ielts-5.webp'},
   {h:'Before you send',list:['Only the parts you really reached are marked','Every band is inside the range of your ticks, or you checked why','Notes and strengths use what the student actually said','Areas for improvement match the lowest bands','The pathway fits the result, not the student\'s wish']}
  ]},
 {id:'class-video',title:'Class Video Upload',cat:'Classes',icon:'upload',updated:'2026-11-25T14:40',mins:2,cover:'img/video-1.webp',
  sum:'Upload every class video the same day, by 23:59, and check that V turns green.',
  rule:'Every class video, the same day, by 23:59. Only a GREEN V means the video arrived. Grey means not due yet, not done. If V is still red, it has not arrived.',
  parts:[
   {h:'After class: V turns red',p:'When the class ends, V on the class card turns red: the video is due. Tap Upload video on that class and choose the file. No renaming: the app names, files and checks it.',img:'img/video-1.webp'},
   {h:'Check that V is green',red:1,p:'When the video has arrived, the card shows Class video uploaded ✓ with the time, and V turns green. Wait for this before you close the app.',img:'img/video-2.webp'},
   {h:'What the chips mean',p:'In · H homework · N note · V video. Grey = not due yet (it is NOT done). Red = due now. Green = done and received.',img:'img/video-3.webp'},
   {h:'The deadline: 23:59 the same day',red:1,p:'Upload right after class. If a video is still missing, the app reminds you at 22:30. After 23:59 the video is late: it is still needed, and a late case is opened.',img:'img/video-4.webp'},
   {h:'No recording? Late cancellation?',p:'If the class was not recorded, or the student cancelled late, upload a screen proof on the same class instead, by 23:59.'},
   {h:'Check your day',p:'Activity log (on a phone: More › Activity log) › Class by class shows each of your classes with the time each step arrived on our server, and when V turned green.'},
   {h:'Before you finish for the day',list:['Every class card shows Class video uploaded ✓','Every V is green, not grey or red','Anything missing is uploaded before 23:59']}
  ]},
 {id:'meeting-id',title:'Meeting ID on VooV',cat:'Classes',icon:'video',updated:'2026-11-25T13:10',mins:2,cover:'img/cover-meet.webp',
  sum:'Set up one recurring VooV meeting per student, so the parent keeps the same meeting ID.',
  rule:'One RECURRING meeting per student, ending as late as VooV allows. No meeting password. Parents keep the same ID, so they are never asked to change it.',
  parts:[
   {h:'Name it: STUDENT NAME: COURSEWARE',p:'In capitals, so the parent and every teacher see at once whose class it is.',img:'img/meet-naming.webp'},
   {h:'Schedule it in VooV',red:1,p:'Schedule › fill in the Topic, the class day and time (Philippine time) › change Recurring from Never to the class repeat › set the end as far as VooV allows (up to 200 classes) › Schedule.',img:'img/meet-vv1.webp'},
   {h:'Security: no password',red:1,p:'Scroll down to Security. Leave Meeting Password and Waiting Room unticked; keep Attendees can join before host ticked.',img:'img/meet-vv2.webp'},
   {h:'Check it and copy the ID',p:'In your meeting list the class shows Recurring next to its meeting ID. Copy that ID.',img:'img/meet-vv3.webp'},
   {h:'Add the ID in our app',p:'On Today, or on your Schedule week calendar, tap + Meeting ID on the class (or tap the class block). Paste and save: it goes on all your upcoming classes with that student.',img:'img/meet-appid.webp'},
   {h:'Before you send it to the parent',list:['The title is STUDENT NAME: COURSEWARE in capitals','It says Recurring, and the end is as late as VooV allows','No meeting password','The same ID is saved in our app','Send the parent the ID once; it stays the same for every class']}
  ]},
 {id:'give-homework',title:'Give Homework',cat:'Homework',icon:'book',updated:'2026-11-25',mins:2,cover:'img/cover-give.webp',open:'../homework/give.html',
  sum:'Make the homework picture after class and send it to the parent.',
  rule:'Copy a photo or worksheet from anywhere, then paste it in the Pictures box. No need to save or upload files.',
  parts:[
   {h:'The screen',p:'Open it from the class card: Give homework. Each number points to one part.',img:'img/give-screen.webp'},
   {h:'Pictures: copy, then paste',p:'Any photo or worksheet from WeChat, a website or a book page. Up to 6 pictures; they go on the homework picture in that order.',img:'img/paste.webp'},
   {h:'Send it',list:['Type the task: the instructions or essay question','Add a short note: one thing done well, one thing to fix','Check the homework picture on the right','Tap Copy picture for the parent/student, then paste it in the WeChat group','Tap Start a new homework for the next student']}
  ]}
];
