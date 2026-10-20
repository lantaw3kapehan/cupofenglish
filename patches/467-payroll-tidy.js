// 20 Oct · Payroll tidy: on-pace rows stick (they were overwritten by the older row painter), history months start closed, shorter insight labels.
const A = String.raw;
require('../tools/lib.js')(process.argv[2], [
  [A`</u></span>on pace ' + peso(pace) + ' <b class="' + (up ? 'up' : 'dn') + '">' + (up ? '▲' : '▼') + '</b> ' + m[1] + ' ' + peso(last); });`,
   A`</u></span><span title="so far ÷ days gone × days in the month · ' + m[1] + ' ' + peso(last) + '">pace ' + peso(pace) + ' <span class="' + (up ? 'up' : 'dn') + '">' + (up ? '▲' : '▼') + ' vs ' + m[1] + '</span></span>'; });`],
  [A`#pyCur .r65 b.up{color:#1E8A5E}#pyCur .r65 b.dn{color:#C0563F}`, A`#pyCur .r65 .up{color:#1E8A5E;font-weight:700}#pyCur .r65 .dn{color:#C0563F;font-weight:700}#pyCur .r65>span{display:inline!important}#pyCur .r65 .tb{display:inline-block!important}`],
  [A`sm.className = 'r65';`, A`sm.className = 'c60 r65';`],
  [A`'<div style="--c:#00A3AD"><em>Where the money goes · ' + mo + '</em>`, A`'<div style="--c:#00A3AD"><em>Where pay goes · ' + mo.split(' ')[0] + '</em>`],
  [A`'<div style="--c:#C2557A"><em>Biggest change vs month before</em>'`, A`'<div style="--c:#C2557A"><em>Biggest change · vs month before</em>'`],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 467 · history months start closed (the first one opened by itself and pushed everything down); open one by clicking it. */
(function(){
  function run(){ const q = ((document.getElementById('prq') || {}).value || '').trim(); if(q) return; document.querySelectorAll('#plList > details.py-h[open]').forEach(d => { if(!d.dataset.u67) d.open = false; }); }
  document.addEventListener('click', e => { const s = e.target.closest && e.target.closest('#plList > details.py-h > summary'); if(s) s.parentElement.dataset.u67 = 1; }, true);
  const _l = window.payLedger; if(_l) window.payLedger = function(){ const r = _l.apply(this, arguments); try{ run(); }catch(e){} return r; };
  const _p = window.pay63; if(_p) window.pay63 = function(k){ document.querySelectorAll('#plList > details.py-h').forEach(d => d.dataset.u67 = 1); return _p.apply(this, arguments); };
  try{ run(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
