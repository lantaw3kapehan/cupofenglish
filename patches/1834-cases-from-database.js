// 1834: (Misty 7 Nov "go ahead", audit) Cases screen from the database (coe-cases → coe_actions_screen), not Google's saved answer.
//   Checked: 164 / 164 cases, incentives ₱21,120 and deductions ₱29,124 identical to Google's last answer; 23 old 2025 cases without
//   a case number were imported into the database (src import1834) so none are missing.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1834-cases-from-database.inc.txt', 'utf8');
lib(file, [["\n</body>", "\n" + inc + "</body>"]]);
