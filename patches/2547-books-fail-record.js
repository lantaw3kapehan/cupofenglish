// 2547 (Misty 19:41): "Books that did not open · last 24 h" on management To do (coe-books v9 op fails).
const file = process.argv[2], fs = require('fs');
const inc = fs.readFileSync(__dirname + '/2547.inc.html', 'utf8');
require('../tools/lib.js')(file, [['<script id="b2278">', inc + '<script id="b2278">']]);
