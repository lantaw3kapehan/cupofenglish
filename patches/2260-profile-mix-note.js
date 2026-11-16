// 2260 (Misty 16 Nov 13:42 "yes go ahead"): an optional note under the teaching mix on the profile cards,
// e.g. "以上为备考课参考安排，具体内容和比重会根据学员的水平和目标调整。" Shown small and grey under the legend.
// Kept inside the saved teaching mix as a last line starting with "※" (no database change); the editor has its own box for it.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 // editor: the note is not a mix row
 ["const mixParse = s => prfLines(s).map(l =>", "const mixParse = s => prfLines(s).filter(l => !/^※/.test(l)).map(l =>"],
 [String.raw`const mixText = () => MX.filter(r => r.p || r.t.trim()).map(r => (r.p ? r.p + '% ' : '') + r.t.trim()).join('\n');`,
  String.raw`const mixText = () => MX.filter(r => r.p || r.t.trim()).map(r => (r.p ? r.p + '% ' : '') + r.t.trim()).join('\n') + (window.__mxNote ? '\n※ ' + window.__mxNote : '');   /* 2260 */`],
 ["MX = mixParse(P.mix);", "MX = mixParse(P.mix); window.__mxNote = (prfLines(P.mix).find(l => /^※/.test(l)) || '').replace(/^※\\s*/, '');   /* 2260 */"],
 ["window.prf2MxAdd = () => { MX.push({ p: '', t: '' }); mixPaint(); };",
  "window.prf2MxAdd = () => { MX.push({ p: '', t: '' }); mixPaint(); };\n  window.prf2MxNote = v => { window.__mxNote = String(v || '').trim(); if(PRFE){ PRFE.mix = mixText(); } dirty(); prfLater(); };   /* 2260 */"],
 ["'<label>Classroom style · the lines at the bottom</label>'",
  "'<label>Note under the teaching mix <span class=\"mute small\">(optional)</span></label><input class=\"in-t\" value=\"' + esc(window.__mxNote || '') + '\" placeholder=\"以上为参考安排，具体内容和比重会根据学员的水平和目标调整。\" oninput=\"prf2MxNote(this.value)\">' +\n        '<label>Classroom style · the lines at the bottom</label>'"],
 // picture
 ["const mix = prfLines(P.mix).map(l => {",
  "const mixNote = (prfLines(P.mix).find(l => /^※/.test(l)) || '').replace(/^※\\s*/, '');   /* 2260 */\n    const mix = prfLines(P.mix).filter(l => !/^※/.test(l)).map(l => {"],
 ["L.mx = y; y += mix.length ? secH + 64 + 34 + mix.reduce((a, x) => a + x.h, 0) + 40 : 0;",
  "const mnF = '400 28px ' + F, mnL = mixNote ? wrap(mixNote, mnF, CW - 20) : [];   /* 2260 */\n    L.mx = y; y += mix.length ? secH + 64 + 34 + mix.reduce((a, x) => a + x.h, 0) + 40 + (mnL.length ? mnL.length * 40 + 16 : 0) : 0;"],
 ["c.lineTo(W - M, yy - 12); c.stroke(); } }); }",
  "c.lineTo(W - M, yy - 12); c.stroke(); } });\n      if(mnL.length){ c.fillStyle = '#8A86A0'; c.font = mnF; c.textAlign = 'left'; mnL.forEach((t, k) => c.fillText(t, M + 6, yy + 18 + k * 40)); } }   /* 2260: note under the mix */"],
]);
