// 782: the small "· or drag the file here" hint (780) is not needed now that the box says "Drag the class video file here" (781).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + '<style>.hw .vdh{display:none}</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
