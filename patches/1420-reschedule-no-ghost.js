// 1420: (Misty, 28 Oct 10:32) "I rescheduled Freya … in our schedule it's still 10:30? We have been raising this issue since."
// Root cause (server): a move is saved in the database first (coe-mgmt classEdit) and Google Calendar follows a few seconds
// later. Google's calendar → database copy that had started before Google applied the move wrote the OLD class back and
// pruned the NEW one, so for 1–2 minutes the database (and every screen reading it) showed 10:30, or both times.
// Fixed in the database (trigger classes_keep_moves, 10 minutes of protection per move). This patch is the screen side:
// 1 · every student class list is cleaned of a moved class's old copy (same event, start = the moved class's "from" time),
//     wherever the list comes from (database, Google, a saved copy);
// 2 · the Schedule student window (Freya's window) reloads its list from the database right after a move/cancel saves;
// 3 · the device's saved copy of that list is replaced at once, so reopening never shows the old time.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["    if((fn === 'mgmtStuClasses' || fn === 'tStuClasses') && TOKEN && args[1] && Date.now() > fresh) return clsDb(args[1]).catch(() => base(fn, ...args));",
   "    if((fn === 'mgmtStuClasses' || fn === 'tStuClasses') && TOKEN && args[1] && Date.now() > fresh) return clsDb(args[1]).then(clsClean).catch(() => Promise.resolve(base(fn, ...args)).then(clsClean));\n" +
   "    if(fn === 'mgmtStuClasses' || fn === 'tStuClasses') return Promise.resolve(base(fn, ...args)).then(clsClean);   /* 1420 */"],
  ["  const base = api, memo = {}; let fresh = 0;\n  async function clsDb(code){",
   "  const base = api, memo = {}; let fresh = 0;\n" +
   "  /* 1420: a moved class's old copy (same event, start = its \"moved from\" time) never shows next to the new time */\n" +
   "  function clsClean(L){ try{ if(!Array.isArray(L)) return L; const gone = {}; L.forEach(e => { if(e && e.mv && e.mv.start && e.start !== e.mv.start) gone[String(e.id) + '|' + new Date(e.mv.start).getTime()] = 1; });\n" +
   "    if(!Object.keys(gone).length) return L; return L.filter(e => !(e && !e.mv && gone[String(e.id) + '|' + new Date(e.start).getTime()])); }catch(x){ return L; } }\n" +
   "  window.clsClean = clsClean;\n" +
   "  async function clsDb(code){"],
  ["Object.keys(SCC).forEach(k => { SCC[k]._t = 0; });   /* keep what's on screen, refetch quietly */ CLS_HOLD = null; if(src==='sw' && SW) delete CLSM[SW.code];",
   "Object.keys(SCC).forEach(k => { SCC[k]._t = 0; });   /* keep what's on screen, refetch quietly */ CLS_HOLD = null; if(src==='sw' && SW) delete CLSM[SW.code];\n" +
   "if(src==='sw' && SW){ const swc = SW.code; try{ store('set','coe.cls.' + swc, JSON.stringify(SW.events)); }catch(y){} setTimeout(() => api('mgmtStuClasses', TOKEN, swc).then(x => { if(!Array.isArray(x)) return; CLSM[swc] = x; try{ store('set','coe.cls.' + swc, JSON.stringify(x)); }catch(y){} if(SW && SW.code === swc){ SW.events = x.slice(); swPaint(); } }).catch(() => {}), 1500); }   /* 1420 */"],
  ["let c = CLSM[code]; if(!c){ try{ c = JSON.parse(store('get','coe.cls.' + code)||'null'); }catch(e){} } if(c){ SW.events = c.slice(); swPaint(); }",
   "let c = CLSM[code]; if(!c){ try{ c = JSON.parse(store('get','coe.cls.' + code)||'null'); }catch(e){} } if(c && window.clsClean) c = clsClean(c); if(c){ SW.events = c.slice(); swPaint(); }   /* 1420 */"]
]);
