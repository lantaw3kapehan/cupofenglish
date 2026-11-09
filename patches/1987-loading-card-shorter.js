// 1987: (Misty 9 Nov 14:33 "LOADING SCREEN ... WHEN CLICKING THE REFRESH FEELS SLOW STILL") The "Loading your screen…" card stayed until the
//   screen had been still for 0.6 s, up to 5 s. The saved screen is drawn within about 0.6 s, but the fresh data arriving from the database
//   over the next 1–3 s kept changing it, so the card usually stayed the full 5 s (measured 5.5 s on Overview). Now it lifts as soon as the
//   screen is drawn (0.3 s still, at most 1.2 s); the fresh numbers fill in place.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if((now - last > 600 && now - dAt > 700) || now - dAt > +(window.__cap1320 || 5000)) off();",
   "if((now - last > 250 && now - dAt > 300) || now - dAt > +(window.__cap1320 || 1200)) off();   /* 1987 */"],
]);
