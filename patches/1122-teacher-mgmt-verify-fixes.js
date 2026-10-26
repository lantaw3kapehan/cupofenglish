// 1122: (Misty, 26 Oct 15:12 "go ahead") — closing the views left Blocked / Not tested in 1120–1121 (teacher drill-down, Teachers
//      details pane, Trial outcomes, Onboarding, New notice, Send decision), verified with sample data at 1366 / 1440 / 1280×720 /
//      125% / 1000 / 683 / phone. One failure found and fixed (presentation only):
// · The "▼ … vs <month>" change badge (teacher page KPIs, Performance rows, QA result) was #B4533D on #F9E3DD = 4.0:1, under the
//   4.5:1 minimum for small text → #9A3A26 (5.4:1). The "▲" badge is darkened a little too (#24683F, 5.5:1) so both read alike.
// · Teachers: with a teacher's details open there were two solid buttons; "All teachers · open times" (a view) is now an
//   outline, so "Save" in the details pane is the one solid action.
// · The section icons in the collapsible check-in headings (Trial outcomes, Onboarding, Teaching setup, Phone reminders) were
//   drawn at ~10 px by an older summary rule; they now keep their 18 px size.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style id="d1122">/* 1122 · change badges pass AA */\ni.dl.dn{color:#9A3A26!important}\ni.dl.up{color:#24683F!important}\n.ic1120>svg{width:100%!important;height:100%!important;max-width:none!important}\n#v-perf summary .ic1120,#sheet summary .ic1120{width:18px!important;height:18px!important;flex:none}\n</style>\n' + s.slice(i);
s = s.slice(0, s.lastIndexOf('</body>')) + '<script>/* 1122 · Teachers: "All teachers · open times" is a view, not the main action (outline); the details pane keeps its Save */\n(function(){ var _r = window.renderTeachers; if(typeof _r !== "function") return; window.renderTeachers = function(){ var r = _r.apply(this, arguments); try{ var b = document.getElementById("avaBtn"); if(b) b.classList.add("x1101-sec"); }catch(e){} return r; }; try{ var b = document.getElementById("avaBtn"); if(b) b.classList.add("x1101-sec"); }catch(e){} })();</script>\n' + s.slice(s.lastIndexOf('</body>'));
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
