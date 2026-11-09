// 2004: the urgent line on teacher Today read "Management is waiting for your to fix · 1 class this week" (the box title's own words, cut).
//   It now reads "To fix · 1 class this week · management is waiting", so the part that matters fits on a phone.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["mt = must ? (must.textContent || '').replace(/^\\W+/, '').trim() : '';",
   "mt = must ? (function(t){ const m = t.match(/waiting for (?:your |you to )?(.+)$/i); return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) + ' · management is waiting' : t; })((must.textContent || '').replace(/^\\W+/, '').trim()) : '';   /* 2004 */"],
]);
