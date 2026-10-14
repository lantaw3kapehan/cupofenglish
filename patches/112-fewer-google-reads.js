// 14 Oct night · Fewer calls to Google, so what still needs Google answers faster.
// The speed log showed Google answering the same screens over and over (since this afternoon: Teacher pages 1,852 times,
// Schedule 1,835 times, Health 387 times at 14 s each), because every open also asked Google for a fresh copy even when the
// database copy was only seconds old. Now: a copy under 3 minutes old is used as it is when a screen is opened, and the
// background refresh uses copies up to 5 minutes old (was 90 s). Messages, pulse and health keep their own rules
// (always fresh), and for 2 minutes after a save everything still reads fresh from Google.
require('../tools/lib.js')(process.argv[2], [
["  const age = d => d ? Date.now() - Date.parse(d.at) : Infinity, mx = fn in SB_BGAGE ? SB_BGAGE[fn] : 90000;",
 "  const age = d => d ? Date.now() - Date.parse(d.at) : Infinity, mx = fn in SB_BGAGE ? SB_BGAGE[fn] : 300000;"],
["  const rp = real(), d = await Promise.race([sbDoc(key), rp.then(() => null, () => null)]);",
 "  let d0; if(!(fn in SB_BGAGE) || SB_BGAGE[fn] > 0){ d0 = await sbDoc(key); if(d0 && age(d0) < 180000) return d0.data; }   /* 14 Oct night: a copy under 3 min is fresh enough */\n  const rp = real(), d = d0 !== undefined ? d0 : await Promise.race([sbDoc(key), rp.then(() => null, () => null)]);"],
]);
