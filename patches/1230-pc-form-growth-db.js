// 1230: (Misty 26 Oct 22:00 "yes") the progress-check form opens from the database. Google's tPcForm took ~14 s (36 a day), so the
//      form opened as an empty "Loading the trial scores and class notes…" version and was redrawn when Google answered.
//      Now the new read-only edge function coe-pcf (SQL coe_pc_form: TR-DATA trial, PR-DATA / app-sent progress checks, S-NOTES
//      notes with their Win / Work on tags, the last two monthly feedbacks, the fixed rating questions) answers in well under a
//      second, in the same shape as Google's answer; the student's name / Chinese name / book / lessons come from the teacher's own
//      list, as before. Google is still asked at the same time; its answer is kept for next time and only redraws the form when it
//      differs in what matters (already sent, trial baseline, notes or feedback) — the teacher's picks and text are kept as before.
//      If coe-pcf does not answer, everything works exactly as before.
//      Growth: the page already opens from the database copy of Google's last answer; a copy older than 3 days used to make the
//      teacher wait for Google (~11 s). Now any copy up to 14 days old opens at once and Google refreshes it behind.
const L = require('../tools/lib.js');
L(process.argv[2], [
  ["let fresh = null; try{ fresh = await (PCF[code] || api('tPcForm', TOKEN, code)); }catch(e){} delete PCF[code];",
   "const gq1230 = PCF[code] || api('tPcForm', TOKEN, code); delete PCF[code]; let db1230 = null;   /* 1230: the database answer first, Google's at the same time */\n" +
   "try{ db1230 = await pcDb1230(code); }catch(e){}\n" +
   "if(db1230 && $('sheet') && $('sheet').classList.contains('on') && !(fresh1230[code] && fresh1230[code] > Date.now() - 1000)){ const shown = P && P.code === code && P.r;\n" +
   "  if(!shown || shown.provisional || pcSig1230(shown) !== pcSig1230(db1230)){ const sc = $('sheet').scrollTop, fid = document.activeElement && document.activeElement.id, cur = fid && $(fid) && $(fid).selectionStart;\n" +
   "    if(P && P.code === code) pcSave(); P = mk(db1230); pcPaint(); try{ $('sheet').scrollTop = sc; if(fid && $(fid)){ $(fid).focus(); if(cur != null && $(fid).setSelectionRange) $(fid).setSelectionRange(cur, cur); } }catch(e){} } }\n" +
   "let fresh = null; try{ fresh = await gq1230; }catch(e){}\n" +
   "if(fresh && fresh.ok && db1230 && P && P.code === code && pcSig1230(fresh) === pcSig1230(P.r)){ try{ store('set', 'coe.pcf.' + code, JSON.stringify(fresh)); store('set', 'coe.pcrate', JSON.stringify(fresh.rate)); }catch(e){} return; }   /* same as shown: keep the page still */"],
  ["const PCF = {};",
   "const PCF = {};\n" +
   "/* 1230: progress-check form from the database (coe-pcf) */\n" +
   "const fresh1230 = {};\n" +
   "function pcSig1230(r){ try{ const d = r.done || null, t = r.trial || null; return JSON.stringify([d && [d.label, d.total, d.cefr], t && [t.label, t.total, t.r], (r.notes || []).map(n => [n.date, n.obs, n.kind]), (r.fb || []).map(f => [f.month, f.teacher, f.total]), r.ended || '', (r.rate || []).length]); }catch(e){ return String(Math.random()); } }\n" +
   "async function pcDb1230(code){ if(typeof FAST_URL === 'undefined' || !TOKEN) return null; const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 5000) : 0;\n" +
   "  try{ const r = await fetch(FAST_URL + '-pcf', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: code }), signal: ac ? ac.signal : undefined }).then(x => x.json());\n" +
   "    if(!r || !r.ok || !Array.isArray(r.rate) || !r.rate.length) return null;\n" +
   "    const st = ((typeof D !== 'undefined' && D && D.students) || []).find(x => x.code === code) || null;\n" +
   "    r.student = st ? { code: code, name: st.name || code, cn: st.cn || '', done: st.done, book: st.book || '' } : { code: code, name: code, cn: '', book: '' };\n" +
   "    try{ store('set', 'coe.pcrate', JSON.stringify(r.rate)); }catch(e){} return r; }catch(e){ return null; } finally{ clearTimeout(tid); } }"],
  ["const SB_UIAGE = { getBootstrap: 1, mgmtStudent: 7 * 864e5, tStudent: 7 * 864e5, mgmtStuClasses: 864e5, tStuClasses: 864e5 };",
   "const SB_UIAGE = { getBootstrap: 1, mgmtStudent: 7 * 864e5, tStudent: 7 * 864e5, mgmtStuClasses: 864e5, tStuClasses: 864e5, tGrowth: 14 * 864e5 };   /* 1230: Growth opens from a copy up to 14 days old, Google refreshes it behind */"]
]);
