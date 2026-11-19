// 2424 (Misty 19 Nov 14:24, management: "the data to fix, when you click it's none?") · the old "Data to fix" box (Google FIX tab)
//   showed 0 and opened to "Nothing to fix" while the real items sit in "Fix these → Data to check". Hide it when it has nothing.
const file = process.argv[2];
require('../tools/lib.js')(file, [['const fixH = `<details class="sec tdx" id="td-fix"', 'const fixH = !fix.filter(x => !FIXD[fixKey(x)]).length ? \'\' : `<details class="sec tdx" id="td-fix"']]);
