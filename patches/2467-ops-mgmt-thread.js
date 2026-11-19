// 2467 (Misty 18:54 "since the problem has been solved, she should also see it here · like a communication between Operations and
//   President · each action seen and reflected instantly") ·
//   Celine's Ops Desk: under the four numbers, "With Management" lists today's problems as a two-way thread: what she found (time, note),
//   then "Solved by Management" with the time, or "Waiting for Management" · the problems number says "· 1 solved".
//   President's From Operations: "Solved today" under the open problems.
//   Both refresh every 20 seconds (were 60 s for Celine, 90 s for the President) · coe_ops_day log now carries who solved it.
const file = process.argv[2];
const JS = String.raw`<style id="u2467">.s2467{margin-top:12px;border-top:1px solid var(--u-line,#ECEAF2);padding-top:10px}.s2467 .h{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:4px}.s2467 .h b{font-size:15px;color:#2B2253}
.s2467 .r{display:grid;grid-template-columns:52px minmax(0,1fr);gap:10px;padding:8px 0;border-top:1px solid #F4F3F8}.s2467 .r:first-of-type{border-top:0}.s2467 .t{color:#6B6880;font-size:13px;font-variant-numeric:tabular-nums;padding-top:2px}
.s2467 .lb{display:inline-block;border-radius:6px;padding:1px 8px;font-size:12px;font-weight:700;margin-right:6px}.s2467 .lb.g{background:#E4F4F1;color:#1E6F5C}.s2467 .lb.r{background:#FCEDE8;color:#B5432C}.s2467 .lb.a{background:#FFF1D6;color:#8A5A00}
.s2467 .ans{margin-top:6px;padding:6px 10px;border-radius:10px;background:#F3FAF8;font-size:13.5px;color:#1E4F45}.s2467 .ans.w{background:#FFF8EA;color:#7A5200}.s2467 .n{font-size:13px;color:#6B6880;margin-top:2px}</style>
<script id="b2467">
window.sol2467 = function(d){ try{ var L = (d && d.log) || [], E = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var P = L.filter(function(l){ return l.kind === 'problem'; }); if(!P.length) return '';
  var rows = P.map(function(p){ var s = L.find(function(x){ return x.kind === 'resolved' && x.ref === 'log:' + p.id; });
    var later = !s && p.ref ? L.find(function(x){ return x.ref === p.ref && /^(fixed|cleared|match|skip|done)$/.test(x.kind) && x.id > p.id; }) : null;
    return '<div class="r"><span class="t">' + E(p.at) + '</span><span><span class="lb r">You found a problem</span><b>' + E(p.title || '') + '</b>' + (p.note ? '<div class="n">' + E(p.note) + '</div>' : '')
      + (s ? '<div class="ans"><span class="lb g">Solved by Management</span>' + E(s.at) + (s.note ? ' · ' + E(s.note) : '') + '</div>' : later ? '<div class="ans"><span class="lb g">You cleared it</span>' + E(later.at) + '</div>' : '<div class="ans w"><span class="lb a">Waiting for Management</span>they see it on their Overview</div>') + '</span></div>'; });
  var open = P.filter(function(p){ return !L.some(function(x){ return x.kind === 'resolved' && x.ref === 'log:' + p.id; }); }).length;
  return '<div class="s2467"><div class="h"><b>With Management</b><span class="small mute">' + (open ? open + ' waiting · ' : '') + (P.length - open) + ' solved today · updates every 20 seconds</span></div>' + rows.reverse().reverse().join('') + '</div>'; }catch(e){ return ''; } };
</script>
`;
require('../tools/lib.js')(file, [
  ["<span>still to do</span></div></div>'", "<span>still to do</span></div></div>' + (window.sol2467 ? window.sol2467(d) : '') + ''"],
  ["447Show(\\'found\\')\"><b class=\"kr\">' + (d.found || 0) + '</b><span>problems found</span>", "447Show(\\'found\\')\"><b class=\"kr\">' + (d.found || 0) + '</b><span>problems found' + (d.solved ? ' · ' + d.solved + ' solved' : '') + '</span>"],
  ["VIEW === 'mtoday') load(true); else if(ops()) paint(); }catch(e){} }, 60e3);", "VIEW === 'mtoday') load(true); else if(ops()) paint(); }catch(e){} }, 20e3);   /* 2467: every 20 s */"],
  ["PDat < 90e3", "PDat < 20e3"],
  ["Solved</button></div>'; }).join('') + '</div>'; })();", "Solved</button></div>'; }).join('') + '</div>';\n      var S2467 = LG.filter(function(l){ return l.kind === 'resolved' && /^log:/.test(l.ref || ''); }); if(S2467.length) h += '<div class=\"p2452\" style=\"border-top:0;padding-top:4px\"><b style=\"font-size:13.5px;color:#1E6F5C\">Solved today · ' + S2467.length + '</b>' + S2467.map(function(l){ return '<div class=\"pr\" style=\"grid-template-columns:48px 1fr\"><span class=\"t\">' + E(l.at) + '</span><span class=\"small mute\">' + E(l.title || '') + ' · she sees it on her desk</span></div>'; }).join('') + '</div>'; })();"]
]);
