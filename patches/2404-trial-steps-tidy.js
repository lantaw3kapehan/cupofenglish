// 2404: trial steps tidy · "Student page" is not a step (no number), the welcome row's button reads "Open", agreement dates "19 Nov".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    let p = el.querySelector('.st01p'); if(!p){",
   "    { const pg = [...el.querySelectorAll('.tl4-r')].find(r => /^Student page$/.test((r.querySelector('.tl4-t b') || {}).textContent || '')); if(pg){ const n = pg.querySelector('.tl4-n'); if(n) n.textContent = '·'; pg.classList.remove('next', 'done'); } }\n" +
   "    { const w = [...el.querySelectorAll('.tl4-r')].find(r => /^Welcome message$/.test((r.querySelector('.tl4-t b') || {}).textContent || '')); const b = w && w.querySelector('.tl4-a button'); if(b && /Class notice/.test(b.textContent)) b.textContent = 'Open'; }\n" +
   "    let p = el.querySelector('.st01p'); if(!p){"],
  ["(ag.how === 'Sent' ? 'Sent ' + String(ag.at || '').slice(0, 10) + ' · waiting for the signature' : 'Signed ' + String(ag.at || '').slice(0, 10))",
   "(ag.how === 'Sent' ? 'Sent ' + dm(ag.at) + ' · waiting for the signature' : 'Signed ' + dm(ag.at))"],
  ["  const LK = { plan: 'plan', cefr: 'cefr', price: 'price', notice: 'welcome' };",
   "  const LK = { plan: 'plan', cefr: 'cefr', price: 'price', notice: 'welcome' };\n  const dm = s => { const m = String(s || '').match(/^(\\d{4})-(\\d{2})-(\\d{2})/); return m ? +m[3] + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1] : String(s || ''); };"]
]);
