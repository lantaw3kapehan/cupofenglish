// 2167 (13 Nov · Misty 18:09 "6 … enhancement, not repeated"): People › Performance · each teacher row gets one more line, under the
// class record chip that already shows on-time / video / homework / notes: Wi-Fi picture check this month (LAN / Wi-Fi / can't tell,
// warnings, cases), renewals in the last 90 days (renewed / stopped) and trial → enrolled in the last 90 days.
// Data: coe_performance_live → extra (coe_tcard_extra); a month snapshot is kept every night (docs sys:tcard:YYYY-MM). Management only.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["</script>\n</body>\n</html>", `</script>
<script id="x2167">
/* 2167 · Performance: Wi-Fi check, renewals and trials on each teacher row */
(function(){
  if(window.__x2167) return; window.__x2167 = 1;
  const add = () => { try{
    if(typeof PF === 'undefined' || !PF || !PF.extra || !(typeof D !== 'undefined' && D && D.mgr)) return;
    const v = document.getElementById('v-perf'); if(!v) return;
    v.querySelectorAll('.pf-row').forEach(row => {
      if(row.querySelector('.x2167')) return;
      const m = String(row.getAttribute('onclick') || '').match(/growthSheet\\('(.+?)'\\)/); if(!m) return;
      const x = PF.extra[String(m[1]).replace(/&#39;/g, "'").toLowerCase()]; if(!x) return;
      const w = x.wifi || {}, r = x.renew || {}, t = x.trials || {}, P = [];
      const seen = (w.cable || 0) + (w.wifi || 0) + (w.unclear || 0);
      if(seen || w.locks) P.push('<span class="chip ' + (w.wifi || w.cases ? 'coral' : w.locks ? 'amber' : 'green') + '">Wi-Fi check ' + (w.wifi ? w.wifi + ' Wi-Fi' : 'all LAN') + '</span> <span class="mute">' + [w.cable ? w.cable + ' LAN' : '', w.unclear ? w.unclear + ' can\\'t tell' : '', w.locks ? w.locks + ' warning' + (w.locks > 1 ? 's' : '') : '', w.cases ? w.cases + ' case' + (w.cases > 1 ? 's' : '') : ''].filter(Boolean).join(' · ') + ' · this month</span>');
      if(r.renewed || r.stopped) P.push('<span class="mute">Renewals ' + r.renewed + ' renewed · ' + r.stopped + ' stopped (90 days)</span>');
      if(t.trials) P.push('<span class="mute">Trials ' + t.enrolled + ' of ' + t.trials + ' enrolled · ' + Math.round(t.enrolled / t.trials * 100) + '% (90 days)</span>');
      if(!P.length) return;
      const box = row.querySelector('.pf-name > div:last-child') || row.querySelector('.pf-name'); if(!box) return;
      const d = document.createElement('div'); d.className = 'small x2167'; d.style.marginTop = '3px'; d.innerHTML = P.join(' · '); box.appendChild(d);
    });
  }catch(e){} };
  const r0 = window.renderPerf; if(typeof r0 === 'function') window.renderPerf = function(){ const r = r0.apply(this, arguments); add(); return r; };
  try{ let q = 0; const v = document.getElementById('v-perf'); if(v) new MutationObserver(() => { if(q) return; q = 1; setTimeout(() => { q = 0; add(); }, 120); }).observe(v, { childList: true, subtree: true }); }catch(e){}
})();
</script>
</body>
</html>`],
]);
