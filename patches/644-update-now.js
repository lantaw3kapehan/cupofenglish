// 644: new versions reach every phone within minutes (Misty: "in every update there should be a forced auto refresh").
// Was: checked every 20 min and held updates from 16:00 to midnight. Now: checked every 5 min (a tiny version file), and the app refreshes
// itself as soon as it is safe — never during a teacher's class (5 min before to 5 min after), while typing, with a card open,
// while saving, or while a class video uploads. Management refreshes at once when idle.
require('../tools/lib.js')(process.argv[2], [
[
"function updQuiet(){ try{ if(typeof D === 'undefined' || !D || performance.now() < 15000) return false;   /* audit 13 Oct: management too */ const h = new Date().getHours(); return h >= 16; }   /* 14 Oct: quiet until midnight (late trial classes), was 22:00 */catch(e){ return false; } }",
"function updQuiet(){ try{ if(window._vupBusy || (typeof API_PEND !== 'undefined' && API_PEND > 0)) return true; if(typeof D === 'undefined' || !D || D.mgr || performance.now() < 15000) return false;\n  /* 644 · 22 Oct: was quiet from 16:00 to midnight · now only while the teacher is in a class (5 min before start to 5 min after end) */\n  const now = Date.now(); return (D.schedule || []).some(c => c && !c.cancelled && c.day === D.today && now >= new Date(c.start).getTime() - 5 * 6e4 && now <= new Date(c.end).getTime() + 5 * 6e4); }catch(e){ return false; } }"
],
[
"if(API_URL && !GAS){ setTimeout(applyUpdate, 2500); setTimeout(applyUpdate, 8000); setInterval(fetchUpdate, 20*60000);",
"if(API_URL && !GAS){ setTimeout(applyUpdate, 2500); setTimeout(applyUpdate, 8000); setInterval(() => { UPD_AT = 0; fetchUpdate(); }, 5*60000);   /* 644: every 5 min (was 20) */"
],
[
"BUSY = id; let pid = null;",
"BUSY = id; window._vupBusy = 1; let pid = null;"
],
[
"BUSY = null; window.removeEventListener('beforeunload', leave);",
"BUSY = null; window._vupBusy = 0; window.removeEventListener('beforeunload', leave);"
]
]);
