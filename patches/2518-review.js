// 2518 (Misty 20 Nov): Performance Improvement Plan and Accountability Review (Annex A) for office staff · code in 2518-review.inc.html · server coe-review v1
const file = process.argv[2];
const INC = require('fs').readFileSync(require('path').join(__dirname, '2518-review.inc.html'), 'utf8');
require('../tools/lib.js')(file, [['<script id="b2278">', INC + '\n<script id="b2278">']]);
