// 21 Oct · Teacher Pay › Bonuses & deductions (Misty: "Can the bonuses or this area in tables or graphs/charts whats best").
//  · Three totals: bonuses (green), deductions (coral), net effect, for the last 90 days.
//  · A small month chart: bonuses and deductions side by side for each month.
//  · One row per kind (e.g. "+ Teacher Recognition · 9 times · +₱2,700" with a bar); tap it for every entry as a small table
//    (date · student · by · amount). Nothing removed: every entry, its student, who tagged it and the detail are in the table.
const E = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '513-pay-bonus-visual.json'), 'utf8'));
require('../tools/lib.js')(process.argv[2], E);
