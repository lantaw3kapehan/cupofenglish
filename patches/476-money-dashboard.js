// 20 Oct · Sales & costs as a dashboard: tabs, tiles with mini charts, Profit-by-month with running total, actions as cards.
const fs = require('fs'), path = require('path');
const oldInc = fs.readFileSync(path.join(__dirname, '474-money-polish.inc'), 'utf8'), newInc = fs.readFileSync(path.join(__dirname, '476-money-dashboard.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [[oldInc, newInc]]);
