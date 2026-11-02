# Server paste · Enrol a sibling on a shared package (2 Nov 2026)

**Why:** Ruyi (ST-2026-132) and Nature (ST-2026-133) are siblings on one paid package (Payment Confirmation 1756, 60 + 8).
Only Ruyi has a package row in ACTIVE. Sharing is set on the second child's row (AY "Shared Package Code"), but the app could
only make a row with a payment (Enrolled · paid) or a lesson transfer, so Nature had no row to link and his classes would not
come off the package.

**What this adds:**
- `mgmtEnrolShared(token, f)` — management only. Makes the sibling's ACTIVE row exactly the way Enrolled · paid makes one
  (new row 6, formulas copied from an ordinary row), with **no lessons of its own** (ENROLLED LESSONS empty), the Active box ticked,
  the first class (AW) and course if given, and **AY = the paying sibling's code**, so ACTIVE counts this child's lessons on the
  sibling's package. No SALES row, no carry-over, no transfer.
  `f = { code, owner, teacher, start: 'yyyy-MM-dd' (optional), course (optional) }`.
  Refuses when: codes are wrong or the same; the paying sibling has no paid package row in ACTIVE; the child already has a row with
  that teacher.
- `zzNature1102` — run once: sets up Nature (Teacher Dezza, first class 8 Nov, course REF) on Ruyi's package.
- The app button that uses `mgmtEnrolShared` ("Shares a sibling's package · no payment" on Enrolled · paid) comes with app patch 1715.

## Step 1 · Paste at the very bottom of Code.gs (CupOfEnglish Teacher App) → Save

