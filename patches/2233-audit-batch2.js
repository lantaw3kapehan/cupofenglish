// 2233 (audit): fewer repeats.
// · Student page › Package: "Lesson summary" and "Lessons left picture" under the package are hidden when the student has one package
//   (the same buttons are at the top of the page). With two or more packages they stay, to pick which package.
// · Student page › Status: "+ Record renewal" is hidden while the step-by-step list shows "Renewed · paid" (same save).
// · Teachers › Contracts: a complete row says "Complete · witnessed" (the pill above already says "Signed by both").
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<script id="x2233">
(function(){
  if(window.__x2233) return; window.__x2233 = 1;
  function tidy(){ const b = document.getElementById('sheetBody'); if(!b) return;
    const pk = b.querySelector('#stuPkg'); if(pk){ const one = pk.querySelectorAll('.mini').length <= 1;
      pk.querySelectorAll('button, a').forEach(x => { const t = (x.textContent || '').trim(); if(t === 'Lesson summary' || t === 'Lessons left picture') x.style.display = one ? 'none' : ''; }); }
    const st = b.querySelector('#stuStat'), rn = b.querySelector('#stuRn');
    if(st){ const dup = rn && [...rn.querySelectorAll('button')].some(x => /^Renewed · paid$/.test((x.textContent || '').trim()) && x.offsetParent);
      st.querySelectorAll('button, a').forEach(x => { if(/^\+ Record renewal$/.test((x.textContent || '').trim())) x.style.display = dup ? 'none' : ''; }); } }
  let q = 0; (function hook(){ const s = document.getElementById('sheet') || document.body; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ tidy(); }catch(e){} }); }).observe(s, { childList: true, subtree: true }); })();
})();
</script>
`;
lib(file, [
 ["'<div class=\"nx1121\"><span class=\"ok\">Complete</span> · signed by both' + (r.wit_at ? ' · witnessed' : ' · witness: Operations') + '</div>'", "'<div class=\"nx1121\"><span class=\"ok\">Complete</span>' + (r.wit_at ? ' · witnessed' : ' · witness: Operations') + '</div>'"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
