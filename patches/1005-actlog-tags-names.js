// 1005: (Misty, 25 Oct 20:48) "My Activity Log … every detail the student is there?" — 990 named the student on class notes,
// homework, I'm in, meeting ID and class videos. The one line still without a name was "Note tags" (the server sends no
// student for it). Each note-tag save follows its class-note save within seconds, so the line now takes the student
// (and class) of the class note saved just before it (within 3 minutes). Display only; the log records are unchanged.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["ST.rows = r.rows || []; ST.who = r.who;",
   "ST.rows = r.rows || []; ST.who = r.who; try{ let last = null; ST.rows.forEach(x => { if(x.code && /^(saveNote|markHomework|classIn)$/.test(x.fn)) last = x; else if(x.fn === 'tNoteTag' && !x.code && last && Math.abs(Date.parse(x.at) - Date.parse(last.at)) < 18e4){ x.code = last.code; x.student = last.student; x.start = last.start; } }); }catch(e){}   /* 1005 */"]
]);
