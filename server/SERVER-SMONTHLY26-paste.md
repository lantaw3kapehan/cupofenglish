# Paste · 26 Oct · Google's lesson sheet (S-MONTHLY) counts only TAUGHT classes, like the app's database

**Approved by Misty 26 Oct 17:54** ("continue with the paused items").

## What S-MONTHLY is, and who uses it
- **Written by:** the **Excel Daily** script project (the one bound to the COE DATABASE spreadsheet), function
  `archiveStudentMonthlyHistorySnapshot_`, on a trigger every 6 hours (Last Synced 06:55 · 12:58 · 19:15 …). Each run re-reads
  the calendar for the **current month** and writes one row per student + teacher + book.
- **Read by:**
  - **ACTIVE** month columns: SUMPRODUCT formulas over S-MONTHLY › Total Hours, matched on code + teacher (+ course).
    These give the sheet's lessons finished / left.
  - **S-OVERVIEW**, which is rebuilt from S-MONTHLY.
  - The app's Google script: the student page lesson history, the "classes since the sheet's last update" gap, and COURSE labels.
  - The database: copied every 30 min. Since today the app counts **October onward from the calendar itself**, and uses
    S-MONTHLY only for months before October.
- **Not read by pay.** PAYROLL's units come from the month's **-DAILY** tab (regular) and **TC&SUB** (sub / trial); see
  `pySplitF_` in the Excel Daily script. T-DASH's current units match the calendar, not S-MONTHLY (26 Oct, real data):

  | Teacher | T-DASH regular units (pay) | S-MONTHLY Oct total | Calendar Oct incl. today |
  |---|---|---|---|
  | Pam | 63.5 | 64.5 | 63.5 |
  | Kat | 72.5 | 74.0 | 72.5 |
  | Dezza | 54 | 54.5 | 54 |
  | Misty | 10 | 12 | 10 |

  So changing S-MONTHLY **does not change any teacher's pay** (nor ranks, which use T-DASH / T-HISTORY).

