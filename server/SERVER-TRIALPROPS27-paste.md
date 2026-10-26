# Paste · 27 Oct · Trial report form opens straight from the database

**Why:** the trial report form still waits for Google (5–8 s on first open) because three things only Google knows:
the form's questions (the Google Form), the "report already sent" notes it keeps for reports sent in the app, and the
"Ask teacher to redo" notes (Script Properties `trp:` / `trredo:`). The database cannot see these.

**What this paste does (nothing else changes):**
1. Copies those three things — plus the family details from S-ENQUIRIES that the form shows — into the database
   (one record, `sys:trstate`). Read-only on the sheets; it writes nothing to any sheet or property.
2. Copies again right after a teacher sends a trial report, right after management uses "Ask teacher to redo", and every
   10 minutes inside the existing inbox job (`sbDrain`), so the copy stays current.
3. The app (release 1251, already live) switches to the database by itself as soon as this copy exists. Until then the form
   opens exactly as before. Google still checks each trial once a day in the background; any difference is logged.

## Step 1 · Paste at the very bottom of **Code.gs** in the **CupOfEnglish Teacher App** project (the only .gs file)

```javascript
// 27 Oct · trial report form from the database: copy the form questions, "report sent" / "redo" notes and family details to sys:trstate
function trState27_() {
  if (!sbCfg_()) return null;
  const PP = PropertiesService.getScriptProperties().getProperties(), trp = {}, trredo = {};
  Object.keys(PP).forEach(k => {
    if (k.indexOf('trp:') === 0) { try { trp[k.slice(4)] = JSON.parse(PP[k]); } catch (e) { } }
    else if (k.indexOf('trredo:') === 0) { try { trredo[k.slice(7)] = JSON.parse(PP[k]); } catch (e) { } }
  });
  const fam = {};
  try { const sh = ss_().getSheetByName('S-ENQUIRIES');
    if (sh && sh.getLastRow() >= 2 && sh.getLastColumn() >= 15) {
      sh.getRange(2, 1, Math.min(600, sh.getLastRow() - 1), 15).getValues().forEach(r => {
        const k = String(r[13] || '').trim().toLowerCase(); if (!k || (k in fam)) return;      // first row wins, like the form
        fam[k] = (r[14] || r[7]) ? { details: String(r[14] || ''), goal: String(r[7] || ''), age: String(r[5] || '') } : null; }); } } catch (e) { }
  const data = { at: new Date().toISOString(), trp: trp, trredo: trredo, fam: fam, form: trForm_(), levels: TR_LEVELS };
  sbReq_('post', 'docs?on_conflict=key', [{ key: 'sys:trstate', scope: 'mgmt', data: data, updated_at: new Date().toISOString() }], 'resolution=merge-duplicates,return=minimal');
  return { sent: Object.keys(trp).length, redo: Object.keys(trredo).length, families: Object.keys(fam).length, questions: data.form.rate.length + data.form.text.length };
}
(function () {
  const S0 = globalThis.tTrialSubmit, R0 = globalThis.mgmtTrialReturn;
  if (typeof S0 !== 'function' || typeof R0 !== 'function' || S0.__t27) return;
  const S1 = function () { const r = S0.apply(this, arguments); try { if (r && r.ok) trState27_(); } catch (e) { console.warn('trState27 submit', e); } return r; };
  const R1 = function () { const r = R0.apply(this, arguments); try { if (r && r.ok) trState27_(); } catch (e) { console.warn('trState27 redo', e); } return r; };
  S1.__t27 = 1; R1.__t27 = 1;
  globalThis.tTrialSubmit = S1; globalThis.mgmtTrialReturn = R1;
  try { tTrialSubmit = S1; mgmtTrialReturn = R1; } catch (e) { }
})();
var sbDrainBaseTr27_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBaseTr27_.apply(this, arguments);
  try { const c = CacheService.getScriptCache(); if (!c.get('tr27')) { c.put('tr27', '1', 600); trState27_(); } } catch (e) { console.warn('trState27', e); }
  return r;
};
/** Run once now: copies everything and says how much. */
function zzTrialState27() { const r = trState27_(); console.log(r ? 'Trial form copied · ' + r.sent + ' reports sent in the app · ' + r.redo + ' redo notes · ' + r.families + ' families · ' + r.questions + ' questions' : 'Not copied: database sign-in (SB_URL / SB_KEY) missing'); }
```

## Step 2 · Save (Cmd+S). Choose **zzTrialState27** next to Debug → **Run**.
The log says something like `Trial form copied · 12 reports sent in the app · 1 redo notes · 2 families · 11 questions`
(11 questions = 9 ratings + 2 comment boxes).

## Step 3 · Deploy › Manage deployments › pencil › **New version** › Deploy
Needed because the copy after "send report" / "ask to redo" runs inside the web app.

## If something looks wrong
Delete the pasted block, save and deploy a new version. The app goes back to asking Google (nothing is lost: the copy is
only read by the app).
