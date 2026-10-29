// 1592: (speed agent, 29 Oct) Students list / student card at 4x CPU. Profile: most of the time was the two colour safety passes (1007 contrast,
// 1101 fixText) that run on every redraw: they read the computed style of each element and wrote a colour in the same loop, so every
// write made the browser recalculate styles (and layout) for the next read — thousands of times on the 4,900-element Students list.
// Now each pass reads everything first, then writes once, and neither pass walks the Students list rows (their colours are AA by CSS: the
// passes changed nothing there except the 'Type?' chip, now darker in its own CSS). Rows off screen use content-visibility (not laid out or
// painted until scrolled to; still in the page, so search, filters, focus and find work as before).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
 [
  "const T = learnerTag1588(code), old = line.querySelector('.lt1588'); if(old && old.outerHTML === T.html) return; if(old) old.outerHTML = T.html; else line.insertAdjacentHTML('beforeend', T.html); }); }",
  "const T = learnerTag1588(code), old = line.querySelector('.lt1588'); if(a.dataset.lb !== T.k) a.dataset.lb = T.k; if(old && old.outerHTML === T.html) return; if(old) old.outerHTML = T.html; else line.insertAdjacentHTML('beforeend', T.html); }); }   /* 1592: the band on the row too (filter without :has) */"
 ],
 [
  "#v-astudents[data-ltf=\"early\"] a.li.sa:not(:has(.lt1588.early)),#v-astudents[data-ltf=\"young\"] a.li.sa:not(:has(.lt1588.young)),#v-astudents[data-ltf=\"teen\"] a.li.sa:not(:has(.lt1588.teen)),#v-astudents[data-ltf=\"adult\"] a.li.sa:not(:has(.lt1588.adult)){display:none!important}",
  "#v-astudents[data-ltf=\"early\"] a.li.sa:not([data-lb=\"early\"]),#v-astudents[data-ltf=\"young\"] a.li.sa:not([data-lb=\"young\"]),#v-astudents[data-ltf=\"teen\"] a.li.sa:not([data-lb=\"teen\"]),#v-astudents[data-ltf=\"adult\"] a.li.sa:not([data-lb=\"adult\"]){display:none!important}"
 ],
 [
  "function contrast(root){ if(!root) return; var els = root.querySelectorAll('*:not([data-c1007])');",
  "function contrast(root){ if(!root) return; var W1592 = []; var els = root.querySelectorAll('*:not([data-c1007]):not(a.li.sa *)');   /* 1592: Students list rows are AA by their own CSS: not checked */"
 ],
 [
  "e.style.setProperty(svg ? 'fill' : 'color', nc, 'important'); if(e.dataset) e.dataset.c1007 = '1'; } }",
  "W1592.push([e, svg ? 'fill' : 'color', nc]); }\n    W1592.forEach(function(w){ w[0].style.setProperty(w[1], w[2], 'important'); if(w[0].dataset) w[0].dataset.c1007 = '1'; }); }   /* 1592: read everything, then write (no style recalculation per element) */"
 ],
 [
  "function fixText(root){ var E = root.querySelectorAll('span,b,i,em,small,strong,div,a,p,td,th,label,li,h3,h4,button,u,mark,s'), n = 0;",
  "function fixText(root){ var W1592 = [], E = root.querySelectorAll('span,b,i,em,small,strong,div,a,p,td,th,label,li,h3,h4,button,u,mark,s'), n = 0;"
 ],
 [
  "if(CR(fg, bl) >= need){ ow.style.setProperty('background-image', 'linear-gradient(rgba(24,18,48,' + a.toFixed(2) + '),rgba(24,18,48,' + a.toFixed(2) + '))', 'important'); break; }",
  "if(CR(fg, bl) >= need){ W1592.push([ow, 'background-image', 'linear-gradient(rgba(24,18,48,' + a.toFixed(2) + '),rgba(24,18,48,' + a.toFixed(2) + '))']); break; }"
 ],
 [
  "if(CR(nc, bg) >= need){ e.style.setProperty('color', 'rgb(' + nc.join(',') + ')', 'important'); break; } } } }\n  var MO = new WeakSet();",
  "if(CR(nc, bg) >= need){ W1592.push([e, 'color', 'rgb(' + nc.join(',') + ')']); break; } } }\n    W1592.forEach(function(w){ w[0].style.setProperty(w[1], w[2], 'important'); }); }   /* 1592: writes after all reads */\n  var MO = new WeakSet();"
 ],
 [
  "for(var k = 0; k < E.length && n < 20000; k++){ var e = E[k]; if(e.dataset.k1101 && e.dataset.c1007 !== '1') continue;",
  "for(var k = 0; k < E.length && n < 20000; k++){ var e = E[k]; if(e.dataset.k1101 && e.dataset.c1007 !== '1') continue; if(e.closest('a.li.sa')) continue;   /* 1592 */"
 ],
 [
  ".lt1588.unk{background:transparent;color:#8A86A0;box-shadow:inset 0 0 0 1px #E2E0EA;font-weight:500}",
  ".lt1588.unk{background:transparent;color:#6F6B85;box-shadow:inset 0 0 0 1px #E2E0EA;font-weight:500}"
 ],
 [
  "</script>\n</body>\n</html>",
  "</script>\n<style id=\"css1592\">/* 1592 · Students list: rows off screen are not laid out or painted until you scroll to them (all rows stay in the page: search, filters, focus, find-in-page unchanged) */\n#v-astudents a.li.sa{content-visibility:auto;contain-intrinsic-size:auto 96px}\n@media(max-width:620px){#v-astudents a.li.sa{contain-intrinsic-size:auto 150px}}\n</style>\n</body>\n</html>"
 ]
]);
