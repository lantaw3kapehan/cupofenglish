// 704: (Misty) A teal "Trainer" pill in the header beside the ★ for teachers who train other teachers (tap → Trainings).
require('../tools/lib.js')(process.argv[2], [
["const t = '★ ' + n; if(b.textContent !== t){ b.textContent = t; b.title = 'Qualified to teach ' + n + ' · open Trainings'; } }",
 `const t = '★ ' + n; if(b.textContent !== t){ b.textContent = t; b.title = 'Qualified to teach ' + n + ' · open Trainings'; } }
  function txTrn(){ const r = $('hRank'); if(!r) return; let b = $('txTrn'); const L = txT() && MY ? TRN(MY, MY.me) : [];
    if(!L.length){ if(b) b.remove(); return; }
    if(!b){ r.insertAdjacentHTML('beforeend', '<button id="txTrn" type="button" onclick="event.stopPropagation();go(\\'train\\')">Trainer</button>'); b = $('txTrn'); }
    const ti = 'Teacher trainer · ' + L.join(', '); if(b.title !== ti) b.title = ti; }`],
["  function txUp(){ try{ txStar(); }catch(x){}", "  function txUp(){ try{ txStar(); }catch(x){} try{ txTrn(); }catch(x){}"],
["'#txStar{border:1.5px solid #D67FA3;", "'#txTrn{border:1.5px solid #00A3AD;background:#EEF8F7;color:#00626A;font:inherit;font-weight:700;font-size:12px;border-radius:99px;padding:1px 8px;margin-left:6px;cursor:pointer;vertical-align:1px}#txStar{border:1.5px solid #D67FA3;"],
]);
