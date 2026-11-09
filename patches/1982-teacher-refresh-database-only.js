// 1982: (Misty 9 Nov "FOR TEACHER'S REFRESH TOO IT SHOULD BE FAST AND INSTANT")
//   · Teacher ↻ ran Google's full re-check ('refresh', 10–30 s) behind the database copy and then replaced the screen with Google's answer. Removed:
//     the teacher home screen is worked out by the database itself (about 0.35 s for every teacher, 9 Nov).
//   · A teacher's home screen never waits on Google when the database has her screen: right after a save, or when the copy is a few minutes old,
//     the database copy is asked again (it is worked out from the tables at that moment) instead of asking Google.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  if(!ui){ const d = await sbDoc(key); if(d && (age(d) < mx || (d.live && age(d) < sbLiveMax(fn)))) return d.data; return real(); }",
   "  if(fn === 'getBootstrap' && typeof D !== 'undefined' && D && !D.mgr && D.me && D.me.name){ const d = await sbDoc(key); if(d && d.data && d.data.me && age0(d) < 3 * 864e5) return d.data; return real(); }   /* 1982: teacher home — the database, never Google while it has her screen */\n  if(!ui){ const d = await sbDoc(key); if(d && (age(d) < mx || (d.live && age(d) < sbLiveMax(fn)))) return d.data; return real(); }"],
  ["if(force){ toast('Up to date'); const tk = TOKEN; api('refresh', tk).then(v => { if(!v || TOKEN !== tk) return; store('set', KEY_D, JSON.stringify(v)); const a = document.activeElement; if(document.querySelector('#sheet.on') || (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return; D = v; render(); }).catch(() => {}); }",
   "if(force) toast('Up to date');   /* 1982: no Google 'refresh' behind teacher ↻ */"],
]);
