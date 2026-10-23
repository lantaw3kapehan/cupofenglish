// 722: (Misty) Videos to check · Celine's OK did not show on Misty's screen — Google took over a minute to answer, so the OK was lost.
// Now OK / Needs action is saved in the database at once (coe-train vf_dec) and every manager's Overview reads it right away;
// Google gets the same decision in the background (and again from the next screen that loads, until Google has it).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
const R = String.raw;
rep(R`})(), mBusy = false;
  async function mLoad(){`, R`})(), mBusy = false;
  /* 722 · decisions in the database first */
  let VFD = {}; const vfSent = new Set(), vfK = x => x.id + '@' + (x.ds || '');
  const vfCall = b => fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(x => x.json());
  const vfMerge = L => L.map(x => { const d = VFD[vfK(x)]; if(!d || (d.at || 0) < (x.at || 0)) return x; if(x.st === d.st) return x;
    if(!vfSent.has(vfK(x))){ vfSent.add(vfK(x)); try{ apiNow('mgmtVidFlagSet', TOKEN, x.id, d.st, d.note || '').catch(() => {}); }catch(e){} }
    return Object.assign({}, x, { st: d.st, by: d.by, dat: d.at, dnote: d.note || '' }); });
  async function vfDecs(){ try{ const d = await vfCall({ action: 'vf_decs' }); if(d && d.ok){ VFD = d.dec || {}; if(MF){ MF = vfMerge(MF); mPaint(); } } }catch(e){} }
  async function mLoad(){`);
rep(R`const r = await api('mgmtVidFlags', TOKEN); if(r && r.ok){ const L = r.list || [];`,
    R`vfDecs(); const r = await api('mgmtVidFlags', TOKEN); if(r && r.ok){ const L = vfMerge(r.list || []);`);
rep(R`try{ const r = await apiNow('mgmtVidFlagSet', TOKEN, id, st, note); if(r && r.ok){ const i = MF.findIndex(x => x.id === id); if(i > -1) MF[i] = r.item; mPaint(); toast(st === 'ok' ? 'Marked OK ✓' : 'Marked Needs action'); } else toast((r && r.msg) || 'Not saved'); }catch(e){ toast(e.message); } };`,
    R`const i = (MF || []).findIndex(x => x.id === id), x = i > -1 ? MF[i] : { id, ds: '' }, me = ((typeof D !== 'undefined' && D && D.me) || {}).name || 'Management';
    try{ const d = await vfCall({ action: 'vf_dec', k: vfK(x), st, note: note || '' }); if(!d || !d.ok) throw new Error((d && d.error) || 'Not saved · try again'); VFD = d.dec || VFD; }catch(e){ return toast(e.message); }
    if(i > -1) MF[i] = Object.assign({}, x, { st, by: me, dat: Date.now(), dnote: note || '' }); mPaint(); toast(st === 'ok' ? 'Marked OK ✓' : 'Marked Needs action');
    vfSent.add(vfK(x)); try{ apiNow('mgmtVidFlagSet', TOKEN, id, st, note).catch(() => {}); }catch(e){} };`);
// every manager's Overview picks up decisions every minute (cheap: database only)
rep(R`setInterval(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'home' && !document.hidden) mLoad(); }catch(e){} }, 5 * 6e4);`,
    R`setInterval(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'home' && !document.hidden) mLoad(); }catch(e){} }, 5 * 6e4);
  setInterval(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'home' && !document.hidden && MF && MF.some(x => x.st === 'open')) vfDecs(); }catch(e){} }, 6e4);`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
