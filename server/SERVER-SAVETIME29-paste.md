# SERVER-SAVETIME29 · where the Enrolled / Renewed · paid time goes (Apps Script paste · timing only)

**What it does:** times every `mgmtRenewPaid` / `mgmtEnrolPaid` call, both the background dry check and the save. Steps recorded:

| Step | Notes |
|---|---|
| `auth_` | |
| `stuClasses_` | marked **hit** or **miss**; a miss calls the Calendar |
| `Calendar.Events.list` | each call and its time |
| `renewEarly_`, `renewStart_` | |
| `salesDupGuard_`, `slogAdd_`, `sbDirty_` | |
| `renewSync24_`, `sharedRenew24_` | |
| `ridRun_` | the request bookkeeping outside the call, as `ridOutside` |

One record per call. Fields: `fn`, `dry`, `code`, `at`, `ms`, `ok`, `steps`; plus `rid` and `ridOutside` when the call came through doPost. A step that ran more than once shows `[total ms, times]`.

**Behaviour unchanged:** every wrapper calls straight through and returns exactly what the original returns. Errors pass through unchanged. All timing code is inside try/catch. Nothing is written to the sheets, and no network call is added to a save.

**Where the numbers go:**
- `console.log` (Executions), lines starting `SAVETIME29`.
- The script cache `svt`, last 60 records.
- The database docs `sys:savetimes`: copied on the next `sbDrain` run after a save, at most once a minute. Or run `zzSaveTimesPush29` by hand.

**Paste:** at the **end of Code.gs**, then **Save + Deploy** (new version of the web app).

**After pasting, once:** run `zzSaveTimeActive29` from the editor. It times the full ACTIVE reads (`getDataRange` values, formulas, the 51 / 44-column reads) and the SALES row, and adds that record to the same log.

**Undo:** delete the whole block, from `// ═════ 29 Oct · SAVETIME29` to `// ═════ END SAVETIME29 ═════`, then Save + Deploy.

