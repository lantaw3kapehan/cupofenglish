// 1113: (Misty 15:52) "Needs your action" rows: title and detail of To do items no longer run together
// ("…class · 2026-10-22Nice note detail") — each line of the To do item is read separately; chip labels also drop a leading
// emoji ("💬 Class note" → "Class note"), same as the symbols in 1112. Display only.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["var g = li.querySelector('.grow'), lines = g ? g.innerText.split('\\n').map(function(z){ return z.trim(); }).filter(Boolean) : [];",
   "var g = li.querySelector('.grow'), lines = g ? (g.children.length > 1 ? [].reduce.call(g.children, function(a, c){ if(c.matches('.chip')) return a; return a.concat(String(c.innerText || '').split('\\n')); }, []) : g.innerText.split('\\n')).map(function(z){ return z.trim(); }).filter(Boolean) : [];"],
  ["function q1112K(l){ return String(l || '').replace(/^[\\s✓◷!⚠•·]+/, '').trim() || 'To do'; }",
   "function q1112K(l){ return String(l || '').replace(/^[\\s✓◷!⚠•·\\u2600-\\u27BF\\uFE0F]+/, '').replace(/^(?:\\uD83C[\\uDC00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83E[\\uDC00-\\uDFFF])+\\s*/, '').trim() || 'To do'; }"],
]);
