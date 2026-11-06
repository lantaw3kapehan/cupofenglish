// 1809: wording · on a declined notice the suggestion line says "missed" instead of "under 4 h".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["(waiting === 1 ? '' : 's') + ' under 4 h: '", "(waiting === 1 ? '' : 's') + (/^Declined/i.test(x.status || '') ? ' missed: ' : ' under 4 h: ')"]]);
