# Server paste · Renewal month counts from the renewal date (27 Oct 2026 · 1356)

**What's wrong:** a package's carry-over is always what was left **on the renewal day**. The app's own renewal (Renewed · paid) already takes the lessons taught earlier that month off the renewal month (`=(formula)-n`). Older renewals never got that step, so their renewal month still counts lessons from **before** the renewal. Those lessons were already used up by the old package, so they are counted twice.

Example — Gaby ST-2023-087, renewed 22 Sep 2026 (33 + 4.5 carried = 37.5):
- September on ACTIVE: Julia 2 (5, 12, 19, 26 Sep) + Cy 3.5 (7, 8, 14, 15, 22, 28, 29 Sep) = 5.5.
- From 22 Sep only: Julia 0.5 (26) + Cy 1.5 (22, 28, 29) = **2.0**. Misty confirmed 2.0.
- Completed 9 → **5.5**, left 28.5 → **32**.

**What this paste does (31 students, 36 ACTIVE rows, 70.5 lessons in total):**
1. `zzRenew27Dry` changes nothing. It only logs, for every row: the month cell **before → after**, TOTAL FINISHED and AVAILABLE before → after.
2. `zzRenew27Run` makes the change on each row, the same way the app's renewal does:
   - if the cell is a formula: `=(formula)-n`;
   - if it is a number: the number minus n.
3. Each changed cell gets a note with the old formula/value, e.g. `renew27 · old: 3.5`. `zzRenew27Undo` puts every old value back.
4. **Safety:** a row is only changed if the student code, teacher and the cell's current value are exactly what was checked on 27 Oct. Any other row is skipped and logged as `SKIP`. A cell already ending in `)-n` is never changed twice.

After the real run, the database copies ACTIVE within about 5 minutes. The package check then keeps the new TOTAL FINISHED (it waits about 8 minutes to be sure). Management and the portal show the corrected numbers, and each student's 核对中 clears by itself.

## Step 1 · Paste at the very bottom of the last file

