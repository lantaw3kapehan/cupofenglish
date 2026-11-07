// 1838: (Misty 7 Nov "BE MADE PROFESSIONAL LIKE THE REST OF THE APP") parent WeChat messages without casual emojis.
//   · The message texts in the app are cleaned (102 places: reminders, renewal and follow-up messages, trial welcome,
//     payment, Class Notice, book and level-up congratulations, agreement reminder, enquiry forms), with the punctuation
//     put back where an emoji ended a sentence. The few that pointed at a picture now say so in words.
//   · Safety net: everything the app copies leaves without emojis (also texts that come from the database).
const lib = require('../tools/lib.js'), fs = require('fs'), cp = require('child_process'), file = process.argv[2];
cp.execFileSync('python3', [__dirname + '/1838-clean.py', file], { stdio: 'inherit' });
const inc = fs.readFileSync(__dirname + '/1838-professional-parent-messages.inc.txt', 'utf8');
lib(file, [["\n</body>", "\n" + inc + "</body>"]]);
