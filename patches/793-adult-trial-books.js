// 793: (Misty) adult trial report: "Suggested materials" showed children's books (OD3, REF, Wonders, RAZ) for an adult.
// For an adult learner it now shows the adult books for the chosen goal and the level, the same as the Course plan:
// daily speaking → DK English / Pathways · work → Business Partner · business → Business Partner / Market Leader.
const file = process.argv[2];
const fs = require('fs');
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 793 · adult books on the trial report level card */
(function(){
  const f0 = window.cefrBox; if(typeof f0 !== 'function' || f0.__793) return;
  const goalOf = g => /business/i.test(g) ? 'business' : /work/i.test(g) ? 'work' : 'daily';
  const w = function(t, all, n){ let h = f0.apply(this, arguments);
    try{ const g = (typeof TRS !== 'undefined' && TRS && TRS.group) || ''; if(all && /^Adult/.test(g) && window.adBooksFor){ const lv = cefrOf(t)[1], L = adBooksFor(goalOf(g), lv);
        if(L && L.length) h = h.replace(/(<b>Suggested materials:<\/b> )[^<]*/, '$1' + L.join(', ') + ' <span class="mute">· adult · ' + (goalOf(g) === 'daily' ? 'daily speaking' : goalOf(g) === 'work' ? 'English for work' : 'Business English') + '</span>'); } }catch(e){}
    return h; };
  w.__793 = 1; window.cefrBox = w;
  const g0 = window.trGrp; if(typeof g0 === 'function') window.trGrp = function(v){ const r = g0.apply(this, arguments); try{ const T = trTot(); if($('trRb')) $('trRb').innerHTML = cefrBox(T.t, T.all, TRS.picks.filter(x => x > -1).length); }catch(e){} return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["window.cpBand = function(b){ CP.band = b; cpSheet(); };",
   "window.cpBand = function(b){ CP.band = b; cpSheet(); };\nwindow.adBooksFor = (goal, cefr) => { const G = AG[goal] || AG.daily, st = G && G.p[bandOf(cefr)]; return (st || []).map(k => { const e = AB[k] ? String(AB[k][1]) : k, m = e.match(/^(.*?) · (?:Level )?(\\S[^·,]{0,18})$/); return m ? m[1] + ' ' + m[2] : e.split(' · ')[0]; }); };   /* 793 */"]
]);
