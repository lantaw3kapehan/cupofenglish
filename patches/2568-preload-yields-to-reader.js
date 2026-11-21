// 2568 (Misty 11:11, Dezza OD1 Workbook "Slow to open · 36 s · meta check failed" on 4G 10 Mbps): saving today's books ahead
// (2552/2554) was downloading at full speed while she opened a book, so the book's own request starved. Now the save:
//  · waits while the book reader is open on screen (the reader marks coe.rd.busy every 15 s), and
//  · is gentler: 256 KB pieces with 0.5 s pauses (about 4 Mbps at most).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'), n = 0;
const A = 'async function waitFree(){ while(!free()) await sleep(60e3); }';
const B = 'const rdBusy = function(){ try{ return Date.now() - (+localStorage.getItem(\'coe.rd.busy\') || 0) < 45e3; }catch(e){ return false; } };   /* 2568: the book reader is open */\n  async function waitFree(){ while(!free() || rdBusy()) await sleep(rdBusy() ? 15e3 : 60e3); }';
s = s.split(A).join(B); n += 2;
s = s.split('pos = e; await sleep(150); }').join('pos = e; await sleep(500); }');
s = s.split('var out = new Uint8Array(n), pos = 0, step = 524288;').join('var out = new Uint8Array(n), pos = 0, step = 262144;');
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
