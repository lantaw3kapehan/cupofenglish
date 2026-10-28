// 1510 · President QA follow-up.
//   (D18) Monitor › Time-ins jumped ~92 px a moment after opening (CLS 0.043 laptop, 0.079 phone, intermittent on main too): the page was
//   drawn first and the "Monitor" title + tab row were added on top of it afterwards (setTimeout after go('team'), and after any repaint
//   that did not pass through the renderTeam wrapper). Now a MutationObserver on #v-team puts the title + tab row back in the same
//   microtask the page is drawn, so the first frame already has them. Same strip() as before; nothing else changes.
//   (Misty 20:43) Sign-in button "President: first time or forgot password" reads "First time or forgot password". Same behaviour:
//   it still sends the code to the owner's e-mail.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["onclick=\"sendCode()\">President: first time or forgot password</button>", "onclick=\"sendCode()\">First time or forgot password</button>"],
  ["  const _rt = window.renderTeam; if(typeof _rt === 'function') window.renderTeam = function(){ const r = _rt.apply(this, arguments); try{ if(VIEW === 'team') strip(); }catch(e){} return r; };",
   "  const _rt = window.renderTeam; if(typeof _rt === 'function') window.renderTeam = function(){ const r = _rt.apply(this, arguments); try{ if(VIEW === 'team') strip(); }catch(e){} return r; };\n" +
   "  /* 1510: title + tabs back before the next paint whenever #v-team is redrawn (no jump) */\n" +
   "  (function hook1510(){ const v = $('v-team'); if(!v) return setTimeout(hook1510, 1000); new MutationObserver(function(){ try{ if(D && D.mgr && !v.querySelector(':scope > .mo-tabs') && v.children.length) strip(); }catch(e){} }).observe(v, { childList: true }); })();"],
]);
