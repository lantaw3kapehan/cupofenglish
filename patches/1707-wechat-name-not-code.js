// 1707: (Misty, 2 Nov 10:50, David's page) "一杯英语ST-2026-134(ST-2026-134) · this is the code showing, not the format I sent" · David
//   has no package yet, so the student page got his code as his name and the WeChat group name repeated the code. Now when the name
//   given is a student code, the group name takes the English name from the student list, ACTIVE or the DATABASE copy:
//   一杯英语David(ST-2026-134) (the "-N节课" part appears once he has a package).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      const names = m[1].replace(/\\s*&\\s*/g, '&').replace(/\\s+/g, ' ').trim(), n = lessons1702(m[2]);",
   "      let names = m[1].replace(/\\s*&\\s*/g, '&').replace(/\\s+/g, ' ').trim(); const n = lessons1702(m[2]);\n" +
   "      if(/^ST-\\d{4}-\\d{3}$/i.test(names)){ const c = names.toUpperCase(); let nm = '';   /* 1707: a code given as the name → the student's English name */\n" +
   "        try{ const L = [].concat((typeof MS !== 'undefined' && Array.isArray(MS)) ? MS : [], (typeof SL !== 'undefined' && SL && Array.isArray(SL.students)) ? SL.students : []); const x = L.find(y => y && up(y.code) === c && y.name && !/^ST-/i.test(String(y.name))); if(x) nm = x.name; }catch(e){}\n" +
   "        try{ if(!nm && typeof AT !== 'undefined' && AT && AT.cols){ const C = {}; AT.cols.forEach((k, i) => C[k] = i); const r = AT.rows.find(r => up(r[C.code]) === c && r[C.name]); if(r) nm = r[C.name]; } }catch(e){}\n" +
   "        try{ if(!nm && typeof DB !== 'undefined' && DB && Array.isArray(DB.rows)){ const r = DB.rows.find(r => up(r[0]) === c && r[2]); if(r) nm = r[2]; } }catch(e){}\n" +
   "        try{ if(!nm){ const h = document.querySelector('#sheetBody h1'); if(h && typeof STU !== 'undefined' && STU && up(STU.code) === c) nm = String(h.childNodes[0] && h.childNodes[0].textContent || '').trim(); } }catch(e){}\n" +
   "        if(nm) names = en(String(nm)); }"]
]);
