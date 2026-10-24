// 783: (Misty) class video uploads must not slow down the teacher's next class (VooV needs the upload line).
// · While the teacher has a class (from 3 min before it starts until it ends, back-to-back classes joined), a class video upload
//   pauses by itself and continues automatically right after. Nothing is lost: it continues from the last piece sent.
// · The progress card says: "⏸ Paused · your 21:30 class is on · continues automatically at 22:20 · keep the app open".
// · Teachers only (management uploads are not paused).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 783 · class video upload waits while a class is on */
(function(){
  const PRE = 3 * 6e4;
  const hm = t => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  window.vidHold = function(c){ try{ if(typeof D === 'undefined' || !D || D.mgr) return null;
      const now = Date.now(), L = (D.schedule || []).filter(x => x && !x.cancelled && x.start && x.end && (!c || x.id !== c.id)).map(x => ({ a: new Date(x.start).getTime(), b: new Date(x.end).getTime(), s: x.start }))
        .filter(x => !isNaN(x.a) && !isNaN(x.b)).sort((p, q) => p.a - q.a);
      const cur = L.find(x => now >= x.a - PRE && now < x.b); if(!cur) return null;
      let until = cur.b; for(const x of L){ if(x.a > cur.a && x.a - PRE <= until && x.b > until) until = x.b; }   /* back-to-back classes */
      return { start: cur.s, until: until, soon: now < cur.a }; }catch(e){ return null; } };
  window.vidHoldMsg = (h, who, pct) => '<b>⏸ Paused · ' + (h.soon ? 'your ' + hm(h.start) + ' class starts soon' : 'your ' + hm(h.start) + ' class is on') + '</b>'
    + '<div class="small" style="opacity:.85;margin-top:4px">' + who + ' · ' + pct + '% sent · continues automatically at ' + hm(h.until) + ' · nothing is lost</div>'
    + '<div class="small" style="opacity:.7;margin-top:2px">So your class gets the full internet · keep the app open</div>';
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["      while(!fileId && off < N){\n        const end = Math.min(off + CH, N);",
   "      while(!fileId && off < N){\n        if(window.vidHold){ let h, w = 0; while((h = vidHold(c))){ w = 1; show(vidHoldMsg(h, who, Math.floor(off / N * 100)), 'wait'); await sleep(15000); } if(w){ try{ const q = await ask(); if(q.done){ fileId = q.done; break; } off = q.off; }catch(x){ if(x.exp) throw x; } prog(); } }   /* 783: wait while a class is on */\n        const end = Math.min(off + CH, N);"]
]);
