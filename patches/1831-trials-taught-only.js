// 1831: (Misty 7 Nov) Trials & sub classes / "Write report": only trials the teacher really taught (cancelled ones dropped).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1831-trials-taught-only.inc.txt', 'utf8');
lib(file, [["<script>\n/* 20 Oct · 364 · A trial moved to another day", inc + "<script>\n/* 20 Oct · 364 · A trial moved to another day"]]);
