# SERVER-RENEWRULE28 · Google's "Renewed · paid" follows the renewal rule (paste into Code.gs)

**Why.** Lucy (ST-2024-139) renewed at 22:17 on 28 Oct. Her 20:30 class with Dezza had ended, but the sheet hadn't counted it yet: S-MONTHLY copies lessons with a lag. So Google recorded CARRY OVER **3** when only **2.5** was left. The renewal date was 28 Oct, so the sheet then counted that class in the new package (3 + 33 − 0.5).

The rule (Misty, 28 Oct 22:27): a class that ended before the renewal belongs to the old package, even on the same day.

**What the database and app already do, live since release 1540.** They work with or without this paste.

- The database counter takes that lesson off the recorded carry (`coe_renew_at.early`) and never counts it in the new package.
- The renewal form waits (核对中) when Google's "lessons left" doesn't match the classes held. Without this paste, a same-day renewal after a class has to wait until ACTIVE counts the class.

**What this paste changes in Google.** The renewal records the real leftover at once, the renewal date is the first class after the renewal, and the result returns `early`. Once `early` is there, the app knows Google already handled it, so the form doesn't wait. Nothing else changes.

## 1 · `renewStart_` — the new package starts with the first class *after* the renewal

Replace this line:

```js
    const t0 = d.getTime(), L = stuClasses_(code).filter(e => !e.cancelled && !/-TC\s*$/i.test(String(e.title || '').replace(/\s+X$/i, '')) && new Date(e.start).getTime() >= t0);
```

with:

```js
    // 1540: paid today → classes from now on; paid on an earlier day (recorded later) → from the next day (that day's classes were before the renewal)
    const today = fmt_(new Date(), 'yyyy-MM-dd'), dd = fmt_(d, 'yyyy-MM-dd');
    const t0 = dd === today ? Date.now() : dd < today ? d.getTime() + 864e5 : d.getTime();
    const L = stuClasses_(code).filter(e => !e.cancelled && !/-TC\s*$/i.test(String(e.title || '').replace(/\s+X$/i, '')) && new Date(e.start).getTime() >= t0);
```

## 2 · New helper (paste anywhere, e.g. right after `renewStart_`)

```js
/* 1540 · lessons that ended before now, in the renewal month, that ACTIVE has not counted yet (S-MONTHLY lag), per ACTIVE row.
   Only the last 48 h: the lag. They belong to the OLD package. Units: 25 min = 0.5, 50 min = 1 (same as the database counter). */
function renewEarly_(code, v, idx, mc, d) {
  const out = {}, now = Date.now(), ym = fmt_(d, 'yyyy-MM');
  if (ym !== fmt_(new Date(), 'yyyy-MM')) return out;
  const L = stuClasses_(code).filter(e => !e.cancelled && !/-(TC|SC)\s*$/i.test(String(e.title || '').replace(/\s+X$/i, '')) && new Date(e.end).getTime() <= now);
  idx.forEach(i => {
    const t = String(v[i][3]).trim().toLowerCase(); let cal = 0, u48 = 0;
    L.forEach(e => {
      if (String(e.teacher || '').trim().toLowerCase() !== t) return;
      const s = new Date(e.start).getTime(), en = new Date(e.end).getTime(), u = Math.round((en - s) / 6e4 / 50 * 2) / 2;
      if (fmt_(new Date(s), 'yyyy-MM') === ym) cal += u;
      if (en > now - 48 * 3600e3) u48 += u;
    });
    const e = Math.max(0, Math.min(u48, cal - num_(v[i][mc])));
    if (e > 0) out[i] = Math.round(e * 10) / 10;
  });
  return out;
}
```

## 3 · `mgmtRenewPaid`, four small edits

**a)** Find:

```js
const avail = num_(v[ri][46]), J = num_(v[ri][9]), monthSoFar = num_(v[ri][mc]);
```

Add these lines **right after** it. They move the `rows` list up and add the early lessons:

```js
const rows = [ri]; for (let i = 4; i < v.length; i++) if (i !== ri && (up(v[i][51]) || up(v[i][0])) === grp && String(v[i][9]) === '' && up(v[i][0]) === code) rows.push(i);
const EA = renewEarly_(code, v, rows, mc, d), early = Math.round(Object.keys(EA).reduce((a, k) => a + EA[k], 0) * 10) / 10, left = Math.round((avail - early) * 10) / 10;   // 1540
```

**b)** In `const info = { ... }`, find:

```js
ok: true, row: row, teacher: String(v[ri][3]), name: String(v[ri][1]), left: avail, pkg: pkg, free: free, total: Math.round((avail + tot) * 10) / 10,
```

and replace it with:

```js
ok: true, row: row, teacher: String(v[ri][3]), name: String(v[ri][1]), left: left, early: early, pkg: pkg, free: free, total: Math.round((left + tot) * 10) / 10,
```

**c)** **Delete** the old `rows` line further down, because it now sits higher up:

```js
const rows = [ri]; for (let i = 4; i < v.length; i++) if (i !== ri && (up(v[i][51]) || up(v[i][0])) === grp && String(v[i][9]) === '' && up(v[i][0]) === code) rows.push(i);
```

In the `rows.forEach` just below it, find:

```js
const r1 = i + 1, pre = num_(v[i][mc]);
```

and replace it with:

```js
const r1 = i + 1, pre = Math.round((num_(v[i][mc]) + (EA[i] || 0)) * 10) / 10;   // 1540: + lessons held before the renewal, not counted yet
```

**d)** Find:

```js
const target = Math.round((avail + tot) * 10) / 10;
```

and replace it with:

```js
const target = Math.round((left + tot) * 10) / 10;   // 1540
```

In the CARRY OVER note, change `avail + ' left from the last package'` to:

```js
left + ' left from the last package' + (early ? ' (' + early + ' held before the renewal, not yet in S-MONTHLY)' : '')
```

## 4 · Deploy

Deploy → Manage deployments → Edit → **New version** → Deploy.

**Test.** Open "Renewed · paid" for any student; nothing is saved until you press Save. The dry run now returns `early` (0 for most students). The app then saves without the 核对中 wait.

**Undo.** Restore the previous version in Manage deployments. The app keeps working either way.
