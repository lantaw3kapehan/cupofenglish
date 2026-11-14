// 2216 (14 Nov · Misty: ok): Active › Renewal early warning (and the Overview line) treat a student on a parent-asked break (2214)
// like Paused: listed under "Paused or not renewing" as "On a break until …", not as a warning. The break list comes from the same
// To do check (coe-ops check, kind riskp), kept on the device (coe.pz2214) and refreshed every 10 minutes for management.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<script id="x2216">
(function(){
  if(window.__x2216) return; window.__x2216 = 1;
  try{ window.PZ2214 = JSON.parse(localStorage.getItem('coe.pz2214') || '{}') || {}; }catch(e){ window.PZ2214 = {}; }
  const keep = m => { window.PZ2214 = m; try{ localStorage.setItem('coe.pz2214', JSON.stringify(m)); }catch(e){} };
  const from = L => { const m = {}; (L || []).forEach(x => { if(x && x.kind === 'riskp' && x.code && x.until) m[String(x.code).toUpperCase()] = String(x.until).slice(0, 10); }); return m; };
  let at = 0;
  function load(){ if(typeof D === 'undefined' || !D || !D.mgr || typeof TOKEN === 'undefined' || !TOKEN || Date.now() - at < 10 * 6e4) return; at = Date.now();
    fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-ops', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'check' }) })
      .then(r => r.json()).then(r => { if(r && r.ok) keep(from(r.items)); }).catch(() => { at = 0; }); }
  setTimeout(load, 4000); setInterval(load, 60e3);
  /* To do already has the list: use it whenever it loads */
  let last = null; setInterval(() => { try{ const F = window.FX2214; if(F && F.items && F.items !== last){ last = F.items; keep(from(F.items)); } }catch(e){} }, 3000);
  window.pz2216Set = function(code, until){ const m = Object.assign({}, window.PZ2214); m[String(code).toUpperCase()] = until; keep(m); };
})();
</script>
`;
lib(file, [
 ["      if(/^(Paused|Not renewing)/.test(rn)){ out.push(",
  "      { const pz = (window.PZ2214 || {})[code]; if(pz && pz >= t){ const pd = new Date(pz + 'T12:00:00'); out.push({ code, name: r[C.name], cn: r[C.cn], teacher: r[C.teacher], left, sc: -1, why: ['On a break until ' + (isNaN(pd) ? pz : pd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })) + ' (the parent asked)'], rn }); return; } }   /* 2216 */\n      if(/^(Paused|Not renewing)/.test(rn)){ out.push("],
 ["try{ toast('✓ On a break until ' + DL(v)", "try{ window.pz2216Set && pz2216Set(x.code, v); }catch(e){} try{ toast('✓ On a break until ' + DL(v)"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
