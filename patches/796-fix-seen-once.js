// 796: (Misty) "on teacher's screen, if they have click see what to fix, that shouldnt keep appearing since they have seen it"
// · Tapping the "To fix" item (or "See what to fix" in the waiting box) marks every class in it as seen, whatever the problem
//   (late time-in, no class video, no homework…). Before, only late-only classes were remembered, so it kept coming back
//   and even turned into "Overdue · counts as a warning".
// · It comes back only for a NEW class to fix, or when a class gets a new problem. The full list stays on Growth › To fix.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const fxLate = i => /^Late|late|after 23|after/i.test(String(i)), fxKey = x => [x.d, x.at, x.code || x.student].join('|');",
   "const fxLate = i => /^Late|late|after 23|after/i.test(String(i)), fxKey = x => [x.d, x.at, x.code || x.student].join('|') + '|' + (x.items || []).slice().sort().join(',');"],
  ["(D.fix || []).forEach(x => { if((x.items || []).every(fxLate)) S[fxKey(x)] = Date.now(); }); store('set', 'coe.fixSeen', JSON.stringify(S)); }catch(e){} };",
   "(D.fix || []).forEach(x => { S[fxKey(x)] = Date.now(); }); fxSeen = S; store('set', 'coe.fixSeen', JSON.stringify(S)); }catch(e){} };"],
  ["const fx = (D.fix || []).filter(x => !((x.items || []).length && (x.items || []).every(fxLate) && fxSeen[fxKey(x)]));",
   "const fx = (D.fix || []).filter(x => !fxSeen[fxKey(x)]);"]
]);
