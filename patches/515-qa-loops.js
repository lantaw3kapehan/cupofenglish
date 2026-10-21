// 21 Oct · QA pass, part 2 (flicker / wasted work found by watching each screen while idle).
//  · Student page: the "Every week · Thu 19:00 …" line was rewritten 8 times a second, forever, while the page was open.
//    It compared its new text with what the browser reads back (never exactly equal for icons), rewrote, which woke its own
//    watcher, and so on. The same pattern was in 7 other places (the student tabs, Overview glance, board, bars). Each now
//    remembers what it last wrote and only writes when that changes (and repairs itself if something else changed it).
//  · Today: "Management is waiting for …" was removed and rebuilt on every refresh of Today, even when unchanged (a blink on
//    slower phones). It now stays as it is unless its content changes.
const fs = require('fs'), f = process.argv[2];
{ const s = fs.readFileSync(f, 'utf8'), re = /if\((\w+)\.innerHTML !== (\w+)\)(\{?\s*)\1\.innerHTML = \2;/g, n = (s.match(re) || []).length; if(n !== 8){ console.error('expected 8 innerHTML comparisons, found ' + n); process.exit(1); } }
require('../tools/lib.js')(f, [
["let TOKEN = store('get', KEY_T), D = null, VIEW = 'today', STU_FILTER = 'all', PROOF = null;",
 "let TOKEN = store('get', KEY_T), D = null, VIEW = 'today', STU_FILTER = 'all', PROOF = null;\n/* 515 · write a box only when its content really changes (what we wrote, and the box still shows it) */\nwindow.__same = (el, h) => !!el && el._sh === h && el.innerHTML === el._sv;\nwindow.__put = (el, h) => { el.innerHTML = h; el._sh = h; el._sv = el.innerHTML; };"],
["const old = $('mustBox'); if(old) old.remove(); if(!n) return;",
 "const old = $('mustBox'); if(!n){ if(old) old.remove(); return; }   /* 515: kept when unchanged */"],
["const lead = root.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', box); else root.insertAdjacentHTML('afterbegin', box);\n    // Pop up once",
 "if(!(old && old._box === box && root.contains(old))){ if(old) old.remove(); const lead = root.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', box); else root.insertAdjacentHTML('afterbegin', box); const nb = $('mustBox'); if(nb) nb._box = box; }\n    // Pop up once"]
]);
{ const re = /if\((\w+)\.innerHTML !== (\w+)\)(\{?\s*)\1\.innerHTML = \2;/g; fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(re, (m, el, h, sp) => `if(!__same(${el}, ${h}))${sp}__put(${el}, ${h});`)); }
