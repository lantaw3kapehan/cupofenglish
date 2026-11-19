// 2447 (Misty 19 Nov 16:36: Celine's Ops Desk · "use the aligned design instead of this navy" · "when you click the 4 done you wouldn't
//   know what those are … every action she does should show, e.g. Not a problem") · the Ops Desk summary is a white card like the rest;
//   each number opens the list behind it: time, a colour label (Done, Not a problem, Fixed, Problem found…) and what it was about.
const file = process.argv[2];
const OLDK = "'<div class=\"k\"><div><b>' + (d.done || 0) + '</b><span>done today</span></div><div><b style=\"color:#A2462C\">' + (d.found || 0) + '</b><span>problems found</span></div><div><b style=\"color:#1E7A4F\">' + (d.fixed || 0) + '</b><span>fixed and cleared</span></div><div><b>' + tasks + '</b><span>still to do</span></div></div>'";
const NEWK = "'<div class=\"k\"><button type=\"button\" class=\"kt\" onclick=\"od2447Show(\\'done\\')\"><b>' + (d.done || 0) + '</b><span>done today</span></button><button type=\"button\" class=\"kt\" onclick=\"od2447Show(\\'found\\')\"><b class=\"r\">' + (d.found || 0) + '</b><span>problems found</span></button><button type=\"button\" class=\"kt\" onclick=\"od2447Show(\\'fixed\\')\"><b class=\"g\">' + (d.fixed || 0) + '</b><span>fixed and cleared</span></button><button type=\"button\" class=\"kt\" onclick=\"od2447Show(\\'todo\\')\"><b>' + tasks + '</b><span>still to do</span></button></div>'";
const CSS = [
  "#v-mtoday #od2341>.c:first-of-type{background:var(--u-card)!important;border:1px solid var(--u-line)!important;color:var(--u-ink)!important}",
  "#v-mtoday #od2341>.c:first-of-type h3{color:var(--u-ink)!important;font-family:var(--ui-font)!important;font-weight:700!important;font-size:17px!important}",
  "#v-mtoday #od2341>.c:first-of-type .mute{color:var(--u-mute)!important}",
  "#v-mtoday #od2341>.c:first-of-type .k>.kt{background:#F7F6FA!important;border:1px solid var(--u-line)!important;border-radius:14px!important;padding:12px 14px!important;text-align:left;cursor:pointer;font:inherit;display:flex;flex-direction:column;gap:2px;color:inherit}",
  "#v-mtoday #od2341>.c:first-of-type .k>.kt:hover{border-color:#9AD3D6!important;background:#F3FAFA!important}",
  "#v-mtoday #od2341>.c:first-of-type .k b{color:var(--u-ink)!important;font-family:var(--ui-font)!important;font-weight:700!important;font-size:28px!important}",
  "#v-mtoday #od2341>.c:first-of-type .k b.r{color:#A2462C!important}#v-mtoday #od2341>.c:first-of-type .k b.g{color:#1E7A4F!important}",
  "#v-mtoday #od2341>.c:first-of-type .k span{color:var(--u-mute)!important;font-size:13px}",
  "#v-mtoday #od2341>.c:first-of-type .btn.ghost{background:#fff!important;color:var(--u-ink)!important;border-color:#CFE3E5!important}",
  ".od47 .r{display:grid;grid-template-columns:52px 1fr;gap:10px;padding:10px 0;border-top:1px solid #F1F0F6;align-items:start}.od47 .t{font-size:13px;color:#6B6880;font-variant-numeric:tabular-nums;padding-top:2px}",
  ".od47 .lb{display:inline-block;border-radius:6px;padding:1px 8px;font-size:12px;font-weight:700;margin-right:6px}.od47 .lb.g{background:#E4F4F1;color:#1E6F5C}.od47 .lb.r{background:#FCEDE8;color:#B5432C}.od47 .lb.n{background:#F1F0F6;color:#4A4566}.od47 .lb.b{background:#E6EEFB;color:#2B4C8C}"
].join('\n');
const JS = String.raw`<script id="b2447">
window.od2447Show = function(k){ try{
  if(k === 'todo'){ var w = [].slice.call(document.querySelectorAll('#od2341 h3')).find(function(h){ return /Work queue/.test(h.textContent); }); if(w) w.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  var d = window.__od2447 || {}, L = (d.log || []).filter(function(l){ return l.kind !== 'nudge'; });
  var K = { cleared: ['Cleared', 'g'], still: ['Not cleared yet', 'r'], match: ['Checked · matches', 'g'], problem: ['Problem found', 'r'], fixed: ['Fixed', 'g'], report: ['Reported to Management', 'r'], messaging: ['Messaging parents', 'b'], skip: ['Not a problem', 'n'], done: ['Done', 'g'] };
  var F = k === 'found' ? function(l){ return /problem|still|report/.test(l.kind); } : k === 'fixed' ? function(l){ return /fixed|cleared|match/.test(l.kind); } : function(){ return true; };
  var R = L.filter(F), T = k === 'found' ? 'Problems found today' : k === 'fixed' ? 'Fixed and cleared today' : 'Done today';
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var h = '<h1>' + T + '</h1><div class="small mute">' + R.length + ' · newest first · each action and what it was about</div><div class="od47" style="margin-top:8px">' +
    (R.length ? R.map(function(l){ var x = K[l.kind] || [l.kind, 'n']; return '<div class="r"><span class="t">' + E(l.at) + '</span><span><span class="lb ' + x[1] + '">' + E(x[0]) + '</span>' + E(l.title || '') + (l.note && l.kind !== 'messaging' ? '<div class="small mute" style="margin-top:3px">' + E(l.note) + '</div>' : '') + '</span></div>'; }).join('') : '<div class="small mute" style="padding:12px 0">Nothing yet today.</div>') + '</div>';
  if(typeof openSheet === 'function') openSheet(h); }catch(e){ console.warn('2447', e); } };
</script>
`;
require('../tools/lib.js')(file, [
  [OLDK, NEWK],
  ["var L = (d.log || []).slice(0, 12), K = {", "window.__od2447 = d; var L = (d.log || []).slice(0, 12), K = {"],
  ["#v-mtoday #od2341>.c:first-of-type{background:#2B2253!important;border:0!important;color:#fff}\n", ""],
  ["#v-mtoday #od2341>.c:first-of-type h3{color:#fff!important}", CSS],
  ['<script id="b2278">', JS + '<script id="b2278">']
]);
