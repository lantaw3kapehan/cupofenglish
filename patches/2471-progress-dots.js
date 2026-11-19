// 2471 (Misty 19:09 "try to use like this too, as how we used it in TRIALS" · dots: green done, ring = now, grey = to go, "5 of 10")
//   Same progress dots on Celine's Ops Desk (done vs today's whole list) · Talk of the Day dashboard has them for the days ready.
const file = process.argv[2];
const JS = String.raw`<style id="u2471">.dt2471{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:12px}.dt2471 i{width:12px;height:12px;border-radius:50%;background:#E5E3EE;display:inline-block}
.dt2471 i.d{background:#3E9A6E}.dt2471 i.c{background:#fff;box-shadow:inset 0 0 0 2.5px #2E6B73}.dt2471 b{margin-left:8px;font-size:15px;color:#2B2253;font-variant-numeric:tabular-nums}.dt2471 span{font-size:13px;color:#6B6880}</style>
<script id="b2471">
window.dots2471 = function(done, total, label){ try{ done = Math.max(0, +done || 0); total = Math.max(done, +total || 0); if(!total) return '';
  var n = Math.min(total, 10), f = total <= 10 ? done : Math.round(done / total * 10), h = '<div class="dt2471" title="' + done + ' of ' + total + '">';
  for(var i = 0; i < n; i++) h += '<i class="' + (i < f ? 'd' : i === f && done < total ? 'c' : '') + '"></i>';
  return h + '<b>' + done + ' of ' + total + '</b>' + (label ? '<span>' + label + '</span>' : '') + '</div>'; }catch(e){ return ''; } };
</script>
`;
require('../tools/lib.js')(file, [
  ["+ (window.sol2467 ? window.sol2467(d) : '') + ''", "+ (window.dots2471 ? window.dots2471(d.done || 0, (d.done || 0) + tasks, 'done today') : '') + (window.sol2467 ? window.sol2467(d) : '') + ''"],
  ['<script id="b2278">', JS + '<script id="b2278">']
]);
