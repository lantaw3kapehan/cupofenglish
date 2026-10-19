// 19 Oct · 290 · Teacher Excellence (Misty): renewals left out (students continue and change teachers); hours taught and hours opened count in Reliability;
// QA on the Performance screen's own scale (average / 5 × 100); demerits softer for the score only (×2, never below 40) — pay penalties stay as the contract says.
require('../tools/lib.js')(process.argv[2], [
  ["    L.push(['Renewals', `${n(f.renewals)} → ${n(p.renewals)}`]);\n",
   "    L.push(['Hours', `${n(f.units)} taught` + (f.hoursOffered != null ? ` · ${f.hoursOffered} offered (taught + open slots in T-AVAIL)` : '') + ` · team middle ${n(f.medianUnits)} → ${n(p.workload)}`]);\n"],
  ["    L.push(['Demerits', `${n(f.demerits)} point${f.demerits == 1 ? '' : 's'} → ${n(p.demerits)}`",
   "    L.push(['Demerits', `${n(f.demerits)} point${f.demerits == 1 ? '' : 's'} → ${n(p.demerits)} (score only · pay penalties as in the contract)`"],
  ["`<p class=\"small mute\" style=\"margin-top:12px\">Quality 40 · Progress 20 · Trust 20 · Reliability 20. Gold 85+ · Silver 70+ · Bronze 55+. Tap a teacher for the facts behind the score.",
   "`<p class=\"small mute\" style=\"margin-top:12px\">Quality 40 (QA % as on Performance, class visits) · Progress 20 (progress checks, notes, new books) · Trust 20 (trials enrolled, students still studying with us, recognitions) · Reliability 20 (time-ins, demerits, hours taught and opened). Renewals are not counted. Gold 85+ · Silver 70+ · Bronze 55+. # is this month's place, not the teacher rank (Junior, Senior…). Tap a teacher for the facts behind the score."]]);
