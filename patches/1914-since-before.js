// 1914: Pay header (newer render path) still said "· since Before 2026" → "· since before 2026".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["${since ? `<span>· since ${esc(since)}</span>` : ''}",
   "${since ? `<span>· since ${esc(String(since).replace(/^Before /, 'before '))}</span>` : ''}"],
]);
