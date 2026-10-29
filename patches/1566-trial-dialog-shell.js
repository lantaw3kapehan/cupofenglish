// 1566 · Trial dialog layout (Misty 08:56, Will's dialog on a laptop: "boxes look broken", "does not move").
// Cause: the trial card's action area (#tlAct, class rp-act) keeps the old rule `.rp-act{position:sticky;bottom:-1px}` meant for a short
// button bar. Since the step list (tl4) moved into it, it is ~1000 px tall, so "sticky to the bottom" pinned it upward: it covered the
// title (cut "Will" under a divider = its top border), the inline PDF and the "More" row slid under one another, and the dialog seemed
// not to scroll. Fixes, in the shared sheet shell (any sheet):
// · A step list inside a sheet is in normal flow (not sticky, no top border). The short sticky button bars (parent report) are unchanged.
// · Chip rows in a sheet: the row had a pill radius (999 px) with overflow hidden, which cut the first chip's left edge (the stray "|")
//   and the selected chip's right border. In sheets the row is now square, not clipped, and wraps.
// · The report PDF preview is shown on demand ("Show the PDF here" / "Hide"), inside the flow, never over other content; one scroll
//   container (the sheet) — the PDF frame is no longer a scroll trap in the middle of the card.
// · "After sending" steps continue the numbers of "Send to the student" (5, 6, …; ✓ when done) instead of a bare "·".
// · Returning to the same trial within 10 minutes (e.g. after Price picture) restores where you were in the card.
// Text, buttons, handlers and stored data unchanged.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, []);   // version bump only
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="sh66css">
.sheet .rp-act.tl4,.sheet .rp-act:has(.tl4-r){position:static!important;bottom:auto!important;border-top:0!important;padding-top:4px!important}
html body #sheet .seg{border-radius:0!important;overflow:visible!important;flex-wrap:wrap!important;padding:1px!important;box-shadow:none!important}
#tlPdf .rp-pdf{display:none}
#tlPdf.sh66-on .rp-pdf{display:block;height:min(62vh,600px)}
#tlPdf .sh66-b{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:13px;color:var(--ink2,#6F6B85)}
#tlPdf .sh66-b button{height:34px;padding:0 12px;font-size:13px}
</style>
<script>
/* 1566 · trial dialog layout */
(function(){ if(window.__1566) return; window.__1566 = 1;
  var POS = {};
  function pdf(){ var el = document.getElementById('tlPdf'); if(!el) return; var fr = el.querySelector('.rp-pdf');
    var b = el.querySelector('.sh66-b'); if(!fr){ if(b) b.remove(); return; }
    if(!b){ el.insertAdjacentHTML('afterbegin', '<div class="sh66-b"><span>Report PDF</span><button type="button" class="btn ghost sm" onclick="sh66Pdf()">Show the PDF here</button></div>'); }
    var on = el.classList.contains('sh66-on'), bt = el.querySelector('.sh66-b button'); if(bt) bt.textContent = on ? 'Hide the PDF' : 'Show the PDF here'; }
  window.sh66Pdf = function(){ var el = document.getElementById('tlPdf'); if(!el) return; el.classList.toggle('sh66-on'); pdf(); };
  function nums(){ var a = document.getElementById('tlAct'); if(!a) return; var S = a.querySelectorAll('#tl4S .tl4-n'), n = 0;
    S.forEach(function(x){ var v = parseInt(x.textContent, 10); if(!isNaN(v)) n = Math.max(n, v); else if(x.textContent.trim() === '✓') n++; });
    a.querySelectorAll('#tl4A .tl4-n').forEach(function(x){ var t = x.textContent.trim(); if(t === '?') return; n++; if(t === '·' || t === '' || !isNaN(parseInt(t, 10))){ x.textContent = x.closest('.tl4-r.done') ? '✓' : String(n); } }); }
  function key(){ var t = typeof TLD !== 'undefined' ? TLD : null; return t ? (t.label || t.date + '|' + t.student) : ''; }
  var sh = document.getElementById('sheet'); if(sh) sh.addEventListener('scroll', function(){ if(document.getElementById('tlAct')){ var k = key(); if(k) POS[k] = { y: sh.scrollTop, at: Date.now() }; } }, { passive: true });
  var _tb = window.tlBtns; if(typeof _tb === 'function') window.tlBtns = function(){ var r = _tb.apply(this, arguments); try{ nums(); pdf(); }catch(e){ console.warn('sh66', e); } return r; };
  var _to = window.tlOpen; if(typeof _to === 'function') window.tlOpen = function(){ var r = _to.apply(this, arguments);
    try{ var k = key(), p = POS[k], s2 = document.getElementById('sheet'); try{ nums(); pdf(); }catch(e){}
      if(p && s2 && Date.now() - p.at < 6e5) requestAnimationFrame(function(){ if(key() === k) s2.scrollTop = p.y; }); }catch(e){} return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1566 trial dialog layout');
