// 2106 (11 Nov 21:55, Misty: "Jim has renewed, but it is shared with Keke … in the payment confirmation only Jim is showing").
//   When the student's package is shared with a sibling, a new payment confirmation is billed to all the children on that package:
//   "Students Jim (朱泓政) & Keke (…)". A bill-to name saved for the family is still used first, and the field can still be edited.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
  "  S.bill_name = p.bill_name || (st ? 'Student ' + (st.en || '') + (st.zh ? ' (' + st.zh + ')' : '') : '');",
  "  S.bill_name = p.bill_name || (st ? 'Student ' + (st.en || '') + (st.zh ? ' (' + st.zh + ')' : '') : '');\n" +
  "  try{ if(!p.bill_name && st && S.code && typeof shGroup === 'function'){ const g = shGroup(S.code);   /* 2106: a shared package bills every child on it */\n" +
  "    if(g){ const C = g.C, up = x => String(x || '').trim().toUpperCase(), seen = {}, kids = [];\n" +
  "      g.G.members.forEach(m => { const cd = up(m[C.code]); if(!cd || seen[cd]) return; seen[cd] = 1; const en = String(m[C.name] || '').trim(), zh = String(m[C.cn] || '').trim(); if(en) kids.push({ cd, t: en + (zh ? ' (' + zh + ')' : '') }); });\n" +
  "      kids.sort((a, b) => (a.cd === up(S.code) ? -1 : b.cd === up(S.code) ? 1 : a.cd.localeCompare(b.cd)));\n" +
  "      if(kids.length > 1) S.bill_name = 'Students ' + kids.map(k => k.t).join(' & '); } } }catch(x){}"
]]);
