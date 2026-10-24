# Server paste · Renewed · paid moves the valid-until date (24 Oct 2026)

**What's wrong:** Anna (ST-2025-034) has three DATABASE rows, one for each teacher (Daniela row 136, Pam row 274, Ara row 275). Renewed · paid wrote the new date (25 Oct 2026, her next class) only on Pam's row. ACTIVE reads the date from another row that still says 17 May 2026, so the valid-until date stayed at 17 Jan 2027.

**What this paste does:**
1. After a renewal is saved, every DATABASE row of that student that still has the **old** package date gets the new date. Rows with a different date are left alone, because they are a separate package.
2. ACTIVE › valid until counts **package + carried over** lessons: under 30 → 4 months, 30–59 → 8 months, 60 or more → 12 months, from the first class. It is set as a formula, so it moves by itself if the start date changes.
3. The renewal answers with the new date, so the app shows it right away.
4. `zzFixAnna24` (run once) repairs Anna now.

## Step 1 · Paste

Open the Apps Script editor › the last file › scroll to the very bottom › paste:

```javascript
// 24 Oct · Renewed · paid: all DATABASE rows of the student get the new renewal date; ACTIVE valid-until counts carried lessons
function renewSync24_(code, prev, row) {
  code = String(code || '').toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return null;
  const key = x => x instanceof Date ? fmt_(x, 'yyyy-MM-dd') : String(x || '').slice(0, 10);
  const db = sheet_(TAB.DB), v = db.getRange(1, 1, db.getLastRow(), 25).getValues();
  let nd = null;   // the new renewal date = the newest one among this student's rows
  v.forEach(r => { if (String(r[0]).toUpperCase() === code && r[24] instanceof Date && (!nd || r[24] > nd)) nd = r[24]; });
  let n = 0;
  if (nd && prev && key(nd) !== prev) for (let i = 1; i < v.length; i++) if (String(v[i][0]).toUpperCase() === code && key(v[i][24]) === prev) { db.getRange(i + 1, 25).setValue(nd); n++; }
  const sh = sheet_(TAB.ACTIVE); let out = { synced: n };
  if (row > 1 && String(sh.getRange(row, 1).getValue()).toUpperCase() === code) {
    sh.getRange(row, 50).setFormula('=IF(AW' + row + '="","",EDATE(AW' + row + ',IF(N(J' + row + ')+N(F' + row + ')<30,4,IF(N(J' + row + ')+N(F' + row + ')<60,8,12))))');
    SpreadsheetApp.flush();
    const a = sh.getRange(row, 49, 1, 2).getValues()[0];
    if (a[0] instanceof Date) out.start = fmt_(a[0], 'yyyy-MM-dd');
    if (a[1] instanceof Date) out.deadline = fmt_(a[1], 'yyyy-MM-dd');
  }
  CacheService.getScriptCache().removeAll(['renmap', 'm:active', 'm:students', 'm:db', 'ms:' + code, 'at:' + code, 'tab:TODAY::', 'untick', 'ready8']);
  return out;
}
(function () {
  const f0 = globalThis.mgmtRenewPaid; if (typeof f0 !== 'function') return;
  globalThis.mgmtRenewPaid = function (token, f) {
    const r = f0.apply(this, arguments);
    try {
      if (r && r.ok && f && !f.dry && !r.dup) {
        const s = renewSync24_(f.code, r.prev && r.prev.date ? String(r.prev.date).slice(0, 10) : '', +r.row);
        if (s && s.deadline) { r.deadline = s.deadline; r.start = s.start; }
      }
    } catch (e) { console.log('renew24 ' + e); }
    return r;
  };
})();
/** Run once: Anna ST-2025-034 (renewed 24 Oct, ACTIVE row 168). */
function zzFixAnna24() { console.log(JSON.stringify(renewSync24_('ST-2025-034', '2026-05-17', 168))); }
```

## Step 2 · Save and run the fix once
1. Press **Cmd+S** (Mac) or **Ctrl+S** and wait for **Saved to Drive**.
2. In the function menu at the top, choose **zzFixAnna24**, then click **Run**.
3. The log should show `{"synced":2,"start":"2026-10-25","deadline":"2027-06-25"}`.

## Step 3 · Deploy
**Deploy › Manage deployments › pencil › Version: New version › Deploy.**

**Check:** in ACTIVE, Anna's row 168 should show valid until **25 Jun 2027**. Within the hour To do says "Deadline Jun 25".
