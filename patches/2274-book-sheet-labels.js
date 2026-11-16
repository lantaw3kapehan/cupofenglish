// 2274 (16 Nov): clearer page names in the unit view: "THE ALPHABET - U1L1" → "Lesson 1 · Aa" (the letter comes from the unit's videos),
// "OD1-Unit 4" → "Unit 4 pages", readers "Level 1 - … - Readers - Rabbit House" → "Reader · Rabbit House".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["      + (P.length ? `<div class=\"b3-lbl\">Pages · open in Drive</div>${P.map(f => a(f, f.name.replace(/^.*?(U\\d+L\\d+.*)$/i, '$1'))).join('')}` : '')",
  "      + (P.length ? `<div class=\"b3-lbl\">Pages · open in Drive</div>${P.map(f => a(f, pLabel(f.name, V))).join('')}` : '')"],
 ["  const a = (f, txt) => `<a class=\"link\"",
  "  function pLabel(n, V){ n = String(n || ''); let m = /U(\\d+)\\s*L(\\d+)/i.exec(n);   /* 2274 */\n    if(m){ const L = (V || []).map(v => (/Letter (\\w\\w)/.exec(v.name) || /(-\\w+) words/.exec(v.name) || [])[1]).filter(Boolean); const k = +m[2]; return 'Lesson ' + k + (L.length && /Letter/.test((V[0] || {}).name || '') && L[k - 1] ? ' · ' + L[k - 1] : ''); }\n    m = /(?:^|[-\\s])Unit\\s*0?(\\d+)\\s*$/i.exec(n); if(m) return 'Unit ' + m[1] + ' pages';\n    m = /Readers?\\s*-\\s*(.+)$/i.exec(n); if(m) return 'Reader · ' + m[1];\n    return n.replace(/^.*?(U\\d+L\\d+.*)$/i, '$1'); }\n  const a = (f, txt) => `<a class=\"link\""],
 ["fs.map(f => a(f)).join('')}</div></details>`; }).join('');", "fs.map(f => a(f, f.kind === 'pdf' ? pLabel(f.name, []) : '')).join('')}</div></details>`; }).join('');"],
]);