```javascript
// 27 Oct · 1356 · renewal month = lessons from the renewal date only (the carry-over is what was left on the renewal day).
// [ACTIVE row, code, teacher, month 'yyyy-MM', value checked on 27 Oct, lessons before the renewal date, package]
const RENEW27_FIX = [
  [294, 'ST-2023-013', 'Julia', '2026-06', 4, 1, 'ST-2023-013 Jim'],
  [280, 'ST-2023-042', 'Mayi', '2026-07', 3.5, 0.5, 'ST-2023-042 Levine'],
  [278, 'ST-2023-057', 'Julia', '2026-08', 5, 1, 'ST-2023-057 Catherine'],
  [271, 'ST-2023-065', 'Mayi', '2026-09', 3.5, 3.5, 'ST-2023-065 Nini'],
  [272, 'ST-2023-065', 'Cy', '2026-09', 2, 1.5, 'ST-2023-065 Nini'],
  [261, 'ST-2023-087', 'Julia', '2026-09', 2, 1.5, 'ST-2023-087 Gaby'],
  [262, 'ST-2023-087', 'Cy', '2026-09', 3.5, 2, 'ST-2023-087 Gaby'],
  [258, 'ST-2024-003', 'Mayi', '2026-09', 6, 6, 'ST-2024-003 Penny'],
  [250, 'ST-2024-034', 'Mayi', '2026-06', 4, 0.5, 'ST-2024-036 Kerry'],
  [247, 'ST-2024-038', 'Daniela', '2026-07', 6.5, 3, 'ST-2024-038 Roye'],
  [38, 'ST-2024-050', 'Pam', '2026-09', 2.5, 1.5, 'ST-2024-050 Grace'],
  [39, 'ST-2024-050', 'Dezza', '2026-09', 1.5, 1.5, 'ST-2024-050 Grace'],
  [238, 'ST-2024-072', 'Dezza', '2026-09', 4, 3, 'ST-2024-072 Ruby'],
  [235, 'ST-2024-087', 'Mayi', '2026-09', 3.5, 1.5, 'ST-2024-087 Evelyn'],
  [210, 'ST-2024-132', 'Kat', '2026-08', 4.5, 2, 'ST-2024-132 Ranran'],
  [178, 'ST-2025-011', 'Julia', '2026-02', 3, 1.5, 'ST-2025-011 Sunny'],
  [164, 'ST-2025-043', 'Kat', '2026-09', 4.5, 2, 'ST-2025-043 Cherry'],
  [152, 'ST-2025-065', 'Kat', '2026-09', 3, 2, 'ST-2025-065 Dario'],
  [145, 'ST-2025-075', 'Julia', '2026-08', 4, 0.5, 'ST-2025-075 Eddie'],
  [144, 'ST-2025-077', 'Mayi', '2026-06', 4, 2.5, 'ST-2025-077 Leo'],
  [140, 'ST-2025-080', 'April', '2026-09', 2, 0.5, 'ST-2025-080 Ryan'],
  [137, 'ST-2025-089', 'Daniela', '2026-08', 7, 3.5, 'ST-2025-089 Sia'],
  [123, 'ST-2025-110', 'April', '2026-06', 4, 3, 'ST-2025-110 Cici'],
  [108, 'ST-2025-129', 'April', '2026-09', 4, 3, 'ST-2025-129 Maria'],
  [94, 'ST-2026-010', 'April', '2026-09', 4, 2.5, 'ST-2026-010 Jake'],
  [296, 'ST-2026-018', 'Julia', '2026-08', 5, 1, 'ST-2026-018 Andy'],
  [82, 'ST-2026-024', 'April', '2026-09', 3, 1, 'ST-2026-024 Lucas'],
  [76, 'ST-2026-027', 'Daniela', '2026-07', 5.5, 2.5, 'ST-2026-027 Asher'],
  [72, 'ST-2026-042', 'Pam', '2026-08', 3.5, 2.5, 'ST-2026-042 Honey'],
  [65, 'ST-2026-048', 'Julia', '2026-09', 9, 2, 'ST-2026-048 Mandy'],
  [51, 'ST-2026-069', 'Kat', '2026-09', 5.5, 2, 'ST-2026-069 Freya'],
  [52, 'ST-2026-063', 'April', '2026-09', 8, 3, 'ST-2026-069 Freya'],
  [45, 'ST-2026-074', 'Pam', '2026-09', 4.5, 3.5, 'ST-2026-074 Lily'],
  [43, 'ST-2026-079', 'April', '2026-09', 2, 1, 'ST-2026-079 Sophia'],
  [28, 'ST-2026-095', 'April', '2026-09', 3, 0.5, 'ST-2026-095 Mia'],
  [29, 'ST-2026-094', 'Dezza', '2026-09', 3, 0.5, 'ST-2026-095 Mia'],
];
function renew27_(mode) {   // mode: 'dry' | 'run' | 'undo'
  const sh = sheet_(TAB.ACTIVE), n = sh.getLastRow(), v = sh.getRange(1, 1, n, 47).getValues(), F = sh.getRange(1, 1, n, 44).getFormulas(), mrow = v[1];
  const N = sh.getRange(1, 1, n, 44).getNotes(), out = [], r1 = x => Math.round(x * 10) / 10;
  const col = ym => { for (let j = 10; j < 44; j++) { const m = mrow[j]; if (m instanceof Date && fmt_(m, 'yyyy-MM') === ym) return j; } return -1; };
  if (mode === 'undo') {
    for (let i = 4; i < n; i++) for (let j = 10; j < 44; j++) { const t = String(N[i][j] || ''), k = t.indexOf('renew27 · old: '); if (k < 0) continue;
      const old = t.slice(k + 15).split('\n')[0]; const c = sh.getRange(i + 1, j + 1);
      if (old.charAt(0) === '=') c.setFormula(old); else c.setValue(old === '' ? '' : Number(old));
      c.setNote(t.slice(0, k).replace(/\n$/, '')); out.push('UNDO row ' + (i + 1) + ' ' + fmt_(mrow[j], 'MMM yy') + ' → ' + old); }
  } else RENEW27_FIX.forEach(([row, code, t, ym, from, minus, who]) => {
    const j = col(ym); if (j < 0) { out.push('SKIP ' + who + ' · no ' + ym + ' column'); return; }
    const same = i => i >= 4 && i < n && String(v[i][0]).trim().toUpperCase() === code && String(v[i][3]).trim().toLowerCase() === t.toLowerCase();
    let i = row - 1;
    if (!same(i)) { i = -1; for (let k = 4; k < n; k++) if (same(k) && Math.abs((Number(v[k][j]) || 0) - from) < 0.01) { i = k; break; } }
    if (i < 0) { out.push('SKIP ' + who + ' · ' + code + ' ' + t + ' row not found'); return; }
    const cur = Number(v[i][j]) || 0, f = String(F[i][j] || '');
    if (/\)\s*-\s*[\d.]+\s*$/.test(f)) { out.push('SKIP ' + who + ' · row ' + (i + 1) + ' already fixed (' + f + ')'); return; }
    if (Math.abs(cur - from) > 0.01) { out.push('SKIP ' + who + ' · row ' + (i + 1) + ' ' + ym + ' is ' + cur + ', checked value was ' + from + ' · left alone'); return; }
    const line = who + ' · row ' + (i + 1) + ' ' + t + ' · ' + ym + ' ' + cur + ' → ' + r1(cur - minus) +
      ' · TOTAL FINISHED ' + v[i][45] + ' → ' + r1((Number(v[i][45]) || 0) - minus) + (v[i][46] !== '' ? ' · AVAILABLE (row) ' + v[i][46] + ' → ' + r1((Number(v[i][46]) || 0) + minus) : '');
    if (mode !== 'run') { out.push('DRY ' + line); return; }
    const c = sh.getRange(i + 1, j + 1), old = f || (v[i][j] === '' ? '' : String(v[i][j]));
    if (f) c.setFormula('=(' + f.replace(/^=/, '') + ')-' + minus); else c.setValue(r1(cur - minus));
    c.setNote((N[i][j] ? N[i][j] + '\n' : '') + fmt_(new Date(), 'yyyy-MM-dd') + ' · lessons before the renewal date taken off (' + minus + ')\nrenew27 · old: ' + old);
    out.push('DONE ' + line);
  });
  SpreadsheetApp.flush();
  CacheService.getScriptCache().removeAll(['m:active', 'm:students', 'tab:TODAY::', 'renmap', 'untick', 'ready8']);
  console.log(out.join('\n')); console.log(JSON.stringify({ mode, rows: out.length, done: out.filter(x => /^DONE/.test(x)).length, skipped: out.filter(x => /^SKIP/.test(x)).length }));
  return out;
}
function zzRenew27Dry() { renew27_('dry'); }
function zzRenew27Run() { renew27_('run'); }
function zzRenew27Undo() { renew27_('undo'); }
```

