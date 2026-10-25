// 922 (D2 · Trials, Student › Refund): failed loads say so instead of spinning or saying "Error".
// Found in this audit (preview, President, 1280):
// · Trials: when the trial-report list can't be loaded, the list area kept two grey loading bars forever and every
//   status tab said "· 0" — it looked like "no trials" or "still loading". Cause: loadTrials() swallows the error and
//   renderTP() shows the loading bars whenever TRL is empty.
// · Student page › Refund (President): when the package can't be read the card showed only the word "Error" with no
//   way to retry or go back.
// Change: Trials shows "Could not load the trial reports" + Try again (the booked-trials card above still works);
// the tab counts read "…" while there is no list. Refund keeps the server's message when it has one, otherwise a plain
// sentence, plus "Try again" and "Back to the student". Nothing is saved; no rule changes.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 922 · Trials list and Refund: clear error states */
(function(){ if(window.__922) return; window.__922 = 1;
  let FAIL = 0;
  const hasTrl = () => { try{ return !!TRL; }catch(e){ return false; } };
  const l0 = window.loadTrials;
  if(typeof l0 === 'function') window.loadTrials = async function(){ let r; try{ r = await l0.apply(this, arguments); }finally{ FAIL = hasTrl() ? 0 : 1; try{ if(FAIL && typeof VIEW !== 'undefined' && VIEW === 'trials' && window.renderTP) renderTP(); }catch(e){} } return r; };
  const r0 = window.renderTP;
  if(typeof r0 === 'function') window.renderTP = function(){ const r = r0.apply(this, arguments);
    try{ if(hasTrl()) return r; const L = document.getElementById('tpList'); if(!L) return r;
      if(FAIL){ L.innerHTML = '<div role="alert" style="padding:14px 4px"><b style="font-size:var(--fs-h2,15px)">Could not load the trial reports.</b><div class="ui-sub" style="margin:4px 0 12px">Check the internet connection and try again. Booked trial classes above come from Schedule and are still shown.</div><button type="button" class="btn teal sm" onclick="trl922Retry()">Try again</button></div>'; }
      const T = document.getElementById('tpTabs'); if(T) T.querySelectorAll('button').forEach(b => { b.textContent = b.textContent.replace(/ · 0$/, ' · …'); b.title = FAIL ? 'Not loaded' : 'Loading'; }); }catch(e){}
    return r; };
  window.trl922Retry = function(){ FAIL = 0; try{ const L = document.getElementById('tpList'); if(L) L.innerHTML = '<div class="sk"></div><div class="sk"></div>'; }catch(e){} return window.loadTrials(); };

  const f0 = window.rfOpen;
  if(typeof f0 === 'function') window.rfOpen = async function(code){ const c = String(code || (typeof STU !== 'undefined' && STU && STU.code) || '').toUpperCase(); const r = await f0.apply(this, arguments);
    try{ const w = document.querySelector('#sheetBody .rf > .warn'); if(w && !document.querySelector('#sheetBody .rf button:not(.sbk)')){ const t = (w.textContent || '').trim();
        if(!t || /^(error|failed|undefined|null)$/i.test(t)) w.textContent = 'Could not read this student’s package for a refund. Check the internet connection and try again. Nothing was changed.';
        w.setAttribute('role', 'alert');
        w.insertAdjacentHTML('afterend', '<div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn teal sm" onclick="rfOpen(\'' + c.replace(/[^A-Z0-9-]/g, '') + '\')">Try again</button><button type="button" class="btn ghost sm" onclick="openStudent(\'' + c.replace(/[^A-Z0-9-]/g, '') + '\')">Back to the student</button></div>'); } }catch(e){}
    return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
