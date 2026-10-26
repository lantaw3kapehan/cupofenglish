// 1110: (Misty 14:05) Pay on wide laptops (≥ 1200 px): two columns so pay is visible at a glance without long scrolling.
// · Left — this month and anything to act on: last month's pay to check ("This is correct" / "Something's wrong"),
//   October estimate (units, bonus, deductions, Regular · Trial · Sub), what is left before October pay is released,
//   Punctuality (late time-ins).
// · Right — the record: total earned, pay history (payslips), bonuses & deductions.
// · Under 1200 px (smaller laptops, split screen, phones) the page stays one column exactly as before.
// Display only: the same cards with the same buttons are moved, nothing is recalculated or sent.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const css = `
@media(min-width:1200px){
 #v-pay .p1110{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px;align-items:start}
 #v-pay .p1110>div>*:first-child{margin-top:0!important}
 #v-pay .p1110 .p1110r>h2{margin-top:18px}
 #v-pay .p1110 .p1110r>h2:first-of-type{margin-top:14px}
 #v-pay .p1110 .p1110r table{width:100%}
}`;
const i = s.lastIndexOf('</style>');
s = s.slice(0, i) + '/* d1110 */' + css + '\n' + s.slice(i);
const js = String.raw`
(function(){
  if(window.__1110) return; window.__1110 = 1;
  var MQ = window.matchMedia ? matchMedia('(min-width:1200px)') : null, busy = false;
  function wide(){ return !!(MQ && MQ.matches); }
  function isEst(e){ return e.classList && e.classList.contains('card') && /^\s*Estimated /.test(e.textContent || ''); }
  function unwrap(v){ var w = v.querySelector(':scope>.p1110'); if(!w) return; var f = document.createDocumentFragment();
    [].slice.call(w.querySelectorAll(':scope>div>*')).forEach(function(x){ f.appendChild(x); }); v.replaceChild(f, w); }
  function arrange(){ if(busy) return; var v = document.getElementById('v-pay'); if(!v || (typeof D !== 'undefined' && D && D.mgr)) return;
    busy = true; try{
      if(!wide()){ unwrap(v); return; }
      var w = v.querySelector(':scope>.p1110'), kids = [].slice.call(v.children).filter(function(x){ return x !== w; });
      var loose = kids.filter(function(x){ return !x.classList.contains('lead'); });
      if(w && !loose.length) return;                                    // already arranged, nothing new
      if(w) unwrap(v);
      var all = [].slice.call(v.children).filter(function(x){ return !x.classList.contains('lead'); });
      if(!all.length) return;
      var L = [], R = [], right = false;
      all.forEach(function(x){ if(x.tagName === 'H2') right = true; if(right || x.classList.contains('at516')) R.push(x); else L.push(x); });
      if(!R.length || !L.length) return;
      var chk = L.filter(function(x){ return x.id === 'pckCard'; }), est = L.filter(isEst), rest = L.filter(function(x){ return chk.indexOf(x) < 0 && est.indexOf(x) < 0; });
      L = chk.concat(est, rest);
      w = document.createElement('div'); w.className = 'p1110';
      var l = document.createElement('div'), r = document.createElement('div'); l.className = 'p1110l'; r.className = 'p1110r';
      L.forEach(function(x){ l.appendChild(x); }); R.forEach(function(x){ r.appendChild(x); });
      w.appendChild(l); w.appendChild(r); v.appendChild(w);
    }catch(e){} finally{ busy = false; } }
  window.pay1110 = arrange;
  function hook(){ var v = document.getElementById('v-pay'); if(!v || v.__o1110) return; v.__o1110 = 1;
    new MutationObserver(function(){ if(!busy) setTimeout(arrange, 0); }).observe(v, { childList: true }); arrange(); }
  if(MQ){ var f = function(){ arrange(); }; MQ.addEventListener ? MQ.addEventListener('change', f) : MQ.addListener(f); }
  var t = 0, iv = setInterval(function(){ hook(); if(++t > 40) clearInterval(iv); }, 500); hook();
})();
`;
const j = s.lastIndexOf('</body>');
s = s.slice(0, j) + '<script>' + js + '</script>\n' + s.slice(j);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