## Step 2 · Save (Cmd+S / Ctrl+S), then the dry run
In the function menu choose **zzRenew27Dry** › **Run**. The last log line should read
`{"mode":"dry","rows":36,"done":0,"skipped":0}`, with 36 lines starting `DRY`. For example:
`DRY ST-2023-087 Gaby · row 261 Julia · 2026-09 2 → 0.5 · TOTAL FINISHED 4 → 2.5 · AVAILABLE (row) 28.5 → 30`
(the AVAILABLE on Julia's row also takes Cy's row into account in the sheet; the package total becomes 32).
Any `SKIP` line means that row changed since 27 Oct — send it to Claude before running.

## Step 3 · The real run
Choose **zzRenew27Run** › **Run**. The last line should read `{"mode":"run","rows":36,"done":36,"skipped":0}`.
No new deployment is needed (nothing here is called by the app).

## Undo
**zzRenew27Undo** › **Run** puts every old value back (it reads the `renew27 · old:` notes).

## Changes per student (lessons left = management's figure now → after)
| Student | Renewal date | Completed now → after | Left now → after |
|---|---|---|---|
| Jim ST-2023-013 | 2026-06-09 | −1 | 4 → 5 |
| Levine ST-2023-042 | 2026-07-07 | −0.5 | 13 → 13.5 |
| Catherine ST-2023-057 | 2026-08-13 | −1 | 9.5 → 10.5 |
| Nini ST-2023-065 | 2026-09-28 | −5 | 27 → 32 |
| Gaby ST-2023-087 | 2026-09-22 | −3.5 | 28.5 → 32 |
| Penny ST-2024-003 | 2026-09-29 | −6 | 57 → 63 |
| Kerry ST-2024-036 | 2026-06-03 | −0.5 | 10 → 10.5 |
| Roye ST-2024-038 | 2026-07-14 | −3 | 10 → 13 |
| Grace ST-2024-050 | 2026-09-18 | −3 | 8.5 → 11.5 |
| Ruby ST-2024-072 | 2026-09-22 | −3 | 30 → 33 |
| Evelyn ST-2024-087 | 2026-09-11 | −1.5 | — → — |
| Ranran ST-2024-132 | 2026-08-13 | −2 | 9.5 → 11.5 |
| Sunny ST-2025-011 | 2026-02-11 | −1.5 | 12.5 → 14 |
| Cherry ST-2025-043 | 2026-09-16 | −2 | 8 → 10 |
| Dario ST-2025-065 | 2026-09-23 | −2 | 10 → 12 |
| Eddie ST-2025-075 | 2026-08-04 | −0.5 | 20 → 20.5 |
| Leo ST-2025-077 | 2026-06-23 | −2.5 | 19 → 21.5 |
| Ryan ST-2025-080 | 2026-09-04 | −0.5 | 31 → 31.5 |
| Sia ST-2025-089 | 2026-08-17 | −3.5 | 19 → 22.5 |
| Cici ST-2025-110 | 2026-06-22 | −3 | 37.5 → 40.5 |
| Maria ST-2025-129 | 2026-09-22 | −3 | 8 → 11 |
| Jake ST-2026-010 | 2026-09-18 | −2.5 | 26.5 → 29 |
| Andy ST-2026-018 | 2026-08-06 | −1 | 14 → 15 |
| Lucas ST-2026-024 | 2026-09-16 | −1 | 11 → 12 |
| Asher ST-2026-027 | 2026-07-16 | −2.5 | 16.5 → 19 |
| Honey ST-2026-042 | 2026-08-25 | −2.5 | 28.5 → 31 |
| Mandy ST-2026-048 | 2026-09-09 | −2 | 53 → 55 |
| Freya ST-2026-069 | 2026-09-09 | −5 | 46.5 → 51.5 |
| Lily ST-2026-074 | 2026-09-24 | −3.5 | 11 → 14.5 |
| Sophia ST-2026-079 | 2026-09-13 | −1 | 32.5 → 33.5 |
| Mia ST-2026-095 | 2026-09-08 | −1 | 3 → 4 |

