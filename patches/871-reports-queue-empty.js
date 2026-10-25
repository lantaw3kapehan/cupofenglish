// 871: Parent reports › Monthly feedback (audit #12). "All reports checked. Nice work." showed while other stages still had
//      reports being made or teachers still to send feedback. Each queue now has its own empty message, followed by what is
//      still open in the other stages, e.g. "Nothing waiting for your check in this queue · 3 PDFs still being made · 2 waiting for teachers".
// · Counts come from the same lists the tabs already use (chk, sent, ret, RP.making, RP.waiting). No status logic changed.
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function renderReports(){\nif(!RP || !$('v-reports')) return;",
   "function rpEmpty870(f, nChk, nSent, nRet, nMk, W){\nconst nW = W == null ? null : W.length, pl = (n, a, b) => n + ' ' + (n === 1 ? a : b);\nconst head = { check: 'Nothing waiting for your check in this queue', sent: 'No reports sent to parents yet this month', ret: 'No reports returned to teachers', making: 'No PDFs being made right now', wait: nW == null ? 'Still checking which teachers have not sent feedback…' : 'Every teacher has sent feedback for this month', all: 'No feedback reports for this month yet' }[f] || 'None.';\nconst o = [];\nif(f !== 'check' && nChk) o.push(pl(nChk, 'report to check', 'reports to check'));\nif(f !== 'making' && nMk) o.push(pl(nMk, 'PDF still being made', 'PDFs still being made'));\nif(f !== 'wait' && nW) o.push(pl(nW, 'waiting for the teacher', 'waiting for teachers'));\nif(f !== 'ret' && nRet) o.push(pl(nRet, 'returned to the teacher', 'returned to teachers'));\nif(f !== 'wait' && nW == null) o.push('feedback still loading');\nif(!o.length && f === 'check' && nSent) return 'All reports for this month are checked and sent. Nice work.';\nreturn esc(head) + (o.length ? ' · ' + esc(o.join(' · ')) : '');\n}\nfunction renderReports(){\nif(!RP || !$('v-reports')) return;"],
  ["<div class=\"empty\">${RP_F==='check'?'All reports checked. Nice work.':'None.'}</div>",
   "<div class=\"empty\">${rpEmpty870(RP_F, chk.length, sent.length, ret.length, (RP.making||[]).length, RP.waiting)}</div>"],
  ["|| '<div class=\"empty\">None.</div>') + `</section>`;",
   "|| '<div class=\"empty\">' + rpEmpty870(RP_F, chk.length, sent.length, ret.length, (RP.making||[]).length, RP.waiting) + '</div>') + `</section>`;"]
]);
