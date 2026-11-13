// 2160 (13 Nov · Misty 13:49 "do all now"): Briefing › "Wi-Fi check · last 7 days": pictures read, on the cable, Wi-Fi seen,
// can't tell, locks (open / allowed / cases), repeat teachers and the reading cost. Data: coe_wifi_week() inside coe_fin_growth (B.growth.wifi).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["renew2151(o) + grow(o) + more() + '</div></div>'",
   "renew2151(o) + grow(o) + more() + (window.wifi2160 ? wifi2160(B.growth && B.growth.wifi) : '') + '</div></div>'"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="x2160">
/* 2160 · Briefing: the Wi-Fi check, last 7 days */
window.wifi2160 = function(W){ try{ if(!W || !(W.pictures || W.locks)) return '';
  const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const pct = W.read ? Math.round(100 * W.cable / W.read) : null;
  const say = W.locks ? (W.open ? '<b>' + W.open + ' still locked</b> · waiting for Operations. ' : '') + (W.cases ? W.cases + ' became a case. ' : '') + (W.allowed ? W.allowed + ' allowed (not Wi-Fi, or cable internet down). ' : '')
    : 'No Wi-Fi this week. ';
  const who = (W.who || []).map(x => E(x.t) + (x.n > 1 ? ' ×' + x.n : '')).join(', ');
  const rep = (W.repeat || []).map(x => E(x.t) + ' (' + x.n + ' cases)').join(', ');
  return '<div class="bz-card"><h2>Wi-Fi check · last 7 days</h2>'
    + '<p class="bz-say" style="margin:0 0 8px">' + (W.read ? '<b>' + W.read + '</b> pictures read' + (pct != null ? ': <b>' + pct + '%</b> on the LAN cable' : '') + ', ' + W.wifi + ' Wi-Fi, ' + W.unclear + ' can’t tell. ' : W.pictures + ' pictures (reading started 13 Nov). ') + say + '</p>'
    + (who ? '<div class="small mute">Locked this week: ' + who + '</div>' : '')
    + (rep ? '<div class="small" style="color:#A6432E;margin-top:4px"><b>Repeat:</b> ' + rep + ' · lesson offers paused until the cable is verified</div>' : '')
    + '<div class="small mute" style="margin-top:6px">Reading cost this week: $' + (+W.usd || 0).toFixed(2) + ' (from the plan’s API credit)</div></div>';
}catch(e){ return ''; } };
</script>
</body>
</html>`],
]);
