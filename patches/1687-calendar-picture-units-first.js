// 1687: (Misty, 1 Nov 10:49) "We should still show 33 instead of 98 · this is my concern." The parent calendar picture's summary
//   now leads with the package units the classes use, then the classes: "33 lesson units booked · 66 classes × 25 min" /
//   "已约33课时 · 66节 × 25分钟" (1686 already limits it to the classes the lessons left pay for).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["c.fillText(live.length + ' classes' + X + ' booked · ' + UN + ' unit' + (UN === 1 ? '' : 's'), X0, y + 50);",
   "c.fillText(UN + ' lesson unit' + (UN === 1 ? '' : 's') + ' booked · ' + live.length + ' class' + (live.length === 1 ? '' : 'es') + X, X0, y + 50);"],
  ["c.fillText('已约' + live.length + '节' + XZ + ' · ' + UN + '课时', X0, y + 86);",
   "c.fillText('已约' + UN + '课时 · ' + live.length + '节' + XZ, X0, y + 86);"]
]);
