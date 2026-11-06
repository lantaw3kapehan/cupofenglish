// 1793: Government · a long month note (e.g. April's SEC explanation) made its row very tall. Notes now show 2 lines;
//   the whole note shows when you point at it, and in ✎.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["'<div class=\"gv-n\">' + esc(g.note) + '</div>'", "'<div class=\"gv-n\" title=\"' + esc(g.note) + '\">' + esc(g.note) + '</div>'"],
  ["#v-gov td.gv-m{min-width:120px;max-width:200px}",
   "#v-gov td.gv-m{min-width:120px;max-width:200px}#v-gov .gv-n{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}"],
]);
