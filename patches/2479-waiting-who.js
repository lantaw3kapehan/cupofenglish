// 2479 (audit B1 "Behind": show who, not only how many): each "Waiting on teachers" row on the President's Overview
//   shows the teachers it is waiting on (the same names To do uses), under the count.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["W.map(x => '<a class=\"nd-wr\" onclick=\"' + E(x.go || '') + '\"><span class=\"nd-n\">' + nf(+x.n || 0) + '</span><span>' + E(x.t || '') + '</span></a>').join('')",
   "W.map(x => '<a class=\"nd-wr\" onclick=\"' + E(x.go || '') + '\"><span class=\"nd-n\">' + nf(+x.n || 0) + '</span><span>' + E(x.t || '') + (x.s ? '<small class=\"wh2479\">' + E(x.s) + '</small>' : '') + '</span></a>').join('')"],
  ['<script id="b2278">', '<style id="u2479">#nd37 .wh2479{display:block;font-size:12px;color:#6B6880;margin-top:1px;font-weight:400}</style>\n<script id="b2278">']
]);
