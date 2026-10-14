// 14 Oct night · Transfer · "Lessons come from": the app finds our students as you type (Misty: "can it auto detect our ST
// codes?"). Searches every student with a package in ACTIVE by English name, Chinese name or code (e.g. "ST-2023", "joy",
// "安"), shows name · code · teacher · lessons left; tap one to choose. Replaces the browser's own suggestion list,
// which did not show on every computer.
require('../tools/lib.js')(process.argv[2], [
['<input id="enTf" class="in-t" list="enTL" placeholder="type the name or code, e.g. Joey" oninput="enPrev()"><datalist id="enTL"></datalist>',
 '<input id="enTf" class="in-t" autocomplete="off" placeholder="type a name, Chinese name or ST code" oninput="enTfS();enPrev()" onfocus="enTfS()"><div id="enTS" class="rnl" style="margin-top:6px"></div>'],
["window.enOth = function(){",
 "window.enTfS = function(){ const box = $('enTS'), i = $('enTf'); if(!box || !i) return; const q = String(i.value || '').trim().toLowerCase();\n" +
 "  if(enTrFrom() || q.length < 2){ box.innerHTML = q.length && !enTrFrom() ? '<div class=\"small mute\">Keep typing…</div>' : ''; return; }\n" +
 "  if(!(typeof AT !== 'undefined' && AT && AT.rows)){ box.innerHTML = '<div class=\"small mute\">Loading our students…</div>'; if(!ENS.atL){ ENS.atL = 1; loadActive(true).then(() => enTfS()).catch(() => { box.innerHTML = '<div class=\"small mute\">Could not load the student list · type the ST code</div>'; }); } return; }\n" +
 "  const C = {}; AT.cols.forEach((c, j) => C[c] = j); const seen = {}, L = [];\n" +
 "  AT.rows.forEach(r => { const code = String(r[C.code] || '').toUpperCase(); if(!/^ST-/.test(code) || code === String(ENS.code).toUpperCase() || r[C.enrolled] === '') return;\n" +
 "    const hay = [r[C.name], r[C.cn], code].join(' ').toLowerCase(); if(hay.indexOf(q) < 0) return; const k = code + '|' + r[C.teacher]; if(seen[k]) return; seen[k] = 1; L.push(r); });\n" +
 "  L.sort((a, b) => (+b[C.available] || 0) - (+a[C.available] || 0));\n" +
 "  box.innerHTML = L.length ? L.slice(0, 8).map(r => '<button type=\"button\" class=\"rno\" data-v=\"' + esc(String(r[C.name] || '').trim() + ' · ' + String(r[C.code]).toUpperCase()) + '\" onclick=\"$(\\'enTf\\').value=this.dataset.v;enTfS();enPrev()\"><b>' + esc(String(r[C.name] || '').trim()) + ' ' + esc(r[C.cn] || '') + '</b><span>' + esc(String(r[C.code]).toUpperCase()) + ' · ' + esc(r[C.teacher] || '') + ' · ' + (r[C.available] === '' ? 'shared' : esc(r[C.available]) + ' left') + (r[C.active] === true ? '' : ' · not active') + '</span></button>').join('') + (L.length > 8 ? '<div class=\"small mute\">' + (L.length - 8) + ' more · type more letters</div>' : '')\n" +
 "    : '<div class=\"small mute\">No student with a package in ACTIVE matches · if the giver is an old student not in our sheet, tick the box below</div>'; };\n" +
 "window.enOth = function(){"],
]);
