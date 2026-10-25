// 874: Trials › a trial report (audit #15, behaviour of patch 808 kept). Copying or sharing the report picture also records
//      the report as sent to the parent (808). That was not visible before the tap. Now:
// · the link reads "Copy picture · also marks as sent" while the report is not marked yet (808's own condition),
//   and a one-line note under the links says so, and that "Mark as sent" records it without copying;
// · the toast after the automatic mark says "Picture copied · <student>'s trial report is now marked as sent";
// · the sent line in the report reads "… · marked when the picture was copied" instead of "… · picture".
// No undo is added: the app has no "unmark sent" operation for trial reports (mgmtTrialSent only) — flagged for Misty.
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["x.textContent = b === pic ? 'Copy picture instead' : b.textContent.trim();",
   "x.textContent = b === pic ? (w874 ? 'Copy picture · also marks as sent' : 'Copy picture instead') : b.textContent.trim();"],
  ["s.links.forEach(b => { const x = document.createElement('button');",
   "const w874 = !!(s.k === 'report' && window.__808 && typeof D !== 'undefined' && D && D.mgr && t.status !== 'Sent' && !t.sent);\n        s.links.forEach(b => { const x = document.createElement('button');"],
  ["r.appendChild(l); } });",
   "r.appendChild(l); if(w874){ const nt = document.createElement('div'); nt.className = 'small mute'; nt.style.cssText = 'grid-column:2/-1;margin-top:2px'; nt.textContent = 'Copying or sharing the picture also records the report as sent to the parent. Mark as sent records it without copying.'; r.appendChild(nt); } } });"],
  ["toast(x.student + \"'s trial report marked sent\")",
   "toast(how === 'picture' ? 'Picture copied · ' + x.student + \"'s trial report is now marked as sent\" : x.student + \"'s trial report marked as sent\")"],
  ["x.sent.how?' · '+esc(x.sent.how):''",
   "x.sent.how?' · '+esc(x.sent.how === 'picture' ? 'marked when the picture was copied' : x.sent.how):''"]
]);
