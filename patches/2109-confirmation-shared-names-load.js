// 2109 (11 Nov 22:22, Misty: "the payment confirmation seemed the same?"). 2106 needed the package list already loaded; opened from
//   Finance › Payment confirmations it often is not, so the bill-to stayed "Student Jim". Now the list is loaded when needed and the
//   bill-to changes to "Students Jim (…) & Keke (…)" a moment later, unless it was already edited by hand.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
  "      if(kids.length > 1) S.bill_name = 'Students ' + kids.map(k => k.t).join(' & '); } } }catch(x){}",
  "      if(kids.length > 1) S.bill_name = 'Students ' + kids.map(k => k.t).join(' & '); }\n" +
  "    else if((typeof AT === 'undefined' || !AT || !AT.cols) && typeof loadActive === 'function'){ const d0 = S.bill_name, cd0 = S.code;   /* 2109: load the package list, then name every child */\n" +
  "      loadActive(true).then(() => { try{ if(S.code !== cd0 || S.bill_name !== d0) return; const g2 = shGroup(cd0); if(!g2) return; const C = g2.C, up = x => String(x || '').trim().toUpperCase(), seen = {}, kids = [];\n" +
  "        g2.G.members.forEach(m => { const cd = up(m[C.code]); if(!cd || seen[cd]) return; seen[cd] = 1; const en = String(m[C.name] || '').trim(), zh = String(m[C.cn] || '').trim(); if(en) kids.push({ cd, t: en + (zh ? ' (' + zh + ')' : '') }); });\n" +
  "        kids.sort((a, b) => (a.cd === up(cd0) ? -1 : b.cd === up(cd0) ? 1 : a.cd.localeCompare(b.cd))); if(kids.length < 2) return;\n" +
  "        S.bill_name = 'Students ' + kids.map(k => k.t).join(' & '); const i = document.querySelector('#ivM input[oninput*=\"bill_name\"]'); if(i) i.value = S.bill_name; preview(); }catch(x){} }).catch(() => {}); } } }catch(x){}"
]]);
