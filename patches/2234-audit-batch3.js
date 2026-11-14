// 2234 (audit batch 3): repeats and small wording.
// · Dates: Chrome writes September as "Sept" in British English; the app now writes "Sep" everywhere, like the other months.
// · Students list: the course books line says "Books A1, OD1" so it is not read as the level (the LEVEL column is the level).
// · Parent reports: the three number tiles are the filters (click a tile to see those reports), so the same three counts
//   are no longer repeated in the buttons below; the empty line no longer repeats "waiting for teachers";
//   "Chinese not reviewed · …" is hidden when every report is already sent (it waited forever).
// · Enquiries: a long Facebook inbox link shows as "Facebook ↗" instead of "Facebook · …all"; "logged 10-29 03:07" reads "logged 29 Oct 03:07".
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<script id="x2234">
(function(){
  if(window.__x2234) return; window.__x2234 = 1;
  ['toLocaleDateString', 'toLocaleString'].forEach(function(fn){ var o = Date.prototype[fn];
    Date.prototype[fn] = function(){ var s = o.apply(this, arguments); return typeof s === 'string' && s.indexOf('Sept') >= 0 ? s.replace(/\bSept\b/g, 'Sep') : s; }; });
  var MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function reports(v){
    var st = v.querySelector('.stats'), segs = v.querySelectorAll('.seg'); if(!st || segs.length < 2) return;
    var sg = segs[1], F = { check: 1, sent: 0, wait: 2 }, tiles = st.querySelectorAll('.stat');
    if(tiles.length !== 3) return;
    Object.keys(F).forEach(function(k){ var t = tiles[F[k]], b = sg.querySelector('button[onclick*="RP_F=\'' + k + '\'"]'); if(!t || !b) return;
      b.style.display = 'none'; t.style.cursor = 'pointer'; t.setAttribute('role', 'button'); t.tabIndex = 0;
      var on = typeof RP_F !== 'undefined' && RP_F === k; t.classList.toggle('on2234', on);
      t.onclick = function(){ RP_F = k; renderReports(); }; t.onkeydown = function(e){ if(e.key === 'Enter') t.onclick(); }; });
    var em = v.querySelector('.sec > .empty'); if(em) em.textContent = em.textContent.replace(/ · \d+ waiting for teachers?$/, '');
    var cn = sg.querySelector('.f1100'); if(cn && /…$/.test(cn.textContent)){ var un = (typeof RP !== 'undefined' && RP && RP.rows || []).filter(function(x){ return !/^Sent/.test(x.status); }).length; cn.style.display = un ? '' : 'none'; } }
  function enquiries(v){
    v.querySelectorAll('a.lk').forEach(function(a){ var m = (a.textContent || '').match(/^(\S+) · …\S*$/); if(m) a.textContent = m[1] + ' ↗'; });
    v.querySelectorAll('.small, .mute').forEach(function(e){ if(e.children.length > 3) return; e.childNodes.forEach(function(n){ if(n.nodeType === 3 && /logged \d\d-\d\d /.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/logged (\d\d)-(\d\d) /, function(_, mm, dd){ return 'logged ' + (+dd) + ' ' + MO[+mm - 1] + ' '; }); }); }); }
  function run(){ try{ var r = document.getElementById('v-reports'); if(r && r.offsetParent) reports(r); var q = document.getElementById('v-enquiry'); if(q && q.offsetParent) enquiries(q); }catch(e){} }
  var q = 0; new MutationObserver(function(){ if(q) return; q = requestAnimationFrame(function(){ q = 0; run(); }); }).observe(document.body, { childList: true, subtree: true });
})();
</script>
<style id="d2234">#v-reports .stats .stat[role=button]{transition:box-shadow .15s}#v-reports .stats .stat[role=button]:hover{box-shadow:0 0 0 2px #CFE4E6}#v-reports .stats .stat.on2234{box-shadow:0 0 0 2px #2F6F77}</style>
`;
lib(file, [
 ["esc((s.teachers || []).join(', ')) + (s.book ? ' · ' + esc(s.book) : '')", "esc((s.teachers || []).join(', ')) + (s.book ? ' · Books ' + esc(s.book) : '')"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
