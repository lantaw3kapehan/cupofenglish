# Server paste · Fixed monthly pay + missing payroll rows (FIXPAY28)

**Why:** Finance › Payroll leaves out anyone whose PAYROLL row for the month adds up to ₱0. Two people are missing from October:
- **Katherine.** Her fixed ₱5,000 was typed by hand into her month-end TIME-IN row every month (31 Jul, 31 Aug, 30 Sep). For October it hasn't been typed yet, so her PAYROLL row is ₱0 and she is hidden.
- **Rose.** She was hired 4 Oct and has taught 6 classes (Weiwei, ST-2026-118). She has no PAYROLL row at all, and no PAY-tab row either, so she would not be paid.

**What it does** (for everyone, every month; the app asks Google to run it every 30 minutes):
1. **Fixed pay.** For each person in the database setting `sys:fixedpay` (now: Katherine ₱5,000), it fills a blank month-end TIME-IN amount for this month, and for last month while it is unpaid.
   - It never overwrites an amount that was typed, and never touches a paid month.
   - PAYROLL, the PAY tab, payslip and Mark paid then work exactly as in September.
2. **Missing or incomplete PAYROLL rows.** A row typed by hand with only a name and month (like Rose's row 50, added 11:56) gets the standard formulas. Anyone who taught that month (the class calendar), is on T-DASH and has no PAYROLL row for this month or last month (while unpaid) gets one.
   - The row is copied from a colleague's row for the same month, so every formula is the standard one: units, rate, bonus, deductions, gross, net, status.
   - Every row it adds is logged.
3. **Nothing else changes.** No other teacher's pay is affected, and September (all paid) is untouched.

**When:** before 16:00 or after 22:00. About 3 minutes.

## Step 1 · paste at the very bottom of Code.gs
```
/* ═════ 28 Oct · FIXPAY28 · fixed monthly pay + missing PAYROLL rows (Misty: "Katherine monthly 5000 is not showing") ═════
   1) Fixed pay (database setting sys:fixedpay): a blank month-end TIME-IN amount gets the monthly amount (this month, and last month while unpaid).
   2) Anyone who taught this month (or last month, while unpaid) and has no PAYROLL row gets one, copied from a colleague's row of that month.
   Typed amounts and paid months are never changed. */
function fixPay28_() {
  const out = [], now = new Date(), months = [fmt_(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM'), fmt_(new Date(now.getFullYear(), now.getMonth() - 1, 1), 'yyyy-MM')];
  const P = sheet_(TAB.PAYROLL), monthRows = ym => { const n = P.getLastRow(), v = P.getRange(1, 1, n, 3).getValues(), L = [];
    v.forEach((r, i) => { if (i >= 3 && r[1] && r[2] instanceof Date && fmt_(r[2], 'yyyy-MM') === ym) L.push({ row: i + 1, name: String(r[1]).trim(), paid: r[0] !== '' }); }); return L; };
  // 1) fixed pay
  let F = []; try { const d = (sbReq_('GET', 'docs?select=data&key=eq.sys:fixedpay') || [])[0]; F = (d && d.data && d.data.list) || []; } catch (e) { console.warn('fixpay list', e); }
  const ti = tiSheet_();
  if (ti) months.forEach(ym => F.forEach(x => {
    const name = String(x.name || '').trim(), amt = Number(x.monthly) || 0; if (!name || !amt || (x.from && ym < x.from)) return;
    const row = monthRows(ym).find(r => r.name.toLowerCase() === name.toLowerCase()); if (row && row.paid) return;   // paid months stay as they are
    const y = +ym.slice(0, 4), m = +ym.slice(5, 7), ds = fmt_(new Date(y, m, 0), 'yyyy-MM-dd');                   // last day of the month
    const v = ti.getRange(1, 1, ti.getLastRow(), 6).getValues();
    let r = v.findIndex(q => ymd_(q[0]) === ds && String(q[1]).trim().toLowerCase() === name.toLowerCase()) + 1;
    if (!r) { if (!tiSync_(name, ds, '', '')) return; const v2 = ti.getRange(1, 1, ti.getLastRow(), 2).getValues(); r = v2.findIndex(q => ymd_(q[0]) === ds && String(q[1]).trim().toLowerCase() === name.toLowerCase()) + 1; if (!r) return; }
    const c = ti.getRange(r, 6), typed = c.getFormula() === '' && c.getValue() !== '';
    if (typed) return;                                                                                              // an amount someone typed is kept
    c.setValue(amt); out.push('fixed pay ' + name + ' ' + ym + ' ₱' + amt + ' (TIME-IN row ' + r + ')');
  }));
  // 2) missing PAYROLL rows
  const TD = table_(TAB.TDASH, 'TOTAL LIFETIME UNITS').rows.map(r => String(r[1] || '').trim()).filter(Boolean), proper = {};
  TD.forEach(n => proper[n.toLowerCase()] = n);
  months.forEach(ym => {
    const L = monthRows(ym); if (!L.length) return;                                                                 // the month is not set up yet
    if (L.length && L.every(r => r.paid)) return;                                                                   // month closed
    const y = +ym.slice(0, 4), m = +ym.slice(5, 7), from = ym + '-01', to = fmt_(new Date(y, m, 1), 'yyyy-MM-dd');
    let C = []; try { C = sbReq_('GET', 'classes?select=data&day=gte.' + from + '&day=lt.' + to + '&cancelled=eq.false&starts_at=lt.' + encodeURIComponent(new Date().toISOString()) + '&limit=5000') || []; } catch (e) { console.warn('fixpay classes', e); return; }
    const taught = {}; C.forEach(x => { const t = String(((x.data || {}).teachers || [])[0] || '').trim().toLowerCase(); if (t) taught[t] = 1; });
    const have = {}; L.forEach(r => have[r.name.toLowerCase()] = 1);
    const tpl = L.find(r => !r.paid && P.getRange(r.row, 5).getFormula()) || L.find(r => P.getRange(r.row, 5).getFormula()); if (!tpl) return;
    L.forEach(r => {                                                                                                // a row typed by hand (name + month only) gets the standard formulas
      if (r.paid || P.getRange(r.row, 5).getFormula() || r.row === tpl.row) return;
      [[4, 8], [16, 3]].forEach(([c0, n]) => P.getRange(tpl.row, c0, 1, n).copyTo(P.getRange(r.row, c0, 1, n), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false));
      out.push('PAYROLL row completed · ' + r.name + ' · ' + ym + ' (row ' + r.row + ': formulas D–K and P–R)');
    });
    Object.keys(taught).forEach(t => {
      if (have[t] || !proper[t]) return;
      const last = Math.max.apply(null, monthRows(ym).map(r => r.row));
      P.insertRowAfter(last); const nr = last + 1, W = P.getLastColumn();
      P.getRange(tpl.row >= nr ? tpl.row + 1 : tpl.row, 1, 1, W).copyTo(P.getRange(nr, 1, 1, W));                  // formulas + format of a colleague's row
      P.getRange(nr, 1).clearContent(); P.getRange(nr, 2).setValue(proper[t]);
      [12, 13, 14, 15, 19].forEach(j => { if (j <= W && !P.getRange(nr, j).getFormula()) P.getRange(nr, j).clearContent(); });   // SSS / Pag-IBIG / PhilHealth / BIR and rank-up date are per person
      have[t] = 1; out.push('PAYROLL row added · ' + proper[t] + ' · ' + ym + ' (row ' + nr + ')');
    });
  });
  if (out.length) { CacheService.getScriptCache().removeAll(['m:payroll', 'm:overview', 'tab:PAY::']); console.log(out.join('\n')); }
  return out;
}
var sbDrainBaseFP28_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBaseFP28_.apply(this, arguments);
  try { const c = CacheService.getScriptCache(); if (!c.get('fp28')) { c.put('fp28', '1', 1800); fixPay28_(); } } catch (e) { console.warn('FIXPAY28', e); }
  return r;
};
/** Run once now: fills Katherine's October amount and adds Rose's October row; the log lists every change. */
function zzFixPay28() { const L = fixPay28_(); console.log(L.length ? L.join('\n') : 'Nothing to change'); }
```

## Step 2 · save, run once, publish
1. Press **Ctrl+S** (Mac: **Cmd+S**).
2. In the function list at the top, choose **zzFixPay28** and click **Run**. The log should say:
   - `fixed pay Katherine 2026-10 ₱5000 (TIME-IN row 3)`
   - `PAYROLL row added · Rose · 2026-10 (row …)`
3. **Deploy › Manage deployments ›** pencil icon › **New version** › **Deploy**.

## After running
- **Finance › Payroll › October** shows Katherine (₱5,000) and Rose (her classes at her T-DASH rate), Pending. Mark paid and payslip work as for everyone else.
- **Rose's government contributions** (SSS / Pag-IBIG / PhilHealth / BIR, columns L–O) start empty. Fill them in PAYROLL if they apply to her.
- **November:** Rose has no November PAYROLL row either, and the paste adds it once she teaches in November. Add her to whatever creates next month's PAYROLL rows, so she is listed from the 1st.
- **Undo:** delete the pasted block, save, and deploy a new version. To undo the two changes it made, clear TIME-IN F3 and delete Rose's added October PAYROLL row.
