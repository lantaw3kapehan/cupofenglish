// 2646: 2645's footer rule lost to a later rule · the raw App check line is hidden with a stronger selector.
require('../tools/lib.js')(process.argv[2], [
  [".c-foot > span{display:none}\n", "#app .c-foot > span{display:none!important}\n"],
]);
