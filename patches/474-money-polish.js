// 20 Oct · Sales & costs polish: tiles explain themselves, one-off sales called out, dues paid this month not counted twice, visual Every-month table, totals.
const fs = require('fs'), path = require('path');
const oldInc = fs.readFileSync(path.join(__dirname, '473-money-executive.inc'), 'utf8'), newInc = fs.readFileSync(path.join(__dirname, '474-money-polish.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [[oldInc, newInc]]);
