// 2261 (Misty 16 Nov 14:01): profile card spacing.
// 1) Classroom style: a gap between paragraphs (each new line in the box starts a new paragraph), instead of one solid block.
// 2) More space between the last teaching-mix row and the grey note under it.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["const stF = '700 40px ' + F, stL = wrap(P.style, stF, CW - 150);",
  "const stF = '700 40px ' + F, stPar = String(P.style || '').split('\\n').map(s => s.trim()).filter(Boolean).map(p => wrap(p, stF, CW - 150)), stL = stPar.flat(), stGap = 26, stExtra = Math.max(0, stPar.length - 1) * stGap;   /* 2261: paragraphs */"],
 ["mnL.length ? mnL.length * 40 + 16 : 0", "mnL.length ? mnL.length * 40 + 40 : 0"],
 ["L.st = y; y += stL.length ? secH + stL.length * 60 + 90 + 50 : 0;", "L.st = y; y += stL.length ? secH + stL.length * 60 + stExtra + 90 + 50 : 0;"],
 ["c.fillText(t, M + 6, yy + 18 + k * 40)", "c.fillText(t, M + 6, yy + 42 + k * 40)"],
 ["qh = stL.length * 60 + 70;", "qh = stL.length * 60 + stExtra + 70;"],
 ["stL.forEach((t, i) => c.fillText(t, M + 100, qy + 74 + i * 60)); }",
  "{ let ly = qy + 74; stPar.forEach((pl, pi) => { pl.forEach(t => { c.fillText(t, M + 100, ly); ly += 60; }); ly += stGap; }); } }   /* 2261 */"],
]);
