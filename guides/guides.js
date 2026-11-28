/* 2885 · Teacher guides (Misty 25 Nov): one place for every "how to".
   To add or update a guide, edit this list only. `updated` shows a "New" or "Updated" badge for 14 days. */
window.COE_GUIDES=[
 /* 3159 (Misty 28 Nov 16:42): guides for management only (shown when the app's sign-in on this device is management) */
 {id:'m-milestone',mgmt:1,title:'Milestone Certificates',cat:'Management',icon:'star',updated:'2026-11-28T17:00',mins:2,
  sum:'Send the time-with-us certificate when a student reaches 3 months, 6 months, 1 year and every year after.',
  rule:'Send only what the app lists. If it says Check the dates first, confirm the dates before you send.',
  parts:[
   {h:'Where they are',p:'To do › Celebrate lists every active student who reached a milestone in the last 30 days, with the date it was reached and the learning period.'},
   {h:'Make and send',list:['Tap Milestone Certificate, then Copy Picture and paste it in the parent’s WeChat','Copy Message gives the English and Chinese text to send with it','Tap Mark as Sent, or Skip if it should not be sent']},
   {h:'Check the dates first',red:1,p:'The amber chip means a break may be missing (for example before 2026, when the records are incomplete). Ask the family or check the chat, then record the break with Pauses on the student page. The milestone moves by itself.'},
   {h:'How learning time is counted',p:'From January 2026, the lessons actually held. Before 2026, the package dates. A gap of more than 45 days with no lesson, or a recorded pause, is not counted.'},
   {h:'The titles',list:['3 Months · Rising Learner (Jade)','6 Months · Committed Learner (Sapphire)','1 Year · Dedicated Learner (Amethyst)','2 Years · Honored Learner (Ruby)','3 and 4 Years · Elite Learner (Onyx)','5 Years and more · CupOfEnglish Legend (Gold)']}
  ]},
 {id:'m-pauses',mgmt:1,title:'Pauses in Learning',cat:'Management',icon:'calendar',updated:'2026-11-28T17:00',mins:1,
  sum:'Record a break the lesson records cannot show, so learning time and milestones stay right.',
  rule:'Record a pause only when you know it happened (the family told us, or the chat shows it).',
  parts:[
   {h:'Where',p:'Open the student’s page › With us card › Pauses.'},
   {h:'Add a pause',list:['Paused from: the first day without lessons','Back on: the day lessons started again (leave it empty if the student has not come back)','Note: what happened, in a few words','Tap Add Pause']},
   {h:'What changes',p:'The pause is taken out of the learning time everywhere: milestone dates, certificates, To do › Celebrate and the journey line. The teacher’s card counts it the same way. Teachers cannot see or change pauses.'},
   {h:'Made a mistake?',p:'Open Pauses again and tap Remove on that line.'}
  ]},
 {id:'m-videos',mgmt:1,title:'Videos to Check',cat:'Management',icon:'video',updated:'2026-11-28T17:00',mins:1,
  sum:'Review the class videos the app flagged, with the teacher’s explanation.',
  rule:'A flag is a question, not a penalty. Read the teacher’s reason before you decide.',
  parts:[
   {h:'What gets flagged',list:['A screen proof instead of a video','A video under 80% of the class time','A video recorded before the class started','The same file as another class’s video']},
   {h:'Where',p:'Overview › Videos to check. Each line shows the class, the check and the teacher’s reason.'},
   {h:'Decide',list:['Open the video','OK: the reason is fine','Needs action: contact the teacher; she sees “management will contact you”','Remove the wrong video: when a teacher uploaded the wrong file']}
  ]},
 {id:'m-sync',mgmt:1,title:'Your Changes Reach Teachers',cat:'Management',icon:'refresh',updated:'2026-11-28T17:00',mins:1,
  sum:'What you save shows on the teacher’s app within about 20 seconds, without a refresh.',
  parts:[
   {h:'What updates by itself',list:['Classes: add, edit, cancel, move, substitute','Student details, book, meeting ID, pauses','Notices, memos, leave answers, late decisions','Video check reviews, contracts to sign, QA feedback, peer reviews','Pay checks and replies, trainings, Speaking topics']},
   {h:'When it waits',p:'The teacher’s app does not reload while she is typing, uploading a class video, or has the app in the background. It updates as soon as she is done.'},
   {h:'A teacher still sees the old version',p:'Ask her to tap Update app at the top, or close the app and open it again.'}
  ]},

 {id:'app-update',cover:'img/g-update.webp',title:'Updating the App',cat:'Getting Started',icon:'refresh',updated:'2026-11-28T14:30',mins:1,
  sum:'Keep the app on the newest version. When Update ready shows at the top, tap it.',
  rule:'The app now runs fully on our own database. An old version of the app can fail to upload class videos, so update when you see Update ready.',
  parts:[
   {h:'Update ready at the top',p:'When a new version is ready, a button shows at the top of the screen: Update ready · Update app (on a phone it shows only Update app). Tap it. The app reloads on the newest version in a few seconds.',img:'img/g-update.webp'},
   {h:'Finish what you are typing first',p:'If a form is open with text in it, finish and save it before you update, so nothing you typed is lost.'},
   {h:'Not sure you have the newest version?',p:'Close the app tab or window completely and open the app again. It loads the newest version by itself.'},
   {h:'Something does not work after an update',list:['Close the app and open it again once','Check your internet','Still not working? Message Ops in Team Chat with a screenshot']}
  ]},
 {id:'sign-in',cover:'img/g-signin.webp',title:'Signing In and Your Password',cat:'Getting Started',icon:'key',updated:'2026-11-28T14:30',mins:1,
  sum:'Sign in with your Gmail and your app password. Forgot it? Message Ops.',
  rule:'Your password is only for you. Never share it, and never sign in on someone else’s laptop and leave it open.',
  parts:[
   {h:'Sign in',p:'Choose Teacher, type the Gmail registered with CupOfEnglish and your app password, then tap Sign in. You stay signed in on that device, so you rarely need to do this.',img:'img/g-signin.webp'},
   {h:'Wrong password',p:'After 6 wrong tries the app waits 15 minutes before you can try again. Type slowly and check Caps Lock.'},
   {h:'Forgot your password or new to the app',p:'There is no “forgot password” email for teachers. Message Ops: Operations sets a new password for you and tells you privately.'},
   {h:'“This Gmail is not registered yet”',p:'Your Gmail is not in the app yet, or it is spelled differently. Message Ops with the Gmail you use.'},
   {h:'“Your app access was removed”',p:'Your access is off. Message Ops.'}
  ]},
 {id:'leave',cover:'img/g-leave-1.webp',title:'Filing a Leave (Notice of Unavailability)',cat:'Rules',icon:'calendar',updated:'2026-11-28T14:30',mins:2,
  sum:'For lessons already booked with you: file at least 4 hours before the first lesson, with proof.',
  rule:'Booked lessons are your commitment. Students book their slots ahead, so file a leave only for a real emergency or a valid reason. Every leave you file counts, whether it is approved, declined or still waiting.',
  parts:[
   {h:'Where to file it',p:'Today or Notices & requests › Request leave. The form is called Notice of unavailability.'},
   {h:'Fill in the form',list:['Type: Sick, Emergency, Bereavement, Vacation, Personal or Other','From and To: the dates','How much: Whole day, or Some classes with the times','Booked lessons affected: the app lists them and shows how many hours’ notice each one has','Reason: what happened','Proof: the form tells you what to attach for the type you picked. If you cannot attach it yet, tick I’ll send it later'],img:'img/g-leave-1.webp'},
   {h:'At least 4 hours’ notice (Clause 2.9)',red:1,p:'File at least 4 hours before the first booked lesson. Less than 4 hours’ notice brings a service credit for each lesson, as shown in the form, even with a valid reason. Operations moves or covers your lessons, and you see the status in your list.'},
   {h:'Every request counts',red:1,p:'All leaves you file are counted by month: approved, declined or waiting. Only a request you cancel yourself does not count. More than 1 in a month is over the limit.',img:'img/g-leave-2.webp'},
   {h:'The monthly marker',list:['Month 1 of 3 over the limit: a reminder','Month 2 of 3: a formal warning','Month 3 of 3: suspension, a pause in lesson offers of up to 30 days']},
   {h:'Free time with no booked lessons',p:'If you have no booked lessons on those dates, you do not need a leave. Close those hours in My open times instead (Clause 2.10).'}
  ]},
 {id:'time-in',cover:'img/g-timein-1.webp',title:'Time-in and Being on Time',cat:'Rules',icon:'clock',updated:'2026-11-28T14:30',mins:2,
  sum:'Time in 30 to 40 minutes before your first class, then tap I’m in for every class by its start.',
  rule:'Time in at least 30 minutes before your first class. Tap I’m in by the start of each class. There is no grace period.',
  parts:[
   {h:'Time in on your class laptop',p:'Time-in opens 40 minutes before your first class and is on time until 30 minutes before. Open the app in Chrome or Edge on the laptop you teach on, tap Time in, then Share entire screen · Time in.',img:'img/g-timein-1.webp'},
   {h:'What the picture must show',list:['Your VooV class with your student','Your computer’s full date and time (Windows: bottom right · Mac: top right)','The LAN cable icon, not Wi-Fi. Turn Wi-Fi off during class','Allow your location when the app asks'],img:'img/g-timein-2.webp'},
   {h:'Teaching from the office',p:'Office computer and office internet are fine. The app records At the office when your location is within the office.'},
   {h:'I’m in for each class',p:'I’m in opens 5 minutes before each class (for example at :25 for a :30 class) and is on time until the class starts.'},
   {h:'If you were late: reply once, within 24 hours',red:1,p:'A late shows as a System notice on Today and under Pay › Punctuality. Tap Submit proof or reason, write what happened (with times if you can) and add a picture if you have one, for example a screenshot that shows the time or a power or internet outage notice. You can reply once. Management decides Excused, Unexcused or Waived. A late not excused or waived within 24 hours becomes Unexcused automatically.'}
  ]},
 {id:'notices',cover:'img/g-notices.webp',title:'Notices, Memos and Got It',cat:'Messages',icon:'bell',updated:'2026-11-28T14:30',mins:1,
  sum:'Formal notices and official memos come to Notices & requests. Tap Got it so management knows you read it.',
  rule:'Read every notice when it arrives and tap Got it.',
  parts:[
   {h:'Where they are',p:'Notices & requests in the menu. A red number shows what you have not read yet. Everything stays there, so you can read it again later.',img:'img/g-notices.webp'},
   {h:'Tap Got it',p:'Got it tells management you have read and understood it. Management sees who has read each notice and who tapped Got it.'},
   {h:'Official memos',p:'An official memo has the CupOfEnglish memo layout, a memo number and a signature. It is part of your records, like your contract.'},
   {h:'Reply or ask',p:'If a notice asks for a reply, reply under it. For a new question, tap New message.'}
  ]},
 {id:'video-checks',cover:'img/g-vcheck.webp',title:'Video Checks: Explain a Flagged Video',cat:'Classes',icon:'video',updated:'2026-11-28T14:30',mins:1,
  sum:'Some uploads are checked. If your video is flagged, explain it on Today before management reviews it.',
  rule:'A check never blocks your upload. It only asks you to explain, so management can mark it OK.',
  parts:[
   {h:'What gets flagged',list:['A screen proof instead of a video','A video much shorter than the class (under 80% of the class time)','A video recorded before the class started','The same file as another class’s video']},
   {h:'Where you see it',p:'Today › Video checks lists your flagged videos with their status: Explain this video, Waiting for review, Reviewed · OK, or Needs action (management will contact you).',img:'img/g-vcheck.webp'},
   {h:'Explain it',p:'Tap Explain, choose the reason, and write what happened (required). You can change your explanation until management reviews it.'},
   {h:'Before you upload',p:'If the app sees a problem before the upload, it asks for the reason first, so the explanation goes in with the video.'}
  ]},
 {id:'class-notes',cover:'img/g-notes.webp',title:'Class Notes on the Right Student',cat:'Classes',icon:'book',updated:'2026-11-28T14:30',mins:1,
  sum:'Open the book from the class you are teaching, and check the student’s name on the notes before you write.',
  rule:'Look at For / 学生 on the page before you write. The name must be the student in front of you.',
  parts:[
   {h:'Open the book for this class',p:'Open the book page from the class card (or the student’s Course book card) of the class you are teaching now. During a class the app puts that student’s name on the notes.'},
   {h:'Check the name',red:1,p:'Class Notes / 课堂笔记 shows the teacher, the date and For / 学生. If the name is wrong, close the book and open it again from the right class card.',img:'img/g-notes.webp'},
   {h:'No name shown?',p:'If the app cannot tell which student it is, it leaves the name empty rather than guess. Open the book from the class card to fill it in.'},
   {h:'Your drawings are kept',p:'Notes you draw are kept on your laptop for the same day, even if you reopen the book.'}
  ]},
 {id:'my-contract',cover:'img/g-contract.webp',title:'My Contract: Read and Sign',cat:'My Records',icon:'file',updated:'2026-11-28T14:30',mins:2,
  sum:'Your Agreement, Annex A and Addendum are in the app. Read them, sign in the app, and keep a printable copy.',
  rule:'You must respond within 14 days of receiving a document: sign it, or tell us if you have a question or do not agree.',
  parts:[
   {h:'Where it is',p:'Menu › My Contract shows Your documents, what was sent to you, what you signed and when.'},
   {h:'Read, then sign',list:['Open the document and read it to the end','Type your full name, exactly as in your Agreement','Draw your signature with your finger or mouse','Tap Sign'],img:'img/g-contract.webp'},
   {h:'Not ready to sign?',p:'Tap I have a question, or I do not agree, and write why. Management replies in the app.'},
   {h:'Your copy',p:'Tap Print or save as PDF for your own copy. After the President countersigns, the notarized copy is attached here too.'},
   {h:'Memos in your contract',p:'Official memos that are part of your contract are listed under Memoranda named in your contract.'}
  ]},
 {id:'monthly-work',cover:'img/g-monthly.webp',title:'Monthly Feedback and Peer Reviews',cat:'My Records',icon:'star',updated:'2026-11-28T14:30',mins:1,
  sum:'Find the monthly feedback and peer reviews you still owe, and send them on time.',
  rule:'Today › Needs your action lists what is due. Clear it before the month closes.',
  parts:[
   {h:'Monthly feedback',p:'Students › Feedback due shows each student whose monthly feedback is due. Open the student, fill in the feedback form and send it.',img:'img/g-monthly.webp'},
   {h:'Peer reviews',p:'If you are asked to review a colleague’s class, it shows on Today › Needs your action and at the top of Growth › Peer feedback with an Open button. Watch the class, then fill in and send the form.'},
   {h:'Your own feedback from management',p:'When your QA feedback is ready, open it, read it, and tap I have read and understood my feedback.'}
  ]},

 {id:'check-homework',title:'Check Homework',cat:'Homework',icon:'check',updated:'2026-11-25T19:00',
  sum:'Mark a photo of homework and send the parent a picture.',open:'../homework/',cover:'img/cover-check.webp',mins:2,
  rule:'Type corrections in RED, beside the mistake. Only red counts as "To fix" for the parent.',
  parts:[
   {h:'The screen',p:'Each number points to one part.',img:'img/screen.webp'},
   {h:'Paste the photo the student sent',p:'Copy it in WeChat, click the homework area, then press ⌘ Cmd + V (Ctrl + V on Windows). If it is one of our own pictures, the app keeps only the homework, so the logo shows once.',img:'img/paste.webp'},
   {h:'Five steps, photo to parent',img:'img/flow-2930.webp'},
   {h:'Red, not blue or green',red:1,p:'Blue and green are for comments and praise only.',img:'img/redblue.webp'},
   {h:'Typing a correction in four taps',p:'Put it just below or beside the word, never on top. Double-click a tag to change its words.',img:'img/typing.webp'},
   {h:'Before you send',list:['Every correction is red and beside the mistake','"To fix" matches the mistakes you marked','Two Stars and a Wish has all three lines filled in','You tapped Copy picture and saw "Saved to … homework" (Copy picture saves the check for you)','You pasted the picture, not a screenshot of the screen']}
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
