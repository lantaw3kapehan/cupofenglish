// 1548 · Service agreement dialog on a 390-wide phone: the title "Service agreement · 服务协议" no longer runs under the close button
// (room kept on the right of the title, as other sheets do). Layout only; wording and the agreement unchanged.
require('../tools/lib.js')(process.argv[2], [
  ["var h1 = sb && sb.querySelector('h1'); if(h1) h1.insertAdjacentHTML('afterend', seg);",
   "var h1 = sb && sb.querySelector('h1'); if(h1){ h1.style.paddingRight = '56px'; h1.insertAdjacentHTML('afterend', seg); }"]
]);
console.log('1548 agreement dialog title clear of the close button');
