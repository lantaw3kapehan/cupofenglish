// 1461 · President QA 28 Oct (Misty: "don't show the President title anywhere teachers or staff can see it — stay low-key").
//   The words "the President" still appeared on screens Operations (Celine) and teachers use: the leave flow and its buttons
//   ("Operations checks → President approves", "File & send to President", "Waiting for the President"), the teacher's
//   "President only" message option, contract status ("Signed · waiting for the President"), Notices list sender name,
//   Team & access role chip on Misty's row, the Source option "President" in a new case, Wallets / Forecast / Sales notes for
//   Operations, and the Performance ranking notes. They now read "management" — the same designation Team Chat uses (1451).
//   Display text only: stored values (T-LEAVE stages, case Source "President", message to:'President') are unchanged, and the
//   Source option keeps value="President" so ACTIONS rows are written exactly as before.
//   Left as is on purpose: the contract document itself (legal signatory capacity), the opt-in memo line
//   "By Authority of the President", and text only Misty sees (isPres branches).
const fs = require('fs'), file = process.argv[2];
const R = [
[
"'Only the President can open this.'",
"'Only management can open this.'",
1
],
[
"'The President marks pay as paid. Send the payslip from here.'",
"'Management marks pay as paid. Send the payslip from here.'",
1
],
[
"'Waiting for the President'",
"'Waiting for management'",
1
],
[
"Operations checks · the President approves · saved in T-LEAVE",
"Operations checks · management approves · saved in T-LEAVE",
2
],
[
"→ the President approves → the teacher sees it in the app",
"→ management approves → the teacher sees it in the app",
1
],
[
"Sent to the President <span class=\"c\">",
"Sent to management <span class=\"c\">",
1
],
[
"'File & send to President'",
"'File & send to management'",
1
],
[
"Mark checked · raise to the President",
"Mark checked · raise to management",
1
],
[
"goes to the President for approval",
"goes to management for approval",
1
],
[
"Only the President approves or declines.",
"Only management approves or declines.",
1
],
[
"Raise it to the President anyway?",
"Raise it to management anyway?",
1
],
[
"then the President approves · you see the status here",
"then management approves · you see the status here",
1
],
[
"'Operations checks', 'President approves',",
"'Operations checks', 'Management approves',",
1
],
[
"(r.to === 'President' ? 'To the President only'",
"(r.to === 'President' ? 'Private · management only'",
1
],
[
"/^cupofenglish$/i.test(String(n)) ? 'President' : String(n)",
"/^cupofenglish$/i.test(String(n)) ? 'Management' : String(n)",
1
],
[
"onclick=\"tmTo(this)\">President only</button>",
"onclick=\"tmTo(this)\">Management only</button>",
1
],
[
"Operations and the President see it in the app",
"Operations and management see it in the app",
2
],
[
"'Only the President sees it (private)'",
"'Only management sees it (private, not Operations)'",
1
],
[
"tell the President in Messages",
"tell management in Messages",
1
],
[
"'Signed · waiting for the President'",
"'Signed · waiting for management to countersign'",
1
],
[
"'Signed ✓ · the President will countersign'",
"'Signed ✓ · management will countersign'",
1
],
[
"Only the President records refunds.",
"Only management records refunds.",
1
],
[
"<span class=\"mute small\">President only · loading…</span>",
"<span class=\"mute small\">Private · loading…</span>",
1
],
[
"balances recorded in this app · President only</div>",
"balances recorded in this app · private</div>",
1
],
[
"'Wallets are for the President only.'",
"'Wallets are not part of this account.'",
1
],
[
"Sales, costs and net are for the President. Payroll",
"Sales, costs and net are not part of this account. Payroll",
1
],
[
"These figures are kept for the President; Payroll",
"These figures are not part of this account; Payroll",
1
],
[
"'The forecast is for the President only.'",
"'The forecast is not part of this account.'",
1
],
[
"that month, not the President</span>",
"that month, not management</span>",
1
],
[
"no total, or the President</td>",
"no total, or management</td>",
1
],
[
"units, or the President: not ranked.",
"units, or management: not ranked.",
2
],
[
"units this month, or the President.</p>",
"units this month, or management.</p>",
1
],
[
"the facts behind each score stay with the President",
"the facts behind each score stay with management",
2
],
[
"Monthly QA (President) <b",
"Monthly QA (management) <b",
1
],
[
"e(p.president ? 'President' : ROLE[p.role] || p.role)",
"e(p.president ? 'Management' : ROLE[p.role] || p.role)",
1
],
[
"' (President only)' : ''",
"' (management only)' : ''",
1
],
[
"<select id=\"cSo\" class=\"in-t\">${opts(L.source,'Operations')}</select>",
"<select id=\"cSo\" class=\"in-t\">${opts(L.source,'Operations').replace('<option>President</option>','<option value=\"President\">Management</option>')}</select>",
1
]
];
let s = fs.readFileSync(file, 'utf8');
for (const [a, b, n] of R) {
  const k = s.split(a).length - 1;
  if (k !== n) { console.error('1461: expected ' + n + ' match(es), found ' + k + ' for: ' + a.slice(0, 100)); process.exit(1); }
  s = s.split(a).join(b);
}
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [["/* 1411 (Misty 23:27)", "/* 1461 · no \"President\" title where Operations or teachers can see it (display only) */\n/* 1411 (Misty 23:27)"]]);
