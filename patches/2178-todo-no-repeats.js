// 2178 (13 Nov · Misty 19:49 "in To do, remove redundancy or repetitive information, to avoid confusion"): each thing has one place.
// · Renewals: only "Renewals due" (Copy reminder / Mark as sent). Removed from Fix these (coe_ops_check skips renew) and from the
//   "Do next in this order" strip, which only repeated the Renewals due "Act now" rows.
// · The four count tiles (Trial reports / Renewals / Trial follow-ups / Data to fix) repeated each section's own count: hidden.
// · Empty sections (Trial follow-ups with none, Data to fix 0) are hidden instead of showing a heading with nothing under it.
// · Fix these › trial group renamed "Trials to revisit" so it is not mistaken for the "Trial follow-ups" section (it holds trials that
//   section no longer lists: no contact for 7+ days, or "Not now" a month ago).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["['trial', 'Trial follow-ups', 'Send the next message or close the trial.', k => k === 'tfu' || k === 'tagain']", "['trial', 'Trials to revisit', 'Older trials: no contact for 7+ days, or \"Not now\" a month ago.', k => k === 'tfu' || k === 'tagain']"],
  ["</script>\n</body>\n</html>", `</script>
<style id="css2178">#v-mtoday #tdFocus,#v-mtoday .tdsum{display:none!important}#v-mtoday .x2178-empty{display:none!important}</style>
<script id="x2178">
/* 2178 · To do: hide sections that are empty */
(function(){
  if(window.__x2178) return; window.__x2178 = 1;
  const tidy = () => { try{ const v = document.getElementById('v-mtoday'); if(!v) return;
    const f = document.getElementById('td-follow'); if(f) f.classList.toggle('x2178-empty', !f.querySelector('.li,.tdr,button,a.li'));
    const x = document.getElementById('td-fix'); if(x){ const s = x.querySelector('summary, h2'); x.classList.toggle('x2178-empty', !!(s && /Data to fix\\s*0\\b/.test(s.textContent || ''))); }
  }catch(e){} };
  const r0 = window.renderMToday; if(typeof r0 === 'function') window.renderMToday = function(){ const r = r0.apply(this, arguments); tidy(); return r; };
  try{ let q = 0; const v = document.getElementById('v-mtoday'); if(v) new MutationObserver(() => { if(q) return; q = 1; setTimeout(() => { q = 0; tidy(); }, 150); }).observe(v, { childList: true, subtree: true }); }catch(e){}
})();
</script>
</body>
</html>`],
]);
