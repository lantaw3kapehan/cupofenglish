// 15 Oct · New class › Weekly package: "Book the rest" fills the number of classes from the lessons left minus those
// already booked, and shows the date of the last class.
const inc = require('fs').readFileSync(require('path').join(__dirname,'188-class-rest-of-package.inc'),'utf8');
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
["<div class=\"small mute\" style=\"margin-top:4px\">Tap the package and the number of classes is worked out from the length", "<div id=\"cRest\" style=\"margin-top:8px\"></div><div class=\"small mute\" style=\"margin-top:4px\">Tap the package and the number of classes is worked out from the length"],
]);
