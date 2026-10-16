// 16 Oct · 235's names clashed with the leave screen (lvAsk, lvT, lvW, lvN…): the level-up check now uses lu… names.
const fs = require('fs'), path = require('path');
const oldI = fs.readFileSync(path.join(__dirname, '236-level-up-rename.old'), 'utf8'), newI = fs.readFileSync(path.join(__dirname, '236-level-up-rename.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
[oldI, newI],
["if(r.done && !(window.lvSkipDone && lvSkipDone(P.code, r.done)))", "if(r.done && !(window.luSkipDone && luSkipDone(P.code, r.done)))"],
["levelUp: window.lvBody ? lvBody(P.code, P.picks) : undefined", "levelUp: window.luBody ? luBody(P.code, P.picks) : undefined"],
]);
