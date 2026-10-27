# Paste · 27 Oct · package check (Enrolled · paid / Renewed · paid) — copy what Google's check reads into the database

**Why:** the "Checking the package…" step waits 13–18 s for Google because it reads ACTIVE (incl. the column-J formula that
links each package to its SALES row), SALES and DATABASE. The database copies lack the column-J links and SALES is days old,
so the check could not be made exact. This copies exactly what the check reads into one record `sys:pkglink` (management only):
- ACTIVE: every package row's code, name, teacher, column J value, the SALES row its column-J formula links to, lessons left
  (AU), the tick (AV), the tick date (AW), the group (AZ), the month columns (K–AR) and the month header dates;
- SALES: every row from the last 60 days, plus every row an ACTIVE package links to;
- DATABASE: per student code, the last row's number, English name, Chinese name and first class date.

Read-only on the sheets. Runs inside the existing minute job (sbDrain) at most every 2 minutes, and right after any
Enrolled · paid / Renewed · paid save, so a just-saved payment is in the copy at once.

```javascript
// 27 Oct · package check from the database: copy ACTIVE (with column-J SALES links), recent SALES and DATABASE names to sys:pkglink
function pkgLink27_() {
  if (!sbCfg_()) return null;
  const iso = x => x instanceof Date ? fmt_(x, 'yyyy-MM-dd') : '', up = x => String(x || '').trim().toUpperCase();
  const sh = sheet_(TAB.ACTIVE), n = sh.getLastRow(), W = Math.min(sh.getLastColumn(), 52);
  const V = sh.getRange(1, 1, n, W).getValues(), FJ = sh.getRange(1, 10, n, 1).getFormulas();
  const hdr = []; for (let j = 10; j <= 43; j++) hdr.push(V[1][j] instanceof Date ? fmt_(V[1][j], 'yyyy-MM') : '');
  const act = [], linked = {};
  for (let i = 4; i < n; i++) {
    const r = V[i]; if (!up(r[0])) continue;
    const m = String(FJ[i][0] || '').match(/SALES!\$?C\$?(\d+)/i), link = m ? Number(m[1]) : 0; if (link) linked[link] = 1;
    act.push({ r: i + 1, c: up(r[0]), n: String(r[1] || ''), t: String(r[3] || ''), j: r[9] === '' ? '' : String(r[9]), link: link,
      au: r[46] === '' ? '' : Number(r[46]) || 0, av: r[47] === true, aw: r[48] instanceof Date ? r[48].getTime() : 0, g: up(r[51]),
      m: r.slice(10, 44).map(x => x === '' ? '' : Number(x) || 0) });
  }
  const sa = sheet_('SALES'), sl = sa.getLastRow(), since = new Date(Date.now() - 60 * 864e5), sales = [];
  if (sl >= 3) sa.getRange(3, 1, sl - 2, 6).getValues().forEach((r, k) => { const row = k + 3;
    if (!linked[row] && !(r[0] instanceof Date && r[0] >= since)) return;
    sales.push({ row: row, d: iso(r[0]), inv: String(r[1] || ''), pkg: r[2] === '' ? '' : Number(r[2]) || 0, free: r[3] === '' ? '' : Number(r[3]) || 0, partner: String(r[4] || ''), method: String(r[5] || '') }); });
  const db = sheet_(TAB.DB), dn = db.getLastRow(), dbm = {};
  if (dn >= 1) db.getRange(1, 1, dn, 17).getValues().forEach((r, k) => { const c = up(r[0]); if (/^ST-\d{4}-\d{3}$/.test(c)) dbm[c] = { row: k + 1, name: String(r[2] || ''), cn: String(r[1] || ''), fc: iso(r[16]) }; });
  const data = { at: new Date().toISOString(), hdr: hdr, act: act, sales: sales, db: dbm };
  sbReq_('post', 'docs?on_conflict=key', [{ key: 'sys:pkglink', scope: 'mgmt', data: data, updated_at: data.at }], 'resolution=merge-duplicates,return=minimal');
  return { packages: act.length, links: Object.keys(linked).length, sales: sales.length, students: Object.keys(dbm).length };
}
(function () {
  const E0 = globalThis.mgmtEnrolPaid, R0 = globalThis.mgmtRenewPaid;
  if (typeof E0 !== 'function' || typeof R0 !== 'function' || E0.__p27) return;
  const after = (f, r) => { try { if (f && !f.dry && r && r.ok) { CacheService.getScriptCache().remove('pk27'); pkgLink27_(); } } catch (e) { console.warn('pkgLink27 after save', e); } };
  const E1 = function (token, f) { const r = E0.apply(this, arguments); after(f, r); return r; };
  const R1 = function (token, f) { const r = R0.apply(this, arguments); after(f, r); return r; };
  E1.__p27 = 1; R1.__p27 = 1;
  globalThis.mgmtEnrolPaid = E1; globalThis.mgmtRenewPaid = R1;
  try { mgmtEnrolPaid = E1; mgmtRenewPaid = R1; } catch (e) { }
})();
var sbDrainBasePk27_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBasePk27_.apply(this, arguments);
  try { const c = CacheService.getScriptCache(); if (!c.get('pk27')) { c.put('pk27', '1', 120); pkgLink27_(); } } catch (e) { console.warn('pkgLink27', e); }
  return r;
};
/** Run once now: copies everything and says how much. */
function zzPkgLink27() { const r = pkgLink27_(); console.log(r ? 'Package check copied · ' + r.packages + ' ACTIVE rows · ' + r.links + ' SALES links · ' + r.sales + ' SALES rows · ' + r.students + ' students' : 'Not copied: database sign-in (SB_URL / SB_KEY) missing'); }
```

## Steps
1. Paste at the very bottom of **Code.gs** (CupOfEnglish Teacher App) → Save.
2. Run **zzPkgLink27** → log: `Package check copied · … ACTIVE rows · … SALES links · … SALES rows · … students`.
3. **Deploy › Manage deployments › pencil › New version › Deploy** (the copy right after a save runs inside the web app).

Until the app release that reads it (1290) is live, nothing uses this copy. Undo: delete the block, save, deploy a new version.
