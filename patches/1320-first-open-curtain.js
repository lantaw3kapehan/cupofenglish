// 1320: (Misty, 27 Oct 12:35 · backlog 4) The very first open on a device (nothing saved on it yet — a new phone/laptop, or right after
//   signing in) still showed the screen building itself for ~1–2 s: the start-up layout, then the header changing size once the app knew
//   it was management, then the Overview boxes, then the screen that was asked for. Now that first open shows one steady loading card
//   (logo + grey lines, fixed in place) while the screen is built underneath, and shows the finished screen at once when it has been
//   quiet for a moment (at most ~4 s after the data arrives). Every later open/refresh is unchanged (the device copy is shown at once).
//   Presentation only.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.indexOf('</head>');
s = s.slice(0, i) + `<style id="st1320">
html.cur1320 #app{visibility:hidden!important}
#cur1320{position:fixed;inset:0;z-index:2147483000;background:var(--bg,#F7F7FA);display:flex;align-items:flex-start;justify-content:center;padding-top:min(22vh,180px);transition:opacity .16s ease}
#cur1320.off{opacity:0;pointer-events:none}
#cur1320 .c{width:min(560px,calc(100vw - 32px));box-sizing:border-box}
#cur1320 .lg{height:44px;display:flex;align-items:center;gap:10px;margin-bottom:26px}
#cur1320 .lg img{height:44px;width:auto}
#cur1320 .sk{height:14px;border-radius:7px;margin:12px 0;background:linear-gradient(90deg,#ECEBF2 0%,#F7F7FB 50%,#ECEBF2 100%);background-size:200% 100%;animation:sk 1.2s infinite}
#cur1320 .t{font:500 14px/1.4 Inter,system-ui,sans-serif;color:#6B6782;margin-top:18px}
@media (prefers-reduced-motion:reduce){#cur1320 .sk{animation:none}}
</style>
` + s.slice(i);
const j = s.indexOf('</head>');
s = s.slice(0, j) + String.raw`<script>
/* 1320 · first open on a device: one steady loading card while the screen builds underneath */
(function(){
  if(window.__1320) return; window.__1320 = 1;
  let on = 0, t0 = 0, last = 0, mo = null, tq = 0;
  function logo(){ try{ const im = document.querySelector('#login img, header .hd img'); return im && im.src ? im.src : ''; }catch(e){ return ''; } }
  function off(){ if(!on) return; on = 0; try{ mo && mo.disconnect(); }catch(e){} clearInterval(tq);
    document.documentElement.classList.remove('cur1320'); const c = document.getElementById('cur1320');
    if(c){ c.classList.add('off'); setTimeout(() => { try{ c.remove(); }catch(e){} }, 220); } }
  function ready(){ try{ return typeof D !== 'undefined' && !!D && typeof VIEW !== 'undefined' && !!VIEW; }catch(e){ return false; } }
  function engage(){ if(on) return; on = 1; t0 = last = Date.now();
    document.documentElement.classList.add('cur1320');
    let c = document.getElementById('cur1320'); if(!c){ c = document.createElement('div'); c.id = 'cur1320'; c.setAttribute('role', 'status'); c.setAttribute('aria-live', 'polite');
      const L = logo(); c.innerHTML = '<div class="c"><div class="lg">' + (L ? '<img alt="CupOfEnglish" src="' + L + '">' : '<b style="font:400 26px \'Fredoka One\',Inter,sans-serif;color:#2B2253">CupOfEnglish</b>') + '</div>'
        + '<div class="sk" style="width:62%"></div><div class="sk"></div><div class="sk" style="width:84%"></div><div class="sk" style="width:48%"></div><div class="t">Loading your screen…</div></div>';
      (document.body || document.documentElement).appendChild(c); }
    try{ mo = new MutationObserver(() => { last = Date.now(); }); mo.observe(document.getElementById('app') || document.body, { childList: true, subtree: true, characterData: true }); }catch(e){}
    let dAt = 0;
    tq = setInterval(() => { const now = Date.now();
      if(now - t0 > 12000) return off();                       // never hold the app longer than this (offline / errors)
      if(!ready()) return; if(!dAt) dAt = now;
      if((now - last > 350 && now - dAt > 500) || now - dAt > +(window.__cap1320 || 2200)) off(); }, 100); }
  window.__curtain1320 = engage;
})();
</script>
` + s.slice(j);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  // skeleton() is what every first open calls (start-up with nothing saved, and both sign-in paths)
  ["function skeleton(){ $('v-today').innerHTML", "function skeleton(){ try{ window.__curtain1320 && window.__curtain1320(); }catch(e){} $('v-today').innerHTML"]]);
