// 1821: (Misty 6 Nov 19:43) Christmas 2026 dinner + gift exchange in the app (Secret Santa without anyone knowing who picked whom).
//   Code in 1821-xmas.inc.txt · server coe-xmas v1 · tables coe_xmas, coe_xmas_draw · docs sys:xmas2026.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1821-xmas.inc.txt', 'utf8');
lib(file, [["<script>/* 1814 · same-HTML guard", inc + "<script>/* 1814 · same-HTML guard"]]);
