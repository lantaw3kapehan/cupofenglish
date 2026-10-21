// 21 Oct · Final polish, teacher Students and Books (Misty: "can you final polish STUDENTS SCREEN and BOOKS SCREEN").
//  · Students: each card shows the student's next class (teal "Today 19:00", "Tomorrow 19:30", or the day).
//  · Students menu number: only what can be done now (feedback that is open or to fix, a missing trial report). Before feedback
//    opens on the 25th it showed every student still to get feedback (22), which looked like 22 things to do.
//  · Books: students who have a class today are ringed in teal on every book and in "By student", with a one-line key.
const NX = "    const NX = {}; { const now = Date.now(); (D.schedule || []).filter(c => c.code && !c.cancelled && new Date(c.end).getTime() > now).sort((a, b) => String(a.start).localeCompare(String(b.start))).forEach(c => { if(!NX[c.code]) NX[c.code] = c; }); }\n    const nxL = c => { if(!c) return ''; const d = new Date(c.start), y = ymdLocal(d), t = ymdLocal(new Date()), tm = ymdLocal(new Date(Date.now() + 864e5)), hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');\n      return `<div class=\"nx507 ${y === t ? 't' : ''}\"><i></i>${y === t ? 'Today ' + hm : y === tm ? 'Tomorrow ' + hm : esc(d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })) + ' · ' + hm}</div>`; };\n";
require('../tools/lib.js')(process.argv[2], [
["    const card = s => { const P = parts(s.book), bk = P.bk.join(' · '), col = bookCol(s.book), lo = s.left != null && s.left <= 5;",
 NX + "    const card = s => { const P = parts(s.book), bk = P.bk.join(' · '), col = bookCol(s.book), lo = s.left != null && s.left <= 5;"],
["'<div class=\"ln\"><em>No class note yet</em></div>'}</div>",
 "'<div class=\"ln\"><em>No class note yet</em></div>'}${nxL(NX[s.code])}</div>"],
["if(el.dataset.k504 !== h){ el.innerHTML = h; el.dataset.k504 = h; }",
 "if(el.dataset.k504 !== h){ el.innerHTML = h; el.dataset.k504 = h; }\n    try{ const n = all.filter(s => fbS[s.code] && !fbS[s.code].done && (fbS[s.code].fix || fbCan(s.code))).length + (D.special || []).filter(x => x.reportMissing).length, b = $('dStu'); if(b){ b.textContent = n; b.classList.toggle('hide', !n); b.title = n ? n + ' to do now (feedback or trial report)' : ''; } }catch(e){}   /* 507: only what can be done now */"],
["#v-students .c504 .rt{",
 "#v-students .nx507{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font-size:12px;font-weight:700;color:#6B6884;font-variant-numeric:tabular-nums}\n#v-students .nx507 i{width:7px;height:7px;border-radius:50%;background:#B9B6CC}\n#v-students .nx507.t{color:#00737B}#v-students .nx507.t i{background:#00A3AD;box-shadow:0 0 0 3px rgba(0,163,173,.18)}\n#v-students .c504 .rt{"]
]);
// Books: today's students
require('../tools/lib.js')(process.argv[2], [[
"  window.bkWho = who => `<div class=\"who\">",
"  window.bkToday = () => { try{ const t = ymdLocal(new Date()), S = new Set((D.schedule || []).filter(c => c.day === t && !c.cancelled).map(c => String(c.student || '').trim().toLowerCase())); return S; }catch(e){ return new Set(); } };   /* 507 */\n  window.bkWho = who => `<div class=\"who\">"]]);
require('../tools/lib.js')(process.argv[2], [
["${who.slice(0, 8).map(w => { const p = pick(w); return `<span class=\"bk-sn\" style=\"--sb:${p[0]};--sc:${p[1]}\">${esc(w)}</span>`; }).join('')}",
 "${(() => { const T = window.bkToday ? bkToday() : new Set(); return who.slice().sort((a, b) => (T.has(String(b).toLowerCase()) ? 1 : 0) - (T.has(String(a).toLowerCase()) ? 1 : 0)).slice(0, 8).map(w => { const p = pick(w), td = T.has(String(w).toLowerCase()); return `<span class=\"bk-sn${td ? ' td507' : ''}\" style=\"--sb:${p[0]};--sc:${p[1]}\"${td ? ' title=\"Class today\"' : ''}>${esc(w)}</span>`; }).join(''); })()}"],
["<div class=\"bl-sr\"><div class=\"bl-av\" style=\"--bc:${window.bkStuC ? bkStuC(w) : S0.c}\">${esc(w[0] || '?')}</div><div class=\"nm\">${esc(w)}</div>",
 "<div class=\"bl-sr${window.bkToday && bkToday().has(String(w).toLowerCase()) ? ' td507' : ''}\"><div class=\"bl-av\" style=\"--bc:${window.bkStuC ? bkStuC(w) : S0.c}\">${esc(w[0] || '?')}</div><div class=\"nm\">${esc(w)}${window.bkToday && bkToday().has(String(w).toLowerCase()) ? ' <small class=\"td507k\">class today</small>' : ''}</div>"],
["    if(teach) h += `<div class=\"bl-n505\">Your students' books${others ? ` · ${others} more open when one of your students starts them` : ''}</div>`;",
 "    if(teach) h += `<div class=\"bl-n505\">Your students' books${others ? ` · ${others} more open when one of your students starts them` : ''}${window.bkToday && bkToday().size ? ' · <span class=\"bk-sn td507\" style=\"--sb:#fff;--sc:#00737B\">ringed</span> = class today' : ''}</div>`;"],
["#v-books .bl-n505{", ".bk-sn.td507{box-shadow:0 0 0 1.5px #00A3AD inset,0 0 0 2px rgba(0,163,173,.15)}\n#v-books .bl-sr.td507 .bl-av{box-shadow:0 0 0 2px #fff,0 0 0 3.5px #00A3AD}#v-books .td507k{font-size:11px;font-weight:700;color:#00737B;margin-left:6px}\n#v-books .bl-n505{"]
]);
