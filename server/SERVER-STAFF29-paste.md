# Server paste · STAFF29: safer MASTERLIST matching, no rows for people who left

**Why:** this fixes two gaps found while deactivating Ric, Daniela and Lovely on 29 Oct.
1. **Rows with no TEACHER'S NAME and no APP EMAIL were not matched.** Ric's MASTERLIST row 29 has neither, so STAFF28 would
   have added a second Ric row. STAFF29 also matches by EMPLOYEE ID, the row the app already knows, and FIRST NAME (+ LAST
   NAME). It **never adds a row for anyone who came from MASTERLIST**, and never adds one when the match is unclear; it says so
   in the app instead.
2. **Rows were added for people who had left.** Editing Daniela, who has a RESIGNATION FILED DATE, added a T-DASH row and
   0-unit PAYROLL rows. STAFF29 adds T-DASH rows, PAYROLL rows and name-dropdown entries only for people who are:
   - active in the app;
   - not marked as left in MASTERLIST (no RESIGNATION FILED DATE or LAST WORKING DAY, and STATUS not
     Resigned / Terminated / AWOL / Inactive).

Everything else works as in STAFF28:
- It writes the same columns.
- It never blanks a cell or touches a formula.
- It keeps the old value in a cell note `staff28 · old: …`, so the existing **zzStaff28Undo** still puts every cell back.
- It handles sign-in and Deactivate the same way.

STAFF29 replaces the function the minute job calls, so nothing else changes. Remove it and STAFF28 works as before.

**When:** any time before 16:00 or after 22:00 (about 3 minutes).

