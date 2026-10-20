// 20 Oct · Management's teacher view showed management's own answers on a teacher's "my" panels (Mayi: setup check still asked though
// approved; Excellence 77.7 · 4th on both Julia and Mayi). Teacher screens now send the viewed teacher's name (coe-mgmt v39 `as`, read-only),
// and the setup check / Excellence answers kept on the device are only used for the teacher they belong to.
require('../tools/lib.js')(process.argv[2], [
  // 1 · every teacher screen from coe-mgmt carries the name of the teacher on screen (ignored by the server for a teacher's own sign-in)
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n/* 365 */ (function(){ const f0 = window.fetch; if(!f0) return; window.fetch = function(u, o){ try{ if(typeof u === 'string' && u === FAST_URL + '-mgmt' && o && typeof o.body === 'string' && typeof D !== 'undefined' && D && !D.mgr && D.me && D.me.name){\n" +
   "  const b = JSON.parse(o.body); if(b && b.op === 'screen' && /^t[A-Z]/.test(String(b.fn || '')) && !b.as){ b.as = D.me.name; o = Object.assign({}, o, { body: JSON.stringify(b) }); } } }catch(e){} return f0.call(this, u, o); }; })();\n</script>\n\n</body>"],
  // 2 · setup check: an answer kept for another teacher is not used
  ["post('tSetupMe').then(d => { ME = d;", "post('tSetupMe').then(d => { ME = d; if(ME) ME.who = (D.me && D.me.name) || '';"],
  ["function card(){ const v = $('v-today'); if(!v || !isT()) return; let c = $('setupCard');",
   "function card(){ const v = $('v-today'); if(!v || !isT()) return; if(ME && ME.who !== undefined && ME.who !== ((D.me && D.me.name) || '')){ ME = null; MEat = 0; setTimeout(() => loadMe(), 0); } if(ME && ME.who === undefined){ ME = null; MEat = 0; setTimeout(() => loadMe(), 0); } let c = $('setupCard');"],
  // 3 · Excellence: the same
  ["post('tKpi').then(d => { K = d || null; Kat = Date.now();", "post('tKpi').then(d => { K = d || null; if(K) K.who = (D.me && D.me.name) || ''; Kat = Date.now();"],
  ["function load(force){ if(Kbusy || !isT() || (!force && Date.now() - Kat < 10 * 6e4)) return;",
   "function load(force){ try{ if(K && isT() && K.who !== ((D.me && D.me.name) || '')){ K = null; Kat = 0; } }catch(e){} if(Kbusy || !isT() || (!force && Date.now() - Kat < 10 * 6e4)) return;"]
]);
