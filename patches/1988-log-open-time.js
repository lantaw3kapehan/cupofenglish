// 1988: (Misty 9 Nov "Will this issue happen again?") Every open records how long the "Loading your screen…" card was up (from the start of
//   the page to the screen showing) as speed row boot:mgmt / boot:teacher. The hourly fix guard flags a slow open (median over 2.5 s).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function off(){ if(!on) return; on = 0; try{ mo && mo.disconnect(); }catch(e){} clearInterval(tq);",
   "function off(){ if(!on) return; on = 0; try{ mo && mo.disconnect(); }catch(e){} clearInterval(tq);\n    try{ if(typeof TOKEN !== 'undefined' && TOKEN && typeof D !== 'undefined' && D && D.me){ const row = { fn: 'boot:' + (D.mgr ? 'mgmt' : 'teacher'), ms: Math.round(performance.now()), ui: false, view: typeof VIEW !== 'undefined' ? String(VIEW || '') : '', v: typeof COE_V !== 'undefined' ? COE_V : 0, dev: (window.innerWidth || 0) < 900 ? 'phone' : 'laptop', at: new Date().toISOString() };\n      setTimeout(() => { try{ fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-notice', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'speed', rows: [row] }), keepalive: true }).catch(() => {}); }catch(e){} }, 4000); } }catch(e){}   /* 1988: how long opening took */"],
]);
