// 2399 (Misty 19 Nov 11:11, Monica's report still showed the KET roadmap) · reports made before 2398 were kept on the device
//   (IndexedDB coe-pdf, key …|v7) and shown again. The key is now …|v8, so every report is made again with the new roadmap.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v7';", "(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v8';"]
]);