## Step 1 · paste at the very bottom of Code.gs (below STAFF28)
```
/* ═════ 29 Oct · STAFF29 · the STAFF28 copy (app → Google) with safer matching and no rows for people who left ═════
   Match: the row the app already knows (checked by EMPLOYEE ID / name / email), else EMPLOYEE ID, TEACHER'S NAME, APP EMAIL,
   FIRST NAME (+ LAST NAME). One clear match only; a new row only for someone added in the app. T-DASH / PAYROLL / dropdowns only
   for someone active who has not left. Old values in "staff28 · old:" notes (zzStaff28Undo). */
function staff29Find_(p, v, head) {
  const col = h => head.indexOf(h), iId = 0, iE = col('APP EMAIL'), iN = col("TEACHER'S NAME"), iF = col('FIRST NAME'), iL = col('LAST NAME');
  const ml = Array.isArray(p.ml) ? p.ml : [], lc = s => String(s == null ? '' : s).trim().toLowerCase();
  const nm = s => lc(s).replace(/^(teacher|coordinator|admin|support)\s+/, '');
  const id = lc(ml[0]), email = lc(p.email || ml[iE]), name = lc(p.name), first = lc(ml[iF] || p.first_name).split(/\s+/)[0], last = lc(ml[iL] || p.last_name);
  const hits = (r, i) => {
    if (i === 0) return 0;
    if (id && lc(r[iId]) === id) return 4;
    if (email && iE > -1 && lc(r[iE]) === email) return 3;
    if (iN > -1 && nm(r[iN]) && nm(r[iN]) === name) return 2;
    const f = iF > -1 ? lc(r[iF]).split(/\s+/)[0] : '', l = iL > -1 ? lc(r[iL]) : '';
    if (!nm(r[iN]) && f && (f === name || f === first) && (!last || !l || l === last)) return 1;   // no TEACHER'S NAME: first (+ last) name
    return 0;
  };
  const k = p.masterlist_row ? p.masterlist_row - 1 : -1;
  if (k > 0 && v[k] && hits(v[k], k) > 0) return { r: k, how: 'known row' };
  let best = 0, rows = [];
  v.forEach((r, i) => { const h = hits(r, i); if (!h) return; if (h > best) { best = h; rows = [i]; } else if (h === best) rows.push(i); });
  if (rows.length === 1) return { r: rows[0], how: ['', 'first name', "teacher's name", 'email', 'employee id'][best] };
  if (rows.length > 1) return { r: -1, why: 'more than one MASTERLIST row fits (rows ' + rows.map(i => i + 1).join(', ') + ')' };
  return { r: -1, why: 'no MASTERLIST row found' };
}
function staff29Left_(p, row, head) {   // has this person left? (then no T-DASH / PAYROLL / dropdown rows)
  if (p.status !== 'active') return 'inactive in the app';
  const ml = Array.isArray(p.ml) ? p.ml : [], at = h => head.indexOf(h);
  const val = j => j < 0 ? '' : String((row && row[j] !== '' && row[j] != null) ? row[j] : (ml[j] == null ? '' : ml[j])).trim();
  if (val(at('RESIGNATION FILED DATE'))) return 'has a resignation filed date';
  if (val(at('LAST WORKING DAY'))) return 'has a last working day';
  const st = val(at('STATUS') > -1 ? at('STATUS') : 10);
  if (/inactive|resign|terminat|discontinu|awol|end of contract/i.test(st)) return 'STATUS ' + st;
  return '';
}
function staff29_(dry, all) {
  if (!sbCfg_()) return ['Not run: database sign-in (SB_URL / SB_KEY) missing'];
  const S = sbReq_('get', 'staff?select=*&' + (all ? '' : 'sync_pending=eq.true&') + 'order=id.asc&limit=' + (all ? 400 : 40)) || []; if (!S.length) return [];
  const out = [], PR = PropertiesService.getScriptProperties(), sh = sheet_(TAB.MASTER);
  const rg = sh.getDataRange(), v = rg.getValues(), F = rg.getFormulas(), N = rg.getNotes(), head = v[0].map(x => String(x).trim().toUpperCase());
  const iS = head.indexOf('STATUS') > -1 ? head.indexOf('STATUS') : 10, iL = head.indexOf('LENGTH');
  const DATE_COLS = head.map((h, j) => /DATE|BIRTH|LAST WORKING DAY/.test(h) ? j : -1).filter(j => j > -1);
  const SENS = /SSS|PHILHEALTH|PAGIBIG|TIN|BIRTH|ADDRESS|EMERGENCY|RELATIONSHIP/;
  let changed = false;
  S.forEach(p => {
    const note = [], email = String(p.email || '').trim().toLowerCase(), ml = Array.isArray(p.ml) ? p.ml : [];
    try {
      const m = staff29Find_(p, v, head); let r = m.r;
      if (r < 0) {
        const fromApp = p.src === 'app' && !p.masterlist_row && !p.google_synced_at && p.status === 'active' && m.why === 'no MASTERLIST row found';
        if (!fromApp) {   // never a second row for someone already in MASTERLIST
          out.push((dry ? 'DRY ' : 'SKIP ') + p.name + ' · ' + m.why + ' · nothing written (fix the row in MASTERLIST, then save again in the app)');
          if (!dry && !all) sbReq_('patch', 'staff?id=eq.' + p.id, { sync_pending: false, google_note: ('Not copied: ' + m.why + '. Nothing written in MASTERLIST.').slice(0, 300) }, 'return=minimal');
          return;
        }
        if (dry) note.push('DRY new MASTERLIST row (added in the app)');
        else { sh.appendRow(head.map(() => '')); r = sh.getLastRow() - 1; v[r] = head.map(() => ''); F[r] = head.map(() => ''); N[r] = head.map(() => ''); sh.getRange(r + 1, 1).setNote('staff28 · new row ' + fmt_(new Date(), 'yyyy-MM-dd HH:mm')); note.push('new MASTERLIST row ' + (r + 1)); }
      } else if (all) { out.push('ROW ' + p.name + ' → MASTERLIST row ' + (r + 1) + ' (' + m.how + ')' + (p.masterlist_row && p.masterlist_row !== r + 1 ? ' · the app had row ' + p.masterlist_row : '')); return; }
      for (let j = 0; r >= 0 && j < head.length; j++) {
        if (j === iL || j === iS || (F[r] && F[r][j])) continue;
        let want = ml[j]; if (want == null || String(want).trim() === '') continue;
        if (j === head.indexOf("TEACHER'S NAME") && String(v[r][j] || '').trim() === '' && p.src !== 'app') continue;   // a blank TEACHER'S NAME made in the sheet stays blank
        want = String(want).trim();
        let val = want; if (DATE_COLS.indexOf(j) > -1 && /^\d{4}-\d{2}-\d{2}/.test(want)) { val = new Date(want.slice(0, 10) + 'T00:00:00'); want = want.slice(0, 10); }
        const now = v[r][j] instanceof Date ? fmt_(v[r][j], 'yyyy-MM-dd') : String(v[r][j] == null ? '' : v[r][j]).trim();
        if (now === want) continue;
        if (dry) { note.push('DRY ' + head[j] + ': "' + (SENS.test(head[j]) ? '•••' : now) + '" → "' + (SENS.test(head[j]) ? '•••' : want) + '"'); continue; }
        const c = sh.getRange(r + 1, j + 1); c.setValue(val); if (now !== '') c.setNote(((N[r][j] ? N[r][j] + '\n' : '') + 'staff28 · old: ' + now).slice(0, 900));
        v[r][j] = val; note.push(head[j]); changed = true;
      }
      if (r >= 0) {
        const st = String(v[r][iS] || ''), isOn = staffOn_(st);
        const want = p.status === 'active' ? (isOn || /resign|terminat|discontinu|awol/i.test(st) ? '' : 'Active') : (isOn ? 'Resigned' : '');   // an app edit never turns a "Resigned" row back to Active
        if (want) { if (dry) note.push('DRY STATUS → ' + want); else { const c = sh.getRange(r + 1, iS + 1); c.setValue(want); if (st) c.setNote(((N[r][iS] ? N[r][iS] + '\n' : '') + 'staff28 · old: ' + st).slice(0, 900)); v[r][iS] = want; note.push('STATUS ' + want); changed = true; } }
        if (!dry && !String(v[r][0] || '').trim() && !(F[r] && F[r][0]) && p.src === 'app') { const code = staff28Code_(sh, v, 0); sh.getRange(r + 1, 1).setValue(code); v[r][0] = code; note.push('EMPLOYEE ID ' + code); changed = true; }
      }
      const left = staff29Left_(p, r >= 0 ? v[r] : null, head);
      if (left) note.push('no T-DASH / PAYROLL rows (' + left + ')');
      else if (p.role !== 'admin' && p.pay_type !== 'none') {
        if (p.role === 'teacher') staff28Tdash_(p.name, r >= 0 ? String(v[r][0] || '') : '', dry).forEach(x => note.push(x));
        staff28Lists_(p.name, dry).forEach(x => note.push(x)); staff28Pay_(p.name, dry).forEach(x => note.push(x));
      }
      if (email && p.status === 'active' && p.pw_salt && p.pw_hash) {
        if (dry) note.push('DRY sign-in password copied');
        else { PR.setProperty('pw:' + email, JSON.stringify({ s: p.pw_salt, h: p.pw_hash, at: Date.now(), by: 'app · ' + (p.updated_by || '') })); PR.deleteProperty('off:' + email); note.push('sign-in password'); changed = true; }
      }
      if (email && p.status !== 'active' && PR.getProperty('pw:' + email)) {
        if (dry) note.push('DRY sign-in removed');
        else { PR.setProperty('off:' + email, JSON.stringify({ at: Date.now(), by: 'app · ' + (p.updated_by || ''), name: p.name })); PR.deleteProperty('pw:' + email);
          const allP = PR.getProperties(); Object.keys(allP).forEach(k => { if (k.indexOf('tok:') === 0) { try { if (JSON.parse(allP[k]).email === email) PR.deleteProperty(k); } catch (e) { } } });
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
staff28_ = function (dry) { return staff29_(dry, false); };   // the minute job (STAFF28's sbDrain wrapper) now uses STAFF29
/** Read-only: for EVERY person in the app, which MASTERLIST row STAFF29 would use (or why it would skip). Changes nothing. */
function zzStaff29Rows() { const L = staff29_(true, true); console.log(L.length ? L.join('\n') : 'Nobody in the app list'); }
/** Read-only: what would happen now for people waiting for Google. */
function zzStaff29Dry() { const L = staff29_(true, false); console.log(L.length ? L.join('\n') : 'Nobody is waiting for Google'); }
```

## Step 2 · save and check (changes nothing)
1. **Cmd+S** (Windows: Ctrl+S).
2. Choose **zzStaff29Rows** › **Run**. Each person gets one line:
   - `ROW <name> → MASTERLIST row N (how)` is fine.
   - `DRY <name> · more than one MASTERLIST row fits` or `· no MASTERLIST row found` means that person will be skipped
     safely. Send that line to Claude.
   - Ric should show `ROW Ric → MASTERLIST row 29 (known row)`.
3. Choose **zzStaff29Dry** › **Run**. It should say `Nobody is waiting for Google`.
4. **Deploy › Manage deployments ›** pencil › **New version** › **Deploy**.

Ric's row 29 STATUS can then be set by the app instead of by hand. Ask Claude to send it again; Google will then show
`STATUS Resigned`, with the old value kept in a note.

## Undo
- **Cell changes:** **zzStaff28Undo** puts back every MASTERLIST cell changed by STAFF28 or STAFF29, from their notes.
- **The paste itself:** delete the pasted block, save, and deploy a new version. STAFF28 then works exactly as before.
