/* 19 Oct · 300 · Progress checks already sent clear from the warnings on every phone and laptop (Misty saw Julia's 3 "not sent yet" though sent on 15 Oct).
   Before, only the device the check was sent from remembered it. Now the database's PR-DATA (coe_pc_done: student code → when it was sent) is read too;
   a request is cleared when a check for that student was sent on or after the day it was asked. */
(function(){
  let at = 0, busy = false;
  const ymd = s => { const m = String(s || '').match(/(\d{4}-\d{2}-\d{2})/); return m ? m[1] : ''; };
  function load(){ if(busy || !TOKEN || !(typeof D !== 'undefined' && D && !D.mgr) || Date.now() - at < 5 * 6e4) return; busy = true;
    fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: 'tPcDone', args: [], token: TOKEN }) })
      .then(x => x.json()).then(r => { if(!(r && r.ok && r.data)) return; at = Date.now(); const S = r.data; let ch = 0; window.PCDONE = window.PCDONE || {};
        const T = (typeof TMSG !== 'undefined' && TMSG && TMSG.threads) || [];
        T.forEach(t => { const m = String((t && t.root && t.root.text) || '').match(/progress check\s*\((ST-\d{4}-\d{3})\)/i); if(!m) return; const code = m[1].toUpperCase();
          if(PCDONE[code] || !S[code]) return; const asked = ymd(t.root.at); if(!asked || ymd(S[code]) >= asked){ PCDONE[code] = 1; ch = 1; } });
        if(ch){ try{ store('set', 'coe.pcdone', JSON.stringify(PCDONE)); }catch(e){} try{ if(typeof render === 'function') render(); }catch(e){} } })
      .catch(() => {}).finally(() => { busy = false; }); }
  const _r = window.render; if(_r) window.render = function(){ const x = _r.apply(this, arguments); try{ setTimeout(load, 800); }catch(e){} return x; };
  setTimeout(load, 2500);
})();
