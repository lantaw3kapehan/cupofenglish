// 1818: final QA · Students › Learner showed "All 164" while the list has 220 active students: 56 students taught by more than one
//   teacher are drawn as a different row (div with openStudent) and never got their learner band, so they were not counted and the
//   Early Years / Young Learners / Teens / Adults filters always showed them. Both kinds of row now get the band, are counted and filtered.
const fs = require('fs'), file = process.argv[2]; let s = fs.readFileSync(file, 'utf8');
const rep = (a, b, n) => { const c = s.split(a).length - 1; if(c !== n) throw new Error('Expected ' + n + ' got ' + c + ' for ' + a.slice(0, 70)); s = s.split(a).join(b); };
rep("document.querySelectorAll('#v-astudents a.li.sa[href^=\"#student=\"]').forEach(a => { const code = up(a.getAttribute('href').slice(9)), line",
    "document.querySelectorAll('#v-astudents a.li.sa[href^=\"#student=\"], #v-astudents div.li.sa[onclick^=\"openStudent\"]').forEach(a => { const code = up(a.getAttribute('href') ? a.getAttribute('href').slice(9) : ((a.getAttribute('onclick') || '').match(/ST-\\d{4}-\\d{3}/) || [''])[0]), line", 1);
rep('#v-astudents[data-ltf="early"] a.li.sa:not([data-lb="early"]),#v-astudents[data-ltf="young"] a.li.sa:not([data-lb="young"]),#v-astudents[data-ltf="teen"] a.li.sa:not([data-lb="teen"]),#v-astudents[data-ltf="adult"]',
    '#v-astudents[data-ltf="early"] .li.sa:not([data-lb="early"]),#v-astudents[data-ltf="young"] .li.sa:not([data-lb="young"]),#v-astudents[data-ltf="teen"] .li.sa:not([data-lb="teen"]),#v-astudents[data-ltf="adult"]', 1);
// the 4th selector continues after "adult"] — make it .li.sa too
{ const i = s.indexOf('#v-astudents[data-ltf="adult"]'); const j = s.indexOf('a.li.sa:not([data-lb="adult"])', i); if(j < 0 || j - i > 40) throw new Error('adult selector'); s = s.slice(0, j) + '.li.sa:not([data-lb="adult"])' + s.slice(j + 'a.li.sa:not([data-lb="adult"])'.length); }
rep("const rows = el.querySelectorAll('a.li.sa'); if(!rows.length) return;", "const rows = el.querySelectorAll('.li.sa'); if(!rows.length) return;   /* 1818: both kinds of row */", 1);
const m = s.match(/const COE_V = (\d+);/); s = s.replace(m[0], 'const COE_V = ' + (+m[1] + 1) + ';'); console.log('COE_V ' + m[1] + ' → ' + (+m[1] + 1));
fs.writeFileSync(file, s);
