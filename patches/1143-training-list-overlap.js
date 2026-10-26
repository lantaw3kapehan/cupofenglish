// 1143: (Misty, 26 Oct 17:00, Teacher Christian › Trainings) "check distorted texts too" — the training checklist on the
//      Trainings page ("For Starting Teacher · 6 of 7 trainings done") drew every finished training on top of the next one.
//      Cause: the old dot style ".tx .d" (14 px round dot of the Trainings matrix) also matched the checklist rows of finished
//      trainings (class "ck d"), squeezing each row to 14 px high. The rows now keep their own size; the matrix dots are unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style id="d1143">/* 1143 · training checklist rows */\n.tx .ck.d,.tx5 .ck.d{display:flex!important;width:100%!important;height:auto!important;border-radius:0!important;vertical-align:baseline!important;background:none!important}\n.tx .ck.d i{background:#00A3AD;border-color:#00A3AD;color:#fff}\n</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
