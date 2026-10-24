// 787: (Misty) "teachers say it's slow to load (Ara)". The teacher home is worked out by the database (~1 s), but for 2 minutes after
// any save (a note, homework, I'm in…) the app ignored that copy and WAITED for Google (5–35 s) so the save would not "disappear".
// Now, in those 2 minutes, the home shows what is already on the screen (it already has the save) at once and asks Google behind it;
// the screen updates by itself when Google answers. Teachers only; management unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && ((d.live && age(d) < 90 * 6e4) || age(d) < 180000)) return d.data;",
   "  if(fn === 'getBootstrap' && ui && typeof D !== 'undefined' && D && D.me && !D.mgr && SB_LASTW && Date.now() - SB_LASTW < 120000){   /* 787: just saved → keep the screen, check behind */\n    const rp = real(); rp.then(x => { if(x && x.me && JSON.stringify(x) !== JSON.stringify(D)){ SB_FRESH[key] = { data: x, t: Date.now() }; sbRedraw(fn, args, x); } }).catch(() => {}); return D; }\n  if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && ((d.live && age(d) < 90 * 6e4) || age(d) < 180000)) return d.data;"]
]);
