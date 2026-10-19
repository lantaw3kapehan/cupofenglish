// 19 Oct · 295 · Teacher Excellence card, new look (Misty: yes): "this month" title with the live line, a level track (Developing → Bronze → Silver → Gold) with her score,
// the four parts as 2 × 2 tiles with small rings, Top 3 as a row of chips, and My months as a small timeline chart (dots coloured by level) with the month-by-month table under it.
const fs = require('fs'), path = require('path'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('  function cardHtml(){'), b = s.indexOf('  function growthCard(){');
if(a < 0 || b < a) { console.error('cardHtml not found'); process.exit(1); }
const card = fs.readFileSync(path.join(__dirname, '295-excellence-card-design.card.js'), 'utf8');
require('../tools/lib.js')(file, [[s.slice(a, b), card],
  ["  window.kxMeReload = () => load(true);", "  window.kxMeReload = () => load(true);\n  window.kxVisits = () => { const g = $('v-growth'); if(!g) return; const h = [...g.querySelectorAll('h2')].find(e => /^Class visits/.test((e.textContent || '').trim())); if(h){ const d = h.closest('details'); if(d) d.open = true; h.scrollIntoView({ behavior: 'smooth', block: 'start' }); } };"]]);
