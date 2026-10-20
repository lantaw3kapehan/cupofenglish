// 20 Oct · Enrolled · paid / Renewed · paid: Partner is a dropdown of the partners in the sales lists (moneyLists), no typing
// (Misty: "give options on partner so we don't need to type"). "Other…" asks for a new name. The field keeps its id, so saving is unchanged.
require('../tools/lib.js')(process.argv[2], [
  ["function openSheet(html){ if(!/class=\"paper/.test(html)) $('sheet').classList.remove('wide'); $('sheetBody').innerHTML = html; $('scrim').classList.add('on'); $('sheet').classList.add('on');",
   "function openSheet(html){ if(!/class=\"paper/.test(html)) $('sheet').classList.remove('wide'); $('sheetBody').innerHTML = html; $('scrim').classList.add('on'); $('sheet').classList.add('on'); try{ if(window.paPick) paPick(); }catch(e){}"],
  // a first class more than 30 days ago (an old package's, e.g. Elsa 2024) is not suggested for a new payment
  ["value=\"' + esc(first || today) + '\">", "value=\"' + esc(first && first >= new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10) ? first : today) + '\">"],
  // the app cannot tell whether the student had a package (Active not loaded) → offer both
  ["const has = (() => { try{ const i = AT.cols.indexOf('code'); return", "const unk = !(typeof AT !== 'undefined' && AT && AT.rows && AT.rows.length), has = unk || (() => { try{ const i = AT.cols.indexOf('code'); return"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n/* 381 · partner dropdown */\n(function(){\n" +
   "  const BASE = ['CupOfEnglish', 'Jinan - Ms. Spring', 'Jinan - Ms. Rose', 'Inner Mongolia - Ms. Jane', 'Inner Mongolia - Ms. Jane Adult', 'Chengdu - Mr. Clark', 'Panpacific University', 'IELTS', 'TOEFL', 'Adult English', 'Adult English - Ph', 'IELTS - Ms. Spring', 'Adults - Ms. Spring', 'Reading Program'];\n" +
   "  const names = () => { const L = (typeof ML !== 'undefined' && ML && Array.isArray(ML.partner) && ML.partner.length) ? ML.partner : BASE; return L.slice(); };\n" +
   "  function fill(sel, cur){ const L = names(); if(cur && L.indexOf(cur) < 0) L.unshift(cur); sel.innerHTML = L.map(x => '<option' + (x === cur ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '<option value=\"__o\">Other…</option>'; if(!cur) sel.value = L.indexOf('CupOfEnglish') > -1 ? 'CupOfEnglish' : L[0]; }\n" +
   "  window.paPick = function(){ ['enPa', 'rpPa'].forEach(id => { const el = $(id); if(!el || el.tagName !== 'INPUT') return; const cur = el.value.trim(), s = document.createElement('select'); s.id = id; s.className = el.className; fill(s, cur);\n" +
   "    s.onchange = () => { if(s.value !== '__o') return; const v = (prompt('Partner name') || '').trim(); if(!v){ fill(s, cur); return; } const o = document.createElement('option'); o.textContent = v; s.insertBefore(o, s.firstChild); s.value = v; };\n" +
   "    el.replaceWith(s);\n" +
   "    if(typeof ML === 'undefined' || !ML){ try{ lists().then(() => { const x = $(id); if(x && x.tagName === 'SELECT'){ const v = x.value; fill(x, v === '__o' ? '' : v); } }).catch(() => {}); }catch(e){} } }); };\n" +
   "})();\n</script>\n\n</body>"]
]);
