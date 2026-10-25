// 912: (phase 2, D1 Monitor) "Everything done in the app" listed up to 300 lines at once (≈5,000 px on a laptop, the board and
// filters scroll far out of reach). Now the newest 40 lines show, then one "Show all N" button; the choice is kept for the
// same tab + teacher until you switch, including across the 60-second refresh. Nothing is removed — every line is still
// in the page (hidden ones use the `hidden` attribute), and filters/tabs work as before. Display only.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 912 · Monitor feed: newest 40 first, "Show all" for the rest */
(function(){ if(window.__912) return; window.__912 = 1;
  var N = 40, OPEN = {};
  var st = document.createElement('style'); st.textContent = '#v-monitor .mo-f .mo-it[hidden]{display:none!important}'; document.head.appendChild(st);
  var key = function(f){ var h = f.querySelector('h2'); return h ? h.textContent : ''; };
  function cut(){ var v = document.getElementById('v-monitor'); if(!v) return; var f = v.querySelector('.mo-f'); if(!f || f.getAttribute('data-912')) return;
    f.setAttribute('data-912', '1'); var L = f.querySelectorAll('.mo-it'), k = key(f); if(L.length <= N + 5 || OPEN[k]) return;
    for(var j = N; j < L.length; j++) L[j].hidden = true;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost sm'; b.style.cssText = 'display:block;margin:10px auto 0';
    b.textContent = 'Show all ' + L.length + ' lines'; b.setAttribute('aria-expanded', 'false');
    b.onclick = function(){ OPEN[k] = 1; for(var j = N; j < L.length; j++) L[j].hidden = false; b.remove(); };
    f.appendChild(b); }
  function boot(){ var v = document.getElementById('v-monitor'); if(!v){ setTimeout(boot, 1500); return; }
    new MutationObserver(function(){ try{ cut(); }catch(e){} }).observe(v, { childList: true }); try{ cut(); }catch(e){} }
  boot();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
