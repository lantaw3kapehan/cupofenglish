// 14 Oct · Substitute (SC) classes, aligned to the teacher contract (Absences without notification · notice at least 4 hours before).
// New class › Substitute · SC asks why the regular teacher is out; the server (subOut_) cancels the regular class at that time
// and lodges Teacher Absence · Excused (told ≥ 4 h before) / Unexcused (< 4 h or no notice) for the regular teacher.
// Approved leave or a CupOfEnglish reason → no case. Needs server addClass with subOut_ (14 Oct).
require('../tools/lib.js')(process.argv[2], [
["<div id=\"cHist\" class=\"mini hide\" style=\"margin-top:10px\"></div>",
 "<div id=\"cHist\" class=\"mini hide\" style=\"margin-top:10px\"></div>\n" +
 "<div id=\"cAbs\" class=\"hide\" style=\"margin-top:12px\"><label>Why is the regular teacher out? <span class=\"mute small\">· contract: tell us at least 4 hours before class</span></label>" +
 "<div class=\"seg\" id=\"cAbK\" style=\"flex-wrap:wrap;margin-top:0\">${[['leave','Approved leave'],['told','Informed us'],['none','No notice'],['coe','CupOfEnglish reason']].map(([k, t]) => `<button type=\"button\" data-k=\"${k}\" onclick=\"classAbs('${k}')\">${t}</button>`).join('')}</div>" +
 "<div id=\"cAbT\" class=\"hide\"><label>When did the teacher tell us?</label><div class=\"row\" style=\"gap:10px;align-items:flex-start\"><div class=\"grow\"><input id=\"cAbD\" class=\"in-t\" type=\"date\" onchange=\"classAbsPrev()\"></div><div class=\"grow\">${timeSel('cAbH', '', 'Time')}</div></div></div>" +
 "<div id=\"cAbR\" class=\"small\" style=\"margin-top:6px\"></div></div>"],
// show the block for SC only, and keep its verdict in step with date/time changes
["function classPrev(){ const s = classStu(), el = $('cPrev'); if(!el) return;",
 "function classPrev(){ const s = classStu(), el = $('cPrev'); if(!el) return; const ab = $('cAbs'); if(ab){ ab.classList.toggle('hide', CKIND !== 'SC'); if(CKIND === 'SC'){ const ad = $('cAbD'); if(ad && !ad.value) ad.value = ($('cD') || {}).value || ''; const ah = $('cAbH'); if(ah && !ah._w){ ah._w = 1; ah.addEventListener('change', classAbsPrev); } classAbsPrev(); } }"],
["async function sendClass(){",
 "let CABS = '';\n" +
 "function classAbs(k){ CABS = k; document.querySelectorAll('#cAbK button').forEach(b => b.classList.toggle('on', b.dataset.k === k)); const t = $('cAbT'); if(t) t.classList.toggle('hide', k !== 'told'); classAbsPrev(); }\n" +
 "function classAbsTold(){ const d = ($('cAbD') || {}).value || '', h = (($('cAbH') || {}).value || '').trim(); return /^\\d{4}-\\d{2}-\\d{2}$/.test(d) && /^\\d{1,2}:\\d{2}$/.test(h) ? d + ' ' + (h.length === 4 ? '0' + h : h) : ''; }\n" +
 "function classAbsPrev(){ const el = $('cAbR'); if(!el) return; const d = ($('cD') || {}).value || '', h = (($('cH') || {}).value || '').trim(); let t = '';\n" +
 "if(CABS === 'leave') t = '<span style=\"color:#2E8B57\">No case · covered by the approved leave</span>';\n" +
 "else if(CABS === 'coe') t = '<span style=\"color:#2E8B57\">No case · CupOfEnglish reason</span>';\n" +
 "else if(CABS === 'none') t = '<b style=\"color:#9A3B22\">CASE · Teacher Absence · Unexcused</b> <span class=\"mute\">· no notice · amount from POLICY</span>';\n" +
 "else if(CABS === 'told'){ const k = classAbsTold(); if(!k || !h) t = '<span class=\"mute\">Choose the date and time the teacher told us</span>'; else { const hrs = (new Date(d + 'T' + (h.length === 4 ? '0' + h : h) + ':00') - new Date(k.replace(' ', 'T') + ':00')) / 36e5, ok = hrs >= 4;\n" +
 "  const ht = hrs < 0 ? 'after the class started' : Math.floor(hrs) + ' h ' + Math.round((hrs % 1) * 60) + ' min before class';\n" +
 "  t = (ok ? '<b style=\"color:#B7791F\">CASE · Teacher Absence · Excused</b>' : '<b style=\"color:#9A3B22\">CASE · Teacher Absence · Unexcused</b>') + ' <span class=\"mute\">· told us ' + esc(ht) + (ok ? ' (4 h or more)' : ' (under 4 h)') + ' · amount from POLICY</span>'; } }\n" +
 "if(t) t += '<div class=\"mute\" style=\"margin-top:3px\">The regular class at this time is cancelled (no make-up) and the sub class is added.</div>';\n" +
 "el.innerHTML = t; }\n" +
 "async function sendClass(){"],
["if(!f.teacher) return toast('Choose a teacher');",
 "if(!f.teacher) return toast('Choose a teacher');\n" +
 "if(CKIND === 'SC'){ if(!CABS) return toast('Choose why the regular teacher is out'); if(CABS === 'told' && !classAbsTold()) return toast('Choose when the teacher told us'); if(f.days.length) return toast('A substitute is for one class · untick Weekly package'); f.abs = { why: CABS, told: CABS === 'told' ? classAbsTold() : '' }; }"],
["try{ const r = await api('addClass', TOKEN, f); if(!r.ok) throw r; toast('Added · ' + r.note + (r.ref || ''));",
 "try{ const r = await api('addClass', TOKEN, f); if(!r.ok) throw r; toast('Added · ' + r.note + (r.ref || '')); CABS = '';"],
["function classKind(k, auto){ if(auto && CKSET) return;",
 "function classKind(k, auto){ if(auto && CKSET) return; if((k || '') !== CKIND){ CABS = ''; document.querySelectorAll('#cAbK button').forEach(b => b.classList.remove('on')); const at = $('cAbT'); if(at) at.classList.add('hide'); }"],
]);
