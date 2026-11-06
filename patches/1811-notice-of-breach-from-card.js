// 1811: (Misty 6 Nov 16:44 "yes and let us do all") After charging on the leave card, one tap sends the notice of breach for each
//   case (Clause 5.1), filled in from the notice: what happened (date, lesson, student), the rule (Clause 2.9 / 4.1, or 2.10 for a
//   declined notice), the record (notice id, when it was filed, hours before the lesson, proof), what may follow, the service credit
//   and the deduction points for her rank (Clause 4.2). Uses coe-notice "new" (the teacher gets a phone alert, 5 days to explain;
//   a case never gets two notices). The card shows "Notices of breach sent: N of M".
const lib = require('../tools/lib.js'), file = process.argv[2];
const FN = "const LV1811_PTS = { 'Newly Hired': 2, 'Starting Teacher': 4, 'Newly Qualified': 6, 'Junior Teacher': 8, 'Senior Teacher': 10, 'Master Teacher': 10 };\n"
  + "async function lv1811send(id){ const x = LV && LV.rows.find(r => r.id === id), d = FD1806.dec && FD1806.dec[id]; if(!x || !d) return;\n"
  + "  const ids = String(d.ids || '').split(/,\\s*/).filter(Boolean), L = d.lessons || []; if(!ids.length) return toast('No cases to send');\n"
  + "  if(ids.length !== L.length) return toast('Some cases are missing · send these notices from Cases › the case');\n"
  + "  const rk = lv1800rank(x.teacher) || {}, pts = LV1811_PTS[rk.rank] || '', P = lv1795plan(x), dec = /^Declined/i.test(x.status || ''), yr = String(x.from || '').slice(0, 4), lodged = new Date(lv1795at(x.at)).toLocaleString('en-GB', { timeZone: 'Asia/Manila', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });\n"
  + "  if(!confirm('Send ' + ids.length + ' notice' + (ids.length === 1 ? '' : 's') + ' of breach to ' + tName(x.teacher) + '?\\n\\n' + L.map((l, i) => ids[i] + ' · ' + l.md + ' ' + l.hm + ' ' + l.name + ' · ' + l.k + ' ₱' + l.amount).join('\\n') + '\\n\\nShe gets a phone alert and has 5 calendar days to explain (Clause 5.1).')) return;\n"
  + "  toast('Sending…'); let ok = 0, err = '';\n"
  + "  for(let i = 0; i < ids.length; i++){ const l = L[i], p = P.find(q => q.md === l.md && q.hm === l.hm) || {};\n"
  + "    const n = { teacher: x.teacher, case_id: ids[i], subject: 'Teacher Class Cancellation', amount: l.amount, points: pts, final_notice: false,\n"
  + "      happened: yr + '-' + l.md + ' · ' + l.hm + ' lesson · ' + l.name,\n"
  + "      rule: dec ? 'Clause 2.10: a slot booked with a student is the Teacher’s confirmed schedule for that lesson and must be attended. Clause 4.1: cancelled, missed or absent lesson — excused ₱100 new / ₱300 regular, unexcused ₱300 / ₱500. “Excused” means Operations was notified in advance with a valid reason.'\n"
  + "        : 'Clause 2.9: if the Teacher cannot deliver an accepted lesson, the Teacher files a notice of unavailability in the App, with proof where available, at least four (4) hours before the lesson. Clause 4.1: cancelled, missed or absent lesson — excused ₱100 new / ₱300 regular, unexcused ₱300 / ₱500.',\n"
  + "      record: 'Notice of unavailability ' + id + ' (' + (x.type || 'notice') + ') filed in the App ' + lodged + ' PH' + (p.h != null ? ', ' + lv1795h(p.h) + ' before this lesson' : '') + '. Proof attached: ' + ((x.proof || []).length || 'none') + '. Status: ' + (x.status || '') + (x.note ? ' · Operations: ' + x.note : '') + (dec ? ' · The lesson was not taught (no “I’m in” and no video).' : '') + ' Decision: ' + l.k + ' (' + (d.tier || '') + ').',\n"
  + "      consequence: 'After your explanation, management decides in writing. A verified case brings the service credit (₱' + l.amount + ') and the deduction points for your rank (Addendum No. 1, Clauses 4.1–4.2), unless waived with good reason. A third case of the same kind in one calendar month may pause new lesson offers (Clause 5.2).' };\n"
  + "    try{ const r = await fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-notice', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'new', n }) }).then(r => r.json()); if(r && r.ok) ok++; else err = (r && r.error) || 'not sent'; }catch(e){ err = 'no answer'; } }\n"
  + "  d.notices = (+d.notices || 0) + ok; toast(ok === ids.length ? '✓ ' + ok + ' notice' + (ok === 1 ? '' : 's') + ' of breach sent to ' + tName(x.teacher) : ok + ' of ' + ids.length + ' sent · ' + err); lvSheet(id); }\n";
lib(file, [
  ["const LV1810_URL = ", FN + "const LV1810_URL = "],
  ["at: (d.at || '') + (d.by ? ' by ' + d.by : ''), ids: d.ids || '' }", "at: (d.at || '') + (d.by ? ' by ' + d.by : ''), ids: d.ids || '', raw: d }"],
  ["(done ? '<div class=\"lv95 ok\" style=\"margin-top:6px\">✓ Recorded: <b>' + esc(done.k) + '</b> · ' + esc(done.at) + (done.ids ? ' · ' + esc(done.ids) : '') + '</div>'",
   "(done ? '<div class=\"lv95 ok\" style=\"margin-top:6px\">✓ Recorded: <b>' + esc(done.k) + '</b> · ' + esc(done.at) + (done.ids ? ' · ' + esc(done.ids) : '') + '</div>'\n"
   + "      + (done.raw && done.ids ? (() => { const m = String(done.ids).split(/,\\s*/).filter(Boolean).length, s = +done.raw.notices || 0;   /* 1811 */\n"
   + "          return s >= m ? lv1795line('ok', '✓ Notices of breach sent: ' + s + ' of ' + m + ' · she has 5 calendar days to explain (Clause 5.1) · decide in More › Notices of breach')\n"
   + "            : lv1795line('bad', 'Notices of breach sent: ' + s + ' of ' + m + ' · Clause 5.1: send them before the credit is taken') + '<button class=\"btn sm teal\" style=\"margin-top:6px\" onclick=\"lv1811send(\\'' + esc(x.id) + '\\')\">Send notice' + (m - s === 1 ? '' : 's') + ' of breach (' + (m - s) + ')</button>'; })() : '')"],
]);
