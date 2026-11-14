// 2207 (14 Nov · the Overview jump): two Overview cards arrive 2–4 seconds after a refresh ("From teachers" and the Christmas
// dinner card) and pushed everything down. The Overview now shows the last copy of those cards straight away, in the same place,
// and swaps in the fresh card when it arrives, so nothing moves. Copies are kept on this device only.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<script id="x2207">
(function(){
  if(window.__x2207) return; window.__x2207 = 1;
  const KEYS = ['fd1806', 'x21c'], SK = 'coe.homeLate';
  const v = () => document.getElementById('v-home');
  const real = (h, k) => [...h.children].find(c => c.classList.contains(k) && !c.dataset.ph07);
  function save(){ const h = v(); if(!h) return; const out = {}; KEYS.forEach(k => { const el = real(h, k); if(el){ const p = el.previousElementSibling; out[k] = { html: el.outerHTML, after: p ? (p.className || p.tagName).toString().split(' ')[0] : '' }; } });
    if(Object.keys(out).length) try{ localStorage.setItem(SK, JSON.stringify(out)); }catch(e){} }
  function fill(){ const h = v(); if(!h || !h.children.length) return; let S = null; try{ S = JSON.parse(localStorage.getItem(SK) || 'null'); }catch(e){} 
    KEYS.forEach(k => { const r = real(h, k), ph = h.querySelector(':scope > [data-ph07="' + k + '"]');
      if(r){ if(ph) ph.remove(); return; }
      if(ph || !S || !S[k] || filled[k]) return; filled[k] = 1;
      const t = document.createElement('div'); t.innerHTML = S[k].html; const el = t.firstElementChild; if(!el) return; el.dataset.ph07 = k; el.style.pointerEvents = 'none';
      const a = S[k].after && [...h.children].find(c => (c.className || c.tagName).toString().split(' ')[0] === S[k].after);
      if(a) a.insertAdjacentElement('afterend', el); else h.insertAdjacentElement('afterbegin', el); }); }
  const filled = {};
  function start(){ const h = v(); if(!h){ setTimeout(start, 100); return; }
    const mo = new MutationObserver(() => { mo.disconnect(); try{ fill(); }catch(e){} try{ save(); }catch(e){} mo.observe(h, { childList: true }); });
    mo.observe(h, { childList: true }); try{ fill(); }catch(e){}
    setTimeout(() => { const x = v(); if(x) x.querySelectorAll(':scope > [data-ph07]').forEach(p => p.remove()); }, 15000); }
  start();
})();
</script>
`;
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
