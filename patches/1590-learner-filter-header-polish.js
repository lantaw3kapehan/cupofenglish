// 1590: (coordinator for Misty, 29 Oct) small follow-up to 1588 / 1589.
// 1. Students list: learner filter All · YLE · Teens · Adults (with counts), next to Source; remembered on this device
//    (localStorage coe.ltF). Filters by the 1588 chip already on each row (the same coeLearner decision), so nothing new is computed.
//    "Type?" students show under All only. Applied before paint (attribute on the list), so a remembered filter does not flash.
// 2. Student header (phone): a wrapped meta line no longer starts with a stray "·" (separators that land at the start of a line are clipped).
// 3. Teacher name: the old light-blue background behind it is gone (plain teal text, same link / title).
// Colours use the design-system tokens (--coe-*) when they are there, with today's values as fallbacks.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>",
   `</script>
<style id="css1590">
#v-astudents .ltf1590{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 0 0}
#v-astudents .ltf1590>span{font:600 11px/1 var(--coe-font,Inter,system-ui,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:var(--coe-mute,#5E5A76);margin-right:4px}
#v-astudents .ltf1590 button{height:28px;padding:0 12px;border-radius:999px;border:1px solid var(--coe-line,#E7E5EE);background:#fff;color:var(--coe-text,#3A3556);font:500 13px/26px var(--coe-font,Inter,system-ui,sans-serif);cursor:pointer}
#v-astudents .ltf1590 button b{font-weight:600;margin-left:4px;color:var(--coe-mute,#5E5A76)}
#v-astudents .ltf1590 button[aria-pressed="true"]{background:var(--coe-teal-50,#E3F4F5);border-color:var(--coe-teal-200,#8CC5CA);color:var(--coe-teal-700,#00707A);font-weight:600}
#v-astudents[data-ltf="yle"] a.li.sa:not(:has(.lt1588.yle)),#v-astudents[data-ltf="teen"] a.li.sa:not(:has(.lt1588.teen)),#v-astudents[data-ltf="adult"] a.li.sa:not(:has(.lt1588.adult)){display:none!important}
/* 2 · separators: every item but the first carries its dot 11 px to its left; a dot that starts a line falls in the clipped 17 px */
#sheet #sheetBody.stu2 .shero.h1589 .grow>:is(.h-who,.h-learn):not(#z1590):not(#y1590){margin-left:-17px!important;clip-path:inset(-6px -6px -6px 17px)}
#sheet #sheetBody.stu2 .shero.h1589 .grow>:is(.h-who,.h-learn):not(#z1590)>*{position:relative;margin-left:17px!important;overflow:visible!important}
#sheet #sheetBody.stu2 .shero.h1589 .grow>:is(.h-who,.h-learn):not(#z1590)>*:not(:first-child)::before{content:"·"!important;position:absolute!important;left:-12px!important;top:0!important;bottom:auto!important;width:auto!important;height:auto!important;background:none!important;margin:0!important;color:#B9B6C6!important;display:inline!important;font:400 14px/22px var(--coe-font,Inter,system-ui,sans-serif)!important}
/* 3 · teacher name: no background */
#sheet #sheetBody.stu2 .shero.h1589 .h-learn>.chip.teal:not(#z1590):not(#y1590){background:transparent!important;outline:0!important;box-shadow:none!important;color:var(--coe-teal-700,#00707A)!important}
</style>
<script>
/* 1590 · learner filter on the Students list */
(function(){
  if(window.__1590) return; window.__1590 = 1;
  const K = 'coe.ltF', OPT = [['', 'All'], ['yle', 'YLE'], ['teen', 'Teens'], ['adult', 'Adults']];
  let cur = ''; try{ cur = localStorage.getItem(K) || ''; }catch(e){} if(!OPT.some(o => o[0] === cur)) cur = '';
  const v = () => document.getElementById('v-astudents');
  function apply(){ const el = v(); if(!el) return; if(cur) el.setAttribute('data-ltf', cur); else el.removeAttribute('data-ltf'); }
  function bar(){ const el = v(); if(!el) return; apply();
    const rows = el.querySelectorAll('a.li.sa'); if(!rows.length) return;
    const n = { '': rows.length, yle: 0, teen: 0, adult: 0 }; rows.forEach(r => { const c = r.querySelector('.lt1588'); if(!c) return; ['yle', 'teen', 'adult'].forEach(k => { if(c.classList.contains(k)) n[k]++; }); });
    const html = '<span>Learner</span>' + OPT.map(o => '<button type="button" data-k="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '" onclick="ltF1590(\\'' + o[0] + '\\')">' + o[1] + '<b>' + n[o[0]] + '</b></button>').join('');
    let b = el.querySelector('.ltf1590');
    if(!b){ const src = [].find.call(el.querySelectorAll('div, section'), d => /^\\s*Source/i.test(d.textContent || '') && d.querySelector('button') && d.children.length < 12);
      const at = src || el.querySelector(':scope > .seg'); if(!at) return; at.insertAdjacentHTML('afterend', '<div class="ltf1590" role="group" aria-label="Learner type"></div>'); b = el.querySelector('.ltf1590'); }
    if(b.innerHTML !== html) b.innerHTML = html; }
  window.ltF1590 = function(k){ cur = k || ''; try{ if(cur) localStorage.setItem(K, cur); else localStorage.removeItem(K); }catch(e){} bar(); };
  apply();
  const r0 = window.renderAStudents; if(typeof r0 === 'function') window.renderAStudents = function(){ const r = r0.apply(this, arguments); try{ bar(); }catch(e){} return r; };
  let q = 0; const el = v(); if(el) new MutationObserver(() => { if(q) return; q = 1; Promise.resolve().then(() => { q = 0; try{ bar(); }catch(e){} }); }).observe(el, { childList: true, subtree: true });
  bar();
})();
</script>
</body>
</html>`]
]);
