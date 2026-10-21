// 21 Oct · "Total earned with CupOfEnglish" counts every paid month since the teacher started (the PAYROLL copy in the database,
// through the small coe-payall function), not only the months the Pay screen lists (about the last 11). Earnings by year as bars.
// The screen's own months are used until the full total arrives (and if it cannot load).
const E = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '517-pay-all-time-server.json'), 'utf8'));
require('../tools/lib.js')(process.argv[2], E);
