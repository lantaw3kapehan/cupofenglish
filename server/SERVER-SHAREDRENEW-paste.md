# Server paste · Renewal of a shared package (24 Oct 2026)

**What's wrong:** Leo & Kaylee share one package, which is held on Leo's row. Renewed · paid (24 Oct) cleared the old package's months on **Leo's** row only. Kaylee's row still counts her 6.5 lessons from the old package. To keep the total right, the renewal raised Leo's carry-over to 8.5 instead of the real 2.
The total (70 left) is right, but parents see "68 + 8.5 carried · 13 completed" instead of "68 + 2 carried · 0 completed".

**What this paste does:** after any Renewed · paid, every sibling row that shares the package (ACTIVE › shared-package column = the owner's code) is treated like the owner's row:
- months before the new package's first-class month are emptied;
- in that month, the lessons already taken are taken off (`=(formula)-n`);
- the old values are written as a note on TOTAL FINISHED, so they can be undone.

Then the carry-over is set so that TOTAL AVAILABLE = lessons left before + new package, exactly as the renewal intended. `zzFixLeo24` (run once) repairs Leo & Kaylee now.

## Step 1 · Paste at the very bottom of the last file

```javascript
// 24 Oct · Renewed · paid on a SHARED package: the siblings' old-package months are cleared too; carry = what was really left
function sharedRenew24_(code, row, start, total) {
  code = String(code || '').toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return null;
  const sh = sheet_(TAB.ACTIVE), n = sh.getLastRow(), v = sh.getRange(1, 1, n, 51).getValues(), F = sh.getRange(1, 1, n, 44).getFormulas();
  const st = start instanceof Date ? start : new Date(String(start || '').slice(0, 10) + 'T00:00:00'); if (isNaN(st)) return null;
  const ym = d => d.getFullYear() * 12 + d.getMonth(), mrow = v[1], out = { rows: [] };
  for (let i = 4; i < n; i++) {
    if (String(v[i][50] || '').trim().toUpperCase().indexOf(code) !== 0 || String(v[i][0]).trim().toUpperCase() === code) continue;
    const ch = [];
    for (let j = 10; j < 44; j++) {
      const m = mrow[j], val = Number(v[i][j]) || 0; if (!(m instanceof Date) || !val) continue;
      if (ym(m) < ym(st)) { sh.getRange(i + 1, j + 1).setValue(''); ch.push(fmt_(m, 'MMM yy') + ' ' + val); }
      else if (ym(m) === ym(st)) { const f = String(F[i][j] || ''); if (/\)\s*-\s*[\d.]+\s*$/.test(f)) continue;
        if (f) sh.getRange(i + 1, j + 1).setFormula('=(' + f.replace(/^=/, '') + ')-' + val); else sh.getRange(i + 1, j + 1).setValue(0);
        ch.push(fmt_(m, 'MMM yy') + ' −' + val + ' (before the renewal)'); }
    }
    if (ch.length) { const c = sh.getRange(i + 1, 46), old = c.getNote(); c.setNote((old ? old + '\n' : '') + fmt_(new Date(), 'yyyy-MM-dd') + ' · renewal of ' + code + ' · old package: ' + ch.join(', ')); out.rows.push(i + 1); }
  }
  SpreadsheetApp.flush();
  if (row > 1 && total !== '' && total != null && !isNaN(+total) && String(sh.getRange(row, 1).getValue()).toUpperCase() === code) {
    const av = Number(sh.getRange(row, 47).getValue());
    if (!isNaN(av) && Math.abs(av - total) > 0.01) { const c0 = Number(sh.getRange(row, 6).getValue()) || 0, c1 = Math.round((c0 + (+total) - av) * 10) / 10;
      sh.getRange(row, 6).setValue(c1); out.carry = [c0, c1]; SpreadsheetApp.flush(); }
    out.available = Number(sh.getRange(row, 47).getValue());
  }
  CacheService.getScriptCache().removeAll(['m:active', 'm:students', 'ms:' + code, 'at:' + code, 'tab:TODAY::', 'renmap']);
  return out;
}
(function () {
  const f1 = globalThis.mgmtRenewPaid; if (typeof f1 !== 'function') return;
  globalThis.mgmtRenewPaid = function (token, f) {
    const r = f1.apply(this, arguments);
    try { if (r && r.ok && f && !f.dry && !r.dup) { const s = sharedRenew24_(f.code, +r.row, r.start || f.date, r.total); if (s && s.rows.length) { r.shared = s; if (s.available != null) r.balance = s.available; } } }
    catch (e) { console.log('shared24 ' + e); }
    return r;
  };
})();
/** Run once: Leo ST-2026-101 (ACTIVE row 22) & Kaylee, renewed 24 Oct · 2 left + 68 new = 70. */
function zzFixLeo24() { console.log(JSON.stringify(sharedRenew24_('ST-2026-101', 22, '2026-10-27', 70))); }
```

## Step 2 · Save (Cmd+S), choose **zzFixLeo24**, click **Run**
The log should show `{"rows":[23],"carry":[8.5,2],"available":70}`.

## Step 3 · Deploy › Manage deployments › pencil › New version › Deploy.
