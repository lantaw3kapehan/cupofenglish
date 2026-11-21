// 2605 (audit QA-21/22, Misty 13:28 "OK" to the mock): buttons say what they do, and the briefing's working-out folds away.
// Finance briefing: "Update" → "Update bank balance" / "Update yuan rate" / "Update due dates"; "Open" → "View 13th-month breakdown";
// "Noted" → "Mark as noted"; every decision button's accessible name includes the item. The forecast line folds into "How this is worked out".
// Training: "+ Schedule" → "Schedule a training", "+ Coaching" → "Record coaching", "Videos & quizzes" → "Training videos and quizzes",
// "✎ Edit records" → "Edit training records". Nothing else changes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["data-label=\"' + E(text.replace(/<[^>]+>/g, '')) + '\">' + { approve: 'Approve', notyet: 'Not yet', noted: 'Noted' }[k] + '</button>'; }).join('');",
   "data-label=\"' + E(text.replace(/<[^>]+>/g, '')) + '\" aria-label=\"' + E({ approve: 'Approve', notyet: 'Not yet', noted: 'Mark as noted' }[k] + ': ' + text.replace(/<[^>]+>/g, '')) + '\">' + { approve: 'Approve', notyet: 'Not yet', noted: 'Mark as noted' }[k] + '</button>'; }).join('');   /* 2605 */"],
  ["<button class=\"bz-btn gh\" onclick=\"fbz2084edit(\\'' + key + '\\')\">Update</button>';",
   "<button class=\"bz-btn gh\" onclick=\"fbz2084edit(\\'' + key + '\\')\">' + ({ phpBank: 'Update bank balance', rate: 'Update yuan rate', bir: 'Update due dates' }[key] || 'Update') + '</button>';   /* 2605 */"],
  ["<button class=\"bz-btn gh\" onclick=\"go(\\'payroll\\')\">Open</button>", "<button class=\"bz-btn gh\" onclick=\"go(\\'payroll\\')\">View 13th-month breakdown</button>"],
  ["'<div style=\"font-size:12px;color:#6C6883;margin-top:6px\">Forecast: received '", "'<details style=\"font-size:12px;color:#6C6883;margin-top:6px\"><summary style=\"cursor:pointer\">How this is worked out</summary>Forecast: received '"],
  ["Sales & costs › \\'if no more sales\\' leaves out the still-expected sales.</div></div>'; }   /* 2589 */", "Sales & costs › \\'if no more sales\\' leaves out the still-expected sales.</details></div>'; }   /* 2589 · 2605 folded */"],
  ["<button class=\"btn\" onclick=\"trSched()\">+ Schedule</button> <button class=\"btn teal\" onclick=\"trCoach()\">+ Coaching</button> <button class=\"btn ghost\" onclick=\"trList()\">Videos &amp; quizzes</button>",
   "<button class=\"btn\" onclick=\"trSched()\">Schedule a training</button> <button class=\"btn teal\" onclick=\"trCoach()\">Record coaching</button> <button class=\"btn ghost\" onclick=\"trList()\">Training videos and quizzes</button>"],
  ["coming: ['Coming up', coming, '<button class=\"btn\" onclick=\"trSched()\">+ Schedule</button>']", "coming: ['Coming up', coming, '<button class=\"btn\" onclick=\"trSched()\">Schedule a training</button>']"],
  ["'<button class=\"btn teal\" onclick=\"trCoach()\">+ Coaching</button>'];", "'<button class=\"btn teal\" onclick=\"trCoach()\">Record coaching</button>'];"],
  ["const t = window._trEdit ? '✓ Done editing' : '✎ Edit records';", "const t = window._trEdit ? 'Done editing' : 'Edit training records';"],
]);
