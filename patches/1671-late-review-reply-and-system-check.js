// 1671: (Misty, 29 Oct) management side of the 1670 System notice. Each late in the management review (Overview › Lates to decide and
// Monitor › Time-ins › To review, where Excused / Unexcused / Waive call decideLate) now shows, inside the same card:
//   · the teacher's reply: reason, proof picture, submission time (or "No reply from the teacher yet");
//   · one "System check" line from the database for the window 5 minutes before the deadline → the check-in: her app activity (taps and
//     screens, coe_speed), failed / waiting / retried saves (writes), an app reload for an update (version change in coe_speed), when her
//     check-in was received and saved, and how many other teachers' check-ins in the same window saved normally (count only, no names).
// Management only (coe-late action mgmt checks the token). Drawn at the source in both card templates from the last copy saved on this
// device; fresh data replaces the text of those blocks in place (no observers, no Google calls). The decision stays decideLate.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  // Monitor › Time-ins › To review
  ["<div class=\"ti-tags\" style=\"margin-top:6px\">${tiNet(x)}${tiTown(x)}</div>\n<div class=\"row\" style=\"margin-top:10px;gap:6px\"><button class=\"btn ghost sm grow\" onclick=\"decide(${x.row},'Excused')\">Excused</button>",
   "<div class=\"ti-tags\" style=\"margin-top:6px\">${tiNet(x)}${tiTown(x)}</div>${window.lxM1671 ? lxM1671(x) : ''}\n<div class=\"row\" style=\"margin-top:10px;gap:6px\"><button class=\"btn ghost sm grow\" onclick=\"decide(${x.row},'Excused')\">Excused</button>"],
  // Overview › Lates to decide
  ["(due(x) ? ' · <span style=\"color:#B4532F\">auto Unexcused ' + esc(due(x)) + '</span>' : '') + '</div></div>'",
   "(due(x) ? ' · <span style=\"color:#B4532F\">auto Unexcused ' + esc(due(x)) + '</span>' : '') + '</div>' + (window.lxM1671 ? lxM1671(x) : '') + '</div>'"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1671 · late review: the teacher's reply + a one-line System check (database only, coe-late) */
(function(){
  if(window.__1671) return; window.__1671 = 1;
  var URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-late', KEY = 'coe.lxm1671';
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var C = (function(){ try{ return JSON.parse(localStorage.getItem(KEY) || 'null') || { items: {} }; }catch(e){ return { items: {} }; } })();
  var SIG = '', AT = 0, BUSY = false, T = 0;
  var local = function(row){ return +row > 1e9 ? new Date(+row + 8 * 3600e3).toISOString().slice(0, 19) : ''; };
  var keyOf = function(x){ var at = local(x.row); return at ? String(x.teacher || '').trim().toLowerCase() + '|' + at : ''; };
  var ic = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>';
  var icr = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  function inner(k){ var it = C.items[k], ck = it && it.check, x = it && it.ex;
    var h = '<div class="lxm-c' + (ck ? '' : ' wait') + '">' + ic + '<span>' + (ck ? E(ck.line) : 'System check: reading the record…') + '</span></div>';
    if(!it) return h + '<div class="lxm-x wait">' + icr + '<span>Teacher’s reply: checking…</span></div>';
    if(!x) return h + '<div class="lxm-x none">' + icr + '<span>No reply from the teacher yet.</span></div>';
    var t = x.at ? new Date(x.at).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }) : '';
    return h + '<div class="lxm-x">' + icr + '<div class="lxm-b"><b>Teacher’s reply</b>' + (t ? ' · submitted ' + E(t) : '') + '<div class="lxm-q">' + E(x.reason) + '</div>'
      + (x.img ? '<a class="lxm-i" href="' + E(x.img) + '" target="_blank" rel="noopener"><img alt="Proof picture from the teacher" src="' + E(x.img) + '"></a>' : '') + '</div></div>'; }
  window.lxM1671 = function(x){ var k = keyOf(x); if(!k) return ''; soon(); return '<div class="lxm" data-lxm="' + E(k) + '">' + inner(k) + '</div>'; };
  function soon(){ if(T) return; T = setTimeout(function(){ T = 0; load(false); }, 0); }
  function put(){ try{ localStorage.setItem(KEY, JSON.stringify(C)); }catch(e){} }
  function paint(){ [].forEach.call(document.querySelectorAll('[data-lxm]'), function(el){ var h = inner(el.getAttribute('data-lxm')); if(el._h !== h && el.innerHTML !== h){ el.innerHTML = h; } el._h = h; }); }
  async function load(force){ try{
    if(BUSY || typeof D === 'undefined' || !D || !D.mgr || typeof MO === 'undefined' || !MO || typeof TOKEN === 'undefined' || !TOKEN) return;
    var L = (MO.late || []).filter(function(x){ return keyOf(x); }).slice(0, 30), sig = L.map(keyOf).join(',');
    if(!L.length) return; if(!force && sig === SIG && Date.now() - AT < 120e3) return;
    BUSY = true; SIG = sig; AT = Date.now();
    var r = await fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'mgmt', lates: L.map(function(x){ return { teacher: x.teacher, at: local(x.row) }; }) }) });
    var j = null; try{ j = await r.json(); }catch(e){} if(!j || !j.ok) return;
    var now = Date.now(), keep = {}; L.forEach(function(x){ keep[keyOf(x)] = 1; });
    Object.keys(j.items || {}).forEach(function(k){ var o = C.items[k], n = j.items[k];
      if(n.ex && n.ex.img && o && o.ex && o.ex.img && o.imgAt && now - o.imgAt < 45 * 6e4){ n.ex.img = o.ex.img; n.imgAt = o.imgAt; } else n.imgAt = now;   /* same picture link for 45 min: no redraw */
      C.items[k] = n; });
    Object.keys(C.items).forEach(function(k){ if(!keep[k]) delete C.items[k]; });
    put(); paint();
  }catch(e){} finally{ BUSY = false; } }
  setInterval(function(){ if(!document.hidden && typeof VIEW !== 'undefined' && (VIEW === 'home' || VIEW === 'team')) load(false); }, 60e3);
  var st = document.createElement('style'); st.id = 'st1671';
  st.textContent = '.lxm{margin-top:8px;font-size:var(--fs-meta,14px);line-height:1.45;color:#3A3556}.lxm-c,.lxm-x{display:flex;gap:6px;align-items:flex-start;margin-top:4px}.lxm-c svg,.lxm-x svg{flex:none;margin-top:2px;color:#5E5A75}'
    + '.lxm-c.wait,.lxm-x.wait,.lxm-x.none{color:#77738C}.lxm-b{min-width:0}.lxm-q{margin-top:2px;padding:6px 9px;border-radius:9px;background:#F7F6FA;white-space:pre-wrap;overflow-wrap:anywhere;color:#2B2253}'
    + '.lxm-i{display:block;width:120px;height:80px;margin-top:6px;border-radius:8px;overflow:hidden;border:1px solid var(--line,#E7E5EE)}.lxm-i img{width:100%;height:100%;object-fit:cover}.lqm-it>.grow{min-width:0;flex:1 1 320px}';   /* sizes from the 901 type scale (var), so its later pass changes nothing */
  document.head.appendChild(st);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
