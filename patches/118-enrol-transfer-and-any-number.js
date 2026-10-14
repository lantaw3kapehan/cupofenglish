// 14 Oct night · Enrolled · paid (trial students): two new choices (Misty, Ying + Joey).
// · Package paid › "Other number": type any number of lessons (and free lessons) instead of 15 / 30+3 / 60+8.
// · Payment › "Transfer · no payment": lessons another student gives (e.g. Joey → Ying 13). Saved as the giver's
//   TRANSFER OUT and the new student's CARRY OVER (ENROLLED 0), with a note on both cells; nothing in SALES.
//   Valid by the normal rule from the first class. Needs the server's SERVER-TRANSFER paste (deployed).
require('../tools/lib.js')(process.argv[2], [
["'<label>Payment</label><div class=\"rnl\">' + (r.sales || []).map(saleOpt).join('') + '<button type=\"button\" class=\"rno' + (ENS.sale ? '' : ' on') + '\" data-s=\"0\" onclick=\"enPick(0)\"><b>New payment</b><span>add it to SALES now</span></button></div>' +",
 "'<label>Payment</label><div class=\"rnl\">' + (r.sales || []).map(saleOpt).join('') + '<button type=\"button\" class=\"rno' + (ENS.sale ? '' : ' on') + '\" data-s=\"0\" onclick=\"enPick(0)\"><b>New payment</b><span>add it to SALES now</span></button><button type=\"button\" class=\"rno\" data-s=\"-1\" onclick=\"enPick(-1)\"><b>Transfer · no payment</b><span>lessons from another student</span></button></div>' +\n" +
 "'<div id=\"enTr\" class=\"hide\"><label>Lessons come from</label><input id=\"enTf\" class=\"in-t\" list=\"enTL\" placeholder=\"type the name or code, e.g. Joey\" oninput=\"enPrev()\"><datalist id=\"enTL\"></datalist><label>How many lessons</label><input id=\"enTn\" class=\"in-t\" type=\"number\" min=\"0.5\" step=\"0.5\" placeholder=\"e.g. 13\" oninput=\"enPrev()\"><div class=\"small mute\" style=\"margin-top:4px\">The giver\\'s TRANSFER OUT goes up, this student gets them as CARRY OVER · no SALES row</div></div>' +"],
["'\" onclick=\"enPk(' + p + ',' + f + ')\"><b>' + p + (f ? ' + ' + f : '') + '</b><span>' + (p + f) + ' lessons</span></button>').join('') + '</div>' +",
 "'\" onclick=\"enPk(' + p + ',' + f + ')\"><b>' + p + (f ? ' + ' + f : '') + '</b><span>' + (p + f) + ' lessons</span></button>').join('') + '<button type=\"button\" class=\"rno enk\" data-p=\"-1\" data-f=\"-1\" onclick=\"enPk(-1,-1)\"><b>Other number</b><span>type the lessons</span></button></div>' +\n" +
 "'<div id=\"enO\" class=\"row hide\" style=\"gap:8px\"><div class=\"grow\"><label>Lessons paid</label><input id=\"enOp\" class=\"in-t\" type=\"number\" min=\"0.5\" step=\"0.5\" placeholder=\"e.g. 13\" oninput=\"enOth()\"></div><div class=\"grow\"><label>+ free lessons</label><input id=\"enOf\" class=\"in-t\" type=\"number\" min=\"0\" step=\"0.5\" placeholder=\"0\" oninput=\"enOth()\"></div></div>' +"],
["window.enPick = function(row, p, f){ ENS.sale = row; if(row){ ENS.pkg = p; ENS.free = f; } document.querySelectorAll('[data-s]').forEach(b => b.classList.toggle('on', +b.dataset.s === row)); const n = $('enNew'); if(n) n.classList.toggle('hide', !!row); enPrev(); };",
 "window.enPick = function(row, p, f){ ENS.tr = row === -1; ENS.sale = row > 0 ? row : 0; if(row > 0){ ENS.pkg = p; ENS.free = f; } document.querySelectorAll('[data-s]').forEach(b => b.classList.toggle('on', +b.dataset.s === row)); const n = $('enNew'); if(n) n.classList.toggle('hide', row !== 0); const t = $('enTr'); if(t) t.classList.toggle('hide', row !== -1);\n" +
 "  if(row === -1 && !ENS.stuL){ ENS.stuL = 1; api('mgmtStudents', TOKEN).then(L => { const dl = $('enTL'); if(dl) dl.innerHTML = (L || []).filter(s => s.code !== ENS.code).map(s => '<option value=\"' + esc(s.name + ' · ' + s.code) + '\">' + (s.left != null ? esc(s.left + ' left') : '') + '</option>').join(''); }).catch(() => {}); }\n" +
 "  enPrev(); };\n" +
 "window.enOth = function(){ ENS.pkg = +($('enOp') || {}).value || 0; ENS.free = +($('enOf') || {}).value || 0; enPrev(); };"],
["window.enPk = function(p, f){ ENS.pkg = p; ENS.free = f; document.querySelectorAll('.enk').forEach(b => b.classList.toggle('on', +b.dataset.p === p && +b.dataset.f === f)); enPrev(); };",
 "window.enPk = function(p, f){ const o = $('enO'); if(o) o.classList.toggle('hide', p !== -1); if(p === -1){ document.querySelectorAll('.enk').forEach(b => b.classList.toggle('on', b.dataset.p === '-1')); return enOth(); } ENS.pkg = p; ENS.free = f; document.querySelectorAll('.enk').forEach(b => b.classList.toggle('on', +b.dataset.p === p && +b.dataset.f === f)); enPrev(); };"],
["function enPrev(){ const el = $('enP'); if(!el || !ENS) return; const t = (+ENS.pkg || 0) + (+ENS.free || 0);",
 "function enTrFrom(){ const v = String(($('enTf') || {}).value || ''), m = v.toUpperCase().match(/ST-\\d{4}-\\d{3}/); return m ? m[0] : ''; }\n" +
 "function enPrev(){ const el = $('enP'); if(!el || !ENS) return; if(ENS.tr){ const n = +($('enTn') || {}).value || 0, fr = String(($('enTf') || {}).value || '').split(' · ')[0];\n" +
 "  el.innerHTML = '<div style=\"font-size:15px\"><b style=\"font-size:20px;color:#00737B\">' + n + ' lessons</b> · transferred' + (fr ? ' from <b>' + esc(fr) + '</b>' : '') + ' · no payment</div><div class=\"small\" style=\"margin-top:4px\">Valid ' + (n < 30 ? 4 : n < 60 ? 8 : 12) + ' months from the first class · ' + (enTrFrom() ? '' : '<b>choose the student from the list</b> · ') + 'TRANSFER OUT on the giver, CARRY OVER here</div>'; return; }\n" +
 "  const t = (+ENS.pkg || 0) + (+ENS.free || 0);"],
["const f = { code: S.code, name: S.name, teacher: $('enT').value, start: $('enS').value, course: $('enC').value.trim(), saleRow: S.sale || 0 };\nif(!S.sale){",
 "const f = { code: S.code, name: S.name, teacher: $('enT').value, start: $('enS').value, course: $('enC').value.trim(), saleRow: S.sale || 0 };\n" +
 "if(S.tr){ const fr = enTrFrom(), n = +($('enTn') || {}).value || 0; if(!fr) return toast('Choose the student the lessons come from (from the list)'); if(!(n > 0)) return toast('Type how many lessons'); f.transfer = { from: fr, n: n }; f.saleRow = 0; }\n" +
 "else if(!(S.pkg + S.free > 0) && !S.sale) return toast('Type the number of lessons');\n" +
 "if(!S.sale && !S.tr){"],
["'</b>' : '') + '</div><div class=\"small mute\" style=\"margin-top:4px\">ACTIVE row ' + r.row + ' · SALES row ' + r.saleRow + (r.link ? ' · invoice saved' : '') + '</div></div>' +",
 "'</b>' : '') + '</div><div class=\"small mute\" style=\"margin-top:4px\">' + (r.transfer ? esc(r.carried + ' lessons transferred from ' + r.fromName + ' · ' + r.fromName + ' has ' + r.fromLeft + ' left · ACTIVE row ' + r.row) : 'ACTIVE row ' + r.row + ' · SALES row ' + r.saleRow + (r.link ? ' · invoice saved' : '')) + '</div></div>' +"],
["left</div><div class=\"small\" style=\"margin-top:4px\">' + r.pkg + (r.free ? ' + ' + r.free : '') + ' paid'",
 "left</div><div class=\"small\" style=\"margin-top:4px\">' + (r.transfer ? r.carried + ' transferred · no payment' : r.pkg + (r.free ? ' + ' + r.free : '') + ' paid')"],
["let r = null; try{ r = await api('mgmtEnrolPaid', TOKEN, { code, dry: true }); }catch(e){ r = { ok: false, msg: String((e && (e.msg || e.message)) || e) }; }",
 "const rp = api('mgmtEnrolPaid', TOKEN, { code, dry: true }).catch(e => ({ ok: false, msg: String((e && (e.msg || e.message)) || e) })); let r = { ok: true, sales: [], firstClass: '', pending: true };   /* 14 Oct night: the form opens at once; SALES payments fill in when Google answers */"],
["ENS.info = r; const nm = String(name || '').split(/\\s+/)[0].toLowerCase();",
 "ENS.info = r; const nm = String(name || '').split(/\\s+/)[0].toLowerCase(); ENS.touched = 0;"],
["'<label>Payment</label><div class=\"rnl\">' + (r.sales || []).map(saleOpt).join('') + '<button",
 "'<label>Payment' + (r.pending ? ' <span class=\"mute small\" id=\"enWait\">· looking for payments in SALES…</span>' : '') + '</label><div class=\"rnl\" id=\"enPay\">' + (r.sales || []).map(saleOpt).join('') + '<button"],
["\nenPrev(); }\nwindow.enPick",
 "\nenPrev(); try{ $('sheetBody').addEventListener('input', () => { ENS.touched = 1; }, { once: true }); }catch(e){}\n" +
 "rp.then(x => { if(!ENS || ENS.code !== code || !$('enPay')) return; const w = $('enWait'); if(!x || !x.ok){ if(w) w.textContent = '· could not read SALES (' + ((x && x.msg) || 'no answer') + ')'; return; }\n" +
 "  ENS.info = x; if(w) w.remove(); const h = (x.sales || []).find(y => nm && y.invoice.toLowerCase().indexOf(nm) > -1);\n" +
 "  const box = $('enPay'); box.insertAdjacentHTML('afterbegin', (x.sales || []).map(saleOpt).join(''));\n" +
 "  if(h && !ENS.touched && !ENS.tr && !ENS.sale && $('enOp') && !$('enOp').value) enPick(h.row, h.pkg, h.free);\n" +
 "  if(x.firstClass && !first){ const s = $('enS'); if(s && !ENS.touched) { s.value = x.firstClass; enPrev(); } } }); }\nwindow.enPick"],
]);
