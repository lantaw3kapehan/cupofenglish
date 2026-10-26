# Paste · 25 Oct · Parent report PDF names the month of the classes (October), not the due month (November)

**Where:** the **ACADEMIC PERFORMANCE & QUALITY MANAGEMENT SYSTEM** spreadsheet → Extensions › Apps Script → the file that has
`autoSaveReports` (StudentReport.gs). Paste at the **very bottom** of that file.

**What it does:** the feedback system names each cycle after the month it is due (opens 25 Oct, due 9 Nov → "November 2026").
While a parent-report PDF is being made, this paste changes only the *words on the PDF*: wherever the top of the STUDENT REPORT
page shows the cycle month (the title "NOVEMBER STUDENT PROGRESS REPORT" and the Reporting period "November 2026") it shows the
month before ("OCTOBER …", "October 2026"). Right after the PDF is made, the cells get their original formulas back.
Nothing else changes: FEEDBACK DATA, the cycle keys, the REPORT FILES list, the Drive folder and the file names stay as they are.

```javascript
// 25 Oct · Parent report PDF shows the month of the classes (cycle month − 1). Safe to paste once.
(function () {
  if (typeof reportPdfBlob_ !== 'function' || reportPdfBlob_.__cls25) return;
  var f0 = reportPdfBlob_;
  var EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var w = function (ss, sh) {
    var saved = [];
    try {
      var v = sh.getRange('C2').getValue(), key = v instanceof Date ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM') : String(v).trim();
      var m = key.match(/^(\d{4})-(\d{2})/);
      if (m) {
        var mi = Number(m[2]) - 1, pi = (mi + 11) % 12, cur = EN[mi], prev = EN[pi];
        var py = pi === 11 ? Number(m[1]) - 1 : Number(m[1]);
        var nr = Math.min(14, sh.getLastRow()), nc = sh.getLastColumn(), rg = sh.getRange(1, 1, nr, nc);
        var shown = rg.getDisplayValues(), forms = rg.getFormulas();
        for (var r = 0; r < nr; r++) for (var c = 0; c < nc; c++) {
          if (r === 1 && c === 2) continue;                                   // C2 = the cycle key itself: never touched
          var t = String(shown[r][c] || '');
          if (!t || !new RegExp('\\b' + cur + '\\b', 'i').test(t)) continue;
          var nt = t.replace(new RegExp('\\b' + cur.toUpperCase() + '\\b', 'g'), prev.toUpperCase())
                    .replace(new RegExp('\\b' + cur + '\\s+' + m[1] + '\\b', 'g'), prev + ' ' + py)
                    .replace(new RegExp('\\b' + cur + '\\b', 'g'), prev);
          if (nt === t) continue;
          var cell = sh.getRange(r + 1, c + 1);
          saved.push({ cell: cell, f: forms[r][c], v: forms[r][c] ? null : cell.getValue() });
          cell.setValue(nt);
        }
        if (saved.length) SpreadsheetApp.flush();
      }
    } catch (e) { console.warn('cls25 label', e); }
    try { return f0.apply(this, arguments); }
    finally {
      saved.forEach(function (x) { try { if (x.f) x.cell.setFormula(x.f); else x.cell.setValue(x.v); } catch (e) { console.warn('cls25 restore', e); } });
      if (saved.length) SpreadsheetApp.flush();
    }
  };
  w.__cls25 = 1;
  reportPdfBlob_ = w;
})();
function zzClsMonth25() { console.log('Parent report month = classes month: ' + (typeof reportPdfBlob_ === 'function' && reportPdfBlob_.__cls25 ? 'ON' : 'OFF')); }
```

## Then
1. Save (Ctrl+S). Pick **zzClsMonth25** next to Debug → **Run**. The log says `Parent report month = classes month: ON`.
2. No deployment is needed (this script runs on its own hourly trigger).
3. **New** PDFs from now on say OCTOBER. The PDFs already made for this cycle (Una and Abby) keep "NOVEMBER": to remake one,
   return it to the teacher in the app and let the teacher send the feedback again — or ask Claude to add a "remake PDF" button.

## If something looks wrong
Delete the pasted block and save. The cells are restored after every PDF, so the sheet itself never keeps the changed words.
