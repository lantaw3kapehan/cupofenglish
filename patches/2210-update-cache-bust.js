// 2210 (14 Nov · several laptops stayed on older versions for hours): when version.txt says there is a newer version, the app downloaded
// "app.html", which the web host can keep serving from its cache for up to 10 minutes; the app then saw no newer version, waited, and could
// miss updates through a whole teaching block. The download now asks for a fresh copy (app.html?v=…), so the newer version arrives at once.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["function fetchUpdateNow(){\nfetch('app.html', {cache:'no-store'})", "function fetchUpdateNow(){\nfetch('app.html?v=' + Date.now(), {cache:'no-store'})"]]);
