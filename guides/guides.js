/* 2885 · Teacher guides (Misty 25 Nov): one place for every "how to".
   To add or update a guide, edit this list only. `updated` shows a "New" or "Updated" badge for 14 days. */
window.COE_GUIDES=[
 {id:'check-homework',title:'Check homework',icon:'check',updated:'2026-11-25T12:10',
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
 {id:'trial-feedback',title:'Trial class feedback',icon:'star',soon:1,sum:'Fill in the trial report after a trial class.'},
 {id:'meeting-id',title:'Meeting ID',icon:'video',soon:1,sum:'Find and share the class meeting ID.'},
 {id:'give-homework',title:'Give homework',icon:'book',updated:'2026-11-25',mins:2,cover:'img/cover-give.webp',open:'../homework/give.html',
  sum:'Make the homework picture after class and send it to the parent.',
  rule:'Copy a photo or worksheet from anywhere, then paste it in the Pictures box. No need to save or upload files.',
  parts:[
   {h:'The screen',p:'Open it from the class card: Give homework. Each number points to one part.',img:'img/give-screen.webp'},
   {h:'Pictures: copy, then paste',p:'Any photo or worksheet from WeChat, a website or a book page. Up to 6 pictures; they go on the homework picture in that order.',img:'img/paste.webp'},
   {h:'Send it',list:['Type the task: the instructions or essay question','Add a short note: one thing done well, one thing to fix','Check the homework picture on the right','Tap Copy picture for the parent/student, then paste it in the WeChat group','Tap Start a new homework for the next student']}
  ]}
];
