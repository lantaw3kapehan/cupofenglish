// 2540 (Misty 18:09–18:11, mock approved): Payroll · "October 2026 pay (paid in November)" and "November so far" (preview).
const file = process.argv[2], fs = require('fs'), path = require('path');
const inc = fs.readFileSync(path.join(__dirname, '2540-payroll-month-so-far.inc.html'), 'utf8');
require('../tools/lib.js')(file, [['<script id="b2278">', inc + '<script id="b2278">']]);
