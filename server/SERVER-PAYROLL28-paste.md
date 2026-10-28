# Server paste · Payroll up to date within a minute + Mark paid for this month (PAYROLL28)

**Why** (Misty 12:17: Katherine and Rose not on October payroll):
1. **The copy is behind.** The database copy of PAYROLL was last taken at 11:36. PAYROLL is copied on a slow rotation, and edits to TIME-IN (where Katherine's ₱5,000 lives) never mark PAYROLL as changed.
2. **₱0 rows are hidden.** The payroll list drops any row whose net is ₱0, which can also hide a row that has base pay or units.
3. **No Mark paid for October.** Mark paid only works on the PAY tab's month (September), so a payment made early for October cannot be recorded from the app.

**What it does:**
1. **Copied every minute.** PAYROLL, PAY and TIME-IN go to the database every minute when they have changed. Only changed rows are sent, about 1–2 s of Google time a minute. Google's payroll answer is refreshed at the same time.
2. **No row with pay is hidden.** Any row with base pay, units, lesson pay, bonus, gross or net is shown.
3. **`markPaidMonth`.** The President can mark a person paid (or undo it) for a given month. It writes the payment date into PAYROLL › DATE OF PAYMENT, the same way Mark paid does. The app shows a Mark paid button on this month's Pending cards (release 1367).
   - It does not tick the PAY tab or save the payslip PDF. Those stay with the month-end PAY flow.
4. **Nothing else changes.** No pay amounts change.

**When:** now is fine. It only reads and copies, plus writes the payment date when Misty taps Mark paid.

## Step 1 · paste at the very bottom of Code.gs
```
/* ═════ 28 Oct · PAYROLL28 · Finance › Payroll up to date within a minute · rows with any pay are shown · Mark paid for a given month ═════ */
var sbDrainBasePR28_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBasePR28_.apply(this, arguments);
  try { const sent = sbSyncSomeBase_([TAB.PAYROLL, TAB.PAY, 'TIME-IN'], 'pr28', 60, 120); if (sent) CacheService.getScriptCache().removeAll(['m:payroll', 'm:overview', 'tab:PAY::']); } catch (e) { console.warn('PAYROLL28 copy', e); }
  return r;
};
mgmtPayroll_ = function () {
  const cache = CacheService.getScriptCache(), hit = getBig_(cache, 'm:payroll'); if (hit) return hit;
  const sh = sheet_(TAB.PAYROLL), last = sh.getLastRow(), head = sh.getRange(1, 1, 1, 18).getDisplayValues()[0];
  const n = s => num_(String(s).replace(/[^\d.-]/g, ''));
  const rows = last > 3 ? sh.getRange(4, 1, last - 3, 18).getDisplayValues().filter(r => r[1] && [3, 4, 5, 6, 8, 9, 15, 16].some(j => n(r[j]) !== 0)) : [];
  const out = { head: head, rows: rows }; putBig_(cache, 'm:payroll', out, 300); return out;
};
function markPaidMonth(token, name, ym, paid) {
  const u = pres_(token); name = String(name || '').trim(); ym = String(ym || '');
  if (!name || !/^\d{4}-\d{2}$/.test(ym)) return { ok: false, msg: 'Choose a person and a month.' };
  const P = sheet_(TAB.PAYROLL), last = P.getLastRow(), t = name.toLowerCase(), today = startOfDay_(new Date()); let n = 0;
  if (last > 3) P.getRange(4, 1, last - 3, 3).getValues().forEach((r, i) => {
    if (String(r[1]).trim().toLowerCase() !== t || !(r[2] instanceof Date) || fmt_(r[2], 'yyyy-MM') !== ym) return;
    if (paid && r[0] === '') { P.getRange(i + 4, 1).setValue(today); n++; } else if (!paid && r[0] !== '') { P.getRange(i + 4, 1).clearContent(); n++; } });
  if (!n) return { ok: false, msg: paid ? name + ' has no unpaid PAYROLL row for ' + ym + '.' : 'Nothing to undo.' };
  CacheService.getScriptCache().removeAll(['tab:PAY::', 'm:overview', 'm:payroll', 'tc:' + t, 'p:' + t, 'mypay:' + t]);
  try { sbDirty_([TAB.PAYROLL, TAB.PAY]); } catch (e) { }
  return { ok: true, n: n, note: name + (paid ? ' marked paid' : ' marked to pay') + ' for ' + ym + ' · PAYROLL updated · ' + u.name };
}
API_FNS.push('markPaidMonth');
/** Run once now: copies PAYROLL, PAY and TIME-IN to the database straight away. */
function zzPayroll28() { CacheService.getScriptCache().remove('pr28'); console.log('Rows copied: ' + sbSyncSomeBase_([TAB.PAYROLL, TAB.PAY, 'TIME-IN'], 'pr28', 60, 120)); CacheService.getScriptCache().removeAll(['m:payroll', 'm:overview', 'tab:PAY::']); }
```

## Step 2 · save, run once, publish
1. Press **Ctrl+S** (Mac: **Cmd+S**).
2. Choose **zzPayroll28** → **Run**. The log shows how many rows were copied.
3. **Deploy › Manage deployments ›** pencil icon › **New version** › **Deploy**. This is needed because `markPaidMonth` is an app action.

## Rose's October row (fix by hand, 1 minute)
Her row (PAYROLL row 51 at 12:30) has only her name and month, with no formulas, so it adds up to ₱0 and is hidden.
1. Select **PAYROLL D50:R50** (Resa's October row, just above) → **Copy**.
2. Click **D51** (Rose) → **Paste**. The formulas follow to row 51.
3. Check that **L51:O51** (SSS / Pag-IBIG / PhilHealth / BIR) are empty or right for Rose.

Her October then reads 3 units × ₱150 = ₱450, plus the ₱300 recognition bonus (ACTIONS) = **₱750**, the same as her own Pay screen.

## Undo
Delete the pasted block, save, and deploy a new version.
