// 14 Oct pm · Fast layer, step 2 (Misty: "do all now"). Time-in and "I'm in" go through the fast layer too, for the same test
// teachers (Misty in teacher view, Julia). The screen proof travels with it; Apps Script replays it at the time the teacher
// tapped (sbAt_), so On time / Late are decided exactly as before. The app shows On time / Late at once from the schedule.
// If the fast layer can't answer, the normal save runs (the server ignores a second time-in or "I'm in" for the same class).
require('../tools/lib.js')(process.argv[2], [
["FAST_W = { saveNote: 1, markHomework: 1, tNoteTag: 1, tGoalsSave: 1 };",
 "FAST_W = { saveNote: 1, markHomework: 1, tNoteTag: 1, tGoalsSave: 1, timeIn: 1, classIn: 1 };"],
["  if(fn === 'markHomework') return { ok: true, queued: true, hw: { time: t, text: String(a.text || '') } };\n",
 "  if(fn === 'markHomework') return { ok: true, queued: true, hw: { time: t, text: String(a.text || '') } };\n" +
 "  if(fn === 'timeIn'){ const fl = (D.schedule || []).filter(x => x.day === D.today && !x.cancelled).sort((p, q) => String(p.start).localeCompare(String(q.start)))[0], mins = fl ? Math.round((new Date(fl.start).getTime() - Date.now()) / 60000) : '';\n" +
 "    return { ok: true, queued: true, timeIn: { time: t, status: fl ? (mins >= 30 ? 'On time' : 'Late') : 'No class today', mins, place: '', proof: '', flag: '' } }; }\n" +
 "  if(fn === 'classIn'){ const c = args[1] || {}, x = (D.classIns || {})[c.id] || { time: t, status: 'On time', mins: '' }; return { ok: true, queued: true, classIn: Object.assign({}, x, { pending: false, proof: '', flag: '', speed: '' }) }; }\n"],
["tid = ac ? setTimeout(() => ac.abort(), 6000) : 0;",
 "tid = ac ? setTimeout(() => ac.abort(), fn === 'timeIn' || fn === 'classIn' ? 15000 : 6000) : 0;   /* the screen proof needs longer */"],
]);
