// 1584: (Misty, 29 Oct · Students audit, simplify) Students header: one Database way in, access in a small menu.
// · "Database sheet · the raw rows, to check or fix" under the title went to the same place as the Database sheet tab right above it → removed;
//   the tab stays. Package check stays as the one link under the title.
// · Partner access and Student access (two buttons in the header) → one "Access" menu with both. Same dialogs (paOpen, psOpen), same ids.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["<a class=\"lk\" onclick=\"go(\\'db\\')\">Database sheet · the raw rows, to check or fix</a> · <a class=\"lk\" onclick=\"pkgCheck()\">",
   "<a class=\"lk\" onclick=\"pkgCheck()\">"],
  ["</script>\n</body>\n</html>",
   `</script>
<style id="css1584">
#v-astudents .acc1584{position:relative;margin-left:auto;align-self:center}
#v-astudents #dbLk{align-items:center}
#v-astudents .acc1584>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
#v-astudents .acc1584>summary::-webkit-details-marker{display:none}
#v-astudents .acc1584>summary svg{width:14px;height:14px;transition:transform .15s}
#v-astudents .acc1584[open]>summary svg{transform:rotate(180deg)}
#v-astudents .acc1584 .mn{position:absolute;right:0;top:calc(100% + 6px);z-index:30;min-width:240px;background:#fff;border:1px solid #E6E4EE;border-radius:12px;box-shadow:0 8px 24px rgba(43,34,83,.12);padding:6px;display:flex;flex-direction:column;gap:2px}
#v-astudents .acc1584 .mn .btn{margin:0!important;justify-content:flex-start;border:0!important;box-shadow:none!important;background:transparent;width:100%;text-align:left;white-space:nowrap}
#v-astudents .acc1584 .mn .btn:hover,#v-astudents .acc1584 .mn .btn:focus-visible{background:#F2F8F8}
</style>
<script>
/* 1584 · Students header: Partner access + Student access in one Access menu */
(function(){
  if(window.__1584) return; window.__1584 = 1;
  function menu(){ try{ const ld = document.querySelector('#v-astudents .lead'); if(!ld) return; const pa = document.getElementById('pa1340b'), ps = document.getElementById('ps1350b'); if(!pa && !ps) return;
    const host = ld.querySelector('#dbLk') || ld; let m = ld.querySelector('.acc1584'); if(!m){ host.insertAdjacentHTML('beforeend', '<details class="acc1584"><summary class="btn ghost sm" aria-label="Access for partners and students">Access <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary><div class="mn"></div></details>'); m = ld.querySelector('.acc1584'); }
    const mn = m.querySelector('.mn'); [pa, ps].forEach(b => { if(b && b.parentNode !== mn){ b.style.marginLeft = ''; mn.appendChild(b); } }); }catch(e){} }
  document.addEventListener('click', e => { document.querySelectorAll('#v-astudents .acc1584[open]').forEach(d => { if(!d.contains(e.target)) d.removeAttribute('open'); else if(e.target.closest('.mn .btn')) d.removeAttribute('open'); }); }, true);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') document.querySelectorAll('#v-astudents .acc1584[open]').forEach(d => { d.removeAttribute('open'); try{ d.querySelector('summary').focus(); }catch(x){} }); });
  const r0 = window.renderAStudents; if(typeof r0 === 'function') window.renderAStudents = function(){ const r = r0.apply(this, arguments); menu(); return r; };
  menu();
})();
</script>
</body>
</html>`]
]);
