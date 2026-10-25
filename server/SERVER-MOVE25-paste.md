# Server paste · 25 Oct · more saves and the class video lists through the database

Replaces the one-line time-out paste (it is included here).

**What it does**
1. Google now also copies these saves from the database queue into the sheets: management **time-out**, the **WeChat reminder log** (teachers and Ops), **video explanation**, **"Not my student"**, **leave answer** and **leave cancel**. The app can then save them in about half a second instead of waiting for Google.
2. Every few minutes (and within a minute after a class video upload, an explanation or a review) Google copies the **video checks** and **which classes already have a video** (last 8 days) to the database, so the "Class videos still missing" list and the video checks can open from the database.

Nothing changes for anyone until the app is switched (after this is deployed and checked against Google).

## Step 1 · Paste at the very bottom of the last file

```javascript
// 25 Oct · more saves replayed from the database queue (safe if SB_REPLAY is missing)
try { Object.assign(SB_REPLAY, { timeOut: 1, tRemindLog: 1, mgmtRemindLog: 1, tVidExplain: 1, tNotMine: 1, tLeaveReply: 1, tLeaveCancel: 1 }); } catch (e) { console.warn('SB_REPLAY', e); }

// 25 Oct · class videos for the database: video checks (vf:*) + which classes have a video (last 8 days) → docs sys:vids
function vidSb25_() {
  if (!sbCfg_()) return 0;
  const flags = vidFlagsAll_(), days = {}, now = new Date();
  for (let k = 0; k <= 7; k++) {
    const ds = fmt_(new Date(now.getTime() - k * 864e5), 'yyyy-MM-dd');
    try { const v = vids_(ds) || {}; days[ds] = {}; Object.keys(v).forEach(key => { if (v[key] && v[key].url) days[ds][key] = 1; }); } catch (e) { console.warn('vids ' + ds, e); }
  }
  sbReq_('post', 'docs?on_conflict=key', [{ key: 'sys:vids', scope: 'mgmt', data: { flags: flags, days: days, at: Date.now() }, updated_at: new Date().toISOString() }], 'resolution=merge-duplicates,return=minimal');
  return flags.length;
}
['tVidDone', 'tVidExplain', 'mgmtVidFlagSet'].forEach(fn => {
  const f0 = globalThis[fn]; if (typeof f0 !== 'function' || f0.__vsb) return;
  const w = function () { const r = f0.apply(this, arguments); try { if (r && r.ok) CacheService.getScriptCache().put('vidsb', '1', 3600); } catch (e) { } return r; };
  w.__vsb = 1; globalThis[fn] = w;
});
var sbDrainBase25vid_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBase25vid_.apply(this, arguments);
  try {
    const c = CacheService.getScriptCache(), last = Number(c.get('vidsbAt') || 0);
    if (c.get('vidsb') || Date.now() - last > 5 * 60e3) { c.remove('vidsb'); c.put('vidsbAt', String(Date.now()), 21600); vidSb25_(); }
  } catch (e) { console.warn('vidSb25', e); }
  return r;
};
/** Run once now: copy the video lists to the database. */
function zzVidSb25() { console.log('video checks copied: ' + vidSb25_()); }
```

## Step 2 · Save (Cmd+S), choose **zzVidSb25**, click **Run** — the log says "video checks copied: N".
## Step 3 · Deploy › Manage deployments › pencil › New version › Deploy.
