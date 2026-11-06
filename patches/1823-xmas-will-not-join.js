// 1823: (Misty 6 Nov 20:04) Christmas: "Yes, I will join" / "No, I will not join" instead of one tick box, so management sees who said no
//   (not the same as no answer). Choosing No hides the dates, wishlist and clues. Management line: joining · not joining · no answer yet.
//   Server coe-xmas v4 returns `answered`.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, JSON.parse(fs.readFileSync(__dirname + '/1823-xmas-will-not-join.pairs.json', 'utf8')));
