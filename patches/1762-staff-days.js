// 1762: (Misty 4 Nov 18:50 "go ahead" · time-ins in the database) Payroll › Database › ✎ Celine (anyone with base pay) › Staff days:
//   the database's record behind base pay (coe_staff_day, moved from the TIME-IN tab; payroll reads it since 19:15, Sep–Nov identical).
//   Time-in / time-out fill in by themselves from the app's time-ins; day off, leave, holiday top-up, daily base and corrections here.
const lib = require('../tools/lib.js'), fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '1762-staff-days.inc.html'), 'utf8');
lib(file, [['</body>\n</html>', inc + '\n</body>\n</html>']]);
