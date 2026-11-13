// 2162 (13 Nov · Misty 13:49 "do all now"):
// (a) To do › Fix these › "Renewal · …" items (coe_ops_check, kind renew: who to remind / follow up / ask to pay today) get
//     "Open" (Renewals) and "Done today" (hides it until tomorrow) instead of "It's correct".
// (b) Edit details › Save enrollment: when "First class" is set later than classes already booked for that student, the app offers to
//     cancel those earlier classes (Parent asked · reason "Start moved to …") with a make-up each at the end — what was done by hand for
//     Fan Fan on 13 Nov. Same server path as Cancel class (editClass, makeup on). Nothing happens without the OK.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["'<button type=\"button\" onclick=\"o2091ok(' + i + ', this)\">It\\'s correct</button></div></div>'); }).join('')",
   "'<button type=\"button\" onclick=\"o2091ok(' + i + ', this)\">' + (x.kind === 'renew' ? 'Done today' : 'It\\'s correct') + '</button></div></div>'); }).join('')"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="x2162">
/* 2162 · First class moved later → offer to cancel the classes booked before it, each with a make-up at the end */
(function(){
  if(window.__sm2162) return; window.__sm2162 = 1;
  const base = window.api; if(typeof base !== 'function') return;
  const ymd = d => new Date(new Date(d).getTime() + 8 * 3600e3).toISOString().slice(0, 10);
  const hm = d => new Date(new Date(d).getTime() + 8 * 3600e3).toISOString().slice(11, 16);
  const nice = s => { try{ return new Date(s + 'T12:00:00+08:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }catch(e){ return s; } };
  async function offer(f){ try{
    const first = String(f && f.firstClass || '').slice(0, 10), code = String(f && f.code || '').toUpperCase();
    if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(first) || !code || typeof STU === 'undefined' || !STU || String(STU.code || '').toUpperCase() !== code) return;
    const now = Date.now(), L = (STU.cls || []).filter(e => e && !e.cancelled && e.id && Date.parse(e.start) > now && ymd(e.start) < first && !/(^|-)\\s*TC\\s*(X)?$/i.test(String(e.title || '')));
    if(!L.length) return;
    const list = L.slice(0, 8).map(e => '• ' + nice(ymd(e.start)) + ' ' + hm(e.start) + (e.teacher ? ' · Teacher ' + String(e.teacher).replace(/^teacher\\s+/i, '') : '')).join('\\n') + (L.length > 8 ? '\\n… and ' + (L.length - 8) + ' more' : '');
    if(!confirm('The first class is now ' + nice(first) + ', but ' + L.length + ' class' + (L.length > 1 ? 'es are' : ' is') + ' still booked before it:\\n\\n' + list + '\\n\\nCancel ' + (L.length > 1 ? 'them' : 'it') + ' and add the same number of make-up classes at the end?\\n(Who asked: Parent / student · the teacher sees “Start moved to ' + nice(first) + '”)')) return;
    let ok = 0;
    for(const e of L){ const mins = Math.max(15, Math.round((Date.parse(e.end) - Date.parse(e.start)) / 6e4) || 25);
      const r = await base('editClass', TOKEN, e.id, { action: 'cancel', start: e.start, date: ymd(e.start), time: hm(e.start), mins: String(mins), teacher: e.teacher || '', makeup: true,
        reason: 'Start moved to ' + nice(first) + ' (parent asked)', forward: false, force: false, by: 'parent' }).catch(() => null);
      if(r && r.ok){ ok++; e.cancelled = true; } }
    try{ toast(ok === L.length ? '✓ ' + ok + ' class' + (ok > 1 ? 'es' : '') + ' cancelled · make-up' + (ok > 1 ? 's' : '') + ' added at the end' : ok + ' of ' + L.length + ' cancelled · open the schedule to check the rest'); }catch(e){}
    try{ if(typeof openStudent === 'function') setTimeout(() => openStudent(code), 1500); }catch(e){}
  }catch(e){} }
  const w = function(fn){ const a = arguments, p = base.apply(this, a);
    if(fn === 'saveStudent' && a[2] && a[2].firstClass && p && p.then) p.then(r => { if(r && r.ok) setTimeout(() => offer(a[2]), 600); }, () => {});
    return p; };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
})();
</script>
</body>
</html>`],
]);
