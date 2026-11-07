// 1851: (Misty 7 Nov "yes kimi with virgo was done") the peer reviews on a teacher's Today list came from Google's last copy,
//   so a review marked done in the database still showed. The list now comes from the database (coe-peer mine: coe_peer, status
//   Assigned), applied before every Today draw; Google's copy is only used until the database has answered once.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  window.qaSeen1850 = function(ts){ if(!ts) return; call({ action: 'qaseen', ts: ts }).catch(() => {}); };\n",
   "  window.qaSeen1850 = function(ts){ if(!ts) return; call({ action: 'qaseen', ts: ts }).catch(() => {}); };\n"
   + "  let P1851 = null; const apply1851 = () => { try{ if(P1851 && typeof D !== 'undefined' && D && !D.mgr) D.peer = P1851; }catch(e){} };\n"
   + "  if(typeof window.renderToday === 'function' && !window.renderToday.__1851){ const rt = window.renderToday, w = function(){ apply1851(); return rt.apply(this, arguments); }; w.__1851 = 1; window.renderToday = w; try{ renderToday = w; }catch(e){} }\n"
   + "  function peer1851(){ if(typeof TOKEN === 'undefined' || !TOKEN || typeof D === 'undefined' || !D || D.mgr) return;\n"
   + "    call({ action: 'mine' }).then(r => { if(!(r && r.ok && Array.isArray(r.peer))) return; const was = JSON.stringify((D && D.peer) || []); P1851 = r.peer; apply1851();\n"
   + "      if(JSON.stringify(D.peer || []) !== was){ try{ if(typeof VIEW === 'undefined' || VIEW === 'today') renderToday(); }catch(e){} } }).catch(() => {}); }\n"
   + "  setTimeout(peer1851, 1500); setInterval(peer1851, 120000);\n"]]);
