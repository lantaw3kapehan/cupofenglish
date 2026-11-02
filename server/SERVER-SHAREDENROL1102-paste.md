# Server change · Enrol a sibling on a shared package (2 Nov 2026) · DONE 18:33 (Version 452)

**Installed by Claude in the browser (Misty: "paste it there, run and deploy").** New script file **SHAREDENROL1102.gs** in the
CupOfEnglish Teacher App project (not Code.gs). Deployed as **Version 452** (same web-app address).

**Why:** Ruyi (ST-2026-132) and Nature (ST-2026-133) are siblings on one paid package (Payment Confirmation 1756, 60 + 8).
Only Ruyi had a package row in ACTIVE, so Nature's classes would not come off the package.

**What it adds:** `mgmtEnrolShared(token, f)` (management only), used by app patch 1715 ("Shares a sibling's package · no payment" on
Enrolled · paid). It makes the sibling's ACTIVE row like an enrolment row, with **no lessons of its own**, Active ticked, TOTAL AVAILABLE and
Deadline formulas copied from the paying sibling's row, Shared Package Code = the sibling's code, source = the sibling's source.
No SALES row. `f = { code, owner, teacher, start, course }`. **Columns are found by their headings**, not by number.

**What happened at 18:27:** the first version used fixed column numbers copied from the 14 Oct "transfer from outside" enrolment code.
ACTIVE got a new month column (Nov 2026) on 1 Nov, so everything from column AS moved right by one: Nature's row got TRUE in TOTAL AVAILABLE,
the date in the Active tick, Ruyi's code in Deadline, and Name / Chinese name / Source as `=DATABASE!C18`-style formulas pointing at another
student (Eric). Ruyi's row was not touched. **18:32 `zzFixNature1102`** repaired Nature's row; checked after: Nature · 田野 · Dezza ·
ENROLLED empty · Active ✓ · 1st class 8 Nov · Deadline formula (blank) · Shared ST-2026-132 · Resolved ST-2026-132 · Jinan – Dr. Spring · REF;
Ruyi 68 available. Database (coe_packages + app ACTIVE rows) shows the same at 18:33.

**Same risk elsewhere (not changed):** the 14 Oct `mgmtEnrolPaid` "Transfer from someone not in DATABASE" code in Code.gs still writes
fixed column numbers (48 / 49 / 50) and leaves Name / Chinese name as copied formulas. Check before the next outside transfer.

**Undo:** delete Nature's row in ACTIVE (no lessons, no payment), delete SHAREDENROL1102.gs, deploy a new version.

