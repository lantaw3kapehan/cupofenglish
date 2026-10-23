// 679: (Misty) Self-study is for every teacher, so it is always visible: right under the next training, before the path.
// Until management adds model lessons it says what will appear there.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("    const M = partsOf(d, 'model').filter(p => p.video_path);\n    if(M.length) h += '<h2>Self-study <span class=\"mute small\" style=\"font-weight:400\">· free</span></h2>' + M.map(p => partRow(d, who, p)).join('');\n", "");
rep("    h += pathHtml(d, who, R);",
    "    const M = partsOf(d, 'model').filter(p => p.video_path);\n" +
    "    h += '<h2 style=\"margin-top:14px\">Self-study <span class=\"mute small\" style=\"font-weight:400\">· free · for every teacher</span></h2>' + (M.length ? M.map(p => partRow(d, who, p)).join('') : '<div class=\"tr-row\" style=\"cursor:default\"><span class=\"ic\">▶</span><div class=\"grow\"><b>Model lessons</b><small>Videos of our best classes will appear here. Watch them any time and write what you will try.</small></div></div>');\n" +
    "    h += '<h2>My path</h2>' + pathHtml(d, who, R);");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
