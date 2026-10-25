// 873: Commands read as verbs, statuses as states (audit #15). Buttons that RECORD something were labelled like a status
//      ("✓ Sent", "Checked · hide", "Trial booked"), so they looked like a state already reached. Same handlers, new words only:
// · To do › renewal reminder, Schedule › class reminders (2 places), Celebrations (2 places): "✓ Sent" → "Mark as sent" / "Mark as reminded"
// · Agreement: "✓ Sent · waiting for the reply" → "Mark as sent · waiting for the reply"
// · QA score fixes: "Checked · hide" → "Mark checked · hide"; "Checked · scores are right · hide" → "Mark checked · scores are right · hide"
// · Leave: "Checked · raise to the President" → "Mark checked · raise to the President"
// · Trainings › coaching: "Done · notes" → "Add notes · mark done" (it opens the notes form)
// · Enquiries: the status buttons "Trial booked / Enrolled / Not now" → "Mark trial booked / Mark enrolled / Mark not now"
//   (the status itself stays a chip on the card)
// · Hints that said "tap ✓ Sent" now say "tap Mark as sent".
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["onclick=\"renQuick('${esc(r[1])}','${esc(String(r[0]).replace(/'/g,''))}')\">✓ Sent</button>",
   "onclick=\"renQuick('${esc(r[1])}','${esc(String(r[0]).replace(/'/g,''))}')\">Mark as sent</button>"],
  ["title=\"Already sent in WeChat · clear it\" onclick=\"scRemDone([${i}])\">✓ Sent</button>",
   "title=\"Already sent in WeChat · clear it\" onclick=\"scRemDone([${i}])\">Mark as sent</button>"],
  ["title=\"Already reminded in WeChat · clear it\" onclick=\"scRemDone([${i}])\">✓ Sent</button>",
   "title=\"Already reminded in WeChat · clear it\" onclick=\"scRemDone([${i}])\">Mark as reminded</button>"],
  ["<button class=\"btn ghost sm\" onclick=\"celMark(${i})\">✓ Sent</button>",
   "<button class=\"btn ghost sm\" onclick=\"celMark(${i})\">Mark as sent</button>"],
  ["<button class=\"btn ghost grow\" onclick=\"celMark(${i})\">✓ Sent</button>",
   "<button class=\"btn ghost grow\" onclick=\"celMark(${i})\">Mark as sent</button>"],
  ["onclick=\"agrSave('Sent')\">✓ Sent · waiting for the reply</button>",
   "onclick=\"agrSave('Sent')\">Mark as sent · waiting for the reply</button>"],
  ["onclick=\"fixIgnore(${i},'checked with the teacher')\">Checked · hide</button>",
   "onclick=\"fixIgnore(${i},'checked with the teacher')\">Mark checked · hide</button>"],
  ["fixIgnore(${i},'checked with the teacher')\">Checked · scores are right · hide</button>",
   "fixIgnore(${i},'checked with the teacher')\">Mark checked · scores are right · hide</button>"],
  ["onclick=\"lvSave(false, true)\"${x.ask ? ' disabled' : ''}>Checked · raise to the President</button>",
   "onclick=\"lvSave(false, true)\"${x.ask ? ' disabled' : ''}>Mark checked · raise to the President</button>"],
  ["onclick=\"trCoachDone(' + s.id + ')\">Done · notes</button>",
   "onclick=\"trCoachDone(' + s.id + ')\">Add notes · mark done</button>"],
  ["' + ['Trial booked', 'Enrolled', 'Not now'].filter(s => s !== e.st).map(s => '<button class=\"btn ghost sm\" onclick=\"enqSt(\\'' + e.id + '\\',\\'' + s + '\\')\">' + s + '</button>').join('')",
   "' + ['Trial booked', 'Enrolled', 'Not now'].filter(s => s !== e.st).map(s => '<button class=\"btn ghost sm\" onclick=\"enqSt(\\'' + e.id + '\\',\\'' + s + '\\')\">Mark ' + s.toLowerCase() + '</button>').join('')"],
  ["copy the message, send it in WeChat, tap ✓ Sent</span>",
   "copy the message, send it in WeChat, tap Mark as sent</span>"],
  ["then tap ✓ Sent'), () => { openShee",
   "then tap Mark as sent'), () => { openShee"],
  ["send it in the class WeChat group, tap ✓ Sent</span>",
   "send it in the class WeChat group, tap Mark as sent</span>"],
  ["then tap ✓ Sent'), () => openSheet(",
   "then tap Mark as sent'), () => openSheet("]
]);
