# TRCOPY1102 · a trial report reaches management within about 2 minutes (2 Nov 2026)

Saved in Apps Script › SRCFIX31.gs (below SRCFIX31 / INVSYNC1101). Runs in the inbox job (sbDrain, time trigger = latest saved code),
which is where teachers' trial reports are sent from, so no new deployment was needed.

**Why:** Becky ST-2026-129 (Teacher Misty, resent 10:04): Google saved the report at 10:04:35 and the sheet wrote the TR-DATA row at
10:04:40, but the database copy of TR-DATA was taken at 10:04:58 without the row, and the next copy only came with the regular round
(10:16:55). Management saw "Report not in yet" for 12 minutes.

**What it does:** after a sent trial report (tTrialSubmit ok) it notes the time; the next sbDrain run at least 50 s later marks TR-DATA
changed (sbDirty_), so the following copy brings the new row.

```javascript
(function () {
  const S0 = globalThis.tTrialSubmit; if (typeof S0 !== 'function' || S0.__trc1102) return;
  const S1 = function () { const r = S0.apply(this, arguments); try { if (r && r.ok) CacheService.getScriptCache().put('trc1102', String(Date.now()), 900); } catch (e) { } return r; };
  Object.keys(S0).forEach(function (k) { try { S1[k] = S0[k]; } catch (e) { } }); S1.__trc1102 = 1; globalThis.tTrialSubmit = S1; try { tTrialSubmit = S1; } catch (e) { }
})();
var sbDrainBaseTrc1102_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBaseTrc1102_.apply(this, arguments);
  try { const c = CacheService.getScriptCache(), t = +(c.get('trc1102') || 0);
    if (t && Date.now() - t > 50000) { c.remove('trc1102'); if (typeof sbDirty_ === 'function') sbDirty_([TAB.TRDATA]); } } catch (e) { console.warn('trc1102', e); }
  return r;
};
```
UNDO: delete the TRCOPY1102 block in SRCFIX31.gs and save.
