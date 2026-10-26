# Paste · 26 Oct · "Got it" saved in the database reaches Google's Messages sheet (read receipts right for management)

**Approved by Misty 26 Oct 16:30** ("Yes, write a paste to make Google catch up").

**What's wrong (real data):** two teachers tapped "Got it" and the app saved it in the database, but Google's Messages sheet
never got it (the database noted "Recorded in the database (Google step skipped)"). So management's read receipts still say
"not answered":
- **Ara** · message MS-261018191536-270 (Celine, 18 Oct 19:15) · Got it on 23 Oct 18:25
- **Lovely** · message MS-261023181242-922 (CupOfEnglish, 23 Oct 18:12) · Got it on 23 Oct 18:25

(Since 26 Oct the teacher's own app already shows them answered — release 1180. This paste fixes management's side.)

**What this paste does (nothing else changes):**
1. Reads the database's confirmed "Got it" saves (`writes`, fn tMsgAck, status done, last 30 days) with the sign-in settings
   the script already has (`sbCfg_` / `sbReq_`).
2. For each one, finds the message in the Messages sheet. Only when the message really belongs to that teacher and its
   **SEEN AT / ACK AT** cells are still empty, it fills them with the time the teacher tapped (and REACT, e.g. "✓ Got it",
   when that cell is empty and the message is not a memo). Cells that already have a value are never touched → running it
   twice changes nothing. No other row or column is written.
3. Runs by itself every 10 minutes inside the existing inbox job (`sbDrain`), so any future "Got it" that misses Google is
   caught up automatically.

## Step 1 · Paste at the very bottom of **Code.gs** in the **CupOfEnglish Teacher App** project (the only .gs file)

```javascript
// 26 Oct · "Got it" saved in the database (status done) is copied into the Messages sheet when Google missed it. Safe to paste once.
function ackSync26_() {
  if (!sbCfg_()) return { checked: 0, fixed: [] };
  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const W = sbReq_('get', 'writes?fn=eq.tMsgAck&status=eq.done&created_at=gte.' + encodeURIComponent(since) + '&select=id,who,args,created_at&order=id.asc&limit=1000') || [];
  if (!W.length) return { checked: 0, fixed: [] };
  msgDrop_(); const R = msgRows_(), byId = {}; R.forEach(r => { if (!r.parent) byId[r.id] = r; });
  const sh = msgSheet_(), fixed = [];
  W.forEach(w => {
    const a = Array.isArray(w.args) ? w.args : [], id = String(a[1] || ''), react = String(a[2] || '');
    if (!/^MS-/.test(id)) return; const r = byId[id]; if (!r) return;
    const owner = String(r.role === 'mgmt' ? r.to : r.from).trim().toLowerCase(); if (!owner || owner !== String(w.who || '').trim().toLowerCase()) return;
    if (r.ack) return;                                                     // already answered in the sheet: leave it
    const at = new Date(w.created_at);
    if (!r.seen) sh.getRange(r.row, 7).setValue(at);
    sh.getRange(r.row, 8).setValue(at);
    if (react && MSG_REACTS.indexOf(react) > -1 && r.kind !== 'memo' && !r.react) sh.getRange(r.row, 15).setValue(react);
    r.ack = 'x'; fixed.push(w.who + ' · ' + id + ' · ' + (react || 'Got it') + ' · ' + fmt_(at, 'yyyy-MM-dd HH:mm'));
  });
  if (fixed.length) msgDrop_();
  return { checked: W.length, fixed: fixed };
}
var sbDrainBaseAck26_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBaseAck26_.apply(this, arguments);
  try { const c = CacheService.getScriptCache(); if (!c.get('ack26')) { c.put('ack26', '1', 600); ackSync26_(); } } catch (e) { console.warn('ackSync26', e); }
  return r;
};
/** Run once now: copies the missed "Got it" into the Messages sheet and lists what it fixed. */
function zzAckSync26() { const r = ackSync26_(); console.log('checked ' + r.checked + ' · fixed ' + r.fixed.length + (r.fixed.length ? '\n' + r.fixed.join('\n') : '')); }
```

## Step 2 · Save (Cmd+S). Choose **zzAckSync26** next to Debug → **Run**.
The log should say something like `checked 80 · fixed 2` and list:
- `Ara · MS-261018191536-270 · ✓ Got it · 2026-10-23 18:25`
- `Lovely · MS-261023181242-922 · ✓ Got it · 2026-10-23 18:25`

Run it a second time: it must say `fixed 0` (nothing is written twice).

## Step 3 · Deploy?
**Not needed.** The inbox job (sbDrain) runs on a time trigger and uses the saved code straight away (same as the earlier
video-list paste). Deploying a new version is harmless if you prefer.

## If something looks wrong
Delete the pasted block and save. Anything already copied stays (it is the teacher's real "Got it" time).
