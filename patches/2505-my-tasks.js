// 2505 (Misty item 6): teachers' "Needs your action" becomes "My tasks · N to do" with a checklist look (an empty circle per task, red ring when urgent).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["td.setAttribute('aria-label', 'Needs your action'); td.innerHTML = '<h2>Needs your action</h2>';", "td.setAttribute('aria-label', 'My tasks'); td.innerHTML = '<h2>My tasks</h2>';"],
  ["var hh = 'Needs your action' + (L.length ? '<span class=\"qn\">' + L.length + '</span>' : '')", "var hh = 'My tasks' + (L.length ? '<span class=\"qn\">' + L.length + ' to do</span>' : '')"],
  ["return '<div class=\"qr\" tabindex=\"0\" role=\"button\" onclick=\"q1106Go(", "return '<div class=\"qr' + (x.sev <= 1.5 || x.red ? ' u' : '') + '\" tabindex=\"0\" role=\"button\" onclick=\"q1106Go("],
  ["' update' + (n === 1 ? '' : 's') + ' · see Needs your action'", "' update' + (n === 1 ? '' : 's') + ' · see My tasks'"],
  ["' in Needs your action · show\"", "' in My tasks · show\""],
  ['<script id="b2278">', '<style id="s2505">#v-today .q1106 .qr::before{content:"";flex:none;width:18px;height:18px;border-radius:50%;border:2px solid #C9C5D6;background:#fff}#v-today .q1106 .qr.u::before{border-color:#E5484D}#v-today .q1106 .qr:hover::before{border-color:#00737B}</style><script id="b2278">']
]);