## Current file SHAREDENROL1102.gs
```javascript
/* ═════ 2 Nov · Enrolled · shared package: a sibling on the package the other child paid for (no payment) · SAVE + DEPLOY ═════
   Columns are found by their headings (row 1 / row 2 of ACTIVE), so a new month column does not shift anything. */
function activeCols1102_(sh) {
  const W = sh.getLastColumn(), h = sh.getRange(1, 1, 2, W).getValues(), up = x => String(x || '').trim().toUpperCase();
  const f1 = t => h[0].map(up).indexOf(t), f2 = t => h[1].map(up).indexOf(t);
  const c = { W: W, name: f1('NAME'), cn: f1('CHINESE NAME'), teacher: f1('TEACHER'), enrolled: f1('ENROLLED LESSONS'), avail: f1('TOTAL AVAILABLE'), tick: f1('NOTES'),
    start: f2('PURCHASE DATE/1ST CLASS'), dead: f2('DEADLINE DATE'), shared: f2('SHARED PACKAGE CODE'), res: f2('RESOLVED PACKAGE CODE'), src: f1('SOURCE'), course: f1('COURSE') };
  const miss = Object.keys(c).filter(k => c[k] < 0); if (miss.length) throw new Error('ACTIVE headings not found: ' + miss.join(', '));
  return c;
}
function enrolShared1102_(u, f) {
  f = f || {}; const up = x => String(x || '').trim().toUpperCase();
  const code = up(f.code), owner = up(f.owner), teacher = String(f.teacher || '').trim();
  if (!/^ST-\d{4}-\d{3}$/.test(code) || !/^ST-\d{4}-\d{3}$/.test(owner) || !teacher) return { ok: false, msg: 'Choose the student, the sibling who paid, and the teacher.' };
  if (code === owner) return { ok: false, msg: 'Choose the sibling who paid (not the same student).' };
  const sh = sheet_(TAB.ACTIVE), db = sheet_(TAB.DB), lock = LockService.getScriptLock(); lock.waitLock(25000);
  try {
    const K = activeCols1102_(sh), W = K.W, v = sh.getDataRange().getValues(), F = sh.getDataRange().getFormulas();
    const oi = v.findIndex((r, i) => i >= 4 && up(r[0]) === owner && String(r[K.enrolled]) !== '');
    if (oi < 0) return { ok: false, msg: owner + ' has no paid package in ACTIVE. Record the payment on that child first (Enrolled · paid).' };
    if (v.some((r, i) => i >= 4 && up(r[0]) === code && String(r[K.teacher]).trim().toLowerCase() === teacher.toLowerCase())) return { ok: false, msg: code + ' already has a row with Teacher ' + teacher + ' in ACTIVE. Use "Shares a package with…" on that row instead.' };
    let ti = -1; for (let i = 4; i < v.length; i++) if (/^ST-/.test(String(v[i][0])) && /SALES!/i.test(String(F[i][K.enrolled] || '')) && (!up(v[i][K.shared])) && !String(v[i][K.course] || '').trim()) { ti = i; break; }
    if (ti < 0) return { ok: false, msg: 'No ordinary ACTIVE row to copy the formulas from.' };
    const hits = db.getRange(1, 1, db.getLastRow(), 1).createTextFinder(code).matchEntireCell(true).findAll().map(x => x.getRow());
    const dbr = hits.length ? hits[hits.length - 1] : 0, dv = dbr ? db.getRange(dbr, 1, 1, 24).getValues()[0] : [];
    const oName = String(v[oi][K.name] || owner), oSrc = String(v[oi][K.src] || '');
    const name = String(dv[2] || f.name || ''), start = /^\d{4}-\d{2}-\d{2}/.test(String(f.start || '')) ? day_(String(f.start).slice(0, 10)) : null;
    const stamp = fmt_(new Date(), 'd MMM yyyy') + ' · by ' + u.name;
    sh.insertRowBefore(6); const row = 6, tr = ti + 1 + (ti + 1 >= 6 ? 1 : 0), orow = oi + 1 + (oi + 1 >= 6 ? 1 : 0);
    sh.getRange(tr, 1, 1, W).copyTo(sh.getRange(row, 1, 1, W));
    const nf = sh.getRange(row, 1, 1, W).getFormulas()[0];
    nf.forEach((fm, j) => { if (!fm && j !== K.tick) sh.getRange(row, j + 1).clearContent(); });
    sh.getRange(row, 1, 1, W).clearNote();
    sh.getRange(row, 1).setValue(code);
    sh.getRange(row, K.name + 1).setValue(name); sh.getRange(row, K.cn + 1).setValue(String(dv[1] || '')); sh.getRange(row, K.teacher + 1).setValue(teacher);
    sh.getRange(row, K.enrolled + 1).clearContent().setNote('No lessons of its own · shares ' + oName + ' (' + owner + ')\'s package · ' + stamp);
    sh.getRange(row, K.tick + 1).setValue(true);
    sh.getRange(orow, K.avail + 1).copyTo(sh.getRange(row, K.avail + 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    sh.getRange(orow, K.dead + 1).copyTo(sh.getRange(row, K.dead + 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    sh.getRange(row, K.shared + 1).setValue(owner);
    if (oSrc) sh.getRange(row, K.src + 1).setValue(oSrc);
    sh.getRange(row, K.course + 1).setValue(String(f.course || '').trim());
    if (dbr && start && !(dv[16] instanceof Date)) db.getRange(dbr, 17).setValue(start);
    SpreadsheetApp.flush();
    const after = sh.getRange(row, 1, 1, W).getValues()[0];
    CacheService.getScriptCache().removeAll(['renmap', 'tab:TODAY::', 'm:active', 'm:students', 'm:db', 'ms:' + code, 'ms:' + owner, 'untick', 'ready8', 'at:' + code, 'at:' + owner, 'sl2', 'endry']);
    try { sbDirty_([TAB.ACTIVE, TAB.DB]); } catch (e) { }
    try { activeSnap_(true); } catch (e) { }
    try { slogAdd_(code, name, '', 'enrol', 'Enrolled · shared package', 'Shares ' + oName + ' (' + owner + ')\'s package · no payment · ACTIVE row ' + row, u.name); } catch (e) { }
    return { ok: true, row: row, name: String(after[K.name]), ownerName: oName, owner: owner, shared: true, enrolled: String(after[K.enrolled]), sharedCode: String(after[K.shared]),
      resolved: String(after[K.res]), tick: after[K.tick] === true, start: after[K.start] instanceof Date ? fmt_(after[K.start], 'yyyy-MM-dd') : String(after[K.start]),
      note: 'Enrolled · ' + name + ' shares ' + oName + '\'s package · ACTIVE row ' + row };
  } finally { lock.releaseLock(); }
}
function mgmtEnrolShared(token, f) { return enrolShared1102_(mgr_(token), f); }
API_FNS.push('mgmtEnrolShared');
/** Run once (2 Nov 18:27 run used the old column numbers): repairs ONLY Nature's row (ST-2026-133 · Dezza). */
function zzFixNature1102() {
  const sh = sheet_(TAB.ACTIVE), K = activeCols1102_(sh), up = x => String(x || '').trim().toUpperCase(), v = sh.getDataRange().getValues();
  const ri = v.findIndex((r, i) => i >= 4 && up(r[0]) === 'ST-2026-133' && String(r[K.teacher]).trim().toLowerCase() === 'dezza');
  const oi = v.findIndex((r, i) => i >= 4 && up(r[0]) === 'ST-2026-132' && String(r[K.enrolled]) !== '');
  if (ri < 0 || oi < 0) { console.log('row not found ' + ri + ' ' + oi); return; }
  const row = ri + 1, orow = oi + 1, dbs = sheet_(TAB.DB), h = dbs.getRange(1, 1, dbs.getLastRow(), 1).createTextFinder('ST-2026-133').matchEntireCell(true).findAll().map(x => x.getRow());
  const dv = h.length ? dbs.getRange(h[h.length - 1], 1, 1, 24).getValues()[0] : [];
  sh.getRange(row, K.name + 1).setValue(String(dv[2] || 'Nature')); sh.getRange(row, K.cn + 1).setValue(String(dv[1] || ''));
  sh.getRange(row, K.tick + 1).setValue(true);
  sh.getRange(orow, K.avail + 1).copyTo(sh.getRange(row, K.avail + 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
  sh.getRange(orow, K.dead + 1).copyTo(sh.getRange(row, K.dead + 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
  sh.getRange(row, K.shared + 1).setValue('ST-2026-132');
  sh.getRange(row, K.src + 1).setValue(String(v[oi][K.src] || ''));
  SpreadsheetApp.flush();
  CacheService.getScriptCache().removeAll(['renmap', 'tab:TODAY::', 'm:active', 'm:students', 'ms:ST-2026-133', 'ms:ST-2026-132', 'at:ST-2026-133', 'at:ST-2026-132']);
  try { sbDirty_([TAB.ACTIVE]); } catch (e) { } try { activeSnap_(true); } catch (e) { }
  zzLook1102();
}
/** Read-only: show ACTIVE rows 6-7 (values + formulas) for checking. */
function zzLook1102() {
  const sh = sheet_(TAB.ACTIVE), W = sh.getLastColumn(), h1 = sh.getRange(1, 1, 2, W).getValues(), rg = sh.getRange(6, 1, 2, W), v = rg.getValues(), F = rg.getFormulas(), out = [];
  [0, 1, 2, 3, 9].concat(Array.from({ length: W - 44 }, (_, k) => 44 + k)).forEach(j => out.push((j + 1) + ' ' + (h1[0][j] || h1[1][j] || '') + ' | r6 ' + JSON.stringify(F[0][j] ? F[0][j].slice(0, 60) + ' = ' + v[0][j] : v[0][j]) + ' | r7 ' + JSON.stringify(F[1][j] ? F[1][j].slice(0, 60) + ' = ' + v[1][j] : v[1][j])));
  console.log(out.join('\n')); return out;
}
```
