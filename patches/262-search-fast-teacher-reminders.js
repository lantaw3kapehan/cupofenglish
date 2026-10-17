// 17 Oct · (1) Schedule search: the student list shows at once from this device (refreshed quietly behind).
// (2) Reminders due: classes in the teacher's turn (Ops off) leave the Ops list; a quiet "Teacher's turn" line shows who reminded (✓ Teacher X 08:41) or who is still waiting.
require('../tools/lib.js')(process.argv[2], [
["if(!SL){ SL = { students:[], teachers:[] }; api('schedLists', TOKEN).then(x => { SL = x; if(document.activeElement === inp) scSug(); }).catch(()=>{ SL = null; }); }",
 "if(!SL){ SL = kept('sl2') || { students:[], teachers:[] }; api('schedLists', TOKEN).then(x => { if(x && x.students){ SL = x; keep('sl2', x); if(document.activeElement === inp) scSug(); } }).catch(()=>{ if(!SL.students.length) SL = null; }); }"],
["const due = SC.events.filter(e => { const st = scStage(e); return st && !scSent(e, st); })",
 "const due = SC.events.filter(e => { const st = scStage(e); return st && !scSent(e, st) && !remByTeacher(e); })"],
]);
