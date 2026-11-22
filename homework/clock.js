/* 2716 (Misty 22 Nov 18:58): the class clock on every full screen (as on the books, 2701): Philippine time HH:MM, checked every second,
   and "n min left" / "Starts in n min" / "Time's up" for the class now on (coe.today.cls, kept by the app).
   coeClock.make() → a small element that keeps itself up to date. Used by Writing correction, Check homework and Speaking Activities. */
(function(){
  if(window.coeClock) return;
  const css = '.coe-clk{display:inline-flex;align-items:center;gap:8px;font-family:"COE Card Inter",Inter,sans-serif;white-space:nowrap}'
    + '.coe-clk b{font-size:20px;font-weight:700;color:#2B2253;font-variant-numeric:tabular-nums}'
    + '.coe-clk span{font-size:13px;font-weight:700;border-radius:999px;padding:4px 12px;background:#E4F6F6;color:#0E6F68}'
    + '.coe-clk span.warn{background:#FFF3DC;color:#8A5A00}.coe-clk span.over{background:#FCEBEB;color:#A32D2D}.coe-clk span:empty{display:none}';
  const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  const ALL = [];
  function tick(){ const now = Date.now(), ph = new Date(now + 8 * 3600e3), hm = String(ph.getUTCHours()).padStart(2, '0') + ':' + String(ph.getUTCMinutes()).padStart(2, '0');
    let o = null; try{ o = JSON.parse(localStorage.getItem('coe.today.cls') || 'null'); }catch(e){}
    const L = (o && o.cls) || [], c = L.find(x => now >= x[0] - 5 * 6e4 && now <= x[1] + 10 * 6e4); let tx = '', cl = '';
    if(c){ const left = Math.ceil((c[1] - now) / 6e4);
      if(now < c[0]){ tx = 'Starts in ' + Math.max(1, Math.ceil((c[0] - now) / 6e4)) + ' min'; }
      else if(left > 0){ tx = left + ' min left'; cl = left <= 5 ? 'warn' : ''; }
      else { tx = 'Time’s up'; cl = 'over'; } }
    ALL.forEach(e => { if(!e.isConnected) return; const b = e.firstChild, s = e.lastChild; if(b.textContent !== hm) b.textContent = hm; if(s.textContent !== tx) s.textContent = tx; if(s.className !== cl) s.className = cl; }); }
  window.coeClock = { make(){ const e = document.createElement('div'); e.className = 'coe-clk'; e.setAttribute('aria-label', 'Time now'); e.innerHTML = '<b></b><span></span>'; ALL.push(e); tick(); return e; } };
  setInterval(tick, 1000);
})();