## What is wrong today (October)
1. A run counts **every class of today**, including classes later that evening (James's 17:00 class was counted at 12:58).
2. Rows are only ever added or updated, **never cleared**. A book that changed mid-month, or a row from a bad run, stays forever:
   Mandy "DKEnglish" (3 Oct), Annie (Pam) "LongVowels" (19 Oct), 164 "(Unmatched)" rows from 4 Oct 06:55. These rows add to
   ACTIVE's month totals on the sheet.
3. "(Unmatched)" is written whenever the teacher list could not be read; one bad run on 4 Oct 06:55 made 164 of them.

## What this paste changes (Excel Daily project only; nothing else)
1. **Only taught classes count:** for the current month, a class counts once it has **ended** (cancelled classes are still
   counted in "Lessons Cancelled" as before). Trial / Sub classes stay excluded, 25 min = 0.5 and 50 min = 1, and the renewal
   rule ("Option A") is unchanged.
2. **The month is rebuilt:** rows of the month that the calendar no longer produces are set to **0 / 0 / 0**, with Last Synced
   updated. They are not deleted, so no rows move and no formula ranges change.
3. **No more "(Unmatched)":** when the title's teacher is not in T-DASH, the teacher is taken from the title's last part (the
   app uses the same rule). If the teacher list cannot be read at all, the run **stops without writing anything**.
4. **Preview first:** `zzSMonthlyPreview26()` shows every row it would change (old → new) and writes nothing.

**Not changed:** September and older months. They are only rebuilt if someone runs "Backfill a Month Range" from the sheet
menu, and that is not needed. Two September leftovers remain: Nico ST-2025-127 "OD2" and Zoe ST-2026-023 "ShortVowels".

## Step 1 · Paste at the very bottom of the LAST file (TrialReport.gs) in the **Excel Daily** project
Open the COE DATABASE spreadsheet → Extensions › Apps Script (the project is called **Excel Daily**), click **TrialReport.gs**,
press Cmd+↓, Enter twice, and paste:

```javascript
// 26 Oct · S-MONTHLY: only taught (ended) classes · the month is rebuilt (stale rows → 0) · no "(Unmatched)" · preview first. Safe to paste once.
function smh26Snapshot_(archiveSource, forDate, dry) {
  const ss = SpreadsheetApp.getActiveSpreadsheet(), sheet = ss.getSheetByName(STUDENT_MONTHLY_HISTORY_SHEET_NAME);
  if (!sheet) throw new Error('"' + STUDENT_MONTHLY_HISTORY_SHEET_NAME + '" sheet was not found.');
  if (!dry) ensureStudentMonthlyHistoryHeaders_(sheet);
  const tz = ss.getSpreadsheetTimeZone(), now = new Date();
  const monthStart = new Date(forDate.getFullYear(), forDate.getMonth(), 1), naturalMonthEnd = new Date(forDate.getFullYear(), forDate.getMonth() + 1, 1);
  const isCurrentMonth = forDate.getFullYear() === now.getFullYear() && forDate.getMonth() === now.getMonth();
  const monthEnd = isCurrentMonth ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) : naturalMonthEnd;
  const monthLabel = Utilities.formatDate(monthStart, tz, 'MMMM yyyy'), monthKey = Utilities.formatDate(monthStart, tz, 'yyyy-MM');
  const teacherNames = shGetTeacherNamesLive_(ss);
  if (!teacherNames.length) throw new Error('Teacher list (T-DASH B4:B200) could not be read — nothing written.');
  const keyFor = (code, teacher, book) => smhNormalize_(code) + '|' + smhNormalize_(teacher) + '|' + smhNormalize_(book);
  const fromTitle = title => { const p = String(title || '').replace(/[–—]/g, '-').replace(/\s+X\s*$/i, '').replace(/[-\s](TC|SC)\s*$/i, '').split('-').map(s => s.trim()).filter(Boolean);
    const last = p.length >= 3 ? p[p.length - 1] : ''; if (!/^[A-Za-z][A-Za-z .']{1,30}$/.test(last)) return '';
    const hit = teacherNames.find(t => smhNormalize_(t) === smhNormalize_(last)); return hit || (last.charAt(0).toUpperCase() + last.slice(1)); };
  const rows = {};
  const activeSheet = ss.getSheetByName('ACTIVE'), renewalByKey = {};
  if (activeSheet) activeSheet.getDataRange().getValues().forEach(r => { const c = String(r[0] || '').trim(), t = String(r[3] || '').trim(), av = r[47]; if (c && av instanceof Date) renewalByKey[smhNormalize_(c) + '|' + smhNormalize_(t)] = av; });
  getMergedEvents_(monthStart, monthEnd).forEach(event => {
    const title = event.getTitle(); if (shGetEventType_(title)) return;
    const codeMatch = /ST-\d{4}-\d{3}/i.exec(title); if (!codeMatch) return; const code = codeMatch[0].toUpperCase();
    const teacher = shFindTeacherInTitle_(title, teacherNames) || fromTitle(title) || '(Unmatched)';
    const parsed = smhParseNameAndBook_(title, code, teacher !== '(Unmatched)' ? teacher : '');
    const name = parsed.name || code, book = parsed.book || '(Unmatched)', key = keyFor(code, teacher, book);
    if (!rows[key]) rows[key] = { code, name, teacher, book, held: 0, hours: 0, cancelled: 0 };
    const rec = rows[key]; if (parsed.name) rec.name = parsed.name;
    const isCancelled = shIsCancelledTitle_(title) || (event.isCancelled && event.isCancelled()) || (event.getMyStatus && event.getMyStatus() === CalendarApp.GuestStatus.NO);
    if (isCancelled) { rec.cancelled++; return; }
    if (event.getEndTime() > now) return;                                          // 26 Oct: counted once the class has ended
    const lessonHours = Math.round((event.getEndTime() - event.getStartTime()) / 60000 / 30) * 0.5; if (lessonHours <= 0) return;
    const rd = renewalByKey[smhNormalize_(code) + '|' + smhNormalize_(teacher)];
    if (rd && event.getStartTime().getFullYear() === rd.getFullYear() && event.getStartTime().getMonth() === rd.getMonth() && event.getStartTime() < rd) return;
    rec.held++; rec.hours += lessonHours;
  });
  const lastRow = sheet.getLastRow(), have = {}, changes = [];
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 8).getValues().forEach((r, i) => {
    if (!(r[0] instanceof Date) || Utilities.formatDate(r[0], tz, 'yyyy-MM') !== monthKey) return;
    have[keyFor(r[1], r[3], r[4])] = { row: i + 2, held: Number(r[5]) || 0, hours: Number(r[6]) || 0, cancelled: Number(r[7]) || 0, code: r[1], teacher: r[3], book: r[4] }; });
  const stamp = Utilities.formatDate(new Date(), tz, 'dd-MMM-yyyy HH:mm'), add = [];
  Object.keys(rows).forEach(k => { const r = rows[k], h = have[k], v = [monthStart, r.code, r.name, r.teacher, r.book, r.held, r.hours, r.cancelled];
    if (h) { if (h.held !== r.held || h.hours !== r.hours || h.cancelled !== r.cancelled) changes.push(r.code + ' · ' + r.teacher + ' · ' + r.book + ' : ' + h.hours + ' → ' + r.hours); if (!dry) { sheet.getRange(h.row, 1, 1, 8).setValues([v]); sheet.getRange(h.row, 9).setValue(stamp); } }
    else { if (r.hours || r.held || r.cancelled) changes.push(r.code + ' · ' + r.teacher + ' · ' + r.book + ' : new ' + r.hours); add.push(v.concat([stamp])); } });
  Object.keys(have).forEach(k => { if (rows[k]) return; const h = have[k]; if (!h.held && !h.hours && !h.cancelled) return;   // already 0
    changes.push(h.code + ' · ' + h.teacher + ' · ' + h.book + ' : ' + h.hours + ' → 0 (not in the calendar any more)');
    if (!dry) { sheet.getRange(h.row, 6, 1, 3).setValues([[0, 0, 0]]); sheet.getRange(h.row, 9).setValue(stamp); } });
  if (!dry) {
    if (add.length) sheet.getRange(sheet.getLastRow() + 1, 1, add.length, 9).setValues(add);
    const n = Math.max(sheet.getLastRow() - 1, 0);
    if (n > 0) { sheet.getRange(2, 1, n, 9).sort([{ column: 1, ascending: false }, { column: 2, ascending: true }]);
      sheet.getRange(2, 1, n, 1).setNumberFormat('mmmm yyyy'); sheet.getRange(2, 7, n, 1).setNumberFormat('0.0'); }
    SpreadsheetApp.flush();
    try { ss.toast('Student Monthly History updated for ' + monthLabel + ' (taught classes only): ' + changes.length + ' change(s).', archiveSource, 8); } catch (e) {}
  }
  return { month: monthLabel, rows: Object.keys(rows).length, changes: changes };
}
archiveStudentMonthlyHistorySnapshot_ = function (archiveSource, forDate) { return smh26Snapshot_(archiveSource, forDate, false); };
globalThis.archiveStudentMonthlyHistorySnapshot_ = archiveStudentMonthlyHistorySnapshot_;
/** Preview only: lists what the next run would change in this month's rows. Writes nothing. */
function zzSMonthlyPreview26() { const r = smh26Snapshot_('Preview', new Date(), true); console.log(r.month + ' · ' + r.rows + ' rows · ' + r.changes.length + ' change(s)\n' + r.changes.join('\n')); }
/** Runs it once now (the 6-hourly trigger then keeps using the new rule by itself). */
function zzSMonthlyApply26() { const r = smh26Snapshot_('Taught classes only', new Date(), false); console.log(r.month + ' · ' + r.changes.length + ' change(s) written\n' + r.changes.join('\n')); }
```

## Step 2 · Save (Cmd+S). Choose **zzSMonthlyPreview26** → **Run**. Nothing is written.
The log lists every change. On 26 Oct evening you should see roughly:
- `ST-2026-048 · Julia · DKEnglish : 1 → 0 (not in the calendar any more)`
- `ST-2023-086 · Pam · LongVowels : 0.5 → 0 …`
- `ST-2024-093 · Kat · … → 0`
- many `… · (Unmatched) · … : x → 0` lines (the 4 Oct rows)
- classes later today: `… : 4 → 3.5`, which goes back up once each class ends
- `ST-2022-004 · Misty · AcademicWriting`: check what it shows. The database counts 5 after today's 17:00 class; if the sheet
  still shows 4, send Claude the line.

If the list looks right, go to Step 3. If anything looks wrong, delete the pasted block and save. Nothing has changed.

## Step 3 · Choose **zzSMonthlyApply26** → **Run** once.
From now on the existing 6-hour trigger uses the new rule by itself. **No Deploy is needed** (this is the spreadsheet's own
script, not a web app).

## Undo
Delete the pasted block and save. The next 6-hourly run then writes the old way again (it re-counts today's later classes).
Rows set to 0 stay 0 until a class for that row appears again; that is correct, because they were not real lessons.