## Not changed · Misty decides (32 students)
The renewal-month value on ACTIVE is neither "whole month" nor "from the renewal date", or the database already has a correction on the rows. Units from the DAILY tabs (each teacher row of the package).

| Student | Renewal date | Teacher rows | Sheet value (renewal month) | Whole month | From renewal date | Note |
|---|---|---|---|---|---|---|
| Daisy ST-2021-002 | 2026-08-22 | Virgo r320 | 0 | 6 | 1 | sheet counts fewer than taught from the renewal date |
| James ST-2022-004 | 2026-03-24 | Misty r104 | 2 | 5 | 3 | sheet counts fewer than taught from the renewal date |
| Lucas ST-2022-040 | 2026-01-13 | Pam r305 | 6 | 7 | 3 | sheet is between the two counts |
| Shirui ST-2022-044 | 2026-03-21 | Mayi r308, Cy r309 | 5.5 | 5 | 2 | sheet counts more than the whole month |
| Una ST-2023-046 | 2026-08-06 | April r115, Dezza r116, Daniela r117, Kat r118 | 7.5 | 8 | 7 | sheet is between the two counts |
| Cynthia ST-2023-069 | 2026-02-18 | Julia r268, Mayi r269 | 5 | 2 | 1 | sheet counts more than the whole month |
| Judy ST-2024-053 | 2026-06-27 | Ara r242 | 3 | 4 | 1 | sheet is between the two counts |
| Dudu ST-2024-068 | 2026-01-08 | Pam r240 | 3 | 5 | 4 | sheet counts fewer than taught from the renewal date |
| Alice ST-2024-101 | 2026-04-13 | Lovely r228, Julia r229 | 3.5 | 3 | 1.5 | sheet counts more than the whole month |
| Arthur ST-2024-107 | 2026-02-23 | Daniela r226, Pam r227 | 0 | 2 | 0.5 | sheet counts fewer than taught from the renewal date |
| Amy ST-2024-130 | 2026-10-14 | Julia r286, Dezza r287, Daniela r288 | 1.5 | 4 | 3 | sheet counts fewer than taught from the renewal date |
| Jelly ST-2024-144 | 2026-02-09 | Mayi r204, Daniela r205, Dezza r206 | 3 | 3.5 | 2.5 | sheet is between the two counts |
| Mia ST-2024-148 | 2026-10-19 | Kat r202 | 3.5 | 4 | 2 | database already has a correction of -33 on these rows; sheet is between the two counts |
| Ethel ST-2024-152 | 2026-10-16 | Julia r197, Mayi r198 | 2.5 | 5 | 3.5 | sheet counts fewer than taught from the renewal date |
| Chenyu ST-2024-157 | 2026-03-15 | Mayi r195, Kat r196 | 2.5 | 1.5 | 0.5 | sheet counts more than the whole month |
| Lucas ST-2025-028 | 2026-04-29 | Pam r171 | 0.5 | 4.5 | 1 | sheet counts fewer than taught from the renewal date |
| Jenny ST-2025-031 | 2026-03-09 | Julia r147 | 0 | 5 | 3 | sheet counts fewer than taught from the renewal date |
| Anna ST-2025-034 | 2026-10-25 | Pam r168, Daniela r169, Ara r170 | 7 | 7 | 1 | database already has a correction of -35 on these rows |
| Cheery ST-2025-040 | 2026-08-18 | Mayi r165, Ara r166 | 0 | 2 | 0.5 | sheet counts fewer than taught from the renewal date |
| Gina ST-2025-047 | 2026-10-21 | Kat r163 | 3.5 | 4 | 1.5 | database already has a correction of -36 on these rows; sheet is between the two counts |
| Serena ST-2025-062 | 2026-08-23 | Julia r156 | 0.5 | 2.5 | 1 | sheet counts fewer than taught from the renewal date |
| Lucy ST-2025-064 | 2026-06-15 | Julia r153, Mayi r154 | 3 | 6.5 | 3.5 | sheet counts fewer than taught from the renewal date |
| Jinyu ST-2025-069 | 2025-09-11 | Kat r149 | 3.5 | 6 | 4 | sheet counts fewer than taught from the renewal date |
| Candy ST-2025-097 | 2026-09-10 | Kat r129 | 0 | 6.5 | 4.5 | sheet counts fewer than taught from the renewal date |
| Olivia ST-2025-121 | 2026-07-02 | April r111 | 4 | 5 | 4.5 | sheet counts fewer than taught from the renewal date |
| Mia ST-2026-017 | 2026-10-10 | April r90 | 2 | 4.5 | 3 | sheet counts fewer than taught from the renewal date |
| Zoe ST-2026-023 | 2026-09-15 | Kat r81 | 4 | 3.5 | 1.5 | sheet counts more than the whole month |
| Andrew ST-2026-059 | 2026-10-08 | Resa r56, Mayi r57 | 3.5 | 4 | 3 | sheet is between the two counts |
| Ellery ST-2026-067 | 2026-10-13 | Julia r47 | 2 | 4 | 3 | sheet counts fewer than taught from the renewal date |
| Lucian ST-2026-072 | 2026-10-16 | Kat r48 | 4 | 4.5 | 2.5 | database already has a correction of -15 on these rows; sheet is between the two counts |
| Leo ST-2026-101 | 2026-10-27 | April r22, April r23 | 0 | 9 | 2 | sheet counts fewer than taught from the renewal date |
| Vicky ST-2026-117 | 2026-10-10 | Rose r12, Dezza r13 | 4.5 | 6 | 5 | sheet counts fewer than taught from the renewal date |

