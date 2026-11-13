// 2184 (13 Nov · Misty): for staff who cannot see company totals (Celine), the Overview "Payments" card opens the sales list,
// and "Sales & costs" is replaced by Transactions (+ Sale, + Expense and the history). The Sales & costs tab is hidden for them.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["<button type=\"button\" onclick=\"go(\\'money\\')\">Open Sales &amp; costs</button>",
  "<button type=\"button\" onclick=\"go(\\'expenses\\');fxK(\\'in\\')\">Open sales</button>"],
 ["function tabs(v){ const g = GOF[v]; if(!g) return ''; const L = g.views.filter(([k]) => k === v || has(k));",
  "function tabs(v){ const g = GOF[v]; if(!g) return ''; const L = g.views.filter(([k]) => (k === v || has(k)) && !(k === 'money' && typeof isPres === 'function' && !isPres()));"],
 ["  window.fo2181Load = function(){",
  "  (function w2184(){ if(typeof window.go !== 'function' || typeof isPres !== 'function') return setTimeout(w2184, 300); if(window.go.x2184) return; const g0 = window.go;\n    const g1 = function(v){ if(v === 'money' && typeof isPres === 'function' && !isPres()){ const r = g0.apply(this, ['expenses'].concat([].slice.call(arguments, 1))); return r; } return g0.apply(this, arguments); }; g1.x2184 = 1; window.go = g1; })();\n  window.fo2181Load = function(){"]
]);
