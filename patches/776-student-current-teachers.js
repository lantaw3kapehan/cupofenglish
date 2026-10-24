// 776: (Misty) Anna's student page still listed Teacher Daniela (stopped). The device's saved student list can be older than the
// database's corrected list, so the student page now also checks the student's own calendar classes:
// · a teacher with no class with this student from 3 weeks ago to 6 weeks ahead is not shown (if the calendar is known).
// · the classes are fetched if not loaded yet, then the page repaints once.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 776 · student page: only current teachers */
(function(){
  if(window.__776 || typeof window.stuRender !== 'function') return; window.__776 = 1;
  const tn = x => String(x || '').toLowerCase().replace(/^\s*(teacher|tr\.?)\s+/, '').trim().split(/\s+/)[0];
  const asked = {};
  window.curTeachers = function(code, list){ code = String(code || '').toUpperCase(); list = Array.isArray(list) ? list : [];
    let L = (typeof STU !== 'undefined' && STU && String(STU.code).toUpperCase() === code && Array.isArray(STU.cls)) ? STU.cls : CLSM[code];
    if(!Array.isArray(L)) return null;
    const a = Date.now() - 21 * 864e5, b = Date.now() + 42 * 864e5, on = new Set(L.filter(c => c && !c.cancelled && (x => x >= a && x <= b)(new Date(c.start).getTime())).map(c => tn(c.teacher)));
    if(!on.size) return null; const k = list.filter(t => on.has(tn(t))); return k.length ? k : null; };
  const _r = window.stuRender;
  window.stuRender = function(){ try{ if(typeof STU !== 'undefined' && STU && STU.s){ const code = String(STU.code).toUpperCase(), all = STU.s._allT || STU.s.teachers || [];
        const k = curTeachers(code, all); if(k){ STU.s = Object.assign({}, STU.s, { teachers: k, _allT: all }); }
        else if(!asked[code] && !Array.isArray(CLSM[code])){ asked[code] = 1; api('mgmtStuClasses', TOKEN, code).then(x => { if(!Array.isArray(x)) return; CLSM[code] = x;
            if(STU && String(STU.code).toUpperCase() === code && curTeachers(code, all)) window.stuRender(); }).catch(() => {}); } } }catch(e){}
    return _r.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