## 核对中 · Being checked (student and partner portals) — 71 codes · live since 27 Oct (coe-student v13, coe-partner v13)
The portals check this themselves (renew.ts, read-only: packages, monthly values, DAILY tabs; refreshed every 2 minutes). A code shows 核对中 while its package's renewal month counts a different number than the lessons taught from the renewal date. After the real run, ACTIVE's TOTAL FINISHED drops, the package check keeps the correction (about 8 minutes later) and the code clears by itself — about 5–15 minutes in all. Verified live: Gaby, Una → 核对中; a control student (ST-2024-016) still shows 38 used / 34 left; Dr. Spring's list shows 核对中 for the affected students and numbers for the rest. Portal reconciliation now: 201 students · 126 shown · 75 核对中 (73 renewal month + Emma ST-2023-016 and Jun ST-2025-106, which were already waiting on a sheet difference).

ST-2021-002, ST-2022-004, ST-2022-040, ST-2022-044, ST-2023-013, ST-2023-042, ST-2023-046, ST-2023-057, ST-2023-065, ST-2023-069, ST-2023-087, ST-2024-003, ST-2024-034, ST-2024-036, ST-2024-038, ST-2024-050, ST-2024-053, ST-2024-068, ST-2024-072, ST-2024-087, ST-2024-101, ST-2024-107, ST-2024-130, ST-2024-132, ST-2024-144, ST-2024-148, ST-2024-152, ST-2024-157, ST-2025-011, ST-2025-028, ST-2025-031, ST-2025-034, ST-2025-040, ST-2025-043, ST-2025-047, ST-2025-062, ST-2025-064, ST-2025-065, ST-2025-069, ST-2025-075, ST-2025-077, ST-2025-080, ST-2025-089, ST-2025-097, ST-2025-110, ST-2025-118, ST-2025-121, ST-2025-129, ST-2026-010, ST-2026-017, ST-2026-018, ST-2026-023, ST-2026-024, ST-2026-027, ST-2026-042, ST-2026-048, ST-2026-059, ST-2026-063, ST-2026-067, ST-2026-069, ST-2026-072, ST-2026-074, ST-2026-079, ST-2026-085, ST-2026-094, ST-2026-095, ST-2026-100, ST-2026-101, ST-2026-114, ST-2026-117, ST-2026-118
