# SERVER-SRCFIX31 · the Source on a new ACTIVE package row comes from the student record (Apps Script paste)

**Why (31 Oct, Lucy ST-2026-131):** `mgmtEnrolPaid` inserts the new package at ACTIVE row 6 by copying a template row. The Source cell (column BA) kept the copied student's partner, so Lucy (referred by Joy ST-2023-012) showed "Jinan – Dr. Spring". Same as Ying ST-2026-119 before. The student record and SALES were right.

**What it does:** after every saved **Enrolled · paid** or **Renewed · paid** (not the dry checks), it writes the package row's Source (ACTIVE column BA) from the student's SOURCE in the **Supabase database** (`coe_students`, the original for students since 16 Oct). It falls back to the DATABASE sheet column W only if the database can't be read. A leading "Partner – " is dropped, so partners read the same as today ("Jinan – Dr. Spring"). If the student has no source, the cell is left empty rather than showing someone else's. It then marks ACTIVE changed, so the database copy of the package (`coe_packages.source`) follows on the next sync.

**Behaviour otherwise unchanged:** the wrapper returns exactly what the original returns; a failed or dry call is untouched; the Source write is in try/catch, so it can never fail a save. The result gets `srcFix: '<value>'` for the log.

**Paste:** at the **end of Code.gs**, then **Save + Deploy** (new version of the web app).

**After pasting, once:**
- `zzSrcFixOne31`: fixes Lucy's active row(s) (ST-2026-131). To fix another student, change the code at the top of the function.
- `zzSrcCheck31`: lists every active ACTIVE row whose Source differs from the student record. Report only (Executions log), changes nothing.

**Undo:** delete the whole block, from `// ═════ 31 Oct · SRCFIX31` to `// ═════ END SRCFIX31 ═════`, then Save + Deploy.

**Live names it relies on:** `mgmtEnrolPaid`, `mgmtRenewPaid`, `sheet_`, `TAB.ACTIVE`, `TAB.DB`, `sbReq_`, `sbCfg_`, `sbDirty_` (skipped if missing). ACTIVE row 1 has "SOURCE" in column BA (index 52), the Active tick in column AV (index 47); `coe_students.data[22]` / DATABASE column W is SOURCE.

