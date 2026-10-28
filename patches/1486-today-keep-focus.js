// 1486 · Keyboard focus survives Today redraws (S5)
// Today redraws its class cards when data arrives (and every minute); the button the teacher had reached with Tab was replaced
// and focus fell back to the page. Now, when focus was inside Today, the same control (same action, same label) gets focus
// back in the new card before the screen paints, without scrolling. Pointer users are not affected.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, []);
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1486 · keep keyboard focus across Today redraws */
(function(){
  if(window.__1486) return; window.__1486 = 1;
  function sig(el){ if(!el || el === document.body) return null; var oc = el.getAttribute('onclick') || '', tx = String(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    var card = el.closest('.cls, .qr, [id]'); return { tag: el.tagName, oc: oc, tx: tx, cls: el.classList.contains('qr') ? 'qr' : '', id: el.id || '' }; }
  function find(v, S){ if(S.id){ var e = document.getElementById(S.id); if(e && v.contains(e)) return e; }
    var L = [].slice.call(v.querySelectorAll(S.tag.toLowerCase())); var hit = L.filter(function(e){ return (e.getAttribute('onclick') || '') === S.oc && String(e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) === S.tx; });
    if(!hit.length && S.oc) hit = L.filter(function(e){ return (e.getAttribute('onclick') || '') === S.oc; });
    return hit[0] || null; }
  var _rt = window.renderToday; if(typeof _rt !== 'function') return;
  window.renderToday = function(){ var v = document.getElementById('v-today'), a = document.activeElement, S = v && a && a !== document.body && v.contains(a) ? sig(a) : null;
    var r = _rt.apply(this, arguments);
    if(S){ var put = function(){ try{ var cur = document.activeElement; if(cur && cur !== document.body && v.contains(cur)) return; var e = find(v, S); if(e && e.focus) e.focus({ preventScroll: true }); }catch(x){} };
      put(); if(window.requestAnimationFrame) requestAnimationFrame(put); }
    return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
