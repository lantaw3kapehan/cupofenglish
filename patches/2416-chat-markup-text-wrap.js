// 2416 (Misty 19 Nov 13:20, Celine's screenshot: "Paste it here if not from t…" ran off the picture) · markup text now wraps onto the
//   next line at the picture's right edge instead of being cut off.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["c.strokeText(o.s, o.a[0], o.a[1]); c.fillText(o.s, o.a[0], o.a[1]); }",
   "{ var room = Math.max(fs * 4, c.canvas.width - o.a[0] - fs * .4), W = String(o.s).split(/\\s+/), L = [], ln = '';\n" +
   "        W.forEach(function(w){ var t = ln ? ln + ' ' + w : w; if(ln && c.measureText(t).width > room){ L.push(ln); ln = w; } else ln = t; }); if(ln) L.push(ln);\n" +
   "        L.forEach(function(t, i){ var y = o.a[1] + i * fs * 1.2; c.strokeText(t, o.a[0], y); c.fillText(t, o.a[0], y); }); } }"]
]);
