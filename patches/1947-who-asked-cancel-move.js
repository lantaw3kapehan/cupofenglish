// 1947: (Misty, 9 Nov 11:09 "let us do all now") Cancel and Move ask "Who asked?" — Parent / student · Teacher · CupOfEnglish · Force majeure.
//   Required for every cancel and move from the class card. Choosing a reason chip suggests it (Parent asked → Parent, Internet problem → Teacher).
//   Sent as f.by with editClass; the database keeps it on the class (data.by / data.mvBy, migration class_who_asked_1947)
//   and Perfect Attendance (Memo 19-2026) counts only what the teacher asked for.
//   Company tools (change teacher, change schedule) send by: company.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["async function classEdit(i, src){",
   "/* 1947: who asked for this change */\n" +
   "const CE_WHO = [['parent', 'Parent / student'], ['teacher', 'Teacher'], ['company', 'CupOfEnglish'], ['force', 'Force majeure']];\n" +
   "function ceWhoHtml(k){ return '<label style=\"margin-top:12px\">Who asked for this? <span class=\"mute small\">(required · counts for Perfect Attendance)</span></label><div class=\"seg\" id=\"eWho' + k + '\" style=\"flex-wrap:wrap;margin-top:0\">' + CE_WHO.map(w => '<button type=\"button\" data-w=\"' + w[0] + '\" onclick=\"ceWho(\\'' + w[0] + '\\')\">' + w[1] + '</button>').join('') + '</div><div class=\"small mute\" id=\"eWhoN' + k + '\" style=\"margin-top:4px\"></div>'; }\n" +
   "window.ceWho = function(v){ window._ceWho = v; ['m', 'c'].forEach(k => { const b = document.getElementById('eWho' + k); if(b) b.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.w === v)); const n = document.getElementById('eWhoN' + k); if(n) n.textContent = v === 'teacher' ? 'Counts as teacher-initiated: the teacher loses this month\\'s Perfect Attendance incentive.' : v === 'force' ? 'Only for events beyond everyone\\'s control (typhoon, area-wide outage). Routine internet, power or equipment problems are the teacher\\'s.' : v ? 'Does not affect the teacher\\'s Perfect Attendance.' : ''; }); };\n" +
   "document.addEventListener('click', ev => { try{ const b = ev.target && ev.target.closest && ev.target.closest('#ceCx .skc button'); if(!b) return; const t = b.textContent || '';\n" +
   "  if(/^(Teacher unavailable|Internet problem|Power outage)/.test(t)) ceWho('teacher'); else if(/Parent|Student|School exam|Family trip|Holiday/.test(t)) ceWho('parent'); }catch(e){} }, true);\n" +
   "async function classEdit(i, src){"],
  ["CE = { e, i, src }; const nw0", "CE = { e, i, src }; window._ceWho = ''; const nw0"],
  ['<button class="btn block" id="eGo"', '${ceWhoHtml(\'m\')}<button class="btn block" id="eGo"'],
  ['<label>Reason for cancelling', '${ceWhoHtml(\'c\')}<label>Reason for cancelling'],
  ["force: action==='move' && ckForce()};",
   "force: action==='move' && ckForce()};\n" +
   "if((action === 'move' || (action === 'cancel' && !e.cancelled)) && !window._ceWho) return toast('Choose who asked for this change');   /* 1947 */\n" +
   "if(window._ceWho && action !== 'restore') f.by = window._ceWho;"],
  ["teacher: o.nw };\n      try{ const r = await api('editClass', TOKEN, c.id, f);", "teacher: o.nw, by: 'company' };\n      try{ const r = await api('editClass', TOKEN, c.id, f);"],
]);
