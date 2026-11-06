// 1798: (Misty 6 Nov 15:24: "those affected with 4 hour notice, can they show the charge? and those who are not affected, no charge?")
//   Each booked lesson now gets its own notice and outcome: under 4 hours → charged (Excused with proof, Unexcused without);
//   4 hours or more → no charge for an emergency with proof (planned time off under 7 days stays at the excused rate).
//   The card lists every lesson with its notice and outcome; "Apply suggested" saves one case per charged lesson.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const OLD = fs.readFileSync(__dirname + '/1798-per-lesson-credit.old.txt', 'utf8'), NEW = fs.readFileSync(__dirname + '/1798-per-lesson-credit.new.txt', 'utf8');
lib(file, [[OLD, NEW], ["'.lv95{font-size:13px;", "'.lv95t{margin-top:8px;border:1px solid #ECEAF1;border-radius:10px;overflow:hidden}.lv95r{display:grid;grid-template-columns:1fr auto auto;gap:10px;padding:5px 10px;font-size:12.5px;border-top:1px solid #F2F1F6}.lv95r:first-child{border-top:0}.lv95r.ok b{color:#1C6B4C}.lv95r.warn b{color:#8A5A0F}.lv95r.bad b{color:#A3321E}.lv95r span:nth-child(2){color:#6E6B84}.lv95{font-size:13px;"]]);
