// 20 Oct · Book / course list and chips: no "#ERROR!", CEFR levels (A1, A1→A2, A2-B1 Borderline …), N/A or dashes — only real books.
const BAD = "(b => /^#|error|^n\\/?a$|^-+$|→|borderline|^(pre-?a1|a1|a2|b1|b2|c1|c2)([^a-z0-9]|$)/i.test(String(b || '').trim()) || String(b || '').trim().length < 2)";
require('../tools/lib.js')(process.argv[2], [
  ["if(!k || seen[k]) return; seen[k] = 1; out.push(b); };", "if(!k || seen[k] || " + BAD + "(b)) return; seen[k] = 1; out.push(b); };"],
  ["const k = K(b); if(!k) return; name[k] = name[k] || b;", "const k = K(b); if(!k || " + BAD + "(b)) return; name[k] = name[k] || b;"],
  ["if(k && mine.indexOf(k) < 0){ mine.push(k);", "if(k && !" + BAD + "(b) && mine.indexOf(k) < 0){ mine.push(k);"]]);
