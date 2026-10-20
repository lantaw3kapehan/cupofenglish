// 20 Oct · 30 + 3 at 25 min = 66 classes (no longer cut at 60; booked in parts of 60) · book chips under Book / course.
const inc = require('fs').readFileSync(require('path').join(__dirname, '385-more-classes-books.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["Math.min(60, +($('cN')||{}).value || 1)), out = [];", "Math.min(140, +($('cN')||{}).value || 1)), out = [];"],
  ["out.length < n && k < 400; k++){ const x = new Date(d); x.setDate(d.getDate()+k); if(days", "out.length < n && k < 1500; k++){ const x = new Date(d); x.setDate(d.getDate()+k); if(days"],
  ["Math.min(60, +($('cN') || {}).value || 1)), out = [];", "Math.min(140, +($('cN') || {}).value || 1)), out = [];"],
  ["k < 400; k++){ const x = new Date(d); x.setDate(d.getDate() + k); const T = by", "k < 1500; k++){ const x = new Date(d); x.setDate(d.getDate() + k); const T = by"],
  ["return Object.values(G).sort(", "return [].concat(...Object.values(G).map(g => { const o = []; for(let i = 0; i < g.dates.length; i += 60){ const ds = g.dates.slice(i, i + 60); o.push({ time: g.time, dates: ds, days: g.days.filter(d => ds.some(x => new Date(x + 'T12:00:00').getDay() === d)) }); } return o; })).sort("],
  ["if(!$('cR') || !$('cR').checked || !mixed()) return baseSend", "if(!$('cR') || !$('cR').checked || !(mixed() || plan().length > 60)) return baseSend"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
