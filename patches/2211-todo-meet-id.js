// 2211 (14 Nov · Misty: yes): To do › Fix these lists the students with classes this week and no meeting ID (database: coe_ops_check kind
// "meet"). The item clears itself when the IDs are added, so it has only "Open" (Schedule), no "It's correct" button.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["\n</body>\n</html>", "\n<style id=\"css2211\">.o91-it.k-meet .o91-bt button:not(.go){display:none}</style>\n</body>\n</html>"]]);
