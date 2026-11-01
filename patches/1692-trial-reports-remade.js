// 1692: (Misty, 1 Nov 18:48) "it's still the same for Nature" · trial reports made in the app are kept on the laptop (806, by
//   content signature) and shown again when the trial is opened. Nature's report was made at 18:27, while 1690 dropped the report's
//   style block, so the broken copy kept coming back after 1691. The signature version moves v4 → v5: every kept report is made
//   again once (a few seconds), so no report made between 15:38 and 18:31 can come back.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v4';", "(t.commZh ? 1 : 0) + '|' + (extra || '') + '|v5';"]
]);
