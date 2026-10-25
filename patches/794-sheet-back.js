// 794: (Misty) "when I click the close, it totally closes the report without remembering where I visited".
// Cards opened from another card (e.g. a trial report from the student page, a picture from the trial card) now remember the card before.
// · × (or tapping outside) goes back to that card, at the same scroll place; × on the first card closes as before.
// · A small "‹ Back to …" line at the top of the card shows where × will go.
// Forms (cards with typing boxes) are not returned to, so a saved form never reopens. Saves that close a card by themselves, the phone's back button and moving to another screen still close everything.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 794 · cards remember the card before */
(function(){
  if(window.__794 || typeof window.openSheet !== 'function' || typeof window.closeSheet !== 'function') return; window.__794 = 1;
  const ST = [], sh = () => document.getElementById('sheet'), body = () => document.getElementById('sheetBody');
  const on = () => { const x = sh(); return !!(x && x.classList.contains('on')); };
  const h1 = el => { const h = el && el.querySelector('h1'); return h ? String(h.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) : ''; };
  const st = document.createElement('style'); st.textContent = '.sbk{display:inline-flex;gap:6px;align-items:center;margin:-4px 0 8px;padding:4px 10px;border-radius:99px;background:#EEF7F7;color:#00737B;font-size:12.5px;font-weight:700;cursor:pointer;border:0;font-family:inherit}';
  document.head.appendChild(st);
  function chip(){ const b = body(); if(!b) return; const old = b.querySelector('.sbk'); if(old) old.remove(); const p = ST[ST.length - 1]; if(!p || !on()) return;
    b.insertAdjacentHTML('afterbegin', '<button type="button" class="sbk" onclick="sheetBack()">‹ Back to ' + String(p.t || 'the last card').replace(/[&<>"']/g, '') + '</button>'); }
  window.sheetBack = function(){ const p = ST.pop(); if(!p) return window.closeSheet(); const x = sh(), b = body(); if(!x || !b) return;
    b.innerHTML = p.html; x.classList.toggle('wide', !!p.wide); try{ x.scrollTop = p.top || 0; }catch(e){} const k = b.querySelector('.sbk'); if(k) k.remove(); chip(); };
  const o0 = window.openSheet;
  window.openSheet = function(html){ const was = on(), b = body(), x = sh(), prev = was && b ? { html: b.innerHTML, top: x ? x.scrollTop : 0, wide: x && x.classList.contains('wide'), t: h1(b) } : null;
    const r = o0.apply(this, arguments);
    try{ if(!was) ST.length = 0; else if(prev && prev.t && !/<textarea|<input(?![^>]*type="(?:checkbox|radio|hidden|file|search)")/i.test(prev.html) && h1(body()) && h1(body()) !== prev.t && !ST.some(p => p.t === h1(body()))){ prev.html = prev.html.replace(/<button type="button" class="sbk"[^>]*>.*?<\/button>/, ''); ST.push(prev); if(ST.length > 8) ST.shift(); }
      chip(); }catch(e){}
    return r; };
  const c0 = window.closeSheet;
  window.closeSheet = function(){ try{ const ev = window.event, t = ev && ev.target;
      const user = ev && ev.type === 'click' && t && t.closest && (t.closest('#sheet > button.x') || t.id === 'scrim');
      if(user && ST.length){ sheetBack(); return; }
      if(!user) ST.length = 0; }catch(e){}
    ST.length = 0; return c0.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
