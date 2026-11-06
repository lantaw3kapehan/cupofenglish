// 1824: (Misty 6 Nov 20:06–20:07) Christmas: no names on teachers' screens. The giver sees only the person's "About me" and wishlist;
//   the name shows only after the President presses Reveal at the dinner. Server coe-xmas v5 no longer sends the name or the wheel list.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, JSON.parse(fs.readFileSync(__dirname + '/1824-xmas-no-names.pairs.json', 'utf8')));
