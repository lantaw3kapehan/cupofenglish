// 2445 (Misty 19 Nov 16:25: "Talk of the Day is faded and unclickable") · the steady-screen copy (2368, faded + inert) of the
//   Talk of the Day box was taken for the live box, so it was never replaced. A copy is now always replaced by the live box.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(!o || o.getAttribute('data-h') !== String(h.length) + lv)", "if(!o || o.hasAttribute('data-c2368') || o.getAttribute('data-h') !== String(h.length) + lv)"],
  ["if(!o2 || o2.getAttribute('data-h') !== String(h2.length))", "if(!o2 || o2.hasAttribute('data-c2368') || o2.getAttribute('data-h') !== String(h2.length))"]
]);
