// 2310 (Misty 17 Nov 16:18 "yes add it now"): teachers can open Check homework in advance, not only from Today's class cards:
// · My schedule (the list and the day panel): a "Check homework" pill under each class, next to the Meeting ID pill (past classes too)
// · My students: a "Check homework" button on each student card (opens the page for that student without a class)
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["<div class=\"rt\">${lo ? '<span class=\"chip coral\">Ending soon</span>' : ''}${fp(s)}</div></div>`; };",
  "<div class=\"rt\">${lo ? '<span class=\"chip coral\">Ending soon</span>' : ''}${fp(s)}${window.hwStuBtn2310 ? hwStuBtn2310(s) : ''}</div></div>`; };"],
 ['<script id="b2278">',
  `<style id="d2310">#v-tsched a.m38.hw2310{background:#EEF2FF;color:#2F2753}.c504 .rt .hw2310{margin-top:6px;white-space:nowrap}</style>
<script id="b2310">
/* 2310 · Check homework from My schedule and My students (teachers), so homework can be checked before the class day */
(function(){
  if(window.__b2310) return; window.__b2310 = 1;
  const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const all = () => [].concat((typeof D !== 'undefined' && D && D.schedule) || [], (typeof TS !== 'undefined' && TS && TS.events) || []);
  const open = u => { const w = window.open(u, 'coehw'); if(!w) location.href = u; };
  window.hwOpenEv2310 = function(id){ try{ const c = all().find(x => x.id === id); if(!c || !c.code) return toast('Class not found · refresh and try again');
    const nm = String(c.student || '').replace(/\\s+X$/i, '') || c.code;
    open('homework/?code=' + encodeURIComponent(c.code) + '&n=' + encodeURIComponent(nm) + '&cls=' + encodeURIComponent(c.id) + '&day=' + encodeURIComponent(c.day || '') + '&t=' + encodeURIComponent(c.start || '') + '&e=' + encodeURIComponent(c.end || '')); }catch(e){ toast('Could not open Homework check'); } };
  window.hwOpenStu2310 = function(code, nm){ try{ open('homework/?code=' + encodeURIComponent(code) + '&n=' + encodeURIComponent(nm || code)); }catch(e){ toast('Could not open Homework check'); } };
  window.hwStuBtn2310 = function(s){ try{ if(!s || !s.code || (typeof D !== 'undefined' && D && D.mgr)) return '';
    return '<button type="button" class="btn ghost sm hw2310" title="Paste the homework from WeChat and correct it" onclick="event.stopPropagation();hwOpenStu2310(\\'' + E(s.code) + '\\',\\'' + E(String(s.name || '').replace(/'/g, '')) + '\\')">Check homework</button>'; }catch(e){ return ''; } };
  const base = window.m38Link;
  window.m38Link = function(e){ let h = ''; try{ h = base ? base(e) : ''; }catch(x){}
    try{ if(e && e.code && !e.cancelled && e.type !== 'Trial' && !(typeof D !== 'undefined' && D && D.mgr))
      h += ' <a class="m38 hw2310" onclick="event.stopPropagation();hwOpenEv2310(\\'' + E(e.id) + '\\')">Check homework</a>'; }catch(x){}
    return h; };
})();
</script>
<script id="b2278">`],
]);
