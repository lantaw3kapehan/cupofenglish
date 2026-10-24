// 775: (Misty) Anna's student page still said "Reminder sent Oct 20" after she renewed (this device's renewal list was old).
// · Opening a student page now refreshes the renewal list from the database (at most every 30 s) and repaints the page if that
//   student's status changed, so Status, To do and the cards agree everywhere.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 775 · student page: fresh renewal status */
(function(){
  if(window.__775 || typeof window.openStudent !== 'function') return; window.__775 = 1;
  let last = 0;
  const _o = window.openStudent;
  window.openStudent = function(code){ const r = _o.apply(this, arguments);
    try{ if(typeof D !== 'undefined' && D && D.mgr && Date.now() - last > 30e3){ last = Date.now(); const k = String(code || '').toUpperCase();
        api('mgmtRenewals', TOKEN).then(v => { if(!v || typeof v !== 'object' || Array.isArray(v)) return; const before = (REN || {})[k];
          REN = v; try{ localStorage.setItem('coe.ren', JSON.stringify(REN)); }catch(e){}
          if(before !== v[k] && typeof STU !== 'undefined' && STU && String(STU.code).toUpperCase() === k && typeof stuRender === 'function') stuRender(); }).catch(() => {}); } }catch(e){}
    return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
