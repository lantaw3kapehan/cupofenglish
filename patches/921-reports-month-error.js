// 921 (D2 · Parent reports): a month that fails to load no longer strands the page.
// Found in this audit (preview, President, 1280): Parent reports › tap "October 2026" when that month can't be loaded →
// the whole page became one grey line "Could not load parent reports." — no title, no month buttons, no way to try
// again or go back to November except leaving the page. Cause: rpMonth() clears RP before loading; loadReports()'s
// error branch then writes only that line.
// Change: in that case the page keeps its title and shows a clear error card with "Try again" and
// "Back to <the month you were on>" (restores what was already loaded). Nothing is saved; counts unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 921 · Parent reports: failed month load keeps the page usable */
(function(){ if(window.__921) return; window.__921 = 1;
  let PREV = null;
  const ml = m => { const k = String(m || '').match(/^(\d{4})-(\d{2})/); return k ? new Date(+k[1], +k[2] - 1, 15).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'this month'; };
  const m0 = window.rpMonth;
  if(typeof m0 === 'function') window.rpMonth = function(m){ try{ if(RP) PREV = RP; }catch(e){} return m0.apply(this, arguments); };
  function paint(){ const el = document.getElementById('v-reports'); if(!el) return; try{ if(RP) return; }catch(e){ return; }
    const e = [...el.querySelectorAll('.empty')].find(x => /Could not load parent reports/.test(x.textContent)); if(!e) return;
    let want = ''; try{ want = RP_M; }catch(x){}
    const back = PREV && PREV.month && PREV.month !== want ? '<button type="button" class="btn ghost sm" onclick="rp921Back()">Back to ' + esc(ml(PREV.month)) + '</button>' : '';
    const box = document.createElement('div'); box.id = 'rp921';
    box.innerHTML = '<div class="lead"><h1>Parent reports</h1><div class="mute small">' + esc(want ? ml(want) : 'Monthly feedback') + '</div></div>' +
      '<div class="ui-card" role="alert" style="margin-top:12px"><b style="font-size:var(--fs-h2,15px)">Could not load the parent reports' + (want ? ' for ' + esc(ml(want)) : '') + '.</b>' +
      '<div class="ui-sub" style="margin:4px 0 12px">Check the internet connection and try again. Nothing was changed.</div>' +
      '<div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn teal sm" onclick="rp921Retry()">Try again</button>' + back + '</div></div>';
    e.replaceWith(box); }
  window.rp921Retry = function(){ try{ const el = document.getElementById('v-reports'); if(el && el.querySelector('#rp921')) el.querySelector('#rp921').innerHTML = (typeof loading === 'function' ? loading('Parent reports') : 'Loading…'); }catch(e){} return window.loadReports(); };
  window.rp921Back = function(){ if(!PREV) return; RP = PREV; RP_M = PREV.month; PREV = null; renderReports(); };
  const l0 = window.loadReports;
  if(typeof l0 === 'function') window.loadReports = async function(){ const r = await l0.apply(this, arguments); try{ paint(); }catch(e){} return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
