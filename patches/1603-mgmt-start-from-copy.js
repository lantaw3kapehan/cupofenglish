// 1603 · management start data (getBootstrap) from this device's copy: it was asked from Google every time the app opened
//   or came back to the front (61 times in 2 h this morning, 4.5 s each, 1 of them while someone waited). Management screens
//   load their own data from the database; the start data (names, lists, who is signed in) changes rarely. Now Google is asked
//   for it at most every 30 minutes, or on the Refresh button; otherwise the copy on this device is used at once.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</script>\n<script>\n/* 1602 · database copy without Google",
   "</script>\n<script>\n/* 1603 · management start data from this device's copy (Google at most every 30 min) */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1603) return; let rf = 0;\n" +
   "  document.addEventListener('click', ev => { try{ if(ev.target && ev.target.closest && ev.target.closest('#rf')) rf = Date.now(); }catch(e){} }, true);\n" +
   "  const w = function(fn){ try{\n" +
   "      if(fn === 'getBootstrap' && typeof D !== 'undefined' && D && D.mgr && D.me && arguments[1] === TOKEN && Date.now() - rf > 5000){\n" +
   "        let at = 0, tk = ''; try{ at = +(localStorage.getItem('coe.m.bootAt') || 0); tk = localStorage.getItem('coe.m.bootTk') || ''; }catch(e){}\n" +
   "        if(Date.now() - at < 30 * 6e4 && tk === String(TOKEN).slice(-12)) return Promise.resolve(D);   /* same sign-in only */\n" +
   "        const p = base.apply(this, arguments); Promise.resolve(p).then(x => { try{ if(x && x.me && x.mgr){ localStorage.setItem('coe.m.bootAt', String(Date.now())); localStorage.setItem('coe.m.bootTk', String(TOKEN).slice(-12)); } }catch(e){} }, () => {}); return p; }\n" +
   "    }catch(e){}\n" +
   "    return base.apply(this, arguments); };\n" +
   "  w.__1603 = 1; for(const k in base) try{ w[k] = base[k]; }catch(e){} window.api = w;\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1602 · database copy without Google"],
]);
