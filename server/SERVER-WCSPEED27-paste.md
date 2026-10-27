# Paste · 27 Oct · time-in internet result copied into T-TIMEIN (Google sheet)

**Why:** since release 1270 the fuller time-in speed test (Cloudflare method) no longer holds up the time-in, so Google's
T-TIMEIN row is saved first and the speed is measured a few seconds later. The finished result is stored in the database
(coe_wechat_posts) and, after a management-asked redo, in coe_timein_redo. This copies it into the T-TIMEIN row's **Speed**
column (and **Network** when that is empty), so the sheet and everything built on it keep the internet result.
A redo's result replaces the first one (Misty, 27 Oct: "redo replaces the original but just the internet").

Runs inside the existing minute job (sbDrain), at most every 2 minutes; only today's and the last 2 days' rows; changes only
those two cells of a teacher's day time-in row, and only when they differ.

```javascript
// 27 Oct · time-in internet result (database) → T-TIMEIN Speed / Network columns
function wcSpeed27_() {
  if (!sbCfg_()) return 0;
  const since = fmt_(new Date(Date.now() - 2 * 864e5), 'yyyy-MM-dd');
  const P = sbReq_('get', 'coe_wechat_posts?select=day,teacher,speed,net&day=gte.' + since + '&speed=not.is.null') || [];
  const R = sbReq_('get', 'coe_timein_redo?select=day,teacher,speed,net,done_at&day=gte.' + since + '&done_at=not.is.null&speed=not.is.null&order=done_at.asc') || [];
  const want = {};
  P.forEach(x => { if (/Mbps/.test(x.speed || '')) want[x.day + '|' + String(x.teacher).trim().toLowerCase()] = x; });
  R.forEach(x => { if (/Mbps/.test(x.speed || '')) want[x.day + '|' + String(x.teacher).trim().toLowerCase()] = x; });   // latest redo wins
  if (!Object.keys(want).length) return 0;
  const t = sheet_(TAB.TIMEIN), n = Math.min(600, t.getLastRow() - 1); if (n < 1) return 0;
  const V = t.getRange(2, 1, n, 14).getValues(); let ch = 0;
  V.forEach((r, i) => {
    if (String(r[13]) !== 'Day') return;
    const d = r[0] instanceof Date ? fmt_(r[0], 'yyyy-MM-dd') : String(r[0]).slice(0, 10), w = want[d + '|' + String(r[1]).trim().toLowerCase()];
    if (!w) return;
    if (String(r[12]) !== String(w.speed)) { t.getRange(i + 2, 13).setValue(String(w.speed).slice(0, 80)); ch++; }
    if (!String(r[11]).trim() && w.net) { t.getRange(i + 2, 12).setValue(String(w.net).slice(0, 160)); ch++; }
  });
  return ch;
}
var sbDrainBaseWc27_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBaseWc27_.apply(this, arguments);
  try { const c = CacheService.getScriptCache(); if (!c.get('wc27')) { c.put('wc27', '1', 120); wcSpeed27_(); } } catch (e) { console.warn('wcSpeed27', e); }
  return r;
};
function zzWcSpeed27() { console.log('Time-in speed cells updated: ' + wcSpeed27_()); }
```

Steps: paste at the bottom of Code.gs (CupOfEnglish Teacher App) → Save → Run **zzWcSpeed27** (log: "Time-in speed cells
updated: N") → no new deployment needed (the minute job runs the saved code).

Undo: delete the block and save.
