// 2535 (Misty 16:39 "OK build it and make it live now"): compact Behind and From Operations cards on Overview (mock approved).
const file = process.argv[2], fs = require('fs'), path = require('path');
const inc = fs.readFileSync(path.join(__dirname, '2535-overview-compact.inc.html'), 'utf8');
require('../tools/lib.js')(file, [['<script id="b2278">', inc + '<script id="b2278">']]);
