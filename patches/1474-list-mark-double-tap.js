// 1474 · Operations QA 28 Oct (Misty's priority 4: "prevent duplicate submissions"; accurate statuses).
//   To do › Do next: "Mark as sent" on a renewal line saves at once and the list redraws, so the next line moves up under the
//   pointer. A double-click (or a quick second tap) therefore marked TWO different students as "Reminder sent" — in the
//   Operations preview a double-click on the first renewal line wrote mgmtRenewal for ST-…-130 and for the next student, ST-…-290,
//   whose parent was never sent anything. The same pattern applies to the trial follow-up "Message sent" button (fuQuick), the
//   Celebrate "Mark as sent" (celMark) and the parent report "Mark as sent" (rpMark).
//   Now a second tap on any of these one-tap list marks within 0.9 s of the first one (or the second click of a double-click) is
//   ignored, wherever it lands. A normal single tap, and marking the next line a moment later, work exactly as before.
//   Sheets' Save / Send buttons are covered separately (1464). No data, permission or wording changes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1474 · one-tap list marks (Mark as sent, Message sent): a quick second tap never marks the next line */\n" +
   "(function(){\n" +
   "  if(window.__1474) return; window.__1474 = 1;\n" +
   "  var RX = /^\\s*(renQuick|fuQuick|celMark|rpMark)\\(/, last = 0;\n" +
   "  document.addEventListener('click', function(e){\n" +
   "    var b = e.target && e.target.closest && e.target.closest('button[onclick]'); if(!b || !RX.test(b.getAttribute('onclick') || '')) return;\n" +
   "    var now = Date.now();\n" +
   "    if(e.detail > 1 || now - last < 900){ e.stopImmediatePropagation(); e.preventDefault(); return; }\n" +
   "    last = now; }, true);\n" +
   "})();\n" +
   "</script>\n</body>\n</html>"]
]);
