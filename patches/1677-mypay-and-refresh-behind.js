// 1677: (Misty, 31 Oct 22:09 "yes go ahead", after the 31 Oct App health: My pay 13 waits at 8 s, teachers' Refresh about 34 s)
//   What the speed log shows: nobody sat on those two. My pay is fetched from Google in the background each time the
//   management app starts (to know whether to show the My pay menu), and Google's full re-check after ↻ ('refresh') runs
//   behind the database copy that is already on screen (teachers saw their page in 1–2 s). They were counted as waits only
//   because someone tapped within 1.5 s of them starting. Still, each one is 8–35 s of Google work, and a double tap on ↻
//   started two.
//   · My pay: the quiet start-up load uses this device's copy up to 6 hours old (was 30 minutes). Opening My pay still
//     shows the copy at once and checks Google as before. Background loads are no longer counted as waits.
//   · ↻ Google re-check ('refresh'): one at a time; a second tap while one is running joins it, and one finished in the
//     last 2 minutes is not repeated. It is marked as background, so it no longer shows as a wait in App health.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["_c1300 = kept('mypay') && Date.now() - _t1300 < 30 * 6e4 &&",
   "_c1300 = kept('mypay') && Date.now() - _t1300 < (quiet ? 360 : 30) * 6e4 &&   /* 1677: start-up load uses a copy up to 6 h old */"],
  ["() => api('mgmtMyPay', TOKEN).then(",
   "() => (quiet && typeof bg === 'function' ? bg(() => api('mgmtMyPay', TOKEN)) : api('mgmtMyPay', TOKEN)).then("],
  ["  window.swMine1676 = ",
   "  /* 1677 · ↻ Google re-check: one at a time, not repeated within 2 minutes, never counted as a wait */\n" +
   "  try{ const _api1677 = window.api; let run1677 = null, done1677 = 0;\n" +
   "    if(_api1677) window.api = function(fn){ if(fn !== 'refresh') return _api1677.apply(this, arguments);\n" +
   "      if(run1677) return run1677; if(Date.now() - done1677 < 120000) return Promise.resolve(null);\n" +
   "      const args = arguments, self = this; run1677 = Promise.resolve(typeof bg === 'function' ? bg(() => _api1677.apply(self, args)) : _api1677.apply(self, args));\n" +
   "      return run1677.then(v => { run1677 = null; done1677 = Date.now(); return v; }, e => { run1677 = null; throw e; }); }; }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
