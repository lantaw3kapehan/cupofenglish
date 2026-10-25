// 862: (audit #14) Trainings matrix (management): viewing is separate from editing.
//  · The matrix opens in VIEW mode. Tapping a dot shows that record (status + kept history), with no Done/Assign/Excuse buttons.
//    Tapping a heading says "turn on Edit". The "⚡ Quick tick" bar is hidden in view mode.
//  · An explicit "Edit records" toggle (aria-pressed) turns on changing: dots open the same form as before, headings open the same
//    "tick many" sheet, Quick tick works as before. Turning Edit off also ends Quick tick.
//  · Bulk changes need a confirm step that shows how many records will be saved: "Tick selected" (heading) and
//    "Mark everything up to" (teacher sheet) first show "Confirm · save N records" with the names / trainings; the second tap saves.
//    Changing any tick, date or status asks again. What is sent to the server (rec_add, same fields) is unchanged.
//  · Every dot cell: role=button, tabindex=0, aria-label "Teacher X · Training Y · Done / Not done / …", Enter or Space opens it.
//    Headings: aria-label; names: role=button, keyboard.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  // bulk · heading sheet: confirm with the count first (inside the trainings closure: AL, e are in scope)
  ["if(!L.length) return toast('Select teachers'); const b = $('tcS'); b.disabled = true;",
   "if(!L.length) return toast('Select teachers'); const b = $('tcS');\n"
   + "    { const st0 = ($('tcSt') || {}).value || 'done', k0 = [id, st0, ($('tcD') || {}).value, ($('tcV') || {}).value, L.join(',')].join('|'), t0 = ((AL && AL.trainings) || []).find(x => x.id === id) || { title: id };\n"
   + "      const SL = { done: t0.kind === 'unlock' ? 'Qualified to teach' : 'Done', completed: 'Training completed', assigned: 'In training' };\n"
   + "      if(b.dataset.cf !== k0){ b.dataset.cf = k0; b.textContent = 'Confirm · save ' + L.length + ' record' + (L.length === 1 ? '' : 's'); let w = $('tcCf');\n"
   + "        if(!w){ b.insertAdjacentHTML('beforebegin', '<div id=\"tcCf\" class=\"card small\" role=\"status\" style=\"margin-top:12px;background:#FFF8EC;border-color:#F2D9A6\"></div>'); w = $('tcCf'); }\n"
   + "        w.innerHTML = '<b>' + L.length + ' new record' + (L.length === 1 ? '' : 's') + ' will be saved</b> · ' + e(t0.title) + ' · ' + e(SL[st0] || st0) + '<div class=\"mute\" style=\"margin-top:4px\">' + L.map(n => e(tName(n))).join(', ') + '</div><div class=\"mute\" style=\"margin-top:4px\">Records are kept permanently. Tap Confirm to save, or change the ticks.</div>'; return; } }\n"
   + "    b.disabled = true;"],
  // bulk · "Mark everything up to": confirm with the count first
  ["const b = $('tuS'); b.disabled = true;",
   "const b = $('tuS');\n"
   + "    { const k0 = [name, upto, $('tuD').value, $('tuV').value, todo.length].join('|');\n"
   + "      if(b.dataset.cf !== k0){ b.dataset.cf = k0; b.textContent = 'Confirm · mark ' + todo.length + ' training' + (todo.length === 1 ? '' : 's') + ' done'; let w = $('tuCf');\n"
   + "        if(!w){ b.insertAdjacentHTML('beforebegin', '<div id=\"tuCf\" class=\"small\" role=\"status\" style=\"margin-top:8px;padding:8px 10px;border-radius:10px;background:#FFF8EC\"></div>'); w = $('tuCf'); }\n"
   + "        w.innerHTML = '<b>' + todo.length + ' new record' + (todo.length === 1 ? '' : 's') + ' for ' + e(tName(name)) + '</b><div class=\"mute\" style=\"margin-top:4px\">' + todo.map(t => e(t.title)).join(', ') + '</div><div class=\"mute\" style=\"margin-top:4px\">Kept permanently. Tap Confirm to save.</div>'; return; } }\n"
   + "    b.disabled = true;"],
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
if (i < 0) { console.error('no </body>'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 862 · Trainings matrix: view mode by default, explicit Edit, accessible cells (audit #14) */
(function(){
  if(typeof window.trCell !== 'function') return;
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window._trEdit = false;
  const css = document.createElement('style');
  css.textContent = '#v-train:not(.tr-edit) .tx-brush{display:none}'
    + '.tr-edt{display:inline-flex;align-items:center;gap:6px;border:1.5px solid var(--line,#E4E2EC);background:#fff;color:#2B2253;border-radius:999px;padding:6px 14px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}'
    + '.tr-edt[aria-pressed="true"]{background:#2f2752;border-color:#2f2752;color:#fff}'
    + '.tr-mode{font-size:12px;color:#55526E}#v-train.tr-edit .tr-mode{color:#8A3B22}'
    + '#v-train:not(.tr-edit) .tx-tb tr.t th button{cursor:default}'
    + '.tx-tb td[role="button"]:focus-visible,.tx-tb [role="button"]:focus-visible,.tx-tb th button:focus-visible{outline:3px solid #01b0bf;outline-offset:-2px;border-radius:6px}';
  document.head.appendChild(css);
  const LAB = {};   // "name|id" → status words, from the matrix
  const tabOf = v => { const b = v.querySelector('.tx-seg button.on'); return b ? b.textContent.trim() : 'Path'; };
  function stOf(td, path){ const i = td.querySelector('i.d'), b = td.querySelector('b.dt');
    if(i){ if(i.classList.contains('y')) return (path ? 'Done' : 'Qualified to teach') + (i.title ? ' · ' + i.title : '');
      if(i.classList.contains('x')) return 'Excused'; if(i.classList.contains('c')) return 'Training completed · not yet qualified';
      if(i.classList.contains('f')) return 'Requires further training'; if(i.classList.contains('b')) return 'Not done · needed now' + (i.title ? ' (' + i.title + ')' : '');
      return 'Not done'; }
    if(b){ const t = b.textContent.trim(); return /^\d+\/\d+$/.test(t) ? 'In progress · ' + t + ' parts' : /training|assigned/i.test(t) ? t.charAt(0).toUpperCase() + t.slice(1) : 'Booked · ' + t; }
    return 'Not done'; }
  function decorate(){ const v = document.getElementById('v-train'); if(!v) return; const tb = v.querySelector('.tx-tb'); if(!tb) return;
    v.classList.toggle('tr-edit', !!window._trEdit);
    const path = /^Path/.test(tabOf(v));
    const row = v.querySelector('.tx-seg') && v.querySelector('.tx-seg').parentElement;
    if(row && !row.querySelector('.tr-edt')){ const sp = row.querySelector('.grow'); const h = '<span class="tr-mode" aria-live="polite"></span><button type="button" class="tr-edt" onclick="trEditToggle()"></button>';
      if(sp) sp.insertAdjacentHTML('afterend', h); else row.insertAdjacentHTML('beforeend', h); }
    const btn = v.querySelector('.tr-edt'), md = v.querySelector('.tr-mode');
    if(btn){ btn.setAttribute('aria-pressed', window._trEdit ? 'true' : 'false'); const t = window._trEdit ? '✓ Done editing' : '✎ Edit records'; if(btn.textContent !== t) btn.textContent = t; }
    if(md){ const t = window._trEdit ? 'Editing · changes are saved and kept' : 'View only'; if(md.textContent !== t) md.textContent = t; }
    const hint = [...v.querySelectorAll('.tx-card > .small.mute')].find(x => /Tap a heading|View only ·|Editing ·/.test(x.textContent));
    if(hint){ const t = window._trEdit ? 'Editing · tap a dot to change one record · tap a heading to tick many (you confirm the count first) · ⚡ Quick tick saves each dot you tap' : 'View only · tap a dot to see its record and history · tap a name for the path · turn on Edit records to change anything';
      if(hint.textContent !== t) hint.textContent = t; }
    const H = [...tb.querySelectorAll('thead tr.t th')];
    H.forEach(th => { const b = th.querySelector('button'); if(!b) return; const m = (b.getAttribute('title') || '').match(/^Tick (.*) for many teachers$/); if(m) b.dataset.full = m[1];
      const full = b.dataset.full || b.textContent.trim();
      b.setAttribute('aria-label', window._trEdit ? full + ' · tick for many teachers (asks to confirm)' : full + ' · view only, turn on Edit records to tick many');
      b.setAttribute('title', window._trEdit ? 'Tick ' + full + ' for many teachers' : full); });
    tb.querySelectorAll('tbody tr').forEach(tr => { const cells = [...tr.children], nm = tr.querySelector('td.st b.link');
      if(nm && !nm.hasAttribute('role')){ nm.setAttribute('role', 'button'); nm.tabIndex = 0; nm.setAttribute('aria-label', 'Open ' + nm.textContent.trim() + '’s training path'); }
      cells.forEach((td, k) => { const oc = td.getAttribute('onclick') || ''; const m = oc.match(/^trCell\('((?:[^'\\]|\\.)*)','([^']*)'\)$/); if(!m) return;
        const th = H[k], tt = th ? ((th.querySelector('button') || {}).dataset || {}).full || th.textContent.trim() : m[2];
        const who = nm ? nm.textContent.trim() : m[1], st = stOf(td, path); LAB[m[1] + '|' + m[2]] = st;
        td.setAttribute('role', 'button'); td.tabIndex = 0;
        td.setAttribute('aria-label', 'Teacher ' + who.replace(/^Teacher\s+/i, '') + ' · ' + tt + ' · ' + st + (window._trEdit ? ' · tap to change' : ''));
        [...td.children].forEach(c => c.setAttribute('aria-hidden', 'true')); }); }); }
  window.trEditToggle = function(){ window._trEdit = !window._trEdit; if(!window._trEdit) window._trBrush = null;
    try{ if(window.paintTrAll) paintTrAll(); }catch(x){} decorate(); toast(window._trEdit ? 'Edit on · changes are saved' : 'View only'); };
  /* view mode: a dot shows the record, without the change buttons */
  const _cell = window.trCell;
  window.trCell = function(name, id){
    if(window._trEdit) return _cell.apply(this, arguments);
    const br = window._trBrush; window._trBrush = null; let r;
    try{ r = _cell.apply(this, arguments); } finally { window._trBrush = br; }
    const b = document.getElementById('sheetBody'); if(!b) return r;
    const d0 = b.querySelector('#trCd'); if(d0 && d0.closest('.card')) d0.closest('.card').remove();
    b.querySelectorAll('button[onclick^="trTick"]').forEach(x => { const p = x.parentElement; if(p && p !== b) p.remove(); else x.remove(); });
    [...b.querySelectorAll('.small.mute')].forEach(x => { if(/^Set status/.test(x.textContent)) x.remove(); });
    const h1 = b.querySelector('h1'), st = LAB[name + '|' + id];
    const box = '<div class="card" role="status" style="margin-top:12px"><div class="small mute">Status</div><b>' + e(st || 'See the history below') + '</b>'
      + '<div class="small mute" style="margin-top:8px">View only. To change it, close this and turn on <b>Edit records</b> above the matrix.</div></div>';
    const sub = h1 && h1.nextElementSibling; if(sub) sub.insertAdjacentHTML('afterend', box); else b.insertAdjacentHTML('afterbegin', box);
    if(!b.querySelector('h2')) b.insertAdjacentHTML('beforeend', '<div class="small mute" style="margin-top:12px">No records yet for this training.</div>');
    return r; };
  /* headings: tick many only in edit mode */
  const _col = window.trCol;
  if(_col) window.trCol = function(){ if(!window._trEdit) return toast('View only · turn on Edit records to tick a training for many teachers'); return _col.apply(this, arguments); };
  /* quick tick only in edit mode */
  const _bon = window.trBrushOn;
  if(_bon) window.trBrushOn = function(){ if(!window._trEdit) return toast('Turn on Edit records first'); return _bon.apply(this, arguments); };
  /* "Mark everything up to" (teacher sheet): only in edit mode */
  const _up = window.trUpTo;
  if(_up) window.trUpTo = function(){ if(!window._trEdit) return '<div class="small mute" style="margin:12px 0">View only · turn on Edit records on the Trainings matrix to mark trainings done.</div>'; return _up.apply(this, arguments); };
  /* bulk sheets: changing a tick / date / status resets the confirm step; live count on the button */
  function reset(){ const b = document.getElementById('tcS'); if(b && b.dataset.cf){ delete b.dataset.cf; const w = document.getElementById('tcCf'); if(w) w.remove(); }
    if(b && !b.disabled){ const n = document.querySelectorAll('.tcI:checked').length; b.textContent = '✓ Tick selected' + (n ? ' · ' + n : ''); }
    const u = document.getElementById('tuS'); if(u && u.dataset.cf){ delete u.dataset.cf; const w = document.getElementById('tuCf'); if(w) w.remove(); if(!u.disabled) u.textContent = '✓ Mark done'; } }
  document.addEventListener('change', ev => { const t = ev.target; if(t && t.matches && t.matches('.tcI,#tcSt,#tcD,#tcV,#tuT,#tuD,#tuV')) reset(); });
  document.addEventListener('click', ev => { const a = ev.target && ev.target.closest && ev.target.closest('a.link'); if(a && /tcI/.test(a.getAttribute('onclick') || '')) setTimeout(reset, 0); });
  /* keyboard: Enter / Space on a dot or a name */
  document.addEventListener('keydown', ev => { if(ev.key !== 'Enter' && ev.key !== ' ') return; const t = ev.target; if(!t || !t.closest || !t.closest('#v-train .tx-tb')) return;
    if(t.getAttribute('role') === 'button' && t.tagName !== 'BUTTON'){ ev.preventDefault(); t.click(); } });
  /* re-label after every repaint of the Trainings screen */
  let q = 0; const mo = new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ decorate(); }catch(x){} }); });
  (function w(){ const v = document.getElementById('v-train'); if(v){ mo.observe(v, { childList: true, subtree: true }); decorate(); } else setTimeout(w, 1500); })();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
