// 992: (Misty, 25 Oct 19:25) "for Owen, sub classes … not accounted on the lesson summary … there is no OTHER TEACHERS LESSON
//      on lesson summary" · "all previous sub lessons were not included in lesson summary … every lesson count, this is money"
// What was found (read-only check of the database copy of the sheet):
// · Substitute classes are recorded in TC&SUB (type "Sub") and counted in ACTIVE › SUB CLASS, which the sheet already adds to
//   TOTAL FINISHED (and so to lessons left). The app's lesson summary used that total, but its month-by-month history only shows
//   each teacher's own DAILY lessons and had no "Other-teacher lessons" line, so substitute lessons looked missing.
// · Owen (ST-2026-047) and Austin (ST-2026-032) had their first substitute class today; ACTIVE › SUB CLASS still shows 0 for
//   both, so the sheet has not counted today's substitutes yet (see the note to Misty about the SUB CLASS formula).
// Change (app, lesson summary picture/PDF and the sheet view): a line "Other-teacher lessons (substitute classes) ·
// 其他教师授课课时" under the month history, with the substitute lessons counted in this package (ACTIVE › SUB CLASS of
// every teacher row in the package), so the months + this line add up to "Lessons Completed". Totals are not changed here.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["`; }).join('')}</table>\n<div style=\"margin-top:14px;font-size:13px;line-height:1.5\">${over ?",
   "`; }).join('')}${(() => { const sb = C.sub != null ? n1(rows0.reduce((a, x) => a + (+x[C.sub] || 0), 0)) : 0; return `<tr style=\"border-top:1px dashed #BFDCDC\"><td style=\"padding:6px 0 4px\">Other-teacher lessons (substitute classes)<div style=\"font-size:11px\">其他教师授课课时（代课）</div></td><td style=\"text-align:right;padding-right:10px\">${sb}</td><td><div style=\"height:8px;border-radius:4px;background:#E6F4F4\"><div style=\"width:${Math.round(Math.min(sb, mx) / mx * 100)}%;height:100%;border-radius:4px;background:#8FCFCF\"></div></div></td></tr>`; })()}</table>\n<div style=\"margin-top:14px;font-size:13px;line-height:1.5\">${over ?"]
]);
