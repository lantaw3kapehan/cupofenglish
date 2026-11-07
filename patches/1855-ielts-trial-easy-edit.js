// 1855: (Misty 7 Nov "the most important, it's easy to make edit for the teachers too and management" · "since this is direct to
//   database now so editing should be easy" · "when we schedule a trial class and IELTS … what's the best workaround to avoid redundancy")
//   · Teacher › Students › Trials: a trial with an IELTS assessment shows "IELTS 6.0 · B2 · Edit" — tap to reopen and edit it any day,
//     not only on the class day. Below it, "Your online IELTS trial assessments" (last 60 days) lists them all, tap to edit.
//   · Management › Trials › open the trial: "Edit the IELTS assessment" opens it in Walk-in test (all scores and notes editable).
//   · No double entry: the assessment is made from the calendar trial (student, date, time, code, teacher) the first time the
//     teacher taps it. If the calendar title has "IELTS" (e.g. "Teacher Pam (IELTS Trial Class Student Lily)") it opens straight
//     away, with no choice to make.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  // class card: carry "IELTS in the title"
  ["trialSheet(${trQ({code:c.code,student:c.student||c.title,date:c.day,time:tm(c.start)})})",
   "trialSheet(${trQ({code:c.code,student:c.student||c.title,date:c.day,time:tm(c.start),ie:/ielts/i.test(c.title||'')})})"],
  ["const ex = mine(q); if(ex) return openA(q);", "const ex = mine(q); if(ex || q.ie) return openA(q);"],
  ["if(K.ok) clear(); }).catch", "if(K.ok){ clear(); try{ if(VIEW === 'students') renderStudents(); }catch(e){} } }).catch"],
  // teacher Students › Trials: Result cell
  ["<td>${t.reportMissing?`<span", "<td>${(window.ie1854 && ie1854.chip && ie1854.chip(t)) || (t.reportMissing?`<span"],
  ["esc(t.status||'—')}</td></tr>", "esc(t.status||'—'))}</td></tr>"],
  ["${t.reportMissing ? `<span class=\"chip red\"", "${(window.ie1854 && ie1854.chip && ie1854.chip(t)) || (t.reportMissing ? `<span class=\"chip red\""],
  ["esc(t.status || '—')}</span>`}</div>`).join('')}</div>`;", "esc(t.status || '—')}</span>`)}</div>`).join('')}</div>`;"],
  // helpers
  ["window.ie1854 = { open: i => openA(TRQS[i]), report:",
   "const lab = a => { const b = a.combined != null ? a.combined : a.sp_band; return 'IELTS' + (b != null ? ' ' + (+b).toFixed(1) : '') + (a.cefr ? ' \\u00b7 ' + a.cefr : ''); };\n"
   + "  const qOf = a => ({ date: String(a.trial_date || '').slice(0, 10), time: a.trial_time || '', student: a.name, code: a.trial_code || '' });\n"
   + "  window.ie1854 = { chip: t => { const a = t && mine({ date: t.date, student: t.student }); return a ? '<span class=\"chip teal\" style=\"cursor:pointer\" onclick=\"ie1854.edit(\\'' + a.id + '\\')\">' + esc(lab(a)) + ' \\u00b7 Edit</span>' : ''; },\n"
   + "    edit: id => { const a = K.list.find(x => x.id === id); if(a) openA(qOf(a)); }, lab, list: () => K.list,\n"
   + "    mOpen: id => { if(typeof closeSheet === 'function') closeSheet(); go('assess'); setTimeout(() => window.as1778 && as1778.open(id), 80); },\n"
   + "    open: i => openA(TRQS[i]), report:"],
  // management: keep every online trial assessment (for Trials › open)
  ["C('list').then(r => { if(r && r.ok){ const t3", "C('list').then(r => { if(r && r.ok){ M.all = (r.list || []).filter(a => a.kind === 'trial'); const t3"],
  ["\n</body>", "\n<script>\n/* 1855 · online IELTS trial assessments: easy to edit for teachers and management */\n(function(){\n"
   + "  if(window.__1855) return; window.__1855 = 1;\n"
   + "  const key = (d, s) => String(d || '').slice(0, 10) + '|' + String(s || '').trim().toLowerCase();\n"
   + "  const fmt = d => { const z = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(z) ? String(d || '') : z.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };\n"
   + "  /* teacher › Students: all her online IELTS trial assessments, tap to edit */\n"
   + "  const rs = window.renderStudents; if(typeof rs === 'function'){ const w = function(){ const r = rs.apply(this, arguments); try{ add(); }catch(e){} return r; }; window.renderStudents = w; try{ renderStudents = w; }catch(e){} }\n"
   + "  function add(){ if(typeof D === 'undefined' || !D || D.mgr || !window.ie1854) return; const el = $('v-students'); if(!el || $('ie1855')) return;\n"
   + "    const t60 = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10), L = (ie1854.list() || []).filter(a => a.kind === 'trial' && String(a.trial_date || '') >= t60); if(!L.length) return;\n"
   + "    el.insertAdjacentHTML('beforeend', '<div id=\"ie1855\"><h2>Your online IELTS trial assessments <span class=\"c\">tap to edit</span></h2>' + L.map(a => '<div class=\"li\" onclick=\"ie1854.edit(\\'' + a.id + '\\')\"><div class=\"av\">' + esc(String(a.name || '?')[0]) + '</div><div class=\"grow\"><b>' + esc(a.name) + '</b><div class=\"small mute\">' + esc(fmt(a.trial_date)) + (a.trial_time ? ' \\u00b7 ' + esc(a.trial_time) : '') + (a.shared_at ? ' \\u00b7 result sent' : '') + '</div></div><span class=\"chip teal\">' + esc(ie1854.lab(a)) + '</span></div>').join('') + '</div>'); }\n"
   + "  /* management › Trials › a trial: open its IELTS assessment */\n"
   + "  const to = window.tlOpen; if(typeof to === 'function') window.tlOpen = async function(){ const r = await to.apply(this, arguments); try{ btn(); }catch(e){} return r; };\n"
   + "  function btn(){ if(typeof TLD === 'undefined' || !TLD || typeof D === 'undefined' || !D || !D.mgr) return; const b = $('sheetBody'); if(!b || $('ie1855m')) return;\n"
   + "    const k = key(TLD.date, TLD.student), a = (window.__ie1855all || []).find(x => key(x.trial_date, x.name) === k); if(!a) return;\n"
   + "    b.insertAdjacentHTML('afterbegin', '<div id=\"ie1855m\" style=\"margin:0 0 12px;padding:12px 14px;border-radius:14px;background:#E8EEFB;border:1px solid #C9D6F3\"><b style=\"color:#2B4C9B\">Online IELTS trial \\u00b7 ' + esc(ie1854.lab(a)) + '</b><div class=\"small mute\">' + esc(a.teacher || '') + ' used the walk-in assessment. Edit the scores and notes there; this trial updates at once.</div><button type=\"button\" class=\"btn teal sm\" style=\"margin-top:8px\" onclick=\"ie1854.mOpen(\\'' + a.id + '\\')\">Edit the IELTS assessment</button></div>'); }\n"
   + "  function mAll(){ if(typeof D === 'undefined' || !D || !D.mgr || !window.as1778 || typeof TOKEN === 'undefined' || !TOKEN) return; as1778.call('list').then(r => { if(r && r.ok) window.__ie1855all = (r.list || []).filter(a => a.kind === 'trial'); }).catch(() => {}); }\n"
   + "  setTimeout(mAll, 7000); setInterval(() => { if(!document.hidden) mAll(); }, 300000);\n"
   + "  const _go = window.go; if(typeof _go === 'function') window.go = function(v){ const r = _go.apply(this, arguments); try{ if(v === 'trials') mAll(); }catch(e){} return r; };\n"
   + "})();\n</script>\n</body>"]]);
