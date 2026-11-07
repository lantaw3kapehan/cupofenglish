// 1854: (Misty 7 Nov "a best workaround for the walk-in test, for our IELTS Teachers like Misty and Pam, if they have online IELTS trial
//   class, they can also use the app for feedback" · "replace it" · Misty, Pam, Martin · writing optional · "easy to edit … 1:1 speaking mostly"
//   · "the current assessment and scoring now in walk-in is good, so it should reflect in online too" · "management can easily see")
//   · Trial class (teacher): IELTS teachers (database list sys:ielts_teachers) get a choice — "IELTS assessment" or the usual trial report.
//     The IELTS assessment is the walk-in test (same questions, timers, notes, 0–9 bands, same rounding and CEFR, writing link optional),
//     made for that trial (student, date, time, code) and saved as it goes; opening the trial again reopens it to edit.
//   · It is that trial's report: the database writes the trial row (Management › Trials shows "IELTS 6.0 · B2" and the comments) and
//     the teacher's "Write report" clears. Management also sees it in Walk-in test, tagged "Online trial".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  // teacher: "‹ All" goes back to Today; the student-link box (management data) is not shown
  ["function back(){ flush(); try{",
   "function back(){ if(typeof D !== 'undefined' && D && !D.mgr){ flush(); S.a = null; clearTimers(); go('today'); return; } flush(); try{"],
  ["function lkHtml(){ const a = S.a; if(!a) return '';",
   "function lkHtml(){ const a = S.a; if(!a || (typeof D !== 'undefined' && D && !D.mgr)) return '';"],
  // management list: tag online trials
  ["function chip(a){ if(a.essay_submitted_at && a.wr_band == null) return '<span class=\"as-k t\">Essay in \\u00b7 score it</span>';",
   "function chip(a){ const tg = a && a.kind === 'trial' ? '<span class=\"as-k\" style=\"background:#E8EEFB;color:#2B4C9B\">Online trial' + (a.teacher ? ' \\u00b7 ' + E(a.teacher) : '') + '</span>' : '';\n"
   + "    return tg + chip0(a); }\n  function chip0(a){ if(a.essay_submitted_at && a.wr_band == null) return '<span class=\"as-k t\">Essay in \\u00b7 score it</span>';"],
  // export: open an assessment made for a trial
  ["window.as1778 = { ck, nm, edit,",
   "window.as1778 = { openTrial: a => { S.a = Object.assign({ sp: {}, wr: {}, notes: {} }, a); S.tab = 'speak'; S.typeEssay = false; go('assess'); paint(); }, call, ck, nm, edit,"],
  ["\n</body>", "\n<script>\n/* 1854 · online IELTS trial classes: the walk-in assessment as the trial's report */\n(function(){\n"
   + "  if(window.__1854) return; window.__1854 = 1;\n"
   + "  const C = (op, o) => (window.as1778 && window.as1778.call) ? window.as1778.call(op, o) : Promise.reject(new Error('not ready'));\n"
   + "  const K = { ok: null, list: [], at: 0 };\n"
   + "  const key = (d, s) => String(d || '').slice(0, 10) + '|' + String(s || '').trim().toLowerCase();\n"
   + "  function load(){ if(typeof D === 'undefined' || !D || D.mgr || typeof TOKEN === 'undefined' || !TOKEN || Date.now() - K.at < 60000) return Promise.resolve(); K.at = Date.now();\n"
   + "    return C('tlist').then(r => { K.ok = !!(r && r.ok); K.list = (r && r.list) || []; if(K.ok) clear(); }).catch(() => {}); }\n"
   + "  function mine(q){ return K.list.find(a => a.kind === 'trial' && key(a.trial_date, a.name) === key(q.date, q.student)); }\n"
   + "  function clear(){ try{ let ch = 0; (D.special || []).forEach(x => { if(x.reportMissing && mine({ date: x.date, student: x.student })){ x.reportMissing = false; ch = 1; } }); if(ch && typeof renderToday === 'function') renderToday(); }catch(e){} }\n"
   + "  async function openA(q){ const ex = mine(q); toast(ex ? 'Opening the IELTS assessment…' : 'Making the IELTS assessment…');\n"
   + "    try{ const r = await C('tnew', { date: q.date, time: q.time || '', student: q.student, code: q.code || '' }); if(!r || !r.ok) throw new Error((r && (r.msg || r.error)) || 'Not saved');\n"
   + "      if(!mine(q)) K.list.unshift(r.a); clear(); if(typeof closeSheet === 'function') closeSheet(); window.as1778.openTrial(r.a); }\n"
   + "    catch(e){ toast(String(e.message || e) + ' \\u00b7 try again'); } }\n"
   + "  window.ie1854 = { open: i => openA(TRQS[i]), report: i => { if(typeof closeSheet === 'function') closeSheet(); setTimeout(() => base(i), 60); } };\n"
   + "  let base = window.trialSheet;\n"
   + "  if(typeof base === 'function') window.trialSheet = function(i){ const q = TRQS[i]; if(!K.ok || !q) return base.apply(this, arguments);\n"
   + "    const ex = mine(q); if(ex) return openA(q);\n"
   + "    openSheet('<h1>Trial report \\u00b7 ' + esc(q.student || '') + '</h1><div class=\"small mute\">' + esc(q.date || '') + (q.time ? ' \\u00b7 ' + esc(q.time) : '') + '</div>'\n"
   + "      + '<button class=\"btn teal block\" style=\"margin-top:16px\" onclick=\"ie1854.open(' + i + ')\">IELTS assessment</button><div class=\"small mute\" style=\"margin-top:4px\">The walk-in test: Speaking parts 1\\u20133 with timers and notes, 0\\u20139 bands and CEFR; Writing optional (send her the link). It is this trial\\u2019s report, and you can edit it any time.</div>'\n"
   + "      + '<button class=\"btn ghost block\" style=\"margin-top:14px\" onclick=\"ie1854.report(' + i + ')\">Usual trial report</button><div class=\"small mute\" style=\"margin-top:4px\">For young learners: the 9 ratings and the two comments.</div>'); };\n"
   + "  setTimeout(load, 2500); setInterval(() => { if(!document.hidden) load(); }, 300000);\n"
   + "  /* management: Overview shows new online IELTS trial assessments (last 3 days, result not sent yet) */\n"
   + "  const M = { list: [], at: 0 };\n"
   + "  function mLoad(){ if(typeof D === 'undefined' || !D || !D.mgr || typeof TOKEN === 'undefined' || !TOKEN || Date.now() - M.at < 120000) return; M.at = Date.now();\n"
   + "    C('list').then(r => { if(r && r.ok){ const t3 = Date.now() - 3 * 864e5; M.list = (r.list || []).filter(a => a.kind === 'trial' && !a.shared_at && Date.parse(a.updated_at) > t3); try{ if(VIEW === 'home') renderHome(); if(typeof hmBadge === 'function') hmBadge(); }catch(e){} } }).catch(() => {}); }\n"
   + "  const q0 = window.hmQueue; if(typeof q0 === 'function') window.hmQueue = function(){ const o = q0.apply(this, arguments); try{ const L = M.list;\n"
   + "    if(o && o.Q && L.length) o.Q.push({ n: L.length, tone: '', t: 'Online IELTS trial assessments', s: L.slice(0, 3).map(a => a.name + (a.teacher ? ' (' + a.teacher + ')' : '') + (a.sp_band != null ? ' \\u00b7 ' + (+a.sp_band).toFixed(1) : '')).join(' \\u00b7 ') + ' \\u00b7 open Walk-in test', go: \"go('assess')\" }); }catch(e){} return o; };\n"
   + "  setTimeout(mLoad, 6000); setInterval(() => { if(!document.hidden) mLoad(); }, 300000);\n"
   + "  const _go = window.go; if(typeof _go === 'function') window.go = function(v){ const r = _go.apply(this, arguments); try{ if(v === 'today'){ K.at = 0; load(); } }catch(e){} return r; };\n"
   + "})();\n</script>\n</body>"]]);
