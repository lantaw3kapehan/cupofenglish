// 1971: (Misty 9 Nov 13:10 "also when refreshing, loading the screen seemed slow" · screenshot: "Loading your screen…")
//   Management's start data (getBootstrap) still came from Google (10–30 s) whenever this device had not opened the app in the last 30 min.
//   For management it only holds the signed-in name, today's date and the manager's own shift and time-in; every screen reads the database.
//   Now the saved copy on this device (same sign-in, any age) opens at once and Google's answer replaces it in the background.
//   A copy from another day starts without yesterday's time-in. First sign-in on a device still waits as before.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["D = (!force && D && D.mgr && bootFresh1609()) ? (window.__bootSkip1609 = 1, D) :",
   "D = (!force && D && D.mgr && (bootFresh1609() || bootSame1971())) ? (window.__bootSkip1609 = 1, window.__bootBg1971 = !bootFresh1609(), bootDay1971(D)) :"],
  ["store('set', KEY_D, JSON.stringify(D)); if(D && D.mgr && !window.__bootSkip1609) bootMark1609(); render(); if(!D.mgr){ prefetchTeacher(force); fastFails(); }",
   "store('set', KEY_D, JSON.stringify(D)); if(D && D.mgr && !window.__bootSkip1609) bootMark1609(); render(); if(!D.mgr){ prefetchTeacher(force); fastFails(); }\n" +
   "if(window.__bootBg1971){ window.__bootBg1971 = 0; const tk = TOKEN; api('getBootstrap', tk).then(v => { if(!v || !v.mgr || TOKEN !== tk) return; D = v; store('set', KEY_D, JSON.stringify(D)); bootMark1609(); const a = document.activeElement; if(document.querySelector('#sheet.on') || (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))) return; render(); }).catch(() => {}); }   /* 1971 */"],
  ["function bootMark1609(){",
   "function bootSame1971(){ try{ return !!TOKEN && localStorage.getItem('coe.m.bootTk') === String(TOKEN).slice(-12); }catch(e){ return false; } }   /* 1971: same sign-in on this device, any age */\n" +
   "function bootDay1971(d){ try{ const t = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); if(d && d.today && String(d.today).slice(0, 10) !== t){ d.today = t; d.timeIn = null; } }catch(e){} return d; }\n" +
   "function bootMark1609(){"],
]);
