// 2177 (13 Nov · Misty 19:47 "this is in briefing, it shouldn't be"): the "Wi-Fi check · last 7 days" card (2160) leaves the Briefing.
// The Wi-Fi results stay on each teacher's Performance row (2167) and in To do › Wi-Fi checks.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["renew2151(o) + grow(o) + more() + (window.wifi2160 ? wifi2160(B.growth && B.growth.wifi) : '') + '</div></div>'", "renew2151(o) + grow(o) + more() + '</div></div>'"]]);
