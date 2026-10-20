// 20 Oct · Student flow tiles show the current month first, arrows vs last month at the same day of the month.
const fs = require('fs'), inc = fs.readFileSync(require('path').join(__dirname, '424-student-flow.inc'), 'utf8');
const f = process.argv[2]; let h = fs.readFileSync(f, 'utf8');
const a = h.indexOf('/* 20 Oct · 424 · Overview › "Student flow"'), b = h.indexOf('</script>', a);
if(a < 0 || b < 0) throw new Error('424 block not found');
h = h.slice(0, a) + inc + h.slice(b); fs.writeFileSync(f, h); console.log('Replaced 424 block');
