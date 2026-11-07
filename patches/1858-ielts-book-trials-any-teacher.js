// 1858: (Misty 7 Nov "any teacher that will be assigned with IELTS, will see the assessment right? it will automate?" · "yes" ·
//   "young-learner trial and adult, these should stay the same, no change")
//   · A trial booked with an IELTS book (IELTS, IELTSSpeaking, IELTSWriting, IELTSReading, IELTSUKVIGT) opens the IELTS assessment for
//     whichever teacher has it — from the class card, the Today "Trial report" reminder and Students › Trials (coe-assess v7).
//   · Every other trial (young learners, adults …) opens the usual trial report, with no extra choice, for every teacher.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["trialSheet(${trQ({code:x.code,student:x.student,date:x.date,time:x.time})})", "trialSheet(${trQ({code:x.code,student:x.student,date:x.date,time:x.time,ie:/ielts/i.test(x.book||''),ieW:/ielts\\s*writing/i.test(x.book||'')})})"],
  ["trialSheet(${trQ({code:t.code,student:t.student,date:t.date,time:t.time})})", "trialSheet(${trQ({code:t.code,student:t.student,date:t.date,time:t.time,ie:/ielts/i.test(t.book||''),ieW:/ielts\\s*writing/i.test(t.book||'')})})"],
  ["trialSheet(${trQ({ code: t.code, student: t.student, date: t.date, time: t.time })})", "trialSheet(${trQ({ code: t.code, student: t.student, date: t.date, time: t.time, ie: /ielts/i.test(t.book || ''), ieW: /ielts\\s*writing/i.test(t.book || '') })})"],
  ["const ex = mine(q); if(ex || q.ie) return openA(q);\n    openSheet(", "const ex = mine(q); if(ex || q.ie) return openA(q); if(!window.__ieChoice) return base.apply(this, arguments);   /* 1858: other trials: the usual report */\n    openSheet("]]);
