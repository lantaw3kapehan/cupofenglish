// 1722: (Misty, 3 Nov 15:30) Students search "andy" → "238 found · Enter opens Abby", every student listed, and the SOURCE filter row
//   drawn 7 times. "We have fixed this before but the problem is repetitive."
//   · The SOURCE key (15 Oct) added a new row on every redraw and relied on the whole list being rebuilt in between; when a redraw did
//     not rebuild the list, the rows piled up. Now it removes its old row first, so there is only ever one.
//   · Safety net for the search: after the whole Students screen is drawn, the rows are filtered once more by the words typed (name,
//     中文, code, teacher, book — the same fields as the search), and "N found · Enter opens …" is set from what is really shown.
//     So the list always matches the search, whatever an earlier step did. Enter opens the first row shown.
const file = process.argv[2];
const JS = String.raw`<script>
/* 1722 · Students search safety net: the list on screen always matches the words typed */
(function(){
  if(window.__1722) return; window.__1722 = 1;
  const nz = s => String(s == null ? '' : s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  function filt(){ try{
    const v = document.getElementById('v-astudents'), a = document.getElementById('aq'); if(!v || !a) return;
    const q = nz(a.value).trim(), W = q.split(/\s+/).filter(Boolean), rows = [...v.querySelectorAll('.li[onclick^="openStudent"]')];
    if(!W.length){ rows.forEach(r => { if(r.dataset.q1722){ r.style.display = ''; delete r.dataset.q1722; } }); return; }
    let n = 0, first = null;
    rows.forEach(r => { const code = ((String(r.getAttribute('onclick') || '').match(/openStudent\('([^']+)'/) || [])[1] || '').toLowerCase();
      const hay = nz(r.textContent) + ' ' + code + ' ' + code.replace(/^st-/, '') + ' ' + code.replace(/^st-\d{4}-/, '');
      const ok = W.every(w => hay.indexOf(w) > -1);
      if(!ok){ if(r.style.display !== 'none'){ r.style.display = 'none'; r.dataset.q1722 = 1; } }
      else { if(r.dataset.q1722){ r.style.display = ''; delete r.dataset.q1722; } if(r.style.display !== 'none'){ n++; if(!first) first = r; } } });
    const f = [...v.querySelectorAll('div.small.mute')].find(d => / found( · Enter opens .*)?$/.test(d.textContent.trim()));
    if(f){ const nm = first ? ((first.querySelector('b') || {}).textContent || '').trim() : ''; const t = n + ' found' + (nm ? ' · Enter opens ' + nm : ''); if(f.textContent !== t) f.textContent = t; }
    if(!n && !v.querySelector('.e1722')) (f || a).insertAdjacentHTML('afterend', '<div class="empty e1722">No student matches “' + (typeof esc === 'function' ? esc(a.value) : a.value) + '”.</div>');
    if(n){ const e = v.querySelector('.e1722'); if(e) e.remove(); }
  }catch(e){ console.warn('1722 search', e); } }
  window.f1722 = filt;
  const r0 = window.renderAStudents;
  if(typeof r0 === 'function') window.renderAStudents = function(){ let r; try{ r = r0.apply(this, arguments); } catch(e){ console.warn('Students list draw', e); } filt(); setTimeout(filt, 0); return r; };
  const k0 = window.asKey; if(typeof k0 === 'function') window.asKey = function(ev){ if(ev && ev.key === 'Enter'){ ev.preventDefault(); try{ clearTimeout(window.AS_T); }catch(x){} try{ renderAStudents(); }catch(x){} filt();
      const v = document.getElementById('v-astudents'), f = v && [...v.querySelectorAll('.li[onclick^="openStudent"]')].find(r => r.style.display !== 'none'); if(f) f.click(); return; } return k0.apply(this, arguments); };
  const aq = () => document.getElementById('aq');
  document.addEventListener('input', ev => { if(ev.target && ev.target.id === 'aq') setTimeout(filt, 200); }, true);
  const v = document.getElementById('v-astudents'); if(v){ let q = 0; new MutationObserver(() => { if(q || !aq() || !aq().value) return; q = 1; requestAnimationFrame(() => { q = 0; filt(); }); }).observe(v, { childList: true, subtree: true }); }
})();
</script>
`;
require('../tools/lib.js')(file, [
  ["      const at = v.querySelector('.sa-h') || rows[0];", "      v.querySelectorAll('.sk2').forEach(x => x.remove());   /* 1722 · one Source row only */\n      const at = v.querySelector('.sa-h') || rows[0];"],
  ["<script>\n/* 1590 · learner filter on the Students list */", JS + "<script>\n/* 1590 · learner filter on the Students list */"]
]);
