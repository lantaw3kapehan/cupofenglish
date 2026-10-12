// Class notice: teacher name once ("Teacher Julia", not "Teacher Teacher Julia").
require('../tools/lib.js')(process.argv[2], [["(typeof tName === 'function' ? tName(x.teacher || '') : '') || x.teacher || ''", "String(x.teacher || '').replace(/^(teacher|tr\\.?)\\s+/i, '').trim()"]]);
