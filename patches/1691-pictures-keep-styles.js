// 1691: (Misty, 1 Nov 18:30, trial class report picture overlapping / unstyled) · 1690 left out everything in the page body
//   except the element being drawn, but 71 <style> blocks live in the body (added by later screen changes), so pictures drawn
//   with those styles (the trial report) lost their layout. Now any <style>/<link> and any box that holds one are kept.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(!el || !el.contains || n === B || n === H || n === R || H.contains(n) || el.contains(n) || n.contains(el)) return false; return B.contains(n);",
   "if(!el || !el.contains || n === B || n === H || n === R || H.contains(n) || el.contains(n) || n.contains(el)) return false; if(n.tagName === 'STYLE' || n.tagName === 'LINK' || (n.querySelector && n.querySelector('style,link[rel=stylesheet]'))) return false; return B.contains(n);"]
]);