```javascript
/* ═════ 2 Nov · Enrolled · shared package: a sibling on the package the other child paid for (no payment) · SAVE + DEPLOY ═════ */
function enrolShared1102_(u, f) {
  f = f || {}; const up = x => String(x || '').trim().toUpperCase();
  const code = up(f.code), owner = up(f.owner), teacher = String(f.teacher || '').trim();
  if (!/^ST-\d{4}-\d{3}$/.test(code) || !/^ST-\d{4}-\d{3}$/.test(owner) || !teacher) return { ok: false, msg: 'Choose the student, the sibling who paid, and the teacher.' };
  if (code === owner) return { ok: false, msg: 'Choose the sibling who paid (not the same student).' };
  const sh = sheet_(TAB.ACTIVE), db = sheet_(TAB.DB), lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    const v = sh.getDataRange().getValues(), F = sh.getDataRange().getFormulas(), W = sh.getLastColumn(), cc = v[0].map(x => up(x)).indexOf('COURSE');
    if (!v.some((r, i) => i >= 4 && up(r[0]) === owner && String(r[9]) !== '')) return { ok: false, msg: owner + ' has no paid package in ACTIVE. Record the payment on that child first (Enrolled · paid).' };
    if (v.some((r, i) => i >= 4 && up(r[0]) === code && String(r[3]).trim().toLowerCase() === teacher.toLowerCase())) return { ok: false, msg: code + ' already has a row with Teacher ' + teacher + ' in ACTIVE. Use "Shares a package with…" on that row instead.' };
    let ti = -1; for (let i = 4; i < v.length; i++) if (/^ST-/.test(String(v[i][0])) && /SALES!/i.test(String(F[i][9] || '')) && (!up(v[i][51]) || up(v[i][51]) === up(v[i][0])) && !(cc > -1 && String(v[i][cc] || '').trim())) { ti = i; break; }
    if (ti < 0) return { ok: false, msg: 'No ordinary ACTIVE row to copy the formulas from.' };
    const hits = db.getRange(1, 1, db.getLastRow(), 1).createTextFinder(code).matchEntireCell(true).findAll().map(x => x.getRow());
    const dbr = hits.length ? hits[hits.length - 1] : 0, dv = dbr ? db.getRange(dbr, 1, 1, 24).getValues()[0] : [];
    const oName = (v.find((r, i) => i >= 4 && up(r[0]) === owner) || [])[1] || owner;
    const name = String(dv[2] || f.name || ''), start = /^\d{4}-\d{2}-\d{2}/.test(String(f.start || '')) ? day_(String(f.start).slice(0, 10)) : null;
    const stamp = fmt_(new Date(), 'd MMM yyyy') + ' · by ' + u.name;
    sh.insertRowBefore(6); const row = 6, tr = ti + 1 + (ti + 1 >= 6 ? 1 : 0);
    sh.getRange(tr, 1, 1, W).copyTo(sh.getRange(row, 1, 1, W));
    const nf = sh.getRange(row, 1, 1, W).getFormulas()[0];
    nf.forEach((fm, j) => { if (!fm && j !== 47) sh.getRange(row, j + 1).clearContent(); });
    sh.getRange(row, 1, 1, W).clearNote();
    const put = (j, val) => { if (!nf[j]) sh.getRange(row, j + 1).setValue(val); };
    sh.getRange(row, 1).setValue(code); put(1, name); put(2, String(dv[1] || '')); put(3, teacher);
    sh.getRange(row, 10).clearContent().setNote('No lessons of its own · shares ' + oName + ' (' + owner + ')\'s package · ' + stamp);
    sh.getRange(row, 48).setValue(true);
    if (start) put(48, start);
    if (!nf[49]) sh.getRange(row, 50).clearContent();
    sh.getRange(row, 51).setValue(owner);
    if (cc > -1 && f.course) put(cc, String(f.course).trim());
    if (dbr && start && !(dv[16] instanceof Date)) db.getRange(dbr, 17).setValue(start);
    SpreadsheetApp.flush();
    const after = sh.getRange(row, 1, 1, 52).getValues()[0];
    CacheService.getScriptCache().removeAll(['renmap', 'tab:TODAY::', 'm:active', 'm:students', 'm:db', 'ms:' + code, 'ms:' + owner, 'untick', 'ready8', 'at:' + code, 'at:' + owner, 'sl2', 'endry']);
    try { sbDirty_([TAB.ACTIVE, TAB.DB]); } catch (e) { }
    try { activeSnap_(true); } catch (e) { }
    try { slogAdd_(code, name, '', 'enrol', 'Enrolled · shared package', 'Shares ' + oName + ' (' + owner + ')\'s package · no payment · ACTIVE row ' + row, u.name); } catch (e) { }
    return { ok: true, row: row, name: name, owner: owner, ownerName: String(oName), shared: true, enrolled: String(after[9]), ay: String(after[50]), az: String(after[51]),
      note: 'Enrolled · ' + name + ' shares ' + oName + '\'s package · ACTIVE row ' + row };
  } finally { lock.releaseLock(); }
}
function mgmtEnrolShared(token, f) { return enrolShared1102_(mgr_(token), f); }
API_FNS.push('mgmtEnrolShared');
/** Run once from the editor: Nature (ST-2026-133, Teacher Dezza) on Ruyi's package (ST-2026-132). */
function zzNature1102() {
  const r = enrolShared1102_({ name: 'Misty' }, { code: 'ST-2026-133', owner: 'ST-2026-132', teacher: 'Dezza', start: '2026-11-08', course: 'REF' });
  console.log(JSON.stringify(r)); return r;
}
```

## Step 2 · Run zzNature1102 once
Pick **zzNature1102** in the function list next to Debug → **Run**. The log should end with
`{"ok":true,"row":6,"name":"Nature",...,"enrolled":"","ay":"ST-2026-132","az":"ST-2026-132",...}`.
Running it a second time is safe: it answers "already has a row with Teacher Dezza".

## Step 3 · Deploy
Deploy › Manage deployments › ✏️ › New version · "2 Nov · enrol a sibling on a shared package" → Deploy.
(Needed for the app button; zzNature1102 works without it.)

## Check (Claude)
ACTIVE row 6 = Nature · Dezza · ENROLLED empty · Active ✓ · AW 8 Nov · AY ST-2026-132; Ruyi's row 7 unchanged (68).
App › Students › Ruyi or Nature: "Shared package · 2 students", 68 left.

**Undo:** delete Nature's row 6 in ACTIVE (it holds no lessons or payment), delete the pasted block, save, deploy.
