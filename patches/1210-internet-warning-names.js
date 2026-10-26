// 1210: (Misty, 26 Oct 21:00) Internet warnings said "Weak internet · 35 Mbps" even when the speed was fine and the real problem was
//      jitter or latency. The chip now names the actual concern (e.g. "Unstable connection · high jitter 45 ms", "High latency · 250 ms",
//      "Slow download · 8 Mbps"), the worst first and "+N more". Tapping it opens the details: download, upload, latency, jitter (or
//      "not measured"), when it was measured, and which check it was — the latest check on this device vs the measurement saved with a
//      time-in (historical). Thresholds are unchanged: amber when download < 25 Mbps, ping > 100 ms or jitter > 15 ms; red when
//      download < 10 Mbps, ping > 200 ms or jitter > 30 ms (upload has no threshold, shown for information only). The teacher-profile
//      "unstable network" chip (ping > 300 ms or jitter > 100 ms, unchanged) now says which one. Nothing stored changes.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { const n = s.split(a).length - 1; if(n !== 1){ console.error('1210 expected 1 match, found ' + n + ': ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, () => b); };
rep("const tiNet = x => netBadge(x.speed),", "const tiNet = x => netBadge(x.speed, { at: x.timeIn || x.time || '', date: x.date || '', kind: x.type === 'Class' ? 'class' : 'timein', who: x.name || x.teacher || '' }),");
rep("${ti.speed ? `<div style=\"margin-top:6px\">${netBadge(ti.speed)}</div>` : ''}", "${ti.speed ? `<div style=\"margin-top:6px\">${netBadge(ti.speed, { at: ti.time, kind: 'timein', mine: 1 })}</div>` : ''}");
rep("(bad(t) ? '<span class=\"un\">unstable network</span>' : '<span></span>')", "(bad(t) ? '<span class=\"un\">' + (window.unW1210 ? unW1210(t) : 'unstable network') + '</span>' : '<span></span>')");
rep("(bad(t) ? ' · unstable network' : '')", "(bad(t) ? ' · ' + (window.unW1210 ? unW1210(t) : 'unstable network') : '')");
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1210 · internet warnings name the real concern */
(function(){
  if(window.__1210) return; window.__1210 = 1;
  var num = function(re, s){ var m = s.match(re); return m ? parseFloat(m[1]) : NaN; };
  function parse(s){ s = String(s || ''); var est = /browser estimate|^~/.test(s.trim());
    return { s: s, est: est, dn: num(/↓\s*([\d.]+)/, s), up: num(/↑\s*([\d.]+)/, s), ms: num(/([\d.]+)\s*ms(?:\s*·\s*jitter|\s*$|\s*·)/, s.replace(/jitter\s*[\d.]+\s*ms/, '')), jt: num(/jitter\s*([\d.]+)/, s), dnE: est ? num(/~\s*([\d.]+)/, s) : NaN }; }
  /* thresholds exactly as before (netQ): red = dn < 10 || ms > 200 || jt > 30 · amber = dn < 25 || ms > 100 || jt > 15 */
  function issues(p){ var dn = isNaN(p.dn) ? p.dnE : p.dn, L = [], r = Math.round, e = p.est ? ' (browser estimate)' : '';
    if(!isNaN(dn) && dn < 25) L.push({ red: dn < 10, w: (dn < 10 ? 10 : 25) / Math.max(dn, .1), t: (dn < 10 ? 'Slow download · ' : 'Download under 25 Mbps · ') + (dn < 10 ? dn.toFixed(1) : r(dn)) + ' Mbps' + e });
    if(!isNaN(p.ms) && p.ms > 100) L.push({ red: p.ms > 200, w: p.ms / (p.ms > 200 ? 200 : 100), t: (p.ms > 200 ? 'High latency · ' : 'Slow response · ping ') + r(p.ms) + ' ms' });
    if(!isNaN(p.jt) && p.jt > 15) L.push({ red: p.jt > 30, w: p.jt / (p.jt > 30 ? 30 : 15), t: (p.jt > 30 ? 'Unstable connection · high jitter ' : 'Slightly unstable · jitter ') + r(p.jt) + ' ms' });
    L.sort(function(a, b){ return (b.red - a.red) || (b.w - a.w); }); return L; }
  window.netQ = function(s){ var p = parse(s), dn = isNaN(p.dn) ? p.dnE : p.dn; if(isNaN(dn) && isNaN(p.ms)) return { lvl: '', label: '' };
    var L = issues(p), lvl = L.length ? (L[0].red ? 'weak' : 'ok') : 'good';
    return { lvl: lvl, label: L.length ? L[0].t + (L.length > 1 ? ' · +' + (L.length - 1) + ' more' : '') : 'Good internet', s: p.s, issues: L, p: p }; };
  var NB = window.__nb1210 = [];
  window.netBadge = function(s, ctx){ var q = netQ(s); if(!q.lvl) return ''; var i = NB.push({ s: String(s || ''), ctx: ctx || {} }) - 1; if(NB.length > 600) NB.splice(0, 300);
    var tip = q.issues.length ? q.issues.map(function(x){ return x.t; }).join(' · ') : 'Download, ping and jitter all within the good range';
    return '<span class="ti-q ' + q.lvl + '" role="button" tabindex="0" title="' + esc(tip + ' · tap for details') + '" style="cursor:pointer" data-nb="' + esc(String(s || '')) + '" data-nbc="' + esc(JSON.stringify(ctx || {})) + '" onclick="event.stopPropagation();netDetail1210(this)" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();netDetail1210(this)}">' + esc(q.label) + '</span>'; };
  window.unW1210 = function(t){ var p = parse(t && t.speed), a = [];   /* teacher profile chip: ping > 300 ms or jitter > 100 ms (unchanged) */
    if(p.ms > 300) a.push('high latency ' + Math.round(p.ms) + ' ms'); if(p.jt > 100) a.push('high jitter ' + Math.round(p.jt) + ' ms');
    return a.length ? 'unstable · ' + a.join(' + ') : 'unstable network'; };
  try{ var _nc = window.netCheck; if(typeof _nc === 'function' && !_nc.__1210){ window.netCheck = function(full){ var r = _nc.apply(this, arguments);
      try{ Promise.resolve(r).then(function(o){ if(o && o.speed && full !== false) try{ localStorage.setItem('coe.netLast', JSON.stringify({ s: o.speed, at: Date.now(), kind: full === 'lite' ? 'class' : 'timein' })); }catch(e){} }); }catch(e){}
      return r; }; window.netCheck.__1210 = 1; } }catch(e){}
  function rows(p){ var f = function(v, u, d){ return isNaN(v) ? '<span class="mute">not measured</span>' : '<em class="nd-v"><b class="num">' + v.toFixed(d) + '</b> ' + u + '</em>'; };
    var dn = isNaN(p.dn) ? p.dnE : p.dn;
    return '<div class="nd-g">' +
      '<div><span>Download</span>' + f(dn, 'Mbps' + (p.est ? ' (estimate)' : ''), 1) + '<small>good 25+ · weak under 10</small></div>' +
      '<div><span>Upload</span>' + f(p.up, 'Mbps', 1) + '<small>information only</small></div>' +
      '<div><span>Latency (ping)</span>' + f(p.ms, 'ms', 0) + '<small>good under 100 · weak over 200</small></div>' +
      '<div><span>Jitter (steadiness)</span>' + f(p.jt, 'ms', 1) + '<small>good under 15 · weak over 30</small></div></div>'; }
  function block(title, when, s){ var q = netQ(s), p = parse(s);
    return '<div class="nd-b"><div class="nd-h"><b>' + title + '</b>' + (q.lvl ? '<span class="ti-q ' + q.lvl + '">' + esc(q.label) + '</span>' : '') + '</div>' +
      '<div class="mute small">' + esc(when) + '</div>' + rows(p) +
      (q.issues && q.issues.length ? '<div class="small" style="margin-top:6px"><b>Concern:</b> ' + q.issues.map(function(x){ return esc(x.t) + (x.red ? ' (weak)' : ' (fair)'); }).join(' · ') + '</div>' : '<div class="small" style="margin-top:6px">No concern · all within the good range.</div>') + '</div>'; }
  var hm = function(ms){ try{ return new Date(ms).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  window.netDetail1210 = function(el){ var s = el.getAttribute('data-nb') || '', c = {}; try{ c = JSON.parse(el.getAttribute('data-nbc') || '{}'); }catch(e){}
    var kind = c.kind === 'class' ? '“I’m in” for a class' : 'time-in', when = 'Saved with the ' + kind + (c.date ? ' on ' + String(c.date).slice(0, 10) : ' today') + (c.at ? ' at ' + c.at : '') + ' · historical, not live';
    var h = '<h1>Internet check</h1><div class="mute small">' + (c.who && typeof D !== 'undefined' && D && D.mgr ? esc(c.who) + ' · ' : '') + 'measured on the device used, against Cloudflare (same as speed.cloudflare.com)</div>';
    var mine = typeof D !== 'undefined' && D && !D.mgr, L = null; try{ L = JSON.parse(localStorage.getItem('coe.netLast') || 'null'); }catch(e){}
    if(mine && L && L.s && Math.abs(L.at - Date.now()) < 864e5 && L.s !== s) h += block('Latest check · this device', hm(L.at) + ' · ' + (L.kind === 'class' ? 'at your last “I’m in”' : 'at your last time-in'), L.s);
    h += block(c.kind === 'class' ? 'At “I’m in” (historical)' : 'At time-in (historical)', when, s);
    if(!mine) h += '<div class="small mute" style="margin-top:10px">This is the measurement saved with that ' + kind + '. A newer check on the teacher’s device is not shown here.</div>';
    h += '<div class="small mute" style="margin-top:10px">Ping = how fast the connection answers. Jitter = how much that changes from moment to moment; high jitter makes video freeze or drop even when the speed is high.</div>';
    h += '<button class="btn ghost block" style="margin-top:12px" onclick="closeSheet()">Close</button>';
    openSheet(h); };
  var st = document.createElement('style'); st.textContent = '.nd-b{border:1px solid var(--line,#e6e3ef);border-radius:12px;padding:12px;margin-top:12px}.nd-g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px}.nd-g>div{background:var(--soft,#f6f5fa);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:2px;min-width:0}.nd-g span{font-size:12px;color:var(--mute,#6b6880)}.nd-h{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px}.nd-h b{margin-right:auto}.nd-v{font-style:normal}.nd-g small{font-size:11px;color:var(--mute,#6b6880)}@media(min-width:900px){.nd-g{grid-template-columns:repeat(4,minmax(0,1fr))}}';
  document.head.appendChild(st);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
