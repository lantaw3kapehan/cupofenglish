/* 21 Oct · 489 · To do "flickers" (Misty). Opening To do starts several background loads (renewal statuses, trial follow-ups, data fixes,
   trial reports, enquiries, agreements, ACTIVE); each one redrew the whole screen, so the list jumped a few times in a row, and some
   redraws had nothing new. Now:
   · a redraw with exactly the same data as the last one is skipped;
   · redraws that arrive close together are merged into one (the first runs at once, the rest wait 350 ms and run once);
   · the scroll position is kept across a redraw.
   A tap that changes something (✓ Sent, Update, Change…) still redraws at once. */
(function(){
  const base = window.renderMToday; if(!base) return;
  const J = x => { try{ return JSON.stringify(x); }catch(e){ return String(Math.random()); } };
  const hash = s => { let h = 0; for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h + ':' + s.length; };
  const sig = () => { try{ return hash(J([typeof TD !== 'undefined' ? TD : 0, typeof REN !== 'undefined' ? REN : 0, typeof TFU !== 'undefined' ? TFU : 0,
    typeof FIXI !== 'undefined' ? FIXI : 0, typeof FIXD !== 'undefined' ? FIXD : 0, typeof TRL !== 'undefined' && TRL ? [TRL.at, (TRL.rows || []).length, (TRL.rows || []).map(r => r.status).join()] : 0,
    typeof ENQ !== 'undefined' && ENQ ? ENQ.length + '|' + ENQ.map(e => e && (e.st || '') + (e.trial || '')).join() : 0, typeof AGM !== 'undefined' && AGM ? Object.keys(AGM).length : 0,
    typeof AT !== 'undefined' && AT && AT.rows ? AT.rows.length : 0, typeof TDW !== 'undefined' ? TDW : 0])); }catch(e){ return String(Math.random()); } };
  let last = '', lastAt = 0, t = 0, userAt = 0;
  ['click', 'keydown', 'touchend'].forEach(ev => addEventListener(ev, () => { userAt = Date.now(); }, true));
  function run(args){ const v = document.getElementById('v-mtoday'), s = sig();
    if(s === last && v && v.querySelector('[id^="td-"]') && Date.now() - userAt > 1500) return;   // nothing new to show
    last = s; lastAt = Date.now(); const y = window.scrollY;
    const r = base.apply(this, args);
    try{ if(Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y); }catch(e){}
    return r; }
  window.renderMToday = function(){ const args = arguments, now = Date.now();
    if(now - userAt < 1500 || now - lastAt > 350){ clearTimeout(t); return run(args); }   // a tap, or the first redraw in a while: at once
    clearTimeout(t); t = setTimeout(() => { try{ run(args); }catch(e){ console.warn('td89', e); } }, 350); };
})();
