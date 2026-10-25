// 930: (audit 25 Oct, D3 · findings 5 and 10) Bars and dots drawn at one spot / not at all on three screens:
//  · Leave › "Team leave · next 6 weeks": every leave bar was 4 px wide at the same place; the "today" line sat near 12 Nov.
//  · Performance › "QA by domain": the domain bars were invisible (0 px wide).
//  · Monitor › Time-ins › "Today's timeline": every time-in dot at the same horizontal position (also on a laptop).
// Cause: the Trainings stylesheet has an unscoped rule `.tr{max-width:760px;margin:0 auto}` meant for the teacher's Trainings
// page wrapper. Those three charts also use a `.tr` track inside a grid / flex row; `margin:auto` there shrinks the track to
// 0 px and centres it, so every percentage position lands on the same point.
// Fix: the rule now applies only to the Trainings page wrapper it was written for (`#v-train > .tr`, the teacher's loading view).
// Contracts / Notices panel rows (`.ct .tr`) are no longer capped at 760 px inside the wide panel. No data or positions change.
require('../tools/lib.js')(process.argv[2], [
  ['.tr{max-width:760px;margin:0 auto}.tr h1{margin:0}.tr .sub{color:#5E5A75;font-size:13.5px;margin-top:2px}',
   '#v-train>.tr{max-width:760px;margin:0 auto}#v-train>.tr h1{margin:0}#v-train>.tr .sub{color:#5E5A75;font-size:13.5px;margin-top:2px}'],
]);
