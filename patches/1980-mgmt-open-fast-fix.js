// 1980: (Misty 9 Nov 14:09 "REFRESHING IT IS STILL SLOW", screenshot "Loading your screen…" on #payroll)
//   1971 decided "same sign-in on this device" from localStorage coe.m.bootTk, but every coe.m.* key is moved into the app's own
//   storage (IndexedDB) when the app starts, so that check always failed and a new tab still waited for Google's start data (3–6 s here,
//   longer on a slow line). The saved management start data itself (coe.data) is already per person: it is wiped on sign-out and when a
//   different person signs in (1366). So: saved management data for this sign-in → open at once, Google's copy follows in the background.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function bootSame1971(){ try{ return !!TOKEN && localStorage.getItem('coe.m.bootTk') === String(TOKEN).slice(-12); }catch(e){ return false; } }",
   "function bootSame1971(){ try{ return !!TOKEN && !!(D && D.mgr && D.me && D.me.name); }catch(e){ return false; } }   /* 1980: coe.m.* lives in IndexedDB, not localStorage */"],
]);
