// 1943: (Misty, 9 Nov 10:44) "what if another concern happens later so we shouldnt be doing the same that we're doing now"
//   Overview › Lates to decide comes only from the database. When the database's Overview does not answer and the app falls back
//   to Google for the rest of the screen, Google's late list (its own ids, decisions it has not caught up with) is dropped, and
//   the card says the lates could not be checked yet instead of showing an already-decided late.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    if(fn === 'mgmtOverview' && typeof D !== 'undefined' && D && D.mgr && typeof LIVE !== 'undefined' && LIVE && TOKEN) return ovDb().catch(() => base(fn, ...args));",
   "    if(fn === 'mgmtOverview' && typeof D !== 'undefined' && D && D.mgr && typeof LIVE !== 'undefined' && LIVE && TOKEN) return ovDb().then(r => { try{ window.LATE_OFF1943 = 0; }catch(e){} return r; }, async () => { const g = await base(fn, ...args);   /* 1943: Google's lates are never shown */\n" +
   "      try{ if(g && typeof g === 'object'){ g.late = []; window.LATE_OFF1943 = Date.now(); } }catch(e){} return g; });"],
  ["    if(!L.length){ if(box) box.remove(); LQS = sig; return; }",
   "    if(!L.length && window.LATE_OFF1943){ const s1943 = 'off' + window.LATE_OFF1943; if(box && root.contains(box) && LQS === s1943 && !force) return; LQS = s1943;   /* 1943 */\n" +
   "      if(!box || !root.contains(box)){ box = document.createElement('section'); box.id = 'lqmBox'; box.style.cssText = 'margin:0 0 16px'; root.insertBefore(box, root.firstChild); }\n" +
   "      box.innerHTML = '<div class=\"lqm\" style=\"background:#F7F5FC;border-color:#E2DEEE\"><b>⏱ Lates to decide</b><div class=\"small mute\" style=\"margin-top:2px\">Could not check the database just now · tap ↻ in a minute. Lates are never decided twice, and the 24 h rule still runs.</div></div>'; return; }\n" +
   "    if(!L.length){ if(box) box.remove(); LQS = sig; return; }"]
]);
