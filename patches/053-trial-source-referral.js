// New class › Trial · TC: "Source" (Student referral · Partner · WeChat · 小红书 · Website · Other). Student referral: type a name or ST code,
// the student is detected from the list ("✓ Paul · ST-2021-005"). Saved to DATABASE › SOURCE. The referrer gets 1 free lesson automatically
// when the new student is tagged Enrolled (server v353: refSave_ / refOnEnrol_). Partners get no incentive.
require('../tools/lib.js')(process.argv[2], [
[
"CHIST = null; CKIND = ''; CKSET = 0; openSheet('<h1>New class</h1>",
"CHIST = null; CKIND = ''; CKSET = 0; CSRC = ''; CREF = null; openSheet('<h1>New class</h1>"
],
[
"<div id=\"cHist\" class=\"mini hide\" style=\"margin-top:10px\"></div>",
"<div id=\"cSrc\" class=\"hide\"><label>Source <span class=\"mute small\">· how they found us</span></label><div class=\"seg\" id=\"cSrcK\" style=\"flex-wrap:wrap;margin-top:0\">${['Student', 'Partner', 'WeChat', '小红书', 'Website', 'Other'].map(k => `<button type=\"button\" data-k=\"${k}\" onclick=\"classSrc('${k}')\">${k === 'Student' ? 'Student referral' : k}</button>`).join('')}</div>\n<div id=\"cRefW\" class=\"hide\"><input id=\"cRf\" class=\"in-t\" list=\"cSL\" placeholder=\"Type the student's name or ST code\" autocomplete=\"off\" oninput=\"classRefChk()\"><div id=\"cRfOk\" class=\"small\" style=\"margin-top:4px\"></div></div>\n<div id=\"cPtW\" class=\"hide\"><input id=\"cPt\" class=\"in-t\" placeholder=\"Partner name (optional) · no incentive for partners\" autocomplete=\"off\"></div></div>\n<div id=\"cHist\" class=\"mini hide\" style=\"margin-top:10px\"></div>"
],
[
"function classPrev(){ const s = classStu(), el = $('cPrev'); if(!el) return; const nw = $('cNew'); if(nw) nw.classList.toggle('hide', !(s && s.fresh));",
"function classPrev(){ const s = classStu(), el = $('cPrev'); if(!el) return; const nw = $('cNew'); if(nw) nw.classList.toggle('hide', !(s && s.fresh)); const sr = $('cSrc'); if(sr) sr.classList.toggle('hide', CKIND !== 'TC');"
],
[
"async function sendClass(){",
"let CSRC = '', CREF = null;\nfunction classSrc(k){ CSRC = CSRC === k ? '' : k; document.querySelectorAll('#cSrcK button').forEach(b => b.classList.toggle('on', b.dataset.k === CSRC)); const a = $('cRefW'), p = $('cPtW'); if(a) a.classList.toggle('hide', CSRC !== 'Student'); if(p) p.classList.toggle('hide', CSRC !== 'Partner'); if(CSRC === 'Student') setTimeout(() => { const i = $('cRf'); if(i) i.focus(); }, 30); }\nfunction classRefChk(){ const v = (($('cRf') || {}).value || '').trim(), out = $('cRfOk'), L = (SL && SL.students) || []; CREF = null;\nif(v){ const m = v.match(/ST-\\d{4}-\\d{3}/i); let hit = m ? L.filter(x => x.code === m[0].toUpperCase()) : []; if(!hit.length){ const q = v.toLowerCase().replace(/\\s+/g, ' '); hit = L.filter(x => String(x.name).toLowerCase().replace(/-/g, ' ') === q); if(!hit.length) hit = L.filter(x => String(x.name).toLowerCase().replace(/-/g, ' ').split(' ')[0] === q); }\nconst uniq = [...new Map(hit.map(x => [x.code, x])).values()]; if(uniq.length === 1) CREF = { code: uniq[0].code, name: String(uniq[0].name).replace(/-/g, ' ') };\nif(out) out.innerHTML = CREF ? '<b style=\"color:#1E7A55\">✓ ' + esc(CREF.name) + ' · ' + esc(CREF.code) + '</b> <span class=\"mute\">· gets 1 free lesson when this student enrols</span>' : uniq.length > 1 ? '<span style=\"color:#B4513B\">' + uniq.length + ' students match · pick one from the list (with the ST code)</span>' : '<span class=\"mute\">No match yet · pick from the list</span>'; } else if(out) out.innerHTML = ''; }\nasync function sendClass(){"
],
[
"days: $('cR').checked ? classDays() : [], count: D.length, force: ckForce()};",
"days: $('cR').checked ? classDays() : [], count: D.length, force: ckForce()};\nif(CKIND === 'TC' && CSRC){ if(CSRC === 'Student'){ classRefChk(); if(!CREF) return toast('Pick the referring student from the list'); if(CREF.code === s.code) return toast('A student cannot refer themselves'); Object.assign(f, { src: 'Student', refCode: CREF.code, refName: CREF.name }); } else Object.assign(f, { src: CSRC, partner: CSRC === 'Partner' ? (($('cPt') || {}).value || '').trim() : '' }); }"
],
[
"try{ const r = await api('addClass', TOKEN, f); if(!r.ok) throw r; toast('Added · ' + r.note);",
"try{ const r = await api('addClass', TOKEN, f); if(!r.ok) throw r; toast('Added · ' + r.note + (r.ref || '')); CSRC = ''; CREF = null;"
]
]);
