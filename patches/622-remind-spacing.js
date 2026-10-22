// 622: blank line between the English and Chinese reminder lines (and before the Tencent Meeting number, as before).
require('../tools/lib.js')(process.argv[2], [
["return f(p[0]) + '\\n' + f(p[1]) + (k === 'on'", "return f(p[0]) + '\\n\\n' + f(p[1]) + (k === 'on'"]
]);
