// 2242 (Misty, 14 Nov): Teacher › Pay. Once a teacher has verified last month's pay, the "Estimated November" card is on top;
// last month's card moves under it and reads "October 2026 pay · verified, waiting for payment" (it disappears once marked paid, as before).
// Not verified yet → last month's card stays on top, because the teacher still has to check it.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<script id="x2242">
(function(){
  if(window.__x2242) return; window.__x2242 = 1;
  function fix(){ try{ const v = document.getElementById('v-pay'); if(!v || !v.offsetParent || typeof D === 'undefined' || !D || D.mgr) return;
    const pc = document.getElementById('pckCard'); if(!pc || !/Verified ✓/.test(pc.textContent)) return;
    const est = [...v.querySelectorAll('.card')].find(c => c !== pc && /^\s*Estimated /.test(c.textContent)); if(!est) return;
    const b = pc.querySelector('b'); if(b && / pay · please check$/.test(b.textContent)) b.textContent = b.textContent.replace(/ · please check$/, ' · verified, waiting for payment');
    if(est.compareDocumentPosition(pc) & Node.DOCUMENT_POSITION_PRECEDING){ est.after(pc); } }catch(e){} }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; fix(); }); }).observe(document.body, { childList: true, subtree: true });
})();
</script>
`;
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
