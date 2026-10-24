// 762: (Misty) migrate step 4 · Google-only reports (Overview health, night checks, peer reviews, parent reports, trials, pay checks, links…)
// were re-asked in the background every 1–5 minutes on every open tab (≈8,000 Google calls a day from two management accounts, 10–60 s each),
// which is what made Google slow for real saves. A background refresh now reuses this tab's last answer for a while (below);
// opening a screen or tapping still asks fresh, and so does Refresh.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + `<script>
/* 762 · calmer background refreshes of Google-only reports */
(function(){
  const M = 6e4, GAP = { mgmtUrls: 360 * M, mgmtHealth: 15 * M, mgmtNight: 60 * M, mgmtPeer: 30 * M, mgmtReports: 15 * M, mgmtReportsWait: 15 * M, mgmtTrials: 15 * M, mgmtTrialFus: 15 * M,
    mgmtPayChecks: 15 * M, mgmtPayReady: 15 * M, mgmtMyPay: 30 * M, mgmtTab: 15 * M, mgmtPerformance: 30 * M, mgmtTeacherCard: 30 * M, mgmtHours: 30 * M, mgmtWeekSum: 60 * M, mgmtFixIgnored: 30 * M,
    schedLists: 15 * M, mgmtVidFlags: 10 * M, mgmtRenewals: 15 * M, mgmtGrowth: 30 * M, mgmtTeacherVisits: 30 * M,
    tPayCheck: 20 * M, tPayReady: 20 * M, tGrowth: 30 * M, tVidList: 20 * M, tVidFlags: 20 * M, tFbStatus: 15 * M };
  const C = {}; let FORCE = 0;
  const base = window.api; if(!base || base.__762) return;
  const w = function(fn){ const args = Array.prototype.slice.call(arguments, 1), self = this;
    const g = GAP[fn]; if(!g) return base.apply(this, arguments);
    let k = ''; try{ k = fn + '|' + JSON.stringify(args.slice(1)); }catch(e){ return base.apply(this, arguments); }
    const ui = Date.now() - (window._ui || 0) < 1500 || Date.now() - FORCE < 5000, c = C[k];
    if(!ui && c && Date.now() - c.t < g){ try{ return Promise.resolve(JSON.parse(c.j)); }catch(e){} }
    if(!ui && c && c.p) return c.p;   /* one at a time */
    const p = Promise.resolve(base.apply(self, [fn].concat(args)));
    C[k] = Object.assign(c || { t: 0 }, { p });
    p.then(r => { try{ if(r && r.ok !== false) C[k] = { t: Date.now(), j: JSON.stringify(r) }; else C[k].p = null; }catch(e){ C[k] = { t: 0 }; } }, () => { if(C[k]) C[k].p = null; });
    return p; };
  w.__762 = 1; window.api = w;
  /* the ↻ Refresh button asks everything fresh */
  document.addEventListener('click', ev => { try{ const b = ev.target && ev.target.closest && ev.target.closest('#rf'); if(b) FORCE = Date.now(); }catch(e){} }, true);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
