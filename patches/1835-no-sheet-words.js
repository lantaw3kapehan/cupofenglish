// 1835: (audit 7 Nov) no sheet leftovers on management screens: Students › "Database sheet" tab and link removed (a frozen Google copy
//   with #ERROR! values); "PAY tab" buttons hidden; Payroll / history labels without "PAY tab" / "PAYROLL tab"; "in ACTIVE" → "in
//   Packages"; "ACTIVE › RENEWAL STATUS / SOURCE" → the package's renewal status / source. The Database view itself stays for the code
//   that still reads it. (The App check renewal wording was fixed in the database: coe_renew_check.)
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  [", ['db', 'Database sheet']]", "]"],
  ["'<div id=\"dbLk\" class=\"small\" style=\"margin-top:4px\">", "'<div id=\"dbLk\" class=\"small\" style=\"display:none\">"],
  [" (PAY tab) · ", " · "],
  ["(PAYROLL tab) · ", "· "],
  ["<span>PAYROLL tab</span>", "<span>before October 2026</span>"],
  ["total net · PAYROLL tab", "total net"],
  ["Mark paid ticks ✔ PAID on the PAY tab.", "Mark paid records the payment."]]);
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b, n) => { const c = s.split(a).length - 1; if(c !== n){ console.error('expected ' + n + ' × ' + a + ', found ' + c); process.exit(1); } s = s.split(a).join(b); };
rep(`onclick="tabSheet('PAY','PAY tab')">PAY tab</button>`, `onclick="tabSheet('PAY','PAY tab')" style="display:none">PAY tab</button>`, 2);
rep('from the PAYROLL tab', 'from the database', 3);
rep('Saved in ACTIVE › RENEWAL STATUS', 'Saved as the package renewal status', 2);
rep('ACTIVE › SOURCE', 'the package source', 2);
rep(' in ACTIVE', ' in Packages', 22);
fs.writeFileSync(file, s);
