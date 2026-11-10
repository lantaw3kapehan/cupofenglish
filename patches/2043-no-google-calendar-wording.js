// 2043 (10 Nov 09:56, Misty sent the cancel message "… make-up: Google Calendar checks the weekly class · Google Calendar follows in
//   a few seconds"): the app is the calendar since 8 Nov (1903/1907); Google Calendar is no longer named anywhere staff read.
//   · save messages (svPill / toast): Google Calendar phrases are taken out before they show;
//   · New class sheet, Schedule header and the daily grid note say "the app's calendar".
const file = process.argv[2];
const CLEAN = `<script id="x2043">
/* 2043 · no "Google Calendar" in save messages (the app is the calendar since 8 Nov) */
(function(){ const cl = s => typeof s !== 'string' ? s : s
    .replace(/\\s*·\\s*make-up: Google Calendar checks the weekly class/gi, '')
    .replace(/\\s*·\\s*Google Calendar (follows|is updated)[^·<]*/gi, '')
    .replace(/ (in|to|from) (the works@ )?Google Calendar(…|\\.\\.\\.)/gi, '$3')
    .replace(/Saved in Google Calendar/gi, 'Saved').replace(/ (in|to) Google Calendar\\b/gi, '');
  try{ const p = window.svPill; if(typeof p === 'function') window.svPill = svPill = function(id, html, kind){ return p.call(this, id, cl(html), kind); }; }catch(e){}
  try{ const t = window.toast; if(typeof t === 'function') window.toast = toast = function(m){ return t.call(this, cl(m)); }; }catch(e){}
})();
</script>
`;
require('../tools/lib.js')(file, [
 ["Goes straight into the works@ Google Calendar, titled like the team's: code-student-book-teacher", "Goes straight into the app's calendar, titled like the team's: code-student-book-teacher"],
 ["and in their own Google Calendar if their Gmail is set under Teachers.", "with a class reminder."],
 ["All teachers · Google Calendar · cancellations crossed out", "All teachers · cancellations crossed out"],
 ["' · changes go to Google Calendar, then the day is recounted for pay and lessons left.'", "' · changes are saved at once, then the day is recounted for pay and lessons left.'"],
 ["<script id=\"l1651\">", CLEAN + "<script id=\"l1651\">"]
]);
