// 14 Oct pm · Teacher forms on the fast layer (Misty: "as long as you follow the same control, e.g. monthly class feedback
// should open in certain times like we agreed"). Monthly class feedback, progress check, trial report, peer review, meeting ID,
// message reactions, visit replies, "seen" marks and homework flags now confirm in under a second; the sheet gets them within
// a minute through the same server functions, replayed AT THE TIME THE TEACHER TAPPED — so the same rules apply: feedback only
// in its window, only your own students, only once per month, only assigned reviews. The app still opens the forms only when
// they are open (same as before).
// If the sheet refuses one (e.g. "Already sent for October"), the teacher sees it on Today: "Not sent · Monthly feedback ·
// Ellery · reason" with Open / OK, so nothing is lost silently.
require('../tools/lib.js')(process.argv[2], [
["FAST_W = { saveNote: 1, markHomework: 1, tNoteTag: 1, tGoalsSave: 1, timeIn: 1, classIn: 1 };",
 "FAST_W = { saveNote: 1, markHomework: 1, tNoteTag: 1, tGoalsSave: 1, timeIn: 1, classIn: 1, tFbSubmit: 1, tPcSubmit: 1, tTrialSubmit: 1, tPeerSubmit: 1, tSetMeet: 1, tMsgAck: 1, tVisitAck: 1, tMsgSeen: 1, tHwFlag: 1 };"],
["  return { ok: true, queued: true }; }\nasync function fastWrite(fn, args){",
 "  if(fn === 'tFbSubmit'){ let t = ''; try{ t = fbTotals().total; }catch(e){} return { ok: true, queued: true, done: { total: t, at: 'sending' }, total: t, student: (typeof FBF !== 'undefined' && FBF && (FBF.student || FBF.name)) || args[1] }; }\n" +
 "  if(fn === 'tPeerSubmit'){ let t = '', p = ''; try{ const x = prTot(); t = x.t; p = x.p; }catch(e){} return { ok: true, queued: true, total: t, pct: p }; }\n" +
 "  if(fn === 'tPcSubmit' || fn === 'tTrialSubmit') return { ok: true, queued: true, total: '', cefr: '', label: '' };\n" +
 "  if(fn === 'tSetMeet') return { ok: true, queued: true, meet: args[2] };\n" +
 "  if(fn === 'tVisitAck') return { ok: true, queued: true, at: t };\n" +
 "  if(fn === 'tMsgAck') return { ok: true, queued: true, note: 'Saved' };\n" +
 "  return { ok: true, queued: true }; }\n" +
 "let FF = [];   /* 14 Oct pm: saves the sheet refused later (fast layer) */\n" +
 "const FF_L = { tFbSubmit: 'Monthly feedback', tPcSubmit: 'Progress check', tTrialSubmit: 'Trial report', tPeerSubmit: 'Peer review', saveNote: 'Class note', markHomework: 'Homework', timeIn: 'Time-in', classIn: \"I'm in\", tGoalsSave: 'Goals', tNoteTag: 'Note tag', tSetMeet: 'Meeting ID' };\n" +
 "async function fastFails(){ if(!TOKEN || !D || D.mgr) return; try{ const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'mine', token: TOKEN }) }).then(x => x.json());\n" +
 "  if(!r || !r.ok) return; let ok = []; try{ ok = JSON.parse(localStorage.getItem('coe.ffok') || '[]'); }catch(e){} FF = (r.failed || []).filter(x => FF_L[x.fn] && ok.indexOf(x.id) < 0); ffPaint(); }catch(e){} }\n" +
 "function ffOk(id){ try{ const ok = JSON.parse(localStorage.getItem('coe.ffok') || '[]'); ok.push(id); localStorage.setItem('coe.ffok', JSON.stringify(ok.slice(-50))); }catch(e){} FF = FF.filter(x => x.id !== id); ffPaint(); }\n" +
 "function ffWho(x){ const a = x.a1; return typeof a === 'string' ? a : a && (a.student || a.code || a.date) || ''; }\n" +
 "function ffPaint(){ try{ const el = $('v-today'); if(!el) return; const old = $('ffBox'); if(old) old.remove(); if(!FF.length) return;\n" +
 "  el.insertAdjacentHTML('afterbegin', '<div id=\"ffBox\" class=\"card\" style=\"border-color:#E9B8AC;background:#FFF5F2;margin-bottom:12px\"><b style=\"color:#9A3B22\">Not sent · please check</b>' + FF.map(x => { const code = typeof x.a1 === 'string' ? x.a1 : ''; const open = x.fn === 'tFbSubmit' && code ? `<button class=\"btn teal sm\" onclick=\"fbSheet('${esc(code)}')\">Open</button>` : x.fn === 'tPcSubmit' && code ? `<button class=\"btn teal sm\" onclick=\"pcForm('${esc(code)}')\">Open</button>` : '';\n" +
 "    return `<div style=\"display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:8px\"><div class=\"small\"><b>${esc(FF_L[x.fn])}</b>${ffWho(x) ? ' · ' + esc(ffWho(x)) : ''} · ${esc(String(x.error || 'refused'))} <span class=\"mute\">· ${esc(new Date(x.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}</span></div><div style=\"display:flex;gap:6px\">${open}<button class=\"btn ghost sm\" onclick=\"ffOk(${x.id})\">OK</button></div></div>`; }).join('') + '</div>'); }catch(e){} }\n" +
 "setInterval(() => { if(!document.hidden) fastFails(); }, 600000);\n" +
 "async function fastWrite(fn, args){"],
["store('set', KEY_D, JSON.stringify(D)); render(); if(!D.mgr) prefetchTeacher(force);",
 "store('set', KEY_D, JSON.stringify(D)); render(); if(!D.mgr){ prefetchTeacher(force); fastFails(); }"],
["function renderToday(){",
 "function renderToday(){ setTimeout(ffPaint, 0);   /* 14 Oct pm: keep the \"Not sent\" box on Today */"],
]);
