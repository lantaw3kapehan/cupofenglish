// 1609 · 1603/1604 did not take on Misty's laptop: management start data still came from Google every time the app came back
//   to the front (coe_speed 10:39–10:53, every 1–2 min). The "asked Google at …" time was kept only in localStorage, which
//   can be full on a busy device (writes then fail silently), and the very first start-up call never recorded it. Now the
//   time is also kept in memory for this page, and recorded after every start-up answer from Google.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["\nasync function reload(force){",
   "\nfunction bootFresh1609(){ try{ const m = window.__boot1609; if(m && m.tk === String(TOKEN).slice(-12) && Date.now() - m.t < 30 * 6e4) return true; }catch(e){}\n" +
   "  try{ return Date.now() - +(localStorage.getItem('coe.m.bootAt') || 0) < 30 * 6e4 && localStorage.getItem('coe.m.bootTk') === String(TOKEN).slice(-12); }catch(e){ return false; } }\n" +
   "function bootMark1609(){ window.__boot1609 = { t: Date.now(), tk: String(TOKEN).slice(-12) }; try{ localStorage.setItem('coe.m.bootAt', String(Date.now())); localStorage.setItem('coe.m.bootTk', String(TOKEN).slice(-12)); }catch(e){} }   /* 1609 */\n" +
   "async function reload(force){"],
  ["D = (!force && D && D.mgr && (function(){ try{ return Date.now() - +(localStorage.getItem('coe.m.bootAt') || 0) < 30 * 6e4 && localStorage.getItem('coe.m.bootTk') === String(TOKEN).slice(-12); }catch(e){ return false; } })()) ? D : await api('getBootstrap', TOKEN);",
   "D = (!force && D && D.mgr && bootFresh1609()) ? (window.__bootSkip1609 = 1, D) : (window.__bootSkip1609 = 0, await api('getBootstrap', TOKEN));   /* 1609 */"],
  ["store('set', KEY_D, JSON.stringify(D)); render(); if(!D.mgr){ prefetchTeacher(force); fastFails(); }",
   "store('set', KEY_D, JSON.stringify(D)); if(D && D.mgr && !window.__bootSkip1609) bootMark1609(); render(); if(!D.mgr){ prefetchTeacher(force); fastFails(); }"],
  ["        let at = 0, tk = ''; try{ at = +(localStorage.getItem('coe.m.bootAt') || 0); tk = localStorage.getItem('coe.m.bootTk') || ''; }catch(e){}\n        if(Date.now() - at < 30 * 6e4 && tk === String(TOKEN).slice(-12)) return Promise.resolve(D);",
   "        if(typeof bootFresh1609 === 'function' && bootFresh1609()) return Promise.resolve(D);   /* 1609 */"],
  ["if(x && x.me && x.mgr){ localStorage.setItem('coe.m.bootAt', String(Date.now())); localStorage.setItem('coe.m.bootTk', String(TOKEN).slice(-12)); }",
   "if(x && x.me && x.mgr && typeof bootMark1609 === 'function') bootMark1609();"],
]);
