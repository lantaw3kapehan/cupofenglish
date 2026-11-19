// 2402: trial steps · the agreement comes from S-AGREE (database), "Next" is the first open step after the last one done (older gaps
//   stay grey, they are not the next thing to do), and the weekly slots read Mon → Sun.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["let ag = null; try{ ag = typeof agrOf === 'function' ? agrOf(code, '', t.student) : null; }catch(e){}",
   "let ag = f.agree ? { at: f.agree.at, how: /sent/i.test(String(f.agree.how || '')) && !/sign/i.test(String(f.agree.how || '')) ? 'Sent' : f.agree.how } : null; if(!ag) try{ ag = typeof agrOf === 'function' ? agrOf(code, '', t.student) : null; }catch(e){}"],
  ["sch.n + ' classes · ' + (sch.slots || []).join(' + ')",
   "sch.n + ' classes · ' + (sch.slots || []).slice().sort((a, b) => ('MonTueWedThuFriSatSun'.indexOf(a.slice(0, 3)) - 'MonTueWedThuFriSatSun'.indexOf(b.slice(0, 3))) || a.localeCompare(b)).join(' + ')"],
  ["const n = L.filter(s => s.done).length, nx = L.find(s => !s.done);",
   "const n = L.filter(s => s.done).length, ld = L.map(s => s.done).lastIndexOf(true), nx = L.find((s, i) => !s.done && i > ld) || L.find(s => !s.done);"]
]);
