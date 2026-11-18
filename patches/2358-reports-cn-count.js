// 2358 (QA 18 Nov): Parent reports › "Chinese not reviewed · …" stayed … when no report had come in yet.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["b.textContent = 'Chinese not reviewed \u00b7 ' + (known.length ? nNo : '\u2026');", "b.textContent = 'Chinese not reviewed \u00b7 ' + (known.length || at ? nNo : '\u2026');   /* 2358: 0 once loaded, not \u2026 for ever */"]
]);
