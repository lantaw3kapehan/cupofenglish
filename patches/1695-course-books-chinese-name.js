// 1695: (Misty, 1 Nov 21:59) "The English name is here now but why isn't the Chinese name showing?" · the screen that opened the
//   Course Books picture still had Vita's details from before the rename (no Chinese name). When the Chinese name is blank, the
//   picture now takes it from the student whose English name (or code) matches, from the student page, the student list or ACTIVE
//   — only when exactly one student matches, so a shared English name is never guessed.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["        if(s){ en = String(s.name).trim(); cn = String(cn || s.cn || s.chinese || '').trim(); } } }catch(e){}",
   "        if(s){ en = String(s.name).trim(); cn = String(cn || s.cn || s.chinese || '').trim(); } }\n" +
   "      if(!String(cn || '').trim() && String(en || '').trim()){ const nm = String(en).trim().toLowerCase(), F = {};   /* 1695: a missing Chinese name */\n" +
   "        const add = (code, n, z) => { if(String(n || '').trim().toLowerCase() === nm && String(z || '').trim()) F[String(code || n).toUpperCase()] = String(z).trim(); };\n" +
   "        if(typeof STU !== 'undefined' && STU && STU.s) add(STU.code, STU.s.name, STU.s.cn || STU.s.chinese);\n" +
   "        [].concat((typeof MS !== 'undefined' && Array.isArray(MS)) ? MS : [], (typeof SL !== 'undefined' && SL && Array.isArray(SL.students)) ? SL.students : []).forEach(x => x && add(x.code, x.name, x.cn || x.chinese));\n" +
   "        if(typeof AT !== 'undefined' && AT && AT.cols){ const C = {}; AT.cols.forEach((k, i) => C[k] = i); (AT.rows || []).forEach(r => add(r[C.code], r[C.name], r[C.cn])); }\n" +
   "        const V = [...new Set(Object.values(F))]; if(V.length === 1) cn = V[0]; } }catch(e){}"]
]);