**Live names it relies on** (from the coordinator's read of the live Code.gs, 29 Oct):
- `mgmtRenewPaid`, `mgmtEnrolPaid`, `auth_`, `stuClasses_`, `renewEarly_`, `renewStart_`, `salesDupGuard_`, `slogAdd_`, `sbDirty_`, `renewSync24_`, `sharedRenew24_`, `ridRun_`, `sbDrain`;
- for the push and the zz function: `sbReq_`, `sbCfg_`, `sheet_`, `TAB.ACTIVE`.

A name that doesn't exist is skipped, never an error.

**Tested in Node** with stand-ins shaped like the live chain (ridRun_ → wrappers → base → auth_ / renewEarly_ → stuClasses_ → Calendar / renewStart_):
- same return values;
- errors pass through;
- a Calendar miss then a hit is recorded;
- save-only steps appear only on saves;
- nothing is recorded outside these two calls;
- the drain copies once a minute;
- pasting twice doesn't double-wrap.

**After a day of saves**, read `select data from docs where key = 'sys:savetimes';`. If `stuClasses_:miss` / `Calendar.Events.list` dominates, SAVEFAST reads the student's classes from the database `classes` table instead, with the same `renewEarly_` / `renewStart_` math and a Calendar fallback when the database copy is stale.

```javascript
// ═════ 29 Oct · SAVETIME29 · where the Enrolled / Renewed · paid time goes (timing only · SAVE + DEPLOY) ═════
// Read-only in behaviour: every wrapper calls straight through and returns exactly what the original returns; all timing code is in
// try/catch. One record per mgmtRenewPaid / mgmtEnrolPaid call (dry check or save): total ms + ms per step (auth_, stuClasses_ hit/miss,
// Calendar.Events.list calls, renewEarly_, renewStart_, salesDupGuard_, slogAdd_, sbDirty_, renewSync24_, sharedRenew24_, ridRun_ outside).
// Kept in console.log and the script cache 'svt' (last 60); copied to the database docs 'sys:savetimes' at most once a minute by the
// next sbDrain run (or run zzSaveTimesPush29 by hand). zzSaveTimeActive29: times the full ACTIVE reads once.
// UNDO: delete this whole block (from this line to the "END SAVETIME29" line), save, deploy.
var SVT29 = { cur: null, depth: 0, inRid: 0, out: null };
function svtNow29_() { return Date.now(); }
function svtAdd29_(name, ms) {
  try { const c = SVT29.cur; if (!c) return; const s = c.steps[name] || (c.steps[name] = [0, 0]); s[0] += ms; s[1]++; } catch (e) { }
}
function svtKeep29_(rec) {
  try {
    console.log('SAVETIME29 ' + JSON.stringify(rec));
    const k = CacheService.getScriptCache(); let L = []; try { L = JSON.parse(k.get('svt') || '[]'); } catch (e) { L = []; }
    L.unshift(rec); L = L.slice(0, 60); k.put('svt', JSON.stringify(L), 21600); k.put('svtdirty', '1', 21600);
  } catch (e) { }
}
// the two calls people wait for: one record each (outermost call only; nested re-entry is counted as part of it)
['mgmtRenewPaid', 'mgmtEnrolPaid'].forEach(function (fn) {
  const f0 = globalThis[fn]; if (typeof f0 !== 'function' || f0.__svt29) return;
  const w = function (token, f) {
    if (SVT29.depth > 0) return f0.apply(this, arguments);
    const t0 = svtNow29_(); let r, ok = false;
    try { SVT29.cur = { fn: fn, dry: !!(f && f.dry), code: String((f && f.code) || ''), at: new Date().toISOString(), steps: {} }; } catch (e) { }
    SVT29.depth++;
    try { r = f0.apply(this, arguments); ok = !!(r && r.ok); return r; }
    finally {
      SVT29.depth--;
      try { const c = SVT29.cur; SVT29.cur = null;
        if (c) { c.ms = svtNow29_() - t0; c.ok = ok; delete c.cal; Object.keys(c.steps).forEach(function (k) { c.steps[k] = c.steps[k][1] > 1 ? c.steps[k] : c.steps[k][0]; });
          if (SVT29.inRid) SVT29.out = c; else svtKeep29_(c); } } catch (e) { }
    }
  };
  w.__svt29 = 1; globalThis[fn] = w;
});
// inner steps (only counted inside one of the two calls above)
['auth_', 'renewEarly_', 'renewStart_', 'salesDupGuard_', 'slogAdd_', 'sbDirty_', 'renewSync24_', 'sharedRenew24_'].forEach(function (fn) {
  const f0 = globalThis[fn]; if (typeof f0 !== 'function' || f0.__svt29) return;
  const w = function () { if (!SVT29.cur) return f0.apply(this, arguments); const t0 = svtNow29_();
    try { return f0.apply(this, arguments); } finally { svtAdd29_(fn, svtNow29_() - t0); } };
  w.__svt29 = 1; globalThis[fn] = w;
});
// stuClasses_: cache hit or miss (a miss calls the Calendar)
(function () {
  const f0 = globalThis.stuClasses_; if (typeof f0 !== 'function' || f0.__svt29) return;
  const w = function () { if (!SVT29.cur) return f0.apply(this, arguments); const t0 = svtNow29_(), c0 = SVT29.cur.cal || 0;
    try { return f0.apply(this, arguments); } finally { try { svtAdd29_('stuClasses_:' + ((SVT29.cur && (SVT29.cur.cal || 0) > c0) ? 'miss' : 'hit'), svtNow29_() - t0); } catch (e) { } } };
  w.__svt29 = 1; globalThis.stuClasses_ = w;
})();
// the Calendar calls themselves (if the advanced service lets its method be wrapped; if not, the hit/miss above still shows the cost)
(function () {
  try {
    const E = Calendar.Events, f0 = E.list; if (typeof f0 !== 'function' || f0.__svt29) return;
    const w = function () { if (!SVT29.cur) return f0.apply(E, arguments); const t0 = svtNow29_();
      try { return f0.apply(E, arguments); } finally { try { SVT29.cur.cal = (SVT29.cur.cal || 0) + 1; svtAdd29_('Calendar.Events.list', svtNow29_() - t0); } catch (e) { } } };
    w.__svt29 = 1; E.list = w;
  } catch (e) { console.log('SAVETIME29 calendar wrap skipped · ' + e); }
})();
// doPost's ridRun_: the time around the call (request bookkeeping) is added to the same record as 'ridRun_ outside'
(function () {
  const f0 = globalThis.ridRun_; if (typeof f0 !== 'function' || f0.__svt29) return;
  const w = function () { const t0 = svtNow29_(); SVT29.inRid++; SVT29.out = SVT29.inRid === 1 ? null : SVT29.out;
    try { return f0.apply(this, arguments); }
    finally { SVT29.inRid--; try { if (!SVT29.inRid && SVT29.out) { const c = SVT29.out; SVT29.out = null; c.rid = svtNow29_() - t0; c.ridOutside = c.rid - c.ms; svtKeep29_(c); } } catch (e) { } } };
  w.__svt29 = 1; globalThis.ridRun_ = w;
})();
// copy the records to the database (docs 'sys:savetimes') on the next queue drain, at most once a minute; never inside a save
function zzSaveTimesPush29() {
  const k = CacheService.getScriptCache(); let L = []; try { L = JSON.parse(k.get('svt') || '[]'); } catch (e) { }
  if (typeof sbReq_ !== 'function' || (typeof sbCfg_ === 'function' && !sbCfg_())) { console.log('SAVETIME29 no database link · ' + L.length + ' records in the cache'); return L.length; }
  sbReq_('post', 'docs?on_conflict=key', [{ key: 'sys:savetimes', scope: 'mgmt', data: { at: Date.now(), n: L.length, rows: L }, updated_at: new Date().toISOString() }], 'resolution=merge-duplicates,return=minimal');
  k.remove('svtdirty'); k.put('svtpush', '1', 60); console.log('SAVETIME29 pushed ' + L.length); return L.length;
}
(function () {
  const f0 = globalThis.sbDrain; if (typeof f0 !== 'function' || f0.__svt29) return;
  const w = function () { const r = f0.apply(this, arguments);
    try { const k = CacheService.getScriptCache(); if (k.get('svtdirty') && !k.get('svtpush')) zzSaveTimesPush29(); } catch (e) { console.log('SAVETIME29 push ' + e); }
    return r; };
  w.__svt29 = 1; globalThis.sbDrain = w;
})();
/** Run once by hand: how long the full ACTIVE reads take (the base function does values + formulas; sharedRenew24_ does 51 + 44 columns). */
function zzSaveTimeActive29() {
  const sh = sheet_(TAB.ACTIVE), out = { at: new Date().toISOString(), fn: 'zzSaveTimeActive29', steps: {} }; let t = Date.now();
  const R = sh.getDataRange(); out.steps.getDataRange = Date.now() - t; t = Date.now();
  const v = R.getValues(); out.steps['getValues (all)'] = Date.now() - t; t = Date.now();
  R.getFormulas(); out.steps['getFormulas (all)'] = Date.now() - t; t = Date.now();
  const n = sh.getLastRow(); sh.getRange(1, 1, n, 51).getValues(); out.steps['getValues 51 cols'] = Date.now() - t; t = Date.now();
  sh.getRange(1, 1, n, 44).getFormulas(); out.steps['getFormulas 44 cols'] = Date.now() - t; t = Date.now();
  sheet_('SALES').getRange(3, 1, 1, 6).getValues(); out.steps['SALES one row'] = Date.now() - t;
  out.rows = v.length; out.cols = v[0] ? v[0].length : 0; out.ms = Object.keys(out.steps).reduce(function (a, k) { return a + out.steps[k]; }, 0);
  svtKeep29_(out); return out;
}
/** Run by hand to read the last records in the log. */
function zzSaveTimesShow29() { const L = JSON.parse(CacheService.getScriptCache().get('svt') || '[]'); L.forEach(function (x) { console.log(JSON.stringify(x)); }); return L.length; }
// ═════ END SAVETIME29 ═════
```
