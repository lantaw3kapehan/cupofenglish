// 860: (audit #10) Performance mixes numbers from different periods. Each number now says which period and how many it counts:
//  · Header: "Each number has its own period" + a closed "What each number covers" list (QA = each teacher's latest evaluation,
//    on-time / feedback / homework = this month so far, compliance = the class-record month, peer reviews = by review round).
//  · Team QA average: "<period> round · n evaluations" (it is the number of QA rows in that round, not teachers).
//  · Teacher rows: "last evaluated · <period>", "x of y time-ins", "<Mon> so far" on feedback / homework, compliance chip "· n classes".
//  · Peer reviews: "sent in <Month> · by date sent", "still waiting · all rounds", "open class reviews · all rounds".
//  · QA by domain: says when the latest evaluations come from different periods.
//  · Teacher Excellence: "How this score is made" — the missing-data treatment exactly as coe_kpi_calc does it. Weights/rules unchanged.
require('../tools/lib.js')(process.argv[2], [
  // header + "What each number covers"
  ['QA evaluations (QA-DATA) and ${esc(PF.month)} KPIs · tap a teacher for the full page</div></div>',
   'Each number has its own period · tap a teacher for the full page</div>${pfWinHtml(T)}</div>'],
  ['function pfSet(f){ PF_F = f; renderPerf(); }',
   'function pfSet(f){ PF_F = f; renderPerf(); }\n' +
   "function pfWinHtml(T){ const ev = T.filter(t => t.latest).map(t => t.latest.period), per = [...new Set(ev)], md = new Date(Date.now() + 8 * 3600e3), cur = md.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }), mo = String(PF.month || '');\n" +
   "const sofar = mo === cur ? esc(mo.split(' ')[0].slice(0, 3)) + ' 1–' + md.getUTCDate() + ' (month so far)' : esc(mo);\n" +
   "return '<details class=\"pf-win\" style=\"margin:0 0 12px;font-size:13px;color:var(--ink2,#55526E)\"><summary style=\"cursor:pointer;font-weight:600\">What each number covers</summary><ul style=\"margin:6px 0 0;padding-left:18px;line-height:1.55\">'\n" +
   "+ '<li><b>QA score and domains I–V</b> · each teacher\\'s <b>latest</b> QA evaluation, so periods can differ by teacher' + (per.length ? ' (' + (per.length === 1 ? 'all ' + esc(per[0]) : per.length + ' different periods') + ')' : '') + ' · ▲▼ compare with that teacher\\'s previous evaluation · ' + ev.length + ' of ' + T.length + ' teachers evaluated</li>'\n" +
   "+ '<li><b>Team QA average</b> · one QA round (the month the evaluation is for) · the count is evaluations in that round</li>'\n" +
   "+ '<li><b>On-time</b> · ' + sofar + ' · daily time-ins (not class time-ins) · \"x of y\" = on time of the time-ins recorded</li>'\n" +
   "+ '<li><b>Feedback · Homework</b> · ' + sofar + ' · progress checks written and homework marked, by the date saved</li>'\n" +
   "+ '<li><b>Compliance</b> · ' + esc(PF.recMonth || mo) + ' · from the class record (time-in, video, homework, notes) · % of that teacher\\'s recorded classes</li>'\n" +
   "+ '<li><b>Peer reviews</b> · by review round (the month a review counts for) · \"sent\" counts reviews by the date they were sent</li>'\n" +
   "+ '<li><b>Career ladder</b> · lifetime units · <b>Teacher Excellence</b> · its own month, open it for how the score is made</li></ul></details>'; }"],
  ['Team average · ${esc(tm0.period)} · ${tm0.n} teachers evaluated', 'Team QA average · ${esc(tm0.period)} round · ${tm0.n} evaluation${tm0.n === 1 ? \'\' : \'s\'}'],
  ['<div class="small mute">${esc(e.period)}</div>', '<div class="small mute">last evaluated · ${esc(e.period)}</div>'],
  ['<span>on time${t.timeIns ? \' · \' + t.onTime + \' of \' + t.timeIns : \'\'}</span>', '<span>on time${t.timeIns ? \' · \' + t.onTime + \' of \' + t.timeIns + \' time-ins\' : \' · no time-ins yet\'}</span>'],
  ['<span>feedback written</span>', '<span>feedback written · ${esc(String(PF.month || \'\').slice(0, 3))} so far</span>'],
  ['<span>homework marked</span>', '<span>homework marked · ${esc(String(PF.month || \'\').slice(0, 3))} so far</span>'],
  ['Compliance ${recScore(t.rec)}%</span>', 'Compliance ${recScore(t.rec)}% · ${t.rec.classes} class${t.rec.classes === 1 ? \'\' : \'es\'}</span>'],
  // peer reviews
  ['<span>reviews sent this month</span>', '<span>reviews sent in ${esc(new Date(Date.now()+8*3600e3).toLocaleDateString(\'en-GB\',{month:\'long\',timeZone:\'UTC\'}))} · by date sent</span>'],
  ['<span>still waiting</span>', '<span>still waiting · all rounds</span>'],
  ['<span>open class reviews</span>', '<span>open class reviews · all rounds</span>'],
  // QA by domain
  ["latest evaluations (' + E.length + ')</span>", "latest evaluation of ' + E.length + ' teachers' + (() => { const P = [...new Set(E.map(t => t.latest.period))]; return P.length > 1 ? ' · from ' + P.length + ' different periods' : P.length ? ' · ' + esc(P[0]) : ''; })() + '</span>"],
  // Teacher Excellence · management sheet
  ["+ `<p class=\"small mute\" style=\"margin-top:12px\">Quality 35 (",
   "+ `<details class=\"small\" style=\"margin-top:12px\"><summary style=\"cursor:pointer\"><b>How this score is made</b> · missing data</summary><ul class=\"mute\" style=\"margin:6px 0 0;padding-left:18px;line-height:1.5\">"
   + "<li>Four parts: Quality 35 · Reliability 35 · Progress 15 · Trust 15.</li>"
   + "<li>Inside a part, a measure with no data that month is <b>skipped</b>, not counted as 0; the measures that have data share the part.</li>"
   + "<li>A part with no data at all is <b>left out</b>, and the total is re-scaled over the parts that remain (for example, no Trust data: the total is out of the other 85 weight points, scaled to 100).</li>"
   + "<li>Attendance, class videos and demerits start at 100 and go down only when a record is found, so <b>no record counts as full marks</b>, not as missing.</li>"
   + "<li>QA uses the teacher's latest evaluation dated before the month ends, so it can be from an earlier month (see the QA line in the facts). Peer reviews received count only from 2 reviews; peer reviews given count once one is sent that month (or after the month ends).</li>"
   + "<li>No total (no data in any part), under ${d.min} units, or the President: not ranked.</li></ul></details>`\n      + `<p class=\"small mute\" style=\"margin-top:12px\">Quality 35 ("],
  // Teacher Excellence · teacher's own "How it works"
  ['A part with no data that month is left out, not counted as zero.', 'A part with no data that month is left out, not counted as zero, and the other parts are scaled up. Attendance, class videos and demerits count as full marks when there is no record.'],
]);
