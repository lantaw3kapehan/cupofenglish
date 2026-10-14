// 14 Oct pm · Second open stays fast the next day too (Misty: "even the day is new, its second open it will be fast, right?").
// The app used a database copy only if it was under 6 hours old; overnight most copies got older than that, so the first
// open next morning waited for Google again. Now any copy up to 3 days old shows at once (student pages: 7 days), and the
// fresh one still loads in the background and redraws the screen if anything changed.
require('../tools/lib.js')(process.argv[2], [
["if(!d || age(d) > (SB_UIAGE[fn] || 6 * 3600e3)) return rp;",
 "if(!d || age(d) > (SB_UIAGE[fn] || 3 * 864e5)) return rp;"],
]);
