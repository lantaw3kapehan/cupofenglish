// 1500: (Misty, 28 Oct 18:30) James ST-2022-004 · Wed 17:00–17:50 · the family moved it to tomorrow, but at 18:29 the class
// card looked finished: "No time-in yet · 90 min ago", "No class video yet", "Live class · VooV —", then Tag this class, and
// Move was hidden behind a small "Picture · move · cancel" link. Nothing on the server blocks moving a past class
// (coe-mgmt classEdit and Google's editClass both accept it; writes 2628/2630 on 26 Oct moved a past class fine).
//  · An ended class now shows Move · reschedule and Cancel as buttons at once (as before the class), with a line saying
//    whether it was held: "Not held · no time-in, no video, no class note" → "Parent rescheduled? Move it to the new day."
//  · Held (a class time-in, a video or a class note): moving it asks first ("…was held… Move it anyway?") instead of a block.
//  · The status box says Scheduled · Live now · Ended · held · Ended · not held · Cancelled (was always "Live class").
//  · After a move, Monitor / To do refetch at once, so the old "No time-in" for that class goes away.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["${e.cancelled ? '' : ph === 'pre' ? `<button class=\"btn teal block\"",
   "${e.cancelled ? '' : ph !== 'live' ? `${ph === 'post' ? '<div id=\"cePost\" class=\"mini\" style=\"margin-top:12px\">' + cePostNote(e) + '</div>' : ''}<button class=\"btn ${ph === 'post' ? 'ghost' : 'teal'} block\""],
  ["${late2 ? 'Cancel · under 2 h' : 'Cancel class'}",
   "${late2 && ph === 'pre' ? 'Cancel · under 2 h' : 'Cancel class'}"],
  ["<div class=\"mon-r\"><b>Live class</b>",
   "<div class=\"mon-r\"><b>${ceStat(e, ci, v)}</b>"],
  ["if(CE && CE.e === e && $('ceMon')){ if(r.ci) e.ci = r.ci; if(r.vid) e.vid = r.vid; $('ceMon').innerHTML = monHtml(e, r); TG = { kind:'late', cond:'' }; }",
   "if(CE && CE.e === e && $('ceMon')){ if(r.ci) e.ci = r.ci; if(r.vid) e.vid = r.vid; $('ceMon').innerHTML = monHtml(e, r); TG = { kind:'late', cond:'' }; const pn = $('cePost'); if(pn) pn.innerHTML = cePostNote(e); }"],
  ["function monHtml(e, info){",
   `/* 1500 · what happened to this class: held = a class time-in, a video or a class note (Monitor's copy) */
function ceHeld(e){ const ci = e && e.ci, v = e && e.vid, w = [];
  if(ci && ci.time) w.push((ci.first ? 'time-in ' : '“I\\'m in” ') + ci.time); if(v && v.url) w.push('a class video');
  try{ const M = window.__monData && window.__monData(); (M && M.teachers || []).forEach(t => (t.classes || []).forEach(c => { if(c.id === e.id && c.note) w.push('a class note'); })); }catch(x){}
  return w; }
function ceStat(e, ci, v){ const now = Date.now(), st = +new Date(e.start), en = +new Date(e.end);
  if(e.cancelled) return 'Cancelled'; if(now < st - 5 * 6e4) return 'Scheduled'; if(now <= en) return 'Live now';
  const h = ceHeld(Object.assign({}, e, { ci: ci || e.ci, vid: v || e.vid })); return h.length ? 'Ended · held' : 'Ended · not held'; }
function cePostNote(e){ const h = ceHeld(e);
  return h.length ? '<b>Ended · held</b> · ' + esc(h.join(' · ')) + '<div class="small mute">Moving it asks you first.</div>'
    : '<b>Ended · not held</b> · no time-in, no video, no class note<div class="small mute">Parent rescheduled? Tap Move · reschedule and choose the new day.</div>'; }
function monHtml(e, info){`],
  ["async function sendEdit(i, action, src){\nconst L = evList(src), e = L[i]; if(!e) return;",
   "async function sendEdit(i, action, src){\nconst L = evList(src), e = L[i]; if(!e) return;\nif(action === 'move' && !e.cancelled && Date.now() > +new Date(e.end)){ const h = ceHeld(e); if(h.length && !confirm('This class was held (' + h.join(', ') + ').\\nMoving it takes it off ' + svDate(ymdLocal(new Date(e.start)), { weekday: 'short', day: 'numeric', month: 'short' }) + ' — the lesson count and pay follow the new day.\\n\\nMove it anyway?')) return; }\nif(action !== 'restore') setTimeout(() => { try{ if(window.moLoad) moLoad(); }catch(x){} try{ if(window.coeStampCheck) coeStampCheck(); }catch(x){} }, 4000);   /* 1500: Monitor / To do drop the old class */"]
]);
