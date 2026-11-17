// 2309 (Misty 17 Nov · Homework check also for management, e.g. Misty's own students): the class pop-up in Schedule gets a
// "Check homework" button, opening the same Homework check page (homework/) for that class.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ['<div id="ceMon" class="mon">${monHtml(e, null)}</div>`}',
  '<div id="ceMon" class="mon">${monHtml(e, null)}</div>`}${!e.cancelled && e.code && !/trial/i.test(e.type || \'\') ? `<button type="button" class="btn ghost block" style="margin-top:12px" onclick="hwOpenCE2309()">Check homework</button>` : \'\'}'],
 ['<script id="b2278">',
  `<script id="b2309">
/* 2309 · Check homework from the Schedule class pop-up (management) */
window.hwOpenCE2309 = function(){ try{ const e = typeof CE !== 'undefined' && CE ? CE.e : null; if(!e || !e.code) return; const nm = String(e.student || '').replace(/\\s+X$/i, '') || e.code;
  const u = 'homework/?code=' + encodeURIComponent(e.code) + '&n=' + encodeURIComponent(nm) + '&cls=' + encodeURIComponent(e.id || '') + '&day=' + encodeURIComponent(String(e.start || '').slice(0, 10)) + '&t=' + encodeURIComponent(e.start || '') + '&e=' + encodeURIComponent(e.end || '');
  const w = window.open(u, 'coehw'); if(!w) location.href = u; }catch(x){ toast('Could not open Homework check'); } };
</script>
<script id="b2278">`],
]);
