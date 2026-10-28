# Server paste · Add / edit / deactivate teachers and staff from the app (STAFF28)

**Why:** Management › Teachers now has **+ Add teacher / staff**, **Edit**, **Give app access** and **Deactivate**
(release 1440). The app saves to the database at once (table `staff`), and sign-in with a new password already works through
the database. This paste makes Google follow within about a minute, so the sheets stay complete and nothing breaks the way
Rose's PAYROLL row did:

1. **MASTERLIST** – a new person gets a new row and the next EMPLOYEE ID (e.g. COE-2026-48); an edit updates the same columns the form shows (the form mirrors every
   MASTERLIST column). Cells with formulas (e.g. LENGTH) are never touched, empty form fields never blank a cell, and every
   changed cell keeps its old value in a note (`staff28 · old: …`) so it can be undone.
2. **T-DASH** – a new teacher gets a row (formulas copied from the row above; their own numbers start empty).
3. **Name dropdowns** – the person is added to every name dropdown in PAYROLL, T-TIMEIN, TIME-IN, ACTIONS, TC&SUB, T-HISTORY
   and PAY (the B53 "Please enter one of: Ara, April, …" error can't happen again).
4. **PAYROLL rows** – an active person who is paid (per lesson or a fixed monthly amount) gets a row in this month and in every
   later month that already has rows, copied from a colleague's row so every formula is the standard one. Paid months are
   never touched.
5. **Sign-in** – a password set in the app is copied as the same salt + hash (the password itself is never stored anywhere);
   **Deactivate** removes the password, ends every open session and marks MASTERLIST STATUS "Resigned" (history is kept).
6. Then the app's user list and the database sign-in copy are refreshed at once.

Nothing runs unless something was saved in the app (it only reads rows marked "waiting for Google").

**When:** any time before 16:00 or after 22:00 (about 3 minutes).

## Step 1 · paste at the very bottom of Code.gs
```
/* ═════ 28 Oct · STAFF28 · teachers & staff added / edited / deactivated in the app (database table staff) → Google ═════
   MASTERLIST row (same columns as the app's form) · name dropdowns · PAYROLL rows · sign-in (salt + hash only) · access off.
   Formula cells, typed cells the form left empty and paid PAYROLL months are never changed. Old values kept in cell notes. */
function staff28Lists_(name, dry) {
  const out = [], lcN = String(name).toLowerCase();
  [TAB.PAYROLL, TAB.TIMEIN, TI_TAB, TAB.ACTIONS, TAB.TCSUB, TAB.THIST, TAB.PAY].forEach(t => {
    const s = ss_().getSheetByName(t); if (!s) return;
    const n = Math.max(2, s.getLastRow()), W = Math.min(s.getLastColumn(), 30); if (W < 1) return;
    const top = s.getRange(1, 1, Math.min(n, 80), W).getDataValidations(), cols = {};
    const isNames = dv => { if (!dv || dv.getCriteriaType() !== SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) return false;
      const L = (dv.getCriteriaValues()[0] || []).map(x => String(x).toLowerCase()); return L.length >= 5 && ['julia', 'pam', 'kat', 'mayi', 'cy'].filter(x => L.indexOf(x) > -1).length >= 2; };
    top.forEach(row => row.forEach((dv, j) => { if (isNames(dv)) cols[j] = 1; }));
    Object.keys(cols).forEach(k => {
      const j = +k, rg = s.getRange(1, j + 1, n, 1), D = rg.getDataValidations(); let ch = 0;
      const nd = D.map(r => { const dv = r[0]; if (!isNames(dv)) return [dv];
        const L = (dv.getCriteriaValues()[0] || []).slice(); if (L.some(y => String(y).toLowerCase() === lcN)) return [dv];
        ch++; L.push(name); return [dv.copy().requireValueInList(L, dv.getCriteriaValues()[1] !== false).build()]; });
      if (ch) { if (!dry) rg.setDataValidations(nd); out.push(t + ' column ' + (j + 1) + ' dropdown (' + ch + ' cells)'); }
    });
  });
  return out;
}
function staff28Pay_(name, dry) {
  const out = [], P = sheet_(TAB.PAYROLL), now = new Date(), cur = fmt_(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM');
  const all = () => { const n = P.getLastRow(), v = P.getRange(1, 1, n, 3).getValues(), M = {};
    v.forEach((r, i) => { if (i >= 3 && r[2] instanceof Date) { const ym = fmt_(r[2], 'yyyy-MM'); (M[ym] = M[ym] || []).push({ row: i + 1, name: String(r[1] || '').trim(), paid: r[0] !== '' }); } }); return M; };
  let M = all();
  Object.keys(M).filter(ym => ym >= cur).sort().forEach(ym => {
    const L = M[ym].filter(r => r.name); if (!L.length || L.every(r => r.paid)) return;          // month not set up, or closed
    if (L.some(r => r.name.toLowerCase() === String(name).toLowerCase())) return;                 // already there
    const tpl = L.find(r => !r.paid && P.getRange(r.row, 5).getFormula()) || L.find(r => P.getRange(r.row, 5).getFormula()); if (!tpl) return;
    if (dry) { out.push('DRY PAYROLL row · ' + name + ' · ' + ym); return; }
    const last = Math.max.apply(null, L.map(r => r.row)); P.insertRowAfter(last); const nr = last + 1, W = P.getLastColumn();
    P.getRange(tpl.row >= nr ? tpl.row + 1 : tpl.row, 1, 1, W).copyTo(P.getRange(nr, 1, 1, W));
    P.getRange(nr, 1).clearContent();
    try { P.getRange(nr, 2).setValue(name); } catch (e) { P.deleteRow(nr); out.push('SKIPPED PAYROLL ' + name + ' ' + ym + ' · ' + String(e.message).slice(0, 80)); return; }
    [12, 13, 14, 15, 19].forEach(j => { if (j <= W && !P.getRange(nr, j).getFormula()) P.getRange(nr, j).clearContent(); });   // SSS / Pag-IBIG / PhilHealth / BIR, rank-up date
    out.push('PAYROLL row added · ' + name + ' · ' + ym + ' (row ' + nr + ')'); M = all();
  });
  return out;
}
function staff28Code_(sh, v, iC) {   // next EMPLOYEE ID: COE-<year>-<highest number + 1>, from MASTERLIST and T-DASH
  let mx = 0; const see = x => { const m = String(x || '').match(/^COE-\d{4}-(\d+)$/i); if (m) mx = Math.max(mx, +m[1]); };
  v.forEach(r => see(r[iC])); try { const T = sheet_(TAB.TDASH); T.getRange(1, 1, T.getLastRow(), 1).getValues().forEach(r => see(r[0])); } catch (e) { }
  return 'COE-' + new Date().getFullYear() + '-' + String(mx + 1).padStart(2, '0');
}
function staff28Tdash_(name, code, dry) {   // a teacher who isn't on T-DASH gets a row: formulas copied from the row above, typed cells left empty
  const T = sheet_(TAB.TDASH), n = T.getLastRow(), v = T.getRange(1, 1, n, 2).getValues();
  if (v.some(r => String(r[1] || '').trim().toLowerCase() === String(name).toLowerCase())) return [];
  let last = 0; v.forEach((r, i) => { if (i >= 3 && String(r[1] || '').trim()) last = i + 1; }); if (!last) return [];
  if (dry) return ['DRY T-DASH row · ' + name];
  T.insertRowAfter(last); const nr = last + 1, W = T.getLastColumn();
  T.getRange(last, 1, 1, W).copyTo(T.getRange(nr, 1, 1, W));
  const F = T.getRange(nr, 1, 1, W).getFormulas()[0]; F.forEach((f, j) => { if (!f && j > 1) T.getRange(nr, j + 1).clearContent(); });
  T.getRange(nr, 1).setValue(code || ''); T.getRange(nr, 2).setValue(name);
  return ['T-DASH row ' + nr];
}
function staff28_(dry) {
  if (!sbCfg_()) return ['Not run: database sign-in (SB_URL / SB_KEY) missing'];
  const S = sbReq_('get', 'staff?select=*&sync_pending=eq.true&order=id.asc&limit=40') || []; if (!S.length) return [];
  const out = [], PR = PropertiesService.getScriptProperties(), sh = sheet_(TAB.MASTER);
  const rg = sh.getDataRange(), v = rg.getValues(), F = rg.getFormulas(), N = rg.getNotes(), head = v[0].map(x => String(x).trim().toUpperCase());
  const iE = head.indexOf('APP EMAIL'), iN = head.indexOf("TEACHER'S NAME"), iS = head.indexOf('STATUS') > -1 ? head.indexOf('STATUS') : 10, iL = head.indexOf('LENGTH');
  const nm = s => String(s || '').replace(/^\s*(teacher|coordinator|admin|support)\s+/i, '').trim().toLowerCase();
  const DATE_COLS = head.map((h, j) => /DATE|BIRTH|LAST WORKING DAY/.test(h) ? j : -1).filter(j => j > -1);
  let changed = false;
  S.forEach(p => {
    const note = [], email = String(p.email || '').trim().toLowerCase(), ml = Array.isArray(p.ml) ? p.ml : [];
    try {
      let r = -1;
      if (p.masterlist_row && v[p.masterlist_row - 1] && (nm(v[p.masterlist_row - 1][iN]) === nm(p.name) || (email && String(v[p.masterlist_row - 1][iE] || '').trim().toLowerCase() === email))) r = p.masterlist_row - 1;
      if (r < 0) for (let i = 1; i < v.length; i++) if ((v[i][iN] && nm(v[i][iN]) === nm(p.name)) || (email && String(v[i][iE] || '').trim().toLowerCase() === email)) { r = i; break; }
      if (r < 0) {
        if (dry) { note.push('DRY new MASTERLIST row'); }
        else { sh.appendRow(head.map(() => '')); r = sh.getLastRow() - 1; v[r] = head.map(() => ''); F[r] = head.map(() => ''); N[r] = head.map(() => ''); sh.getRange(r + 1, 1).setNote('staff28 · new row ' + fmt_(new Date(), 'yyyy-MM-dd HH:mm')); note.push('new MASTERLIST row ' + (r + 1)); }
      }
      for (let j = 0; r >= 0 && j < head.length; j++) {
        if (j === iL || j === iS || F[r][j]) continue;                              // LENGTH and formulas are the sheet's; STATUS below
        let want = ml[j]; if (want == null || String(want).trim() === '') continue;  // an empty form field never blanks a cell
        want = String(want).trim();
        let val = want; if (DATE_COLS.indexOf(j) > -1 && /^\d{4}-\d{2}-\d{2}/.test(want)) { const d = new Date(want.slice(0, 10) + 'T00:00:00'); val = d; want = want.slice(0, 10); }
        const now = v[r][j] instanceof Date ? fmt_(v[r][j], 'yyyy-MM-dd') : String(v[r][j] == null ? '' : v[r][j]).trim();
        if (now === want) continue;
        if (dry) { note.push('DRY ' + head[j] + ': "' + (/SSS|PHILHEALTH|PAGIBIG|TIN|BIRTH|ADDRESS|EMERGENCY/.test(head[j]) ? '•••' : now) + '" → "' + (/SSS|PHILHEALTH|PAGIBIG|TIN|BIRTH|ADDRESS|EMERGENCY/.test(head[j]) ? '•••' : want) + '"'); continue; }
        const c = sh.getRange(r + 1, j + 1); c.setValue(val); if (now !== '') c.setNote(((N[r][j] ? N[r][j] + '\n' : '') + 'staff28 · old: ' + now).slice(0, 900));
        note.push(head[j]); changed = true;
      }
      if (r >= 0) {   // STATUS: the app's Active / Deactivate decides; existing wording is kept when it already agrees
        const st = String(v[r][iS] || ''), isOn = /active|regular|permanent|probation|contract|time/i.test(st) && !/inactive|resign|terminat|discontinu|awol/i.test(st);
        const want = p.status === 'active' ? (isOn ? '' : 'Active') : (isOn ? 'Resigned' : '');
        if (want) { if (dry) note.push('DRY STATUS → ' + want); else { const c = sh.getRange(r + 1, iS + 1); c.setValue(want); if (st) c.setNote('staff28 · old: ' + st); note.push('STATUS ' + want); changed = true; } }
      }
      if (r >= 0 && !dry && !String(v[r][0] || '').trim() && !F[r][0]) { const code = staff28Code_(sh, v, 0); sh.getRange(r + 1, 1).setValue(code); v[r][0] = code; note.push('EMPLOYEE ID ' + code); changed = true; }
      if (p.status === 'active' && p.role === 'teacher') staff28Tdash_(p.name, r >= 0 ? String(v[r][0] || '') : '', dry).forEach(x => note.push(x));
      if (p.status === 'active' && p.role !== 'admin' && p.pay_type !== 'none') { staff28Lists_(p.name, dry).forEach(x => note.push(x)); staff28Pay_(p.name, dry).forEach(x => note.push(x)); }
      if (email && p.status === 'active' && p.pw_salt && p.pw_hash) {
        if (dry) note.push('DRY sign-in password copied');
        else { PR.setProperty('pw:' + email, JSON.stringify({ s: p.pw_salt, h: p.pw_hash, at: Date.now(), by: 'app · ' + (p.updated_by || '') })); PR.deleteProperty('off:' + email); note.push('sign-in password'); changed = true; }
      }
      if (email && p.status !== 'active' && PR.getProperty('pw:' + email)) {
        if (dry) note.push('DRY sign-in removed');
        else { PR.setProperty('off:' + email, JSON.stringify({ at: Date.now(), by: 'app · ' + (p.updated_by || ''), name: p.name })); PR.deleteProperty('pw:' + email);
          const all = PR.getProperties(); Object.keys(all).forEach(k => { if (k.indexOf('tok:') === 0) { try { if (JSON.parse(all[k]).email === email) PR.deleteProperty(k); } catch (e) { } } });
          note.push('sign-in removed, sessions ended'); changed = true; }
      }
      out.push((dry ? 'DRY ' : 'DONE ') + p.name + ' · ' + (note.join(' · ') || 'nothing to change'));
      if (!dry) sbReq_('patch', 'staff?id=eq.' + p.id, { sync_pending: false, google_synced_at: new Date().toISOString(), google_note: note.join(' · ').slice(0, 900), masterlist_row: r >= 0 ? r + 1 : null, pw_salt: null, pw_hash: null }, 'return=minimal');
    } catch (e) {
      out.push('ERROR ' + p.name + ' · ' + String(e && e.message || e).slice(0, 160));
      if (!dry) sbReq_('patch', 'staff?id=eq.' + p.id, { google_note: ('error: ' + String(e && e.message || e)).slice(0, 300) }, 'return=minimal');
    }
  });
  if (changed && !dry) { _fresh = true; try { CacheService.getScriptCache().removeAll(['users', 'staff2', 'm:payroll', 'm:overview', 'tab:PAY::']); if (typeof _memo !== 'undefined') delete _memo.staff; sbPushAuth_(true); } finally { _fresh = false; } }
  if (out.length) console.log(out.join('\n'));
  return out;
}
var sbDrainBaseST28_ = sbDrain;
sbDrain = function () {
  const r = sbDrainBaseST28_.apply(this, arguments);
  try { const c = CacheService.getScriptCache(); if (!c.get('st28')) { c.put('st28', '1', 55); staff28_(false); } } catch (e) { console.warn('STAFF28', e); }
  return r;
};
/** Shows what would change for people waiting for Google (changes nothing). */
function zzStaff28Dry() { const L = staff28_(true); console.log(L.length ? L.join('\n') : 'Nobody is waiting for Google'); }
/** Applies now (the minute job does the same by itself). */
function zzStaff28Run() { const L = staff28_(false); console.log(L.length ? L.join('\n') : 'Nobody is waiting for Google'); }
/** Puts back every MASTERLIST cell this paste changed (from the "staff28 · old:" notes). New rows are listed for you to delete by hand. */
function zzStaff28Undo() {
  const sh = sheet_(TAB.MASTER), rg = sh.getDataRange(), N = rg.getNotes(), out = [];
  for (let i = 0; i < N.length; i++) for (let j = 0; j < N[i].length; j++) { const t = String(N[i][j] || ''), k = t.lastIndexOf('staff28 · old: ');
    if (j === 0 && /staff28 · new row/.test(t)) { out.push('new row ' + (i + 1) + ' (delete it by hand if it should go)'); continue; }
    if (k < 0) continue; const old = t.slice(k + 15); sh.getRange(i + 1, j + 1).setValue(old); sh.getRange(i + 1, j + 1).setNote(t.slice(0, k).replace(/\n$/, '')); out.push('row ' + (i + 1) + ' col ' + (j + 1) + ' → ' + old); }
  CacheService.getScriptCache().removeAll(['users', 'staff2']); console.log(out.length ? out.join('\n') : 'Nothing to undo');
}
```

## Step 2 · save, check, publish
1. **Cmd+S** (Windows: Ctrl+S).
2. Choose **zzStaff28Dry** › **Run**. It should say `Nobody is waiting for Google` (nothing has been saved in the app yet).
3. **Deploy › Manage deployments ›** pencil › **New version** › **Deploy**.

From then on, every Add / Edit / Give app access / Deactivate in the app reaches Google by itself within about a minute.
The app shows "Synced to Google" (or the reason it couldn't) next to each person.

## Undo
Delete the pasted block, save, deploy a new version. `zzStaff28Undo` puts back every MASTERLIST cell it changed; added
PAYROLL rows are listed in the log with their row numbers.
