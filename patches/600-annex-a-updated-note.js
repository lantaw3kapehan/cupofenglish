// 22 Oct · Misty: Annex A still says "log in 30 minutes before … screenshots"; the time-in is now 30–40 minutes in the app.
// Annex A stays word for word (teachers signed it), and Addendum No. 1 Clause 1.5 now expressly replaces those parts.
// The app shows a note above Annex A pointing to what changed.
require('../tools/lib.js')(process.argv[2], [
[`h += '<div class="text">' + md(d.body) + '</div>';`,
 `if(d.kind === 'annex_a') h += '<div class="note" style="margin:0 0 12px"><b>Updated by Addendum No. 1 (Clause 1.5).</b> Time-in is now in the app: it opens 40 minutes before your first class and is on time at least 30 minutes before, with one screenshot showing the student code only; for each later class tap <b>I\\'m in</b> (Clauses 2.2–2.3). Operations sends student reminders; you send them when Operations is off (2.8). Amounts follow Clause 4.1. The text below is the Annex A you signed.</div>';
    h += '<div class="text">' + md(d.body) + '</div>';`],
]);
