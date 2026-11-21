// 2644 (Misty 21 Nov 18:45): "when 1 taps it, it's still there so you don't really know · same when Celine taps but on my end
//   it's still showing · this is not only for this, but other screens".
//   Celine waived Virgo at 18:30; Misty's screen kept its copy until its 5-minute reread.
//   1. Every 15 s (screen open, management only) the lates list is read again from the database and only the lates card changes:
//      a late decided by anyone leaves every screen within about 15 s; new lates arrive the same way. No page redraw.
//   2. The live feed (leave, cases, schedule, trials, peer reviews, money) is read every 20 s instead of 45 s,
//      and a late decided elsewhere refreshes the Overview numbers within 20 s instead of 2 minutes.
const file = process.argv[2];
const SYNC = `<script id="b2644">
(function(){ if(window.__2644) return; window.__2644 = 1;
  let busy = 0;
  async function sync(){ try{
    if(busy || document.hidden || typeof D === 'undefined' || !D || !D.mgr || typeof TOKEN === 'undefined' || !TOKEN || typeof MO === 'undefined' || !MO) return; busy = 1;
    const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'overview', token: TOKEN }) }).then(x => x.json());
    if(!(r && r.ok && r.data && Array.isArray(r.data.late))) return;
    let L = r.data.late; try{ if(window.dec2538) L = L.filter(x => !dec2538.has(dec2538.late(x.row))); }catch(e){}
    const sig = a => JSON.stringify((a || []).map(x => x.row).sort());
    if(sig(L) === sig(MO.late)) return;
    MO.late = L; try{ store('set', 'coe.mo', JSON.stringify(MO)); }catch(e){}
    try{ hmBadge(); }catch(e){}   /* the lates card itself repaints on its own 5 s check (it compares rows, so nothing else moves) */
  }catch(e){} finally{ busy = 0; } }
  setInterval(sync, 15000); document.addEventListener('visibilitychange', () => { if(!document.hidden) setTimeout(sync, 800); });
})();
</script>
</body>`;
require('../tools/lib.js')(file, [
  ["setInterval(pulse, 45000);", "setInterval(pulse, 20000);   /* 2644 */"],
  ["Date.now() - PULSE_AT < 30000", "Date.now() - PULSE_AT < 15000"],
  ["k.has('Late review')||k.has('Payroll')) && Date.now() - PULSE_RL > 120000", "k.has('Late review')||k.has('Payroll')) && Date.now() - PULSE_RL > (k.has('Late review') ? 20000 : 120000)"],
]);
const fs = require('fs'); let h = fs.readFileSync(file, 'utf8'); if(h.includes('id="b2644"')) throw new Error('b2644 already there');
const i = h.lastIndexOf('</body>'); if(i < 0) throw new Error('no </body>'); h = h.slice(0, i) + SYNC + h.slice(i + 7); fs.writeFileSync(file, h);
