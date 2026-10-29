// 1604 · 1603 also for the very first start-up call: the app's opening reload runs before the later scripts load, so the
//   management start data still went to Google once per page open. The opening reload now uses the same rule (the copy on this
//   device for the same sign-in, Google at most every 30 min; Refresh always asks Google).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["\nD = await api('getBootstrap', TOKEN);   /* 638:",
   "\nD = (!force && D && D.mgr && (function(){ try{ return Date.now() - +(localStorage.getItem('coe.m.bootAt') || 0) < 30 * 6e4 && localStorage.getItem('coe.m.bootTk') === String(TOKEN).slice(-12); }catch(e){ return false; } })()) ? D : await api('getBootstrap', TOKEN);   /* 1604: management copy on this device (same sign-in, < 30 min) */   /* 638:"],
]);
