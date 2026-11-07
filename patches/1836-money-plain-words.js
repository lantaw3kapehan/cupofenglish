// 1836: (audit 7 Nov) Finance › Sales & costs is already worked out by the database every 10 minutes (coe-money "apply", since 16 Oct),
//   but the screens still said "MONEY tab". Plain words now: "money summary", "payroll"; the definition line says why Transactions'
//   Difference is a different figure instead of warning about it.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [["Total costs = recorded expenses + net salaries (PAYROLL tab) + government dues. Figures come from the MONEY tab. Transactions shows a different figure, <b>Difference</b> = sales − expense lines only.",
  "Total costs = recorded expenses + net salaries + government dues, worked out by the database every 10 minutes. Transactions shows <b>Difference</b> = sales − expense lines only, so salaries and dues are not in it."]]);
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b, n) => { const c = s.split(a).length - 1; if(n >= 0 && c !== n){ console.error('expected ' + n + ' × ' + a + ', found ' + c); process.exit(1); } s = s.split(a).join(b); };
rep('More from the MONEY tab', 'More detail', -1);
rep('from the MONEY tab', 'from the money summary', -1);
rep('the MONEY tab', 'the money summary', -1);
rep('MONEY tab', 'money summary', -1);
fs.writeFileSync(file, s);
