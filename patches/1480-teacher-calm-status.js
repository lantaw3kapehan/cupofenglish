// 1480 · Teacher QA (28 Oct 2026): calm during a class, one status per record
// 1. The "Addendum needs your signature" sheet no longer opens by itself while a class is running; it waits until the class ends
//    (it opened at ~6 s even during a live lesson: its first openSheet is an empty shell, which the 1107 hold lets through).
// 2. A class whose video the folder check already found (My class videos ✓, coe_vid_mine with the file link) also shows
//    "Class video uploaded" on its class card, so "After class · Video not done yet" and Completed today agree with My class videos.
// 3. Schedule: today's finished classes (listed after the upcoming ones) carry an "Ended" chip (the same word as the class status in 1500).
// 4. Punctuality: the Today line / Needs your action row says "Late to class" for a late "I'm in" (it said "Late time-in" for both),
//    and the row chip says "Late". Display only; no record, rule or amount changes.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["try{ if(!sessionStorage.getItem('coe.ct.pop') && !q && !$('sheet').classList.contains('on')){ sessionStorage.setItem('coe.ct.pop', '1'); setTimeout(() => { if(!$('sheet').classList.contains('on')) ctRead(x.d.id); }, 1200); } }catch(y){}",
   "try{ if(!sessionStorage.getItem('coe.ct.pop') && !q && !$('sheet').classList.contains('on')){ sessionStorage.setItem('coe.ct.pop', '1'); const pop1480 = () => { if((window.calmLesson && calmLesson()) || $('sheet').classList.contains('on')){ setTimeout(pop1480, 30000); return; } ctRead(x.d.id); }; setTimeout(pop1480, 1200); } }catch(y){}"],
  ["${on ? '<span class=\"lv\"><i></i>Live</span>' : ''}",
   "${on ? '<span class=\"lv\"><i></i>Live</span>' : ''}${!e.cancelled && !on && now >= z && window.x1480today && x1480today(e) ? '<span class=\"chip\">Ended</span>' : ''}"],
  ["if(!full) return pend.length ? '<div id=\"txLate\" class=\"lt-bn\"><b>Late time-in pending review</b>",
   "if(!full) return pend.length ? '<div id=\"txLate\" class=\"lt-bn\"><b>' + (pend.every(r => r.kind === 'Late') ? 'Late time-in' : pend.every(r => r.kind !== 'Late') ? 'Late to class' : 'Late time-in / late to class') + ' pending review</b>"],
  ["add({ sev: 1, kind: 'Time-in', red: true,", "add({ sev: 1, kind: 'Late', red: true,"]
]);
let s = fs.readFileSync(file, 'utf8');
const early = (code) => { const A = 'const msgAt = s => {'; if (s.split(A).length !== 2) { console.error('msgAt anchor not found once'); process.exit(1); } s = s.replace(A, () => code + '\n' + A); };
early(String.raw`window.x1480today = function(e){ try{ return String(e.day || '') === String(D.today || '') || ymdLocal(new Date(e.start)) === ymdLocal(new Date()); }catch(x){ return false; } };`);
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1480 · Teacher QA: found-in-folder videos count on the class card; finished-today helper for Schedule */
(function(){
  if(window.__1480) return; window.__1480 = 1;
  var hm = function(s){ try{ return new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  function merge(){ var n = 0; try{
      if(typeof D === 'undefined' || !D || D.mgr || !Array.isArray(D.schedule)) return 0;
      var L = JSON.parse(localStorage.getItem('coe.vid.mine') || 'null'); if(!Array.isArray(L) || !L.length) return 0; D.vids = D.vids || {};
      D.schedule.forEach(function(c){ if(!c || !c.id || c.cancelled || !c.code || c.day !== D.today || (D.vids[c.id] && D.vids[c.id].url)) return;
        var t = Date.parse(c.start), x = L.find(function(v){ return v && v.found && v.url && String(v.code || '').toUpperCase() === String(c.code).toUpperCase() && Date.parse(v.start) === t; });
        if(x){ D.vids[c.id] = { url: x.url, at: hm(x.uploaded || x.foundAt), found: 1 }; n++; } });
    }catch(e){} return n; }
  window.vid1480 = merge;
  var _rt = window.renderToday; if(typeof _rt === 'function') window.renderToday = function(){ try{ merge(); }catch(e){} return _rt.apply(this, arguments); };
  var last = '';
  setInterval(function(){ try{ var k = localStorage.getItem('coe.vid.mine') || ''; if(k === last) return; last = k;
    if(merge() && typeof VIEW !== 'undefined' && VIEW === 'today' && !document.hidden){ var sh = document.getElementById('sheet'); if(!(sh && sh.classList.contains('on'))) renderToday(); } }catch(e){} }, 15000);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
