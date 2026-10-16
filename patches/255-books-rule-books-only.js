// 16 Oct · the books rule prompt only for course-book links (not class videos or other Drive files).
const fs = require('fs'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('/* 16 Oct · 248 · Books: for CupOfEnglish classes only'), z = s.indexOf('</script>', a);
if (a < 0 || z < 0) { console.error('248 block not found'); process.exit(1); }
const blk = s.slice(a, z), x = "if(!a0 || !D || D.mgr || ok()) return;";
if (blk.split(x).length !== 2) { console.error('guard not found once'); process.exit(1); }
require('../tools/lib.js')(file, [[blk, blk.replace(x, "if(!a0 || !D || D.mgr || ok() || !(a0.classList.contains('bkb') || a0.closest('#bkBody, #stuBk, #v-books'))) return;   /* 255: course books only, not class videos */")]]);
