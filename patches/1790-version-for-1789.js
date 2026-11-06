// 1790: raise COE_V for 1789 (1789 changed app.html without the version step), so every device auto-refreshes to the Return/Sent key fix.
require('../tools/lib.js')(process.argv[2], [["/* 1789 */function rpKey1789(", "/* 1789 · 1790 */function rpKey1789("]]);
