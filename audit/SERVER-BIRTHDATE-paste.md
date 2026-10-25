# Server paste · 25 Oct · "Edit student" never blanks a birthdate by accident (R1)

**Approved by Misty 25 Oct 15:34.** Already live: the database rule (step 2, applied 15:4x) and the app (step 4, Release B, COE_V 1181). Step 3 (edge function `coe`) was skipped on purpose: with step 2 and the app fix it adds nothing, and redeploying the 94 KB function by hand carries more risk than benefit. **Only step 1 (this Apps Script paste) is left — for Misty.**

**What it does**
When someone saves *Edit student* and leaves the birthdate alone, the app now sends the stored birthdate again plus a
"keep it" mark (`birthKeep: 1`). If the birthdate is empty and nobody tapped **Remove birthdate**, it also counts as
"keep it". With this paste, Google reads DATABASE › BIRTHDATE (column F) for that row **before** the save and puts the
same value and the same format (e.g. "April//2018") back **after** it. So nothing can blank it or change how it looks.
Only **Remove birthdate** in the app (`birthClear: 1`) can empty the cell. New students and new rows are not affected.

It works for both kinds of save: the direct save from the app, and the saves Google copies from the database queue
(SB_REPLAY). Both call `saveStudent`, the same as the earlier video pastes (`tVidDone`, … are wrapped the same way).

## Order (all three server parts first, then the app)
1. **Apps Script** — this paste (steps below).
2. **Database trigger** — run `audit/server-birthdate.sql` in the Supabase SQL editor. It adds one line to
   `writes_stuedit`: the database copy keeps the birthdate unless the save says Remove.
3. **Edge function `coe`** — apply `audit/server-birthdate.diff` to `server/coe.ts` and deploy `coe`. An empty
   birthdate on an edit is filled from the DATABASE copy and marked "keep it" before it goes into the queue.
4. **App** — patches `960-birthdate-save-safe.js` and `961-stuform-sync-open.js` (after 841).

Each step is safe on its own. Steps 1–3 change only one thing for today's app: emptying the date box no longer
removes a birthdate (it is kept). Removing one needs the app's new **Remove birthdate** (step 4), or doing it in the sheet.

## Step 1 · Paste at the very bottom of the last file

```javascript
// 25 Oct · R1 · Edit student: DATABASE › BIRTHDATE is kept unless the app says "Remove birthdate" (safe to paste once)
(function () {
  const f0 = globalThis.saveStudent;
  if (typeof f0 !== 'function' || f0.__bd25) return;
  const on = x => x === true || x === 1 || x === '1' || x === 'true';
  const BIRTH_COL = 6;   // DATABASE column F (BIRTHDATE)
  const w = function (token, f, row) {
    let keep = null;
    try {
      const r0 = Number(row) || 0;
      if (r0 > 3 && f && typeof f === 'object' && !on(f.birthClear) &&
          (on(f.birthKeep) || String(f.birth == null ? '' : f.birth).trim() === '')) {
        // use the same spreadsheet saveStudent writes to (change this line if your script opens it by ID)
        const sh = SpreadsheetApp.getActive().getSheetByName('DATABASE');
        const code = String(sh.getRange(r0, 1).getValue()).trim();
        if (code && code === String(f.code || '').trim()) {
          const c = sh.getRange(r0, BIRTH_COL);
          keep = { sh: sh, row: r0, code: code, v: c.getValue(), fm: c.getNumberFormat() };
        }
      }
    } catch (e) { console.warn('birthKeep read', e); keep = null; }
    const r = f0.apply(this, arguments);
    try {
      if (keep && r && r.ok !== false) {
        const sh = keep.sh, now = String(sh.getRange(keep.row, 1).getValue()).trim();
        if (now === keep.code) {   // the same student is still in that row
          const c = sh.getRange(keep.row, BIRTH_COL), v = c.getValue();
          const same = (v instanceof Date && keep.v instanceof Date) ? v.getTime() === keep.v.getTime() : String(v) === String(keep.v);
          if (!same) c.setValue(keep.v);
          if (c.getNumberFormat() !== keep.fm) c.setNumberFormat(keep.fm);
        }
      }
    } catch (e) { console.warn('birthKeep restore', e); }
    return r;
  };
  w.__bd25 = 1;
  globalThis.saveStudent = w;
})();
/** Run once: says whether the birthdate guard is on (reads nothing, writes nothing). */
function zzBirthGuard25() { console.log('saveStudent birthdate guard: ' + (globalThis.saveStudent && globalThis.saveStudent.__bd25 ? 'ON' : 'OFF')); }
```

## Step 2 · Save (Cmd+S), choose **zzBirthGuard25**, click **Run** — the log says "saveStudent birthdate guard: ON".
## Step 3 · Deploy › Manage deployments › pencil › New version › Deploy.

## Check afterwards (one student, 2 minutes)
1. Pick a student whose DATABASE birthdate shows as month and year (e.g. ST-2026-105 "April//2018").
2. In the app (after step 4): Students › that student › Edit details. The birthdate reads "April 2018 (month and year only)".
   Change only the city to the same city plus a space and back, or any other harmless field, and save.
3. Within a minute, DATABASE › BIRTHDATE still shows "April//2018" (same format). Version history shows no change to F.

**Things only Misty can confirm in the script**
- `SpreadsheetApp.getActive()`: if the script is not bound to the COE DATABASE spreadsheet, use the same
  `SpreadsheetApp.openById(...)` line that `saveStudent` uses.
- SB_REPLAY must call the save by name at the time it runs (`globalThis[fn]` / `this[fn]`), the same as the
  `tVidDone` wrapper in SERVER-MOVE25 expects. If it keeps its own list of functions made when the script loads, tell
  Claude: the wrapper then has to go into that list instead.
