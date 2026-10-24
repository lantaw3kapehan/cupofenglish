// 759: (Misty) "migrate everything to the database · no slow screens" — step 1.
// a) Class visits, comments on class notes, reminders sent and Overview's month/day are built by the database itself (live). They still went
//    to Google ~1,500×/day whenever the copy looked "older than your last save" (a rule meant for screens that show your own saves).
//    These are written by management, not by the teacher, so they now always come from the database (0.3–0.9 s); Google only if the
//    database cannot answer at all.
// b) Monthly feedback form prefetch: a refused answer (e.g. "opens on the 25th") was never kept, so every device asked Google again
//    every 30 min for every student (~1,800 Google calls/day, 6–7 s each). Refusals are now kept 3 h, forms 6 h as before.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("if(c && c.ok && Date.now() - (c._at||0) < 6*3600e3) continue;", "if(c && Date.now() - (c._at||0) < (c.ok ? 6 : 3)*3600e3) continue;   /* 759 */");
rep("try{ const r = await api('tFbForm', TOKEN, x.code); if(r.ok){ r._at = Date.now(); store('set','coe.doc.fbf.'+x.code, JSON.stringify(r)); } }catch(e){}",
    "try{ const r = await api('tFbForm', TOKEN, x.code); if(r && (r.ok || r.msg)){ r._at = Date.now(); store('set','coe.doc.fbf.'+x.code, JSON.stringify(r)); } }catch(e){}");
const tag = '</body>';
const i = s.lastIndexOf(tag); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + `<script>
/* 759 · read from the database only (Google only if the database cannot answer) */
(function(){
  const DBF = /^(tMyVisits|tMyComments|tNoteComments|tReminders|mgmtMonDay)$/;
  const base = window.api; if(!base || base.__759) return;
  const w = function(fn){ const args = Array.prototype.slice.call(arguments, 1), self = this;
    if(DBF.test(fn) && typeof sbOn === 'function' && typeof sbDoc === 'function' && typeof sbKey === 'function' && sbOn()){
      return sbDoc(sbKey(fn, args)).then(d => (d && d.data != null && (d.live || Date.now() - Date.parse(d.at) < 6 * 36e5)) ? d.data : base.apply(self, [fn].concat(args)), () => base.apply(self, [fn].concat(args))); }
    return base.apply(this, arguments); };
  w.__759 = 1; window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