```javascript
// ═════ 31 Oct · SRCFIX31 · the Source on a new ACTIVE package row comes from the student record (SAVE + DEPLOY) ═════
// After a saved mgmtEnrolPaid / mgmtRenewPaid, ACTIVE column BA (Source) of the package row = the student's SOURCE from the Supabase
// database (coe_students.data[22]; DATABASE sheet column W if the database can't be read), without a leading "Partner – ".
// The copied template row used to leave another student's partner there (Lucy ST-2026-131, Ying ST-2026-119).
// Returns exactly what the original returns; the Source write is in try/catch. UNDO: delete this block, save, deploy.
// 1 Nov: ACTIVE gets a new month column each month, so Source / the Active tick are found by the row-1 headings (SOURCE, SUB CLASS + 3)
function src31Cols_(sh) { const h = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (x) { return String(x || '').trim().toUpperCase(); });
  const s = h.indexOf('SOURCE'), u = h.indexOf('SUB CLASS'); return { src: s > -1 ? s + 1 : 0, act: u > -1 ? u + 3 : 47 }; }
function src31Clean_(v) { return String(v == null ? '' : v).trim().replace(/^Partner\s*[–·\-]\s*/i, ''); }
function src31Db_(code) {
  code = String(code || '').trim().toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(code)) return null;
  try { if (typeof sbReq_ === 'function' && typeof sbCfg_ === 'function' && sbCfg_()) {
    const L = sbReq_('get', 'coe_students?select=data,updated_at&removed_at=is.null&code=eq.' + encodeURIComponent(code) + '&order=updated_at.desc&limit=1') || [];
    if (L.length && Array.isArray(L[0].data)) return src31Clean_(L[0].data[22]); } } catch (e) { console.log('SRCFIX31 database read ' + e); }
  const db = sheet_(TAB.DB), hits = db.getRange(1, 1, db.getLastRow(), 1).createTextFinder(code).matchEntireCell(true).findAll();
  if (!hits.length) return null;
  return src31Clean_(db.getRange(hits[hits.length - 1].getRow(), 23).getValue());
}
function src31Set_(row, code) {
  const sh = sheet_(TAB.ACTIVE); row = Number(row);
  const SRC31_COL = src31Cols_(sh).src; if (!(row >= 5) || !SRC31_COL) return null;
  if (String(sh.getRange(row, 1).getValue()).trim().toUpperCase() !== String(code).trim().toUpperCase()) return null;   // only this student's row
  const want = src31Db_(code); if (want === null) return null;
  const cell = sh.getRange(row, SRC31_COL), had = String(cell.getValue() || '');
  if (had !== want || cell.getFormula()) { cell.setValue(want); try { if (typeof sbDirty_ === 'function') sbDirty_([TAB.ACTIVE]); } catch (e) { }
    try { CacheService.getScriptCache().removeAll(['m:active', 'at:' + String(code).toUpperCase(), 'renmap']); } catch (e) { }
    console.log('SRCFIX31 ' + code + ' ACTIVE row ' + row + ' · "' + had + '" → "' + want + '"'); }
  return want;
}
['mgmtEnrolPaid', 'mgmtRenewPaid'].forEach(function (fn) {
  const f0 = globalThis[fn]; if (typeof f0 !== 'function' || f0.__src31) return;
  const w = function (token, f) {
    const r = f0.apply(this, arguments);
    try { if (r && r.ok && f && !f.dry && Number(r.row) > 0) { const s = src31Set_(r.row, f.code); if (s !== null) r.srcFix = s; } } catch (e) { console.log('SRCFIX31 ' + fn + ' ' + e); }
    return r;
  };
  w.__src31 = 1; globalThis[fn] = w;
});
/** Run once by hand: fix one student's active package rows (change the code for another student). */
function zzSrcFixOne31() {
  const code = 'ST-2026-131', sh = sheet_(TAB.ACTIVE), A = src31Cols_(sh).act, v = sh.getRange(1, 1, sh.getLastRow(), A + 1).getValues(); let n = 0;
  for (let i = 4; i < v.length; i++) if (String(v[i][0]).trim().toUpperCase() === code && v[i][A] === true) { const s = src31Set_(i + 1, code); if (s !== null) n++; }
  console.log('SRCFIX31 zzSrcFixOne31 ' + code + ' · rows ' + n); return n;
}
/** Run by hand: list active ACTIVE rows whose Source differs from the student record (report only, changes nothing). */
function zzSrcCheck31() {
  const sh = sheet_(TAB.ACTIVE), K = src31Cols_(sh), SRC31_COL = K.src, A = K.act; if (!SRC31_COL) return [];
  const v = sh.getRange(1, 1, sh.getLastRow(), SRC31_COL).getValues(), S = {}; let from = 'database';
  try { for (let off = 0; off < 5000; off += 1000) { const L = sbReq_('get', 'coe_students?select=code,data&removed_at=is.null&order=code.asc&limit=1000&offset=' + off) || [];
      L.forEach(function (r) { if (Array.isArray(r.data)) S[String(r.code).toUpperCase()] = src31Clean_(r.data[22]); }); if (L.length < 1000) break; } } catch (e) { from = 'sheet'; }
  if (!Object.keys(S).length) { from = 'sheet'; sheet_(TAB.DB).getDataRange().getValues().forEach(function (r) { const c = String(r[0] || '').trim().toUpperCase(); if (/^ST-/.test(c)) S[c] = src31Clean_(r[22]); }); }
  const out = []; for (let i = 4; i < v.length; i++) { const c = String(v[i][0] || '').trim().toUpperCase(); if (!/^ST-/.test(c) || v[i][A] !== true || !(c in S)) continue;
    const a = String(v[i][SRC31_COL - 1] || '').trim(); if (a !== S[c]) out.push('row ' + (i + 1) + ' · ' + c + ' ' + v[i][1] + ' · ACTIVE "' + a + '" · student record "' + S[c] + '"'); }
  out.forEach(function (x) { console.log('SRCFIX31 ' + x); }); console.log('SRCFIX31 zzSrcCheck31 (' + from + ') · ' + out.length + ' rows differ'); return out;
}
// ═════ END SRCFIX31 ═════
```
