// 872: Enquiries (audit #12). The funnel mixed two kinds of numbers without saying so: "Trial booked" counted everyone who ever
//      reached a trial (Trial booked, Enrolled, or a linked trial) while its tab below counts only the ones whose status is
//      Trial booked now. Same for "Logged" (all enquiries) vs the "Open" tab it opens.
// · Funnel tiles: "Trial booked" → "Reached trial" with "x% · N at trial now"; "Not now" → sub "x% · now".
// · One line under the funnel: milestones (ever reached) vs where they are now (Not now and the tabs).
// · Hover text on each tile says which tab it opens and what that tab counts.
// · Month chart heading: "Enquiries per month · by status now". Results stat "trials" → "reached trial".
// Counts and filters unchanged.
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const st = (k, l, v, c, sub, ar) => '<div class=\"st' + (ar ? ' ar' : '') + '\" style=\"--c:' + c + ';--w:' + pc(v) + '%\" onclick=\"enqF(\\'' + k + '\\')\" title=\"Open: ' + l + '\"><em>' + l + '</em><b>' + v + '</b><small>' + sub + '</small><i></i></div>';",
   "const st = (k, l, v, c, sub, ar, tt) => '<div class=\"st' + (ar ? ' ar' : '') + '\" style=\"--c:' + c + ';--w:' + pc(v) + '%\" onclick=\"enqF(\\'' + k + '\\')\" title=\"' + (tt || 'Open: ' + l) + '\"><em>' + l + '</em><b>' + v + '</b><small>' + sub + '</small><i></i></div>';\nconst tbNow = L.filter(e => e.st === 'Trial booked').length;"],
  ["return '<div class=\"fn31\"><div class=\"fl\">' + st('all', 'Logged', n, '#2B2253', 'enquiries', 1) + st('trial', 'Trial booked', tb, '#00A3AD', pc(tb) + '%', 1) + st('enrolled', 'Enrolled', en, '#2E9E6F', pc(en) + '%', 0) + st('not', 'Not now', no, '#B0ADC0', pc(no) + '%', 0) + '</div>' +",
   "return '<div class=\"fn31\"><div><div class=\"fl\">' + st('all', 'Logged', n, '#2B2253', 'enquiries · ever', 1, 'Every enquiry ever logged · opens the Open tab (not enrolled and not set to Not now)') + st('trial', 'Reached trial', tb, '#00A3AD', pc(tb) + '% · ' + tbNow + ' at trial now', 1, 'Ever reached a trial: Trial booked, Enrolled or a linked trial · opens the Trial booked tab (status is Trial booked now)') + st('enrolled', 'Enrolled', en, '#2E9E6F', pc(en) + '%', 0, 'Status is Enrolled · opens the Enrolled tab') + st('not', 'Not now', no, '#B0ADC0', pc(no) + '% · now', 0, 'Status is Not now at the moment · opens the Not now tab') + '</div><div class=\"small mute\" style=\"margin-top:6px;line-height:1.45\">Logged, Reached trial and Enrolled are milestones: everyone who ever got that far (an enrolled student also counts as reached trial). Not now and the tabs below show where each enquiry is now.</div></div>' +"],
  ["<span>Enquiries per month</span>",
   "<span>Enquiries per month · by status now</span>"],
  ["<div class=\"stat\"><b class=\"num\">' + X.filter(tri).length + '</b><span>trials · '",
   "<div class=\"stat\"><b class=\"num\">' + X.filter(tri).length + '</b><span>reached trial · '"]
]);
