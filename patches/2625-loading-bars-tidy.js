// 2625: when a screen later writes the real text into an element that was showing grey bars (2624), the bar marker and aria-busy come off.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  [".ld24{display:block}.ld24 i{", ".ld24 i{"],
  ["for(var i = 0; i < M.length; i++){ var a = M[i].addedNodes;", "for(var i = 0; i < M.length; i++){ var tg = M[i].target; if(tg && tg.classList && tg.classList.contains('ld24') && !tg.querySelector(':scope > i')){ tg.classList.remove('ld24'); tg.removeAttribute('aria-busy'); } var a = M[i].addedNodes;"],
]);
