// 14 Oct night · Screens the database works out itself open without Google.
// Misty: "opening in TO DO still takes time" (Jelly's page: no copy yet, so the app waited ≈ 8 s for Google).
// The database now builds ACTIVE, the Students list and every student's page from its own tables (checked: 312/312
// ACTIVE rows, 207/207 students, 147/148 student pages identical to Google; the one difference was a note saved a
// minute earlier). Such an answer comes back marked live: the app shows it and does not ask Google as well, as long as
// it is under 90 minutes old. Right after a save (2 min) and with the refresh button the app still asks Google.
// If the database is slow (over 2.5 s) or its answer is not marked live, everything works as before.
require('../tools/lib.js')(process.argv[2], [
["  if(!ui){ const d = await sbDoc(key); if(d && age(d) < mx) return d.data; return real(); }",
 "  if(!ui){ const d = await sbDoc(key); if(d && (age(d) < mx || (d.live && age(d) < 90 * 6e4))) return d.data; return real(); }\n" +
 "  if(SB_LIVE.test(fn)){ const d = await sbDoc(key); if(d && d.live && age(d) < 90 * 6e4) return d.data;   /* 14 Oct night: worked out by the database itself */\n" +
 "    const rp = real(); if(!d || age(d) > (SB_UIAGE[fn] || 3 * 864e5)) return rp;\n" +
 "    rp.then(x => { if(JSON.stringify(x) !== JSON.stringify(d.data)){ SB_FRESH[key] = { data: x, t: Date.now() }; sbRedraw(fn, args, x); } }).catch(() => {}); return d.data; }"],
["let SB_LASTW = 0;",
 "const SB_LIVE = /^mgmt(Active|Students|Student|StuClasses)$/;   /* 14 Oct night: the database works these out itself */\nlet SB_LASTW = 0;"],
]);
